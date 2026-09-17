#!/bin/bash
# deploy-server.sh — รันบน server ผ่าน SSH
# ใช้: bash /domains/checkkub.com/public_html/deploy-server.sh

DIR="/domains/checkkub.com/public_html"
cd "$DIR"

# ตั้ง PATH ให้ครอบคลุม node/pnpm ที่อาจอยู่นอก cron PATH
export PATH="$HOME/.nvm/versions/node/$(ls $HOME/.nvm/versions/node/ 2>/dev/null | tail -1)/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

echo "📥 git pull..."
git pull origin main

echo "📦 install..."
if command -v pnpm &>/dev/null; then
  pnpm install --frozen-lockfile
else
  npm install
fi

echo "🔨 build..."
if command -v pnpm &>/dev/null; then
  pnpm run build
else
  npm run build
fi

echo "🔄 restart Node.js server..."

# ลอง pm2 หลาย path
PM2=""
for p in pm2 \
  ~/.nvm/versions/node/*/bin/pm2 \
  /usr/local/bin/pm2 \
  /usr/bin/pm2 \
  ./node_modules/.bin/pm2; do
  if command -v "$p" &>/dev/null 2>&1 || [ -f "$p" ]; then
    PM2="$p"
    break
  fi
done

if [ -n "$PM2" ]; then
  echo "  ใช้ pm2 ที่: $PM2"
  $PM2 restart nextjs-app 2>/dev/null || $PM2 start ecosystem.config.js
else
  echo "  ไม่พบ pm2 — ใช้ nohup แทน"
  pkill -f "server.js" 2>/dev/null || true
  sleep 1
  nohup node server.js > server.log 2>&1 &
  echo "  Node.js started (PID: $!)"
fi

echo "✅ Deploy สำเร็จ!"
