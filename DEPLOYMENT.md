# คู่มือการ Deploy ขึ้น Production

## สิ่งที่ต้องเตรียมก่อน Deploy

### 1. Environment Variables

สร้างไฟล์ `.env.production` หรือตั้งค่า environment variables ใน hosting platform:

```env
# Database Configuration
DB_HOST=203.170.129.6
DB_USER=checkk_dbdemo
DB_PASSWORD=Frongaoja0103!
DB_PORT=3306
DB_NAME=checkk_dbdemo

# Next.js Configuration
NEXT_PUBLIC_BASE_PATH=

# Node Environment
NODE_ENV=production
```

### 2. Security Checklist

- [ ] **ลบ hardcoded credentials** ออกจาก `lib/db.ts`
- [ ] **ตั้งค่า secure cookies** ใน production
- [ ] **ใช้ HTTPS** สำหรับ production
- [ ] **ตั้งค่า CORS** ถ้าจำเป็น
- [ ] **ตรวจสอบ database connection** ให้รองรับ remote connection

### 3. Database Configuration

ตรวจสอบว่า:
- Database server อนุญาตให้เชื่อมต่อจาก production server
- Firewall rules เปิด port 3306 (หรือ port ที่ใช้)
- Database user มีสิทธิ์เพียงพอ

### 4. Build และ Deploy

#### สำหรับ Vercel:
```bash
# ตั้งค่า environment variables ใน Vercel Dashboard
# แล้ว push code ขึ้น GitHub
git push origin main
```

#### สำหรับ Node.js Server (VPS/Cloud):
```bash
# 1. Build project
npm run build

# 2. Start production server
npm start

# หรือใช้ PM2
pm2 start npm --name "startup-nextjs" -- start
```

#### สำหรับ Docker:
```bash
# Build image
docker build -t startup-nextjs .

# Run container
docker run -p 3000:3000 --env-file .env.production startup-nextjs
```

### 5. Production Scripts

เพิ่มใน `package.json`:
```json
{
  "scripts": {
    "start:prod": "NODE_ENV=production next start",
    "build:prod": "NODE_ENV=production next build"
  }
}
```

## สิ่งที่ต้องเปลี่ยนในโค้ด

### 1. ลบ Hardcoded Credentials

แก้ไข `lib/db.ts` ให้ใช้ environment variables เท่านั้น (ไม่ใส่ default values)

### 2. Security Headers

เพิ่ม security headers ใน `next.config.js`

### 3. Error Handling

ตรวจสอบว่า error messages ไม่เปิดเผยข้อมูล sensitive

## ตรวจสอบหลัง Deploy

- [ ] ทดสอบการเชื่อมต่อฐานข้อมูล
- [ ] ทดสอบหน้า login
- [ ] ทดสอบการเพิ่มข้อมูลรถ
- [ ] ตรวจสอบ logs สำหรับ errors
- [ ] ทดสอบ performance

## Troubleshooting

### Database Connection Error
- ตรวจสอบ firewall rules
- ตรวจสอบ database credentials
- ตรวจสอบ network connectivity

### API Routes ไม่ทำงาน
- ตรวจสอบว่าไม่ได้ใช้ `output: 'export'`
- ตรวจสอบ environment variables

### Cookies ไม่ทำงาน
- ตรวจสอบ domain และ path settings
- ตรวจสอบ HTTPS settings

