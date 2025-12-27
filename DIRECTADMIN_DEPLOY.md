# 🚀 คู่มือ Deploy บน DirectAdmin

## ✅ DirectAdmin รองรับ Next.js ได้

DirectAdmin สามารถรัน Next.js ได้ แต่ต้องใช้วิธีที่เหมาะสม:

### วิธีที่ 1: Deploy เป็น Node.js Application (แนะนำ)

#### ขั้นตอน:

1. **เตรียมไฟล์**
   ```bash
   # Build project
   npm run build
   ```

2. **อัปโหลดไฟล์ขึ้น DirectAdmin**
   - ใช้ File Manager หรือ FTP
   - อัปโหลดไปที่: `/domains/yourdomain.com/public_html/`
   - หรือสร้าง subdomain เช่น `admin.yourdomain.com`

3. **ตั้งค่า Node.js ใน DirectAdmin**
   - ไปที่ **Advanced Features** → **Node.js Selector**
   - เลือก Node.js version (แนะนำ 18.x หรือ 20.x)
   - ตั้งค่า Application Root: `/domains/yourdomain.com/public_html`
   - ตั้งค่า Application URL: `/`
   - ตั้งค่า Application Startup File: `server.js` หรือ `package.json`

4. **สร้างไฟล์ `server.js`** (ถ้าจำเป็น)
   ```javascript
   const { createServer } = require('http');
   const { parse } = require('url');
   const next = require('next');

   const dev = process.env.NODE_ENV !== 'production';
   const hostname = 'localhost';
   const port = process.env.PORT || 3000;

   const app = next({ dev, hostname, port });
   const handle = app.getRequestHandler();

   app.prepare().then(() => {
     createServer(async (req, res) => {
       try {
         const parsedUrl = parse(req.url, true);
         await handle(req, res, parsedUrl);
       } catch (err) {
         console.error('Error occurred handling', req.url, err);
         res.statusCode = 500;
         res.end('internal server error');
       }
     }).listen(port, (err) => {
       if (err) throw err;
       console.log(`> Ready on http://${hostname}:${port}`);
     });
   });
   ```

5. **ตั้งค่า Environment Variables**
   - ไปที่ **Advanced Features** → **Environment Variables**
   - เพิ่ม:
     ```
     DB_HOST=203.170.129.6
     DB_USER=checkk_dbdemo
     DB_PASSWORD=Frongaoja0103!
     DB_PORT=3306
     DB_NAME=checkk_dbdemo
     NODE_ENV=production
     ```

6. **Start Application**
   - ใน Node.js Selector → คลิก "Start" หรือ "Restart"

### วิธีที่ 2: ใช้ Custom Build Script

1. **สร้างไฟล์ `deploy.sh`**
   ```bash
   #!/bin/bash
   npm install
   npm run build
   pm2 start npm --name "startup-nextjs" -- start
   ```

2. **รันผ่าน SSH**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

### วิธีที่ 3: ใช้ PM2 (ถ้ามี SSH access)

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start npm --name "startup-nextjs" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on server reboot
pm2 startup
```

## ⚠️ ข้อจำกัดของ DirectAdmin

1. **Port Restrictions**
   - DirectAdmin อาจจำกัด port ที่ใช้ได้
   - ตรวจสอบว่า port 3000 หรือ port ที่ตั้งค่าไว้ใช้งานได้

2. **Memory Limits**
   - ตรวจสอบ memory limit ใน PHP/Node.js settings
   - อาจต้องเพิ่ม memory limit

3. **Database Connection**
   - ตรวจสอบว่า DirectAdmin อนุญาตให้เชื่อมต่อ database ภายนอกได้
   - อาจต้อง whitelist IP ของ database server

## 📋 Checklist สำหรับ DirectAdmin

- [ ] Build project (`npm run build`)
- [ ] อัปโหลดไฟล์ขึ้น DirectAdmin
- [ ] ตั้งค่า Node.js version
- [ ] ตั้งค่า Environment Variables
- [ ] ตั้งค่า Application Root และ Startup File
- [ ] ตรวจสอบ port และ firewall
- [ ] ทดสอบการเชื่อมต่อ database
- [ ] Start/Restart application

## 🔧 Troubleshooting

### Application ไม่ start
- ตรวจสอบ logs ใน DirectAdmin → Node.js Selector → Logs
- ตรวจสอบว่า port ไม่ถูกใช้งานโดย process อื่น
- ตรวจสอบ environment variables

### Database connection error
- ตรวจสอบว่า database server อนุญาต remote connection
- ตรวจสอบ firewall rules
- ทดสอบ connection จาก SSH

### Port already in use
- เปลี่ยน port ใน `package.json` หรือ environment variable
- Kill process ที่ใช้ port อยู่

