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

// Mock data from RelatedCars.tsx
const mockCars = [
  {
    brand: "Benz",
    model: "GLA200",
    year: 2022,
    price: 1199000,
    image: "/images/hero/main1.png",
    photo_count: 4,
  },
  {
    brand: "BENZ",
    model: "CLS 250",
    year: 2016,
    price: 1090000,
    image: "/images/hero/main11.jpg",
    photo_count: 3,
  },
  {
    brand: "TOYOTA",
    model: "Corolla Altis",
    year: 2023,
    price: 699000,
    image: "/images/hero/main21.jpg",
    photo_count: 5,
  },
  {
    brand: "HONDA",
    model: "ACCORD",
    year: 2022,
    price: 899000,
    image: "/images/hero/main31.jpg",
    photo_count: 4,
  },
  {
    brand: "TOYOTA",
    model: "Harrier",
    year: 2014,
    price: 699000,
    image: "/images/hero/main41.jpg",
    photo_count: 6,
  },
  {
    brand: "BMW",
    model: "530E",
    year: 2020,
    price: 799000,
    image: "/images/hero/main51.jpg",
    photo_count: 3,
  },
  {
    brand: "TOYOTA",
    model: "Alphard",
    year: 2023,
    price: 2459000,
    image: "/images/hero/main61.jpg",
    photo_count: 5,
  },
  {
    brand: "Benz",
    model: "SLK200",
    year: 2013,
    price: 899000,
    image: "/images/hero/main71.jpg",
    photo_count: 4,
  },
  {
    brand: "BMW",
    model: "740LI",
    year: 2017,
    price: 1269000,
    image: "/images/hero/main81.jpg",
    photo_count: 6,
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
            null, // image2
            null, // image3
            null, // image4
            null, // image5
            car.photo_count,
            null, // description
            null, // mileage
            null, // color
            null, // transmission
            null, // fuel_type
            null, // engine_size
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

