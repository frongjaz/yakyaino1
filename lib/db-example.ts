/**
 * Example usage of database connection
 * This file demonstrates how to use the database connection in your Next.js app
 */

import { query, testConnection, getConnection } from './db';

// Example 1: Test database connection
export async function testDbConnection() {
  const isConnected = await testConnection();
  if (isConnected) {
    console.log('Database is ready to use');
  }
}

// Example 2: Simple SELECT query
export async function getUsers() {
  try {
    const results = await query('SELECT * FROM users LIMIT 10');
    return results;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Example 3: Query with parameters (prevent SQL injection)
export async function getUserById(userId: number) {
  try {
    const results = await query('SELECT * FROM users WHERE id = ?', [userId]);
    return results;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Example 4: INSERT query
export async function createUser(name: string, email: string) {
  try {
    const results = await query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    return results;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Example 5: Using transactions
export async function transferData() {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();
    
    // Perform multiple queries
    await connection.query('UPDATE table1 SET ...');
    await connection.query('UPDATE table2 SET ...');
    
    await connection.commit();
    console.log('Transaction completed');
  } catch (error) {
    await connection.rollback();
    console.error('Transaction failed, rolled back:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Example 6: Using in Next.js API Route (app/api/example/route.ts)
/*
import { query } from '@/lib/db';

export async function GET() {
  try {
    const results = await query('SELECT * FROM your_table');
    return Response.json({ data: results });
  } catch (error) {
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
*/

// Example 7: Using in Server Component (app/page.tsx)
/*
import { query } from '@/lib/db';

export default async function HomePage() {
  const data = await query('SELECT * FROM your_table');
  return <div>{/* render data */}</div>;
}
*/

