/**
 * Script สำหรับสร้าง admin user
 * รันด้วยคำสั่ง: node scripts/create-admin.js
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const dbConfig = {
  host: process.env.DB_HOST || '203.170.129.6',
  user: process.env.DB_USER || 'checkk_dbdemo',
  password: process.env.DB_PASSWORD || 'Frongaoja0103!',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'checkk_dbdemo',
};

async function createAdmin() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    // รับ input จาก command line arguments หรือใช้ค่า default
    const username = process.argv[2] || 'admin';
    const password = process.argv[3] || 'admin123';
    const role = 'admin';

    console.log('🔍 กำลังตรวจสอบ username...');
    
    // ตรวจสอบว่า username มีอยู่แล้วหรือไม่
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      console.log(`⚠️  Username "${username}" มีอยู่แล้วแล้ว`);
      console.log('   ต้องการอัพเดท password หรือไม่? (y/n)');
      // สำหรับ automation ให้ใช้ argument
      if (process.argv[4] === '--update') {
        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.execute(
          'UPDATE users SET password = ?, role = ?, status = ? WHERE username = ?',
          [hashedPassword, role, 'active', username]
        );
        console.log(`✅ อัพเดท password สำหรับ "${username}" สำเร็จ`);
      } else {
        console.log('   รันคำสั่ง: node scripts/create-admin.js <username> <password> --update');
      }
      await connection.end();
      return;
    }

    console.log('🔐 กำลัง hash password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('💾 กำลังสร้าง admin user...');
    await connection.execute(
      'INSERT INTO users (username, password, role, status) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, role, 'active']
    );

    console.log('\n✅ สร้าง admin user สำเร็จ!');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${role}`);
    console.log('\n⚠️  จำกัด password ไว้ให้ดี!');
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// รัน script
createAdmin();

