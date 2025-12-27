# 📋 Next.js Environment Variables Priority

## ✅ ดีมาก! `.env.local` ใช้งานได้เลย

Next.js จะอ่านไฟล์ `.env.local` **อัตโนมัติ** และมี **priority สูงสุด**

## 🔄 Priority Order ของ Environment Files

Next.js จะโหลด environment variables ตามลำดับนี้ (ไฟล์ที่อยู่ด้านล่างจะ override ไฟล์ด้านบน):

1. `.env` - Default values
2. `.env.local` - **Local overrides (ignored by git)** ⭐
3. `.env.development` / `.env.production` - Environment-specific
4. `.env.development.local` / `.env.production.local` - Local overrides for specific environment

## ✅ สำหรับ Production

ถ้าคุณมี `.env.local` ใน production server แล้ว:

### ตรวจสอบว่าไฟล์มีข้อมูลครบ:

```env
# .env.local (ใน production)
DB_HOST=203.170.129.6
DB_USER=checkk_dbdemo
DB_PASSWORD=Frongaoja0103!
DB_PORT=3306
DB_NAME=checkk_dbdemo
NODE_ENV=production
NEXT_PUBLIC_BASE_PATH=
```

### ข้อดีของ `.env.local`:

- ✅ **อัตโนมัติ** - Next.js อ่านไฟล์นี้โดยอัตโนมัติ
- ✅ **ปลอดภัย** - อยู่ใน `.gitignore` แล้ว (ไม่ถูก commit)
- ✅ **Priority สูง** - Override ค่าจาก `.env` ได้
- ✅ **Local only** - แต่ละ environment มีไฟล์แยกกัน

## 🔍 ตรวจสอบว่าไฟล์ถูกต้อง

### 1. ตรวจสอบตำแหน่งไฟล์
```
/domains/yourdomain.com/public_html/
├── .env.local          ← ไฟล์นี้ (root ของ project)
├── package.json
├── next.config.js
└── ...
```

### 2. ตรวจสอบ Permissions
```bash
# ควรเป็น 600 (owner read/write only)
chmod 600 .env.local
```

### 3. ตรวจสอบว่า Application อ่านได้
- Restart application
- ตรวจสอบ logs
- ทดสอบการเชื่อมต่อ database

## 📝 สรุป

**คุณไม่ต้องทำอะไรเพิ่ม!**

- ✅ `.env.local` อยู่ใน production แล้ว
- ✅ Next.js จะอ่านไฟล์นี้อัตโนมัติ
- ✅ ไฟล์อยู่ใน `.gitignore` แล้ว (ปลอดภัย)
- ✅ ใช้ได้เลย!

## ⚠️ ถ้ามีปัญหา

### Application ไม่อ่าน `.env.local`

1. **ตรวจสอบตำแหน่งไฟล์**
   - ต้องอยู่ที่ root ของ project (เดียวกับ `package.json`)

2. **ตรวจสอบ Permissions**
   ```bash
   chmod 600 .env.local
   ```

3. **Restart Application**
   - ใน DirectAdmin → Node.js Selector → Restart

4. **ตรวจสอบ Logs**
   - ดู error messages ใน DirectAdmin logs

### ต้องการแก้ไขค่า

1. **แก้ไขไฟล์ `.env.local`** ใน DirectAdmin File Manager
2. **Restart Application**
3. **ทดสอบอีกครั้ง**

