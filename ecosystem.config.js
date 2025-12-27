// PM2 Ecosystem Config
// อ่าน environment variables จาก .env.local อัตโนมัติ
require('dotenv').config({ path: '.env.local' });

module.exports = {
  apps: [{
    name: 'nextjs-app',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    cwd: '/domains/checkkub.com/public_html',
    env_file: '.env.local', // PM2 จะอ่าน env จากไฟล์นี้
    env: {
      NODE_ENV: 'production',
      PORT: process.env.PORT || 3000,
      HOSTNAME: process.env.HOSTNAME || '0.0.0.0',
      // ตัวแปรเหล่านี้จะถูกอ่านจาก .env.local อัตโนมัติ
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_PORT: process.env.DB_PORT || '3306',
      DB_NAME: process.env.DB_NAME,
      NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || ''
    }
  }]
};

