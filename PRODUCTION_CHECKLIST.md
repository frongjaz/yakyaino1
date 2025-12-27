# ✅ Production Deployment Checklist

## 🔐 Security (สำคัญมาก!)

- [ ] **ลบ hardcoded credentials** - ✅ แก้ไขแล้วใน `lib/db.ts`
- [ ] **ตั้งค่า Environment Variables** ใน production server
- [ ] **ใช้ HTTPS** สำหรับ production
- [ ] **ตรวจสอบ secure cookies** - ✅ ตั้งค่าแล้ว
- [ ] **เปลี่ยน default admin password** ถ้ายังใช้ `admin123`

## 📦 Environment Variables

สร้างไฟล์ `.env.production` หรือตั้งค่าใน hosting platform:

```env
DB_HOST=203.170.129.6
DB_USER=checkk_dbdemo
DB_PASSWORD=Frongaoja0103!
DB_PORT=3306
DB_NAME=checkk_dbdemo
NODE_ENV=production
NEXT_PUBLIC_BASE_PATH=
```

## 🗄️ Database

- [ ] ตรวจสอบว่า database server อนุญาต remote connection
- [ ] ตรวจสอบ firewall rules (port 3306)
- [ ] ทดสอบการเชื่อมต่อจาก production server
- [ ] Backup database ก่อน deploy

## 🚀 Build & Deploy

### Option 1: Vercel (แนะนำ)
```bash
# 1. Push code ขึ้น GitHub
git push origin main

# 2. เชื่อมต่อ Vercel กับ GitHub repo
# 3. ตั้งค่า Environment Variables ใน Vercel Dashboard
# 4. Deploy อัตโนมัติ
```

### Option 2: VPS/Node.js Server
```bash
# 1. Build
npm run build

# 2. Start
npm run start:prod

# หรือใช้ PM2
pm2 start npm --name "startup-nextjs" -- start
```

### Option 3: Docker
```bash
# 1. Build image
docker build -t startup-nextjs .

# 2. Run with env file
docker run -p 3000:3000 --env-file .env.production startup-nextjs
```

## ✅ Post-Deployment Testing

- [ ] ทดสอบหน้า login
- [ ] ทดสอบการเพิ่มข้อมูลรถ
- [ ] ทดสอบการแสดงรายการรถ
- [ ] ตรวจสอบ logs
- [ ] ทดสอบ performance

## 📝 Files ที่ต้องตรวจสอบ

- ✅ `lib/db.ts` - ลบ hardcoded credentials แล้ว
- ✅ `app/api/auth/login/route.ts` - ตั้งค่า secure cookies แล้ว
- ⚠️ `.env.production` - **ต้องสร้างเอง**
- ⚠️ Database connection - **ต้องทดสอบ**

## 🔧 Optional Improvements

- [ ] เพิ่ม rate limiting สำหรับ API
- [ ] เพิ่ม logging system
- [ ] ตั้งค่า monitoring (Sentry, etc.)
- [ ] ตั้งค่า CDN สำหรับ static files
- [ ] เพิ่ม database connection pooling optimization

