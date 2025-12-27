# 🔐 วิธีตั้งค่า Environment Variables บน DirectAdmin

## ✅ วิธีที่ 1: ใช้ไฟล์ `.env` (ทำได้)

### ขั้นตอน:

1. **สร้างไฟล์ `.env` ในเครื่องของคุณ**
   ```env
   DB_HOST=203.170.129.6
   DB_USER=checkk_dbdemo
   DB_PASSWORD=Frongaoja0103!
   DB_PORT=3306
   DB_NAME=checkk_dbdemo
   NODE_ENV=production
   NEXT_PUBLIC_BASE_PATH=
   ```

2. **อัปโหลดไฟล์ `.env` ขึ้น DirectAdmin**
   - ใช้ **File Manager** ใน DirectAdmin
   - หรือใช้ **FTP Client** (FileZilla, WinSCP, etc.)
   - อัปโหลดไปที่: `/domains/yourdomain.com/public_html/.env`
   - หรือที่เดียวกับไฟล์ `package.json`

3. **ตั้งค่า Permissions**
   - คลิกขวาที่ไฟล์ `.env` → **Change Permissions**
   - ตั้งค่าเป็น: **600** หรือ **640** (owner read/write only)
   - ⚠️ **สำคัญ:** อย่าตั้งเป็น 644 หรือ 755 (public readable)

4. **ตรวจสอบว่าไฟล์อยู่ในตำแหน่งที่ถูกต้อง**
   ```
   /domains/yourdomain.com/public_html/
   ├── .env              ← ไฟล์นี้
   ├── package.json
   ├── next.config.js
   └── ...
   ```

### ⚠️ ข้อควรระวัง:

- ✅ **ทำได้** - Next.js จะอ่านไฟล์ `.env` อัตโนมัติ
- ⚠️ **ระวัง Security** - ตั้งค่า permissions ให้ถูกต้อง (600)
- ⚠️ **อย่า commit ลง Git** - ตรวจสอบ `.gitignore` ว่ามี `.env` แล้ว
- ⚠️ **Backup** - เก็บไฟล์ `.env` ไว้ในที่ปลอดภัย

## ✅ วิธีที่ 2: ใช้ Environment Variables ใน DirectAdmin (แนะนำ - ปลอดภัยกว่า)

### สำหรับ Node.js Applications:

1. **ไปที่ DirectAdmin → Advanced Features → Node.js Selector**

2. **เลือก Application ของคุณ**

3. **คลิก "Environment Variables" หรือ "Edit Environment"**

4. **เพิ่ม Environment Variables:**
   ```
   DB_HOST=203.170.129.6
   DB_USER=checkk_dbdemo
   DB_PASSWORD=Frongaoja0103!
   DB_PORT=3306
   DB_NAME=checkk_dbdemo
   NODE_ENV=production
   ```

5. **Save และ Restart Application**

### ข้อดี:
- ✅ ปลอดภัยกว่า - ไม่มีไฟล์ `.env` ที่อาจถูกเข้าถึงได้
- ✅ จัดการง่าย - แก้ไขผ่าน DirectAdmin UI
- ✅ แยก environment ได้ - development, staging, production

## ✅ วิธีที่ 3: ใช้ไฟล์ `.env.production`

1. **สร้างไฟล์ `.env.production`**
   ```env
   DB_HOST=203.170.129.6
   DB_USER=checkk_dbdemo
   DB_PASSWORD=Frongaoja0103!
   DB_PORT=3306
   DB_NAME=checkk_dbdemo
   NODE_ENV=production
   ```

2. **อัปโหลดขึ้น DirectAdmin**

3. **Next.js จะอ่านไฟล์นี้เมื่อ `NODE_ENV=production`**

## 📋 Checklist

### ก่อนอัปโหลด `.env`:

- [ ] ตรวจสอบว่าไฟล์ `.env` อยู่ใน `.gitignore` แล้ว
- [ ] ตั้งค่า permissions เป็น 600 (owner read/write only)
- [ ] ตรวจสอบว่าไฟล์อยู่ในตำแหน่งที่ถูกต้อง (root ของ project)
- [ ] Backup ไฟล์ `.env` ไว้ในที่ปลอดภัย

### หลังอัปโหลด:

- [ ] ตรวจสอบว่า application อ่าน environment variables ได้
- [ ] ทดสอบการเชื่อมต่อ database
- [ ] ตรวจสอบ logs สำหรับ errors
- [ ] ตรวจสอบว่าไฟล์ `.env` ไม่ถูกเข้าถึงจาก web browser

## 🔒 Security Best Practices

### 1. ตั้งค่า Permissions ให้ถูกต้อง
```bash
# ผ่าน SSH หรือ File Manager
chmod 600 .env
```

### 2. ตรวจสอบว่าไฟล์ไม่ถูกเข้าถึงจาก web
สร้างไฟล์ `.htaccess` (ถ้าใช้ Apache):
```apache
<Files ".env">
    Order allow,deny
    Deny from all
</Files>
```

### 3. ใช้ Environment Variables แทน (ถ้าเป็นไปได้)
- ปลอดภัยกว่าไฟล์ `.env`
- จัดการง่ายกว่า
- ไม่มีไฟล์ที่อาจถูกเข้าถึงได้

## 🚨 ถ้าไฟล์ `.env` ถูกเข้าถึงได้

1. **เปลี่ยน credentials ทันที**
   - เปลี่ยน database password
   - เปลี่ยน admin password

2. **ตรวจสอบ logs**
   - ดูว่ามีใครเข้าถึงไฟล์หรือไม่

3. **ลบไฟล์ `.env` และใช้ Environment Variables แทน**

## 📝 สรุป

**คำตอบ: ได้ แต่ต้องระวัง!**

- ✅ **ทำได้** - อัปโหลดไฟล์ `.env` ขึ้น DirectAdmin ได้
- ⚠️ **ระวัง Security** - ตั้งค่า permissions ให้ถูกต้อง (600)
- ✅ **แนะนำ** - ใช้ Environment Variables ใน DirectAdmin แทน (ปลอดภัยกว่า)
- ✅ **ตรวจสอบ** - อย่าให้ไฟล์ถูกเข้าถึงจาก web browser

## 🔧 Troubleshooting

### Application ไม่อ่าน `.env`
- ตรวจสอบว่าไฟล์อยู่ในตำแหน่งที่ถูกต้อง (root ของ project)
- ตรวจสอบว่า `NODE_ENV` ถูกต้อง
- ตรวจสอบ permissions (ต้องเป็น 600)

### Database connection error
- ตรวจสอบว่า environment variables ถูกต้อง
- ตรวจสอบว่า database server อนุญาต remote connection
- ตรวจสอบ firewall rules

