import mysql from 'mysql2/promise';

// Database connection configuration
// IMPORTANT: In production, all values must come from environment variables
// Never hardcode credentials in production code
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Validate required environment variables at runtime (not build time)
// This function will be called when actually connecting to the database
function validateDbConfig() {
  // Only validate in production runtime, not during build
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
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

