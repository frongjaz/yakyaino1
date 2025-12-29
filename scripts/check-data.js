/**
 * Script to check car data in database
 */

require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function checkData() {
  let connection;
  
  try {
    console.log('🔍 กำลังตรวจสอบข้อมูล...\n');

    const dbConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306'),
    };

    if (process.env.DB_SOCKET_PATH) {
      dbConfig.socketPath = process.env.DB_SOCKET_PATH;
      delete dbConfig.host;
      delete dbConfig.port;
    }

    connection = await mysql.createConnection(dbConfig);

    // Get total count
    const [countRows] = await connection.execute('SELECT COUNT(*) as total FROM cars');
    const total = countRows[0].total;
    console.log(`📊 จำนวนรถทั้งหมด: ${total} คัน\n`);

    // Get all cars
    const [cars] = await connection.execute('SELECT id, brand, model, year, price, image, photo_count FROM cars ORDER BY id');
    
    console.log('📋 รายการรถทั้งหมด:');
    console.log('─'.repeat(80));
    cars.forEach(car => {
      console.log(`ID ${car.id}: ${car.brand} ${car.model} ${car.year} - ${parseInt(car.price).toLocaleString('th-TH')} บาท`);
    });
    console.log('─'.repeat(80));
    console.log(`\n✅ ตรวจสอบเสร็จสิ้น: ${cars.length} คัน\n`);

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

checkData();

