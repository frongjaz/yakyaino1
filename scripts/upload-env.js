#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const ftp = require('basic-ftp');
const { Readable } = require('stream');

const REMOTE_ROOT = '/domains/checkkub.com/public_html';

const envContent = [
  `NEXT_PUBLIC_BASE_URL=${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.checkkub.com'}`,
  `NEXT_PUBLIC_GA_ID=${process.env.NEXT_PUBLIC_GA_ID || ''}`,
  `NEXT_PUBLIC_AW_ID=${process.env.NEXT_PUBLIC_AW_ID || ''}`,
  `NEXT_PUBLIC_AW_LEAD_LABEL=${process.env.NEXT_PUBLIC_AW_LEAD_LABEL || ''}`,
  `DB_HOST=${process.env.DB_HOST || ''}`,
  `DB_PORT=${process.env.DB_PORT || '3306'}`,
  `DB_NAME=${process.env.DB_NAME || ''}`,
  `DB_USER=${process.env.DB_USER || ''}`,
  `DB_PASSWORD=${process.env.DB_PASSWORD || ''}`,
  `LINE_CHANNEL_TOKEN=${process.env.LINE_CHANNEL_TOKEN || ''}`,
  `LINE_GROUP_ID=${process.env.LINE_GROUP_ID || ''}`,
].join('\n') + '\n';

async function main() {
  const client = new ftp.Client();
  client.ftp.verbose = false;
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: false,
    });
    await client.cd(REMOTE_ROOT);
    const stream = Readable.from([envContent]);
    await client.uploadFrom(stream, '.env.local');
    console.log('✅ อัพโหลด .env.local ไปที่ server แล้ว');
  } catch (err) {
    console.error('❌ FTP error:', err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}
main();
