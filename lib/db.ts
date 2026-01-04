import mysql from 'mysql2/promise';

// Database connection configuration
// IMPORTANT: In production, all values must come from environment variables
// Never hardcode credentials in production code

// Support both TCP and Unix Socket connections
// For DirectAdmin localhost: use socketPath for better performance
// For remote: use host and port
const dbConfig: any = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5, // Reduced for serverless (lower is better)
  queueLimit: 0,
  // Serverless-friendly settings
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Timeout settings (reduced for faster failure detection)
  connectTimeout: 5000, // 5 seconds (reduced from 10)
  acquireTimeout: 5000, // 5 seconds (reduced from 10)
  // Query timeout
  timeout: 8000, // 8 seconds for queries
};

// Use Unix Socket if DB_SOCKET_PATH is provided (DirectAdmin localhost)
if (process.env.DB_SOCKET_PATH) {
  dbConfig.socketPath = process.env.DB_SOCKET_PATH;
} else {
  // Use TCP connection (host + port)
  dbConfig.host = process.env.DB_HOST;
  dbConfig.port = parseInt(process.env.DB_PORT || '3306');
}

// Validate required environment variables at runtime (not build time)
// This function will be called when actually connecting to the database
function validateDbConfig() {
  // Only validate in production runtime, not during build
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    const requiredVars = ['DB_USER', 'DB_PASSWORD', 'DB_NAME'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    // DB_HOST is only required if not using socket
    if (!process.env.DB_SOCKET_PATH && !process.env.DB_HOST) {
      missingVars.push('DB_HOST');
    }
    
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`
      );
    }
  }
}

// Create connection pool (lazy initialization)
// Pool will be created when first accessed, not at module load time
let pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!pool) {
    // Validate config before creating pool
    validateDbConfig();
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const connectionPool = getPool();
    const connection = await connectionPool.getConnection();
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Execute a query with retry logic for serverless environments
export async function query(sql: string, params?: any[], retries = 2): Promise<any> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const connectionPool = getPool();
      
      // Execute query directly (connection pool handles connection management)
      const [results] = await connectionPool.execute(sql, params);
      return results;
    } catch (error: any) {
      lastError = error;
      console.error(`[DB] Query error (attempt ${attempt}/${retries}):`, error.message || error.code);
      
      // Check if it's a connection error that can be retried
      const isConnectionError = 
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'PROTOCOL_CONNECTION_LOST' ||
        error.code === 'PROTOCOL_ENQUEUE_AFTER_QUIT' ||
        error.code === 'ENOTFOUND' ||
        error.message?.includes('Connection lost') ||
        error.message?.includes('timeout') ||
        error.message?.includes('getaddrinfo');
      
      if (isConnectionError && attempt < retries) {
        console.warn(`[DB] Connection error detected, recreating pool and retrying... (${attempt}/${retries})`);
        
        // Recreate pool on connection errors
        if (pool) {
          try {
            await pool.end();
          } catch (e: any) {
            // Ignore errors when closing dead pool
            console.warn('[DB] Error closing pool:', e.message);
          }
          pool = null;
        }
        
        // Exponential backoff (shorter delays for faster recovery)
        const delay = 50 * Math.pow(2, attempt - 1); // 50ms, 100ms
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // If not a connection error or last attempt, throw immediately
      if (!isConnectionError || attempt === retries) {
        throw error;
      }
    }
  }
  
  // If all retries failed
  throw lastError;
}

// Get a single connection (for transactions)
export async function getConnection() {
  const connectionPool = getPool();
  return await connectionPool.getConnection();
}

// Export the pool getter for advanced usage
export { getPool as pool };

// Export default connection function
export default getPool;

