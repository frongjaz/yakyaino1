/**
 * Script to import mock car data into database
 * 
 * Usage:
 *   npx ts-node scripts/import-mock-data.ts
 * 
 * Or compile and run:
 *   npm run build
 *   node scripts/import-mock-data.js
 */

import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Mock data from RelatedCars.tsx with additional details
const mockCars = [
  {
    brand: "Benz",
    model: "GLA200",
    year: 2022,
    price: 1199000,
    image: "/images/hero/main1.png",
    photo_count: 4,
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
    price: 1090000,
    image: "/images/hero/main11.jpg",
    photo_count: 3,
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
    price: 699000,
    image: "/images/hero/main21.jpg",
    photo_count: 5,
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
    price: 899000,
    image: "/images/hero/main31.jpg",
    photo_count: 4,
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
    price: 699000,
    image: "/images/hero/main41.jpg",
    photo_count: 6,
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
    price: 799000,
    image: "/images/hero/main51.jpg",
    photo_count: 3,
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
    price: 2459000,
    image: "/images/hero/main61.jpg",
    photo_count: 5,
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
    price: 899000,
    image: "/images/hero/main71.jpg",
    photo_count: 4,
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
    price: 1269000,
    image: "/images/hero/main81.jpg",
    photo_count: 6,
    description: "BMW 740LI รถหรูหรา สมรรถนะสูง",
    mileage: 60000,
    color: "ดำ",
    transmission: "ออโต้",
    fuel_type: "เบนซิน",
    engine_size: "3.0L",
  },
];

async function importMockData() {
  let connection;
  
  try {
    console.log('🚀 เริ่มนำเข้าข้อมูล mock...\n');

    // Create database connection
    const dbConfig: any = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306'),
    };

    // Check for socket path
    if (process.env.DB_SOCKET_PATH) {
      dbConfig.socketPath = process.env.DB_SOCKET_PATH;
      delete dbConfig.host;
      delete dbConfig.port;
    }

    connection = await mysql.createConnection(dbConfig);
    console.log('✅ เชื่อมต่อ database สำเร็จ\n');

    // Check if cars already exist
    const [existingRows] = await connection.execute('SELECT COUNT(*) as count FROM cars');
    const count = (existingRows[0] as any).count;
    
    if (count > 0) {
      console.log(`⚠️  พบข้อมูลรถใน database แล้ว ${count} คัน`);
      console.log('   หากต้องการนำเข้าข้อมูลใหม่ กรุณาลบข้อมูลเก่าก่อน\n');
    }

    let successCount = 0;
    let errorCount = 0;
    let skipCount = 0;

    for (const car of mockCars) {
      try {
        // Check if car already exists (by brand, model, year)
        const [existing] = await connection.execute(
          'SELECT id FROM cars WHERE brand = ? AND model = ? AND year = ?',
          [car.brand, car.model, car.year]
        );

        if (Array.isArray(existing) && existing.length > 0) {
          console.log(`⏭️  ข้าม: ${car.brand} ${car.model} ${car.year} (มีอยู่แล้ว)`);
          skipCount++;
          continue;
        }

        // Insert car data
        // Use empty string instead of null for image2-5 if columns don't allow null
        const [result] = await connection.execute(
          `INSERT INTO cars (
            brand, model, year, price, image, image2, image3, image4, image5, 
            photo_count, description, mileage, color, transmission, fuel_type, 
            engine_size, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            car.brand,
            car.model,
            car.year,
            car.price,
            car.image,
            '', // image2 - use empty string if column doesn't allow null
            '', // image3
            '', // image4
            '', // image5
            car.photo_count,
            car.description || null, // description
            car.mileage || null, // mileage
            car.color || null, // color
            car.transmission || null, // transmission
            car.fuel_type || null, // fuel_type
            car.engine_size || null, // engine_size
            'available', // status
          ]
        );

        const insertResult = result as any;
        console.log(`✅ เพิ่มสำเร็จ: ${car.brand} ${car.model} ${car.year} (ID: ${insertResult.insertId})`);
        successCount++;
      } catch (error: any) {
        console.error(`❌ เกิดข้อผิดพลาด: ${car.brand} ${car.model} ${car.year}`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 สรุปผลการนำเข้า:');
    console.log(`   ✅ สำเร็จ: ${successCount} คัน`);
    console.log(`   ⏭️  ข้าม: ${skipCount} คัน`);
    console.log(`   ❌ ผิดพลาด: ${errorCount} คัน`);
    console.log(`   📦 ทั้งหมด: ${mockCars.length} คัน\n`);

    await connection.end();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ เกิดข้อผิดพลาดในการเชื่อมต่อ database:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

// Run the import
importMockData();

