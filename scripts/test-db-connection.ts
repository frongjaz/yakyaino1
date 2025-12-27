/**
 * Script สำหรับทดสอบการเชื่อมต่อฐานข้อมูล
 * รันด้วยคำสั่ง: npx tsx scripts/test-db-connection.ts
 * หรือ: npm run test:db
 */

import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// โหลด environment variables จาก .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const dbConfig = {
  host: process.env.DB_HOST || '203.170.129.6',
  user: process.env.DB_USER || 'checkk_dbdemo',
  password: process.env.DB_PASSWORD || 'Frongaoja0103!',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'checkk_dbdemo',
};

async function testConnection() {
  console.log('🔍 กำลังทดสอบการเชื่อมต่อฐานข้อมูล...\n');
  console.log('📋 ข้อมูลการเชื่อมต่อ:');
  console.log(`   Host: ${dbConfig.host}`);
  console.log(`   Port: ${dbConfig.port}`);
  console.log(`   User: ${dbConfig.user}`);
  console.log(`   Database: ${dbConfig.database}\n`);

  let connection;
  try {
    // สร้างการเชื่อมต่อ
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จ!\n');

    // ทดสอบ query
    console.log('🔍 กำลังทดสอบ query...');
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query สำเร็จ:', rows);
    console.log('');

    // แสดงข้อมูล database version
    const [versionRows] = await connection.execute('SELECT VERSION() as version');
    console.log('📊 MySQL Version:', (versionRows as any[])[0].version);
    console.log('');

    // แสดงตารางที่มีในฐานข้อมูล
    console.log('📋 กำลังดึงรายชื่อตาราง...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`✅ พบตารางทั้งหมด ${(tables as any[]).length} ตาราง:`);
    (tables as any[]).forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });

    console.log('\n✅ การทดสอบเสร็จสมบูรณ์!');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ การเชื่อมต่อล้มเหลว!');
    console.error('ข้อผิดพลาด:', error.message);
    console.error('\nรายละเอียด:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 ปิดการเชื่อมต่อแล้ว');
    }
  }
}

// รันการทดสอบ
testConnection();

