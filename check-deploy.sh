#!/bin/bash
# Script สำหรับตรวจสอบการ Deploy

echo "🔍 กำลังตรวจสอบการ Deploy..."

cd /domains/checkkub.com/public_html || exit 1

echo ""
echo "📁 ตรวจสอบไฟล์และโฟลเดอร์:"
echo "================================"
ls -la | head -20

echo ""
echo "📄 ตรวจสอบ .htaccess:"
echo "================================"
if [ -f ".htaccess" ]; then
    echo "✅ พบ .htaccess"
    cat .htaccess
else
    echo "❌ ไม่พบ .htaccess ใน public_html/"
    if [ -f "public/.htaccess" ]; then
        echo "   แต่พบใน public/.htaccess"
        echo "   ให้ copy: cp public/.htaccess .htaccess"
    fi
fi

echo ""
echo "📄 ตรวจสอบ index.html:"
echo "================================"
if [ -f "index.html" ]; then
    echo "✅ พบ index.html"
    ls -lh index.html
else
    echo "❌ ไม่พบ index.html"
    if [ -f "dist/index.html" ]; then
        echo "   แต่พบใน dist/index.html"
        echo "   ให้ copy: cp -r dist/* ."
    fi
fi

echo ""
echo "📁 ตรวจสอบ dist/ folder:"
echo "================================"
if [ -d "dist" ]; then
    echo "✅ พบ dist/"
    ls -la dist/ | head -10
    if [ -f "dist/index.html" ]; then
        echo "✅ พบ dist/index.html"
    else
        echo "❌ ไม่พบ dist/index.html"
    fi
else
    echo "⚠️  ไม่พบ dist/ folder"
fi

echo ""
echo "🔐 ตรวจสอบ Permissions:"
echo "================================"
echo "Current directory permissions:"
ls -ld .
echo ""
echo ".htaccess permissions:"
ls -l .htaccess 2>/dev/null || echo "   ไม่พบ .htaccess"
echo ""
echo "index.html permissions:"
ls -l index.html 2>/dev/null || echo "   ไม่พบ index.html"

echo ""
echo "🌐 ตรวจสอบ Apache Error Log (ถ้ามีสิทธิ์):"
echo "================================"
if [ -f "/var/log/httpd/error_log" ]; then
    echo "Last 5 errors:"
    tail -5 /var/log/httpd/error_log 2>/dev/null || echo "   ไม่สามารถอ่าน log ได้"
elif [ -f "/usr/local/apache/logs/error_log" ]; then
    echo "Last 5 errors:"
    tail -5 /usr/local/apache/logs/error_log 2>/dev/null || echo "   ไม่สามารถอ่าน log ได้"
else
    echo "   ไม่พบ error log"
fi

echo ""
echo "✅ การตรวจสอบเสร็จสิ้น"
echo ""
echo "💡 คำแนะนำ:"
echo "   1. ถ้าไม่มี index.html → ต้อง build: npm run build"
echo "   2. ถ้าไม่มี .htaccess → copy: cp public/.htaccess .htaccess"
echo "   3. ถ้ามี dist/ แต่ไม่มี index.html ใน root → copy: cp -r dist/* ."
echo "   4. ตรวจสอบ permissions: chmod 644 .htaccess && chmod 644 index.html"

