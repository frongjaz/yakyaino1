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
  connectionLimit: 10,
  queueLimit: 0,
  // Serverless-friendly settings
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Timeout settings
  connectTimeout: 10000, // 10 seconds
  acquireTimeout: 10000,
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
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Execute a query
export async function query(sql: string, params?: any[]): Promise<any> {
  try {
    const connectionPool = getPool();
    const [results] = await connectionPool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
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

