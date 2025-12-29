/**
 * Script to update existing mock cars with complete data
 * This will update cars that were imported without full details
 */

require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

// Complete mock data with all fields
const mockCars = [
  {
    brand: "Benz",
    model: "GLA200",
    year: 2022,
    description: "Mercedes-Benz GLA200 รุ่นใหม่ สภาพดีมาก พร้อมใช้งาน",
    mileage: 15000,
    color: "ขาว",
    transmission: "ออโต้",
    fuel_type: "เบนซิน",
    engine_size: "1.3L",
  },
  {
    brand: "BENZ",
    model: "CLS 250",
    year: 2016,
    description: "Mercedes-Benz CLS 250 สไตล์สปอร์ต หรูหรา",
    mileage: 85000,
    color: "ดำ",
    transmission: "ออโต้",
    fuel_type: "ดีเซล",
    engine_size: "2.1L",
  },
  {
    brand: "TOYOTA",
    model: "Corolla Altis",
    year: 2023,
    description: "Toyota Corolla Altis รุ่นใหม่ล่าสุด ประหยัดน้ำมัน",
    mileage: 5000,
    color: "เงิน",
    transmission: "CVT",
    fuel_type: "เบนซิน",
    engine_size: "1.8L",
  },
  {
    brand: "HONDA",
    model: "ACCORD",
    year: 2022,
    description: "Honda Accord สมรรถนะสูง ปลอดภัย",
    mileage: 20000,
    color: "ดำ",
    transmission: "CVT",
    fuel_type: "เบนซิน",
    engine_size: "1.5L",
  },
  {
    brand: "TOYOTA",
    model: "Harrier",
    year: 2014,
    description: "Toyota Harrier SUV หรูหรา พร้อมใช้งาน",
    mileage: 120000,
    color: "ขาว",
    transmission: "CVT",
    fuel_type: "เบนซิน",
    engine_size: "2.0L",
  },
  {
    brand: "BMW",
    model: "530E",
    year: 2020,
    description: "BMW 530E Hybrid ประหยัดน้ำมัน สมรรถนะสูง",
    mileage: 45000,
    color: "ดำ",
    transmission: "ออโต้",
    fuel_type: "ไฮบริด",
    engine_size: "2.0L",
  },
  {
    brand: "TOYOTA",
    model: "Alphard",
    year: 2023,
    description: "Toyota Alphard รถตู้หรูหรา ใหม่มาก พร้อมใช้งาน",
    mileage: 3000,
    color: "ขาว",
    transmission: "CVT",
    fuel_type: "เบนซิน",
    engine_size: "2.5L",
  },
  {
    brand: "Benz",
    model: "SLK200",
    year: 2013,
    description: "Mercedes-Benz SLK200 รถเปิดประทุน สปอร์ต",
    mileage: 95000,
    color: "แดง",
    transmission: "ออโต้",
    fuel_type: "เบนซิน",
    engine_size: "1.8L",
  },
  {
    brand: "BMW",
    model: "740LI",
    year: 2017,
    description: "BMW 740LI รถหรูหรา สมรรถนะสูง",
    mileage: 60000,
    color: "ดำ",
    transmission: "ออโต้",
    fuel_type: "เบนซิน",
    engine_size: "3.0L",
  },
];

async function updateExistingCars() {
  let connection;
  
  try {
    console.log('🔄 กำลังอัพเดตข้อมูลรถที่มีอยู่แล้ว...\n');

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
    console.log('✅ เชื่อมต่อ database สำเร็จ\n');

    let successCount = 0;
    let errorCount = 0;
    let notFoundCount = 0;

    for (const car of mockCars) {
      try {
        // Find car by brand, model, year
        const [existing] = await connection.execute(
          'SELECT id FROM cars WHERE brand = ? AND model = ? AND year = ?',
          [car.brand, car.model, car.year]
        );

        if (existing.length === 0) {
          console.log(`⏭️  ไม่พบ: ${car.brand} ${car.model} ${car.year}`);
          notFoundCount++;
          continue;
        }

        const carId = existing[0].id;

        // Update car data
        await connection.execute(
          `UPDATE cars SET
            description = ?,
            mileage = ?,
            color = ?,
            transmission = ?,
            fuel_type = ?,
            engine_size = ?
          WHERE id = ?`,
          [
            car.description,
            car.mileage,
            car.color,
            car.transmission,
            car.fuel_type,
            car.engine_size,
            carId,
          ]
        );

        console.log(`✅ อัพเดตสำเร็จ: ${car.brand} ${car.model} ${car.year} (ID: ${carId})`);
        successCount++;
      } catch (error) {
        console.error(`❌ เกิดข้อผิดพลาด: ${car.brand} ${car.model} ${car.year}`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 สรุปผลการอัพเดต:');
    console.log(`   ✅ สำเร็จ: ${successCount} คัน`);
    console.log(`   ⏭️  ไม่พบ: ${notFoundCount} คัน`);
    console.log(`   ❌ ผิดพลาด: ${errorCount} คัน`);
    console.log(`   📦 ทั้งหมด: ${mockCars.length} คัน\n`);

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการเชื่อมต่อ database:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

updateExistingCars();

