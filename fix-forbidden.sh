#!/bin/bash
# Script สำหรับแก้ปัญหา Forbidden Error บน DirectAdmin

echo "🔧 กำลังแก้ปัญหา Forbidden Error..."

# ไปที่ project directory
cd /domains/checkkub.com/public_html || exit 1

echo "📁 ตรวจสอบ File Permissions..."

# ตั้งค่า Permissions สำหรับไฟล์และโฟลเดอร์
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;

# ตั้งค่า Permissions สำหรับ .htaccess
if [ -f ".htaccess" ]; then
    chmod 644 .htaccess
    echo "✅ .htaccess permissions: 644"
fi

if [ -f "public/.htaccess" ]; then
    chmod 644 public/.htaccess
    echo "✅ public/.htaccess permissions: 644"
fi

# ตั้งค่า Permissions สำหรับ .env.local
if [ -f ".env.local" ]; then
    chmod 600 .env.local
    echo "✅ .env.local permissions: 600"
fi

# ตรวจสอบว่า index.html มีอยู่หรือไม่
if [ ! -f "dist/index.html" ] && [ ! -f ".next/server/pages/index.html" ]; then
    echo "⚠️  ไม่พบ index.html - ต้อง build project ก่อน"
    echo "   รัน: npm run build"
fi

# ตรวจสอบว่า PM2 รันอยู่หรือไม่
echo ""
echo "🔍 ตรวจสอบ PM2 Status..."
if command -v pm2 &> /dev/null; then
    pm2 status
    echo ""
    echo "📋 PM2 Logs (10 บรรทัดล่าสุด):"
    pm2 logs nextjs-app --lines 10 --nostream || echo "   ไม่พบ nextjs-app process"
else
    echo "⚠️  PM2 ไม่ได้ติดตั้ง"
    echo "   ติดตั้งด้วย: npm install -g pm2"
fi

# ตรวจสอบว่า port 3000 ถูกใช้งานหรือไม่
echo ""
echo "🔍 ตรวจสอบ Port 3000..."
if command -v netstat &> /dev/null; then
    netstat -tulpn | grep 3000 || echo "   Port 3000 ไม่ถูกใช้งาน"
elif command -v ss &> /dev/null; then
    ss -tulpn | grep 3000 || echo "   Port 3000 ไม่ถูกใช้งาน"
fi

# ตรวจสอบ Apache modules
echo ""
echo "🔍 ตรวจสอบ Apache Modules..."
if command -v httpd &> /dev/null; then
    httpd -M 2>/dev/null | grep -E "(proxy|rewrite)" || echo "   ไม่พบ mod_proxy หรือ mod_rewrite"
fi

echo ""
echo "✅ เสร็จสิ้น!"
echo ""
echo "📝 ขั้นตอนต่อไป:"
echo "   1. ตรวจสอบว่า PM2 รันอยู่: pm2 status"
echo "   2. ถ้าไม่รัน: pm2 start ecosystem.config.js"
echo "   3. ตรวจสอบ logs: pm2 logs nextjs-app"
echo "   4. ตรวจสอบว่า .htaccess อยู่ใน public_html/ (ไม่ใช่ public/)"

