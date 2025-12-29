# 🔍 Debug API URL Issue

## 🔴 ปัญหา

API URL มี double slash: `https://yakyaino1.vercel.app//api/cars`

**สาเหตุ:**
- `API_URL` อาจมี trailing slash
- หรือ `getApiUrl` function ไม่จัดการ trailing slash ถูกต้อง

---

## ✅ วิธีแก้ไข

### 1. แก้ไข `lib/api.ts`

**แก้ไข `getApiUrl` function:**
- Remove trailing slash จาก `API_URL` ถ้ามี
- Ensure ไม่มี double slash

---

### 2. ตรวจสอบ `NEXT_PUBLIC_API_URL`

**ใน GitHub Actions:**
```yaml
env:
  NEXT_PUBLIC_API_URL: ${{ secrets.VERCEL_API_URL || 'https://yakyaino1.vercel.app' }}
```

**ตรวจสอบว่า:**
- ไม่มี trailing slash
- URL ถูกต้อง

---

### 3. ทดสอบ

**หลังจาก deploy:**

1. **ไปที่:** `https://checkkub.com/api-test`
2. **ดู API URL ที่แสดง:**
   - ✅ ควรเป็น: `https://yakyaino1.vercel.app/api/cars`
   - ❌ ไม่ควรเป็น: `https://yakyaino1.vercel.app//api/cars`

---

## 🔧 วิธีแก้ไขชั่วคราว

**ถ้ายังไม่ได้:**

1. **แก้ไข GitHub Actions:**
   ```yaml
   env:
     NEXT_PUBLIC_API_URL: https://yakyaino1.vercel.app
   ```

2. **หรือใช้ environment variable ใน build:**
   ```bash
   NEXT_PUBLIC_API_URL=https://yakyaino1.vercel.app npm run build:root
   ```

---

## 📝 Checklist

- [ ] แก้ไข `lib/api.ts` (ทำแล้ว)
- [ ] ตรวจสอบว่า `NEXT_PUBLIC_API_URL` ไม่มี trailing slash
- [ ] Commit และ push
- [ ] Deploy และทดสอบ

