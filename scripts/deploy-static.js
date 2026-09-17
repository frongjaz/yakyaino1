#!/usr/bin/env node
/**
 * deploy-static.js
 * Build static export (hiding app/api to bypass Next.js 13 limitation)
 * then upload out/ to hosting via FTP.
 */

require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ftp = require('basic-ftp');

const ROOT = path.join(__dirname, '..');
const APP_API = path.join(ROOT, 'app/api');
const APP_API_BAK = path.join(ROOT, 'app/_api_bak');
const OUT_DIR = path.join(ROOT, 'out');
const PHP_API_DIR = path.join(ROOT, 'api');

const FTP_HOST = process.env.FTP_HOST;
const FTP_USER = process.env.FTP_USER;
const FTP_PASSWORD = process.env.FTP_PASSWORD;
const REMOTE_ROOT = '/domains/checkkub.com/public_html';

if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD) {
  console.error('❌ ไม่พบ FTP_HOST / FTP_USER / FTP_PASSWORD ใน .env.local');
  process.exit(1);
}

// ── 1. Build ──────────────────────────────────────────────────────────────────
function build() {
  console.log('\n📦 กำลัง build static export...');

  // ซ่อน app/api ชั่วคราว
  if (fs.existsSync(APP_API)) fs.renameSync(APP_API, APP_API_BAK);

  try {
    execSync('pnpm run build', {
      stdio: 'inherit',
      env: { ...process.env, IS_STATIC_EXPORT: 'true' },
      cwd: ROOT,
    });
    console.log('✅ Build สำเร็จ');
  } finally {
    // Restore เสมอ ไม่ว่า build จะสำเร็จหรือล้มเหลว
    if (fs.existsSync(APP_API_BAK)) fs.renameSync(APP_API_BAK, APP_API);
  }
}

// ── 2. FTP Upload ─────────────────────────────────────────────────────────────
async function uploadDir(client, localDir, remoteDir) {
  await client.ensureDir(remoteDir);
  await client.clearWorkingDir(); // เคลียร์ก่อน upload ใหม่ (ข้ามถ้าไม่ต้องการ)

  const entries = fs.readdirSync(localDir, { withFileTypes: true });
  for (const entry of entries) {
    const localPath = path.join(localDir, entry.name);
    const remotePath = `${remoteDir}/${entry.name}`;
    if (entry.isDirectory()) {
      await client.ensureDir(remotePath);
      await uploadDir(client, localPath, remotePath);
      await client.cd(remoteDir);
    } else {
      process.stdout.write(`  ↑ ${remotePath}\n`);
      await client.uploadFrom(localPath, remotePath);
    }
  }
}

async function ftpUpload() {
  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    console.log(`\n🔗 กำลังเชื่อมต่อ FTP: ${FTP_HOST}`);
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure: false,
    });
    console.log('✅ เชื่อมต่อสำเร็จ');

    // upload out/ → public_html
    console.log('\n📤 กำลัง upload frontend (out/)...');
    await client.uploadFromDir(OUT_DIR, REMOTE_ROOT);
    console.log('✅ Frontend upload สำเร็จ');

    // upload api/*.php → public_html/api/
    if (fs.existsSync(PHP_API_DIR)) {
      console.log('\n📤 กำลัง upload PHP API (api/)...');
      await client.uploadFromDir(PHP_API_DIR, `${REMOTE_ROOT}/api`);
      console.log('✅ PHP API upload สำเร็จ');
    }
  } finally {
    client.close();
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  try {
    build();
    await ftpUpload();
    console.log('\n🎉 Deploy สำเร็จ! www.checkkub.com พร้อมใช้งาน');
  } catch (err) {
    // Restore api dir ถ้ายังค้างอยู่
    if (fs.existsSync(APP_API_BAK) && !fs.existsSync(APP_API)) {
      fs.renameSync(APP_API_BAK, APP_API);
    }
    console.error('\n❌ Deploy ล้มเหลว:', err.message);
    process.exit(1);
  }
})();
