/**
 * Test Database Connection สำหรับ DirectAdmin
 * 
 * วิธีใช้:
 * 1. สร้างไฟล์ .env.local ใน public_html/
 * 2. รัน: node scripts/test-db-directadmin.js
 */

require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// ใช้ socket ถ้ามี, ไม่งั้นใช้ TCP
if (process.env.DB_SOCKET_PATH) {
  dbConfig.socketPath = process.env.DB_SOCKET_PATH;
  console.log('📡 ใช้ Unix Socket:', process.env.DB_SOCKET_PATH);
} else {
  dbConfig.host = process.env.DB_HOST || 'localhost';
  dbConfig.port = parseInt(process.env.DB_PORT || '3306');
  console.log('📡 ใช้ TCP Connection:', `${dbConfig.host}:${dbConfig.port}`);
}

async function testConnection() {
  console.log('\n🔍 กำลังทดสอบการเชื่อมต่อฐานข้อมูล...\n');
  console.log('📋 ข้อมูลการเชื่อมต่อ:');
  console.log(`   User: ${dbConfig.user}`);
  console.log(`   Database: ${dbConfig.database}`);
  if (dbConfig.socketPath) {
    console.log(`   Socket: ${dbConfig.socketPath}`);
  } else {
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   Port: ${dbConfig.port}`);
  }
  console.log('');

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
    console.log('📊 MySQL/MariaDB Version:', versionRows[0].version);
    console.log('');

    // แสดงตารางที่มีในฐานข้อมูล
    console.log('📋 กำลังดึงรายชื่อตาราง...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`✅ พบตารางทั้งหมด ${tables.length} ตาราง:`);
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });

    console.log('\n✅ การทดสอบเสร็จสมบูรณ์!\n');
  } catch (error) {
    console.error('\n❌ เกิดข้อผิดพลาด:', error.message);
    console.error('\n💡 วิธีแก้ไข:');
    console.error('   1. ตรวจสอบว่า .env.local มีข้อมูลครบถ้วน');
    console.error('   2. ตรวจสอบว่า database user มีสิทธิ์เข้าถึง');
    console.error('   3. ตรวจสอบว่า database name ถูกต้อง');
    console.error('   4. ตรวจสอบ password\n');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testConnection();

