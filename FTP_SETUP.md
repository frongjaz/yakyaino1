# 📤 คู่มือการตั้งค่า FTP Upload

## ✅ สิ่งที่ทำแล้ว

1. ✅ สร้าง API endpoint `/api/upload` สำหรับอัพโหลดไฟล์ไปยัง FTP
2. ✅ แก้ไข `AddCarForm` ให้อัพโหลดไฟล์ก่อนบันทึก
3. ✅ เพิ่ม `basic-ftp` package
4. ✅ สร้าง `lib/auth-api.ts` สำหรับ authentication

---

## ⚙️ การตั้งค่า

### 1. ติดตั้ง Package

```bash
npm install basic-ftp
```

---

### 2. ตั้งค่า Environment Variables

**ใน Vercel Dashboard:**

1. ไปที่ **Settings** → **Environment Variables**
2. เพิ่ม variables ต่อไปนี้:

```env
FTP_HOST=ftp.checkkub.com
FTP_USER=your_ftp_username
FTP_PASSWORD=your_ftp_password
FTP_PATH=/domains/checkkub.com/public_html/images/cars/
NEXT_PUBLIC_BASE_URL=https://checkkub.com
```

**หมายเหตุ:**
- `FTP_HOST`: FTP server address
- `FTP_USER`: FTP username
- `FTP_PASSWORD`: FTP password
- `FTP_PATH`: Path ที่จะเก็บรูปภาพ (ต้องมี `/` ท้าย)
- `NEXT_PUBLIC_BASE_URL`: Base URL ของเว็บไซต์ (สำหรับสร้าง public URL)

---

### 3. สร้าง Directory บน FTP

**ต้องสร้าง directory นี้บน FTP server:**
```
/domains/checkkub.com/public_html/images/cars/
```

**Permissions:**
- Directory: `755`
- Files: `644`

---

## 🔧 วิธีทำงาน

1. **User อัพโหลดรูปภาพ:**
   - เลือกไฟล์จาก form
   - ระบบจะแสดง preview ทันที
   - อัพโหลดไปยัง FTP server

2. **API Process:**
   - ตรวจสอบ authentication
   - Validate file type และ size
   - สร้าง unique filename
   - อัพโหลดไปยัง FTP
   - Return public URL

3. **บันทึกข้อมูล:**
   - ใช้ URL ที่ได้จาก upload
   - บันทึกใน database

---

## 📁 File Structure

```
public_html/
  └── images/
      └── cars/
          ├── car_1234567890_abc123.jpg
          ├── car_1234567891_def456.png
          └── ...
```

---

## 🔍 Troubleshooting

### ปัญหา: "FTP configuration ไม่ครบถ้วน"

**สาเหตุ:** Environment variables ไม่ถูกตั้งค่า

**วิธีแก้:**
1. ตรวจสอบว่า environment variables ถูกตั้งค่าใน Vercel
2. Redeploy application

---

### ปัญหา: "เกิดข้อผิดพลาดในการอัพโหลดไฟล์"

**สาเหตุ:** 
- FTP credentials ไม่ถูกต้อง
- Directory ไม่มีอยู่
- Permissions ไม่ถูกต้อง

**วิธีแก้:**
1. ตรวจสอบ FTP credentials
2. สร้าง directory `/domains/checkkub.com/public_html/images/cars/`
3. ตั้งค่า permissions เป็น `755`

---

### ปัญหา: รูปภาพไม่แสดง

**สาเหตุ:** URL ไม่ถูกต้อง

**วิธีแก้:**
1. ตรวจสอบว่า `NEXT_PUBLIC_BASE_URL` ถูกตั้งค่า
2. ตรวจสอบว่าไฟล์ถูกอัพโหลดไปยัง FTP แล้ว
3. ตรวจสอบ permissions ของไฟล์

---

## 📝 Checklist

- [ ] ติดตั้ง `basic-ftp` package
- [ ] ตั้งค่า environment variables ใน Vercel
- [ ] สร้าง directory `/domains/checkkub.com/public_html/images/cars/`
- [ ] ตั้งค่า permissions (755)
- [ ] Deploy และทดสอบ

---

## 🔗 Links

- [Vercel Environment Variables](https://vercel.com/dashboard)
- [basic-ftp Documentation](https://github.com/patrickjuchli/basic-ftp)

---

## 📝 สรุป

**สิ่งที่ต้องทำ:**
1. ติดตั้ง package: `npm install basic-ftp`
2. ตั้งค่า environment variables ใน Vercel
3. สร้าง directory บน FTP
4. Deploy และทดสอบ

**หลังจากตั้งค่าแล้ว:**
- รูปภาพจะถูกอัพโหลดไปยัง FTP server
- เก็บ URL ใน database
- แสดงรูปภาพจาก FTP server

