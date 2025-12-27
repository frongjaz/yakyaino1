# 🚀 คู่มือ Deploy ผ่าน GitHub

## ⚠️ สิ่งสำคัญ: GitHub ไม่ใช่ Hosting Platform

GitHub เองไม่สามารถรัน Next.js application ได้โดยตรง แต่สามารถใช้:

1. **GitHub Pages** - สำหรับ static sites เท่านั้น (ไม่รองรับ API routes)
2. **GitHub Actions** - สำหรับ CI/CD เพื่อ deploy ไปยัง platform อื่น

## วิธีที่ 1: GitHub Actions → Deploy ไปยัง VPS/DirectAdmin

### สร้าง GitHub Actions Workflow

สร้างไฟล์ `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          DB_HOST: ${{ secrets.DB_HOST }}
          DB_USER: ${{ secrets.DB_USER }}
          DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
          DB_NAME: ${{ secrets.DB_NAME }}
          DB_PORT: ${{ secrets.DB_PORT }}
          NODE_ENV: production

      - name: Deploy to server via SSH
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          port: ${{ secrets.PORT }}
          source: "dist,package.json,package-lock.json"
          target: "/home/username/public_html"

      - name: Restart application
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          port: ${{ secrets.PORT }}
          script: |
            cd /home/username/public_html
            npm install --production
            pm2 restart startup-nextjs || pm2 start npm --name "startup-nextjs" -- start
```

### ตั้งค่า GitHub Secrets

1. ไปที่ Repository → **Settings** → **Secrets and variables** → **Actions**
2. เพิ่ม Secrets:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `DB_PORT`
   - `HOST` (server IP)
   - `USERNAME` (SSH username)
   - `SSH_KEY` (private SSH key)
   - `PORT` (SSH port, default 22)

## วิธีที่ 2: GitHub Actions → Deploy ไปยัง Vercel

### ใช้ Vercel GitHub Integration (แนะนำ)

1. **เชื่อมต่อ GitHub กับ Vercel**
   - ไปที่ [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Import repository

2. **ตั้งค่า Environment Variables**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - เพิ่ม:
     - `DB_HOST`
     - `DB_USER`
     - `DB_PASSWORD`
     - `DB_NAME`
     - `DB_PORT`
     - `NODE_ENV=production`

3. **Deploy**
   - Push code ขึ้น GitHub
   - Vercel จะ deploy อัตโนมัติ

### ใช้ Vercel CLI

```yaml
# .github/workflows/deploy-vercel.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## วิธีที่ 3: GitHub Pages (Static Export Only)

⚠️ **ข้อจำกัด:** ไม่รองรับ API routes และ dynamic features

```yaml
# .github/workflows/deploy-pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build static export
        run: npm run build
        env:
          NEXT_PUBLIC_BASE_PATH: /your-repo-name
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

## 📋 สรุป: วิธีที่แนะนำ

### สำหรับ Next.js + API Routes:

1. **Vercel** (ง่ายที่สุด) ⭐
   - เชื่อมต่อ GitHub → Deploy อัตโนมัติ
   - ตั้งค่า Environment Variables ใน Vercel Dashboard

2. **DirectAdmin + GitHub Actions**
   - ใช้ GitHub Actions เพื่อ build และ deploy ไปยัง DirectAdmin
   - ตั้งค่า SSH keys และ secrets

3. **Railway/Render/Heroku**
   - เชื่อมต่อ GitHub repository
   - Deploy อัตโนมัติเมื่อ push code

### สำหรับ Static Site:

- **GitHub Pages** - ฟรี แต่จำกัดเฉพาะ static

## 🔐 Security Best Practices

1. **อย่า commit `.env` files**
2. **ใช้ GitHub Secrets สำหรับ sensitive data**
3. **ใช้ Environment Variables ใน hosting platform**
4. **ตรวจสอบ `.gitignore`** ว่ามี `.env*` แล้ว

