# company-web-3d

เว็บไซต์บริษัทแนวก่อสร้าง/วิศวกรรมที่พัฒนาด้วย Next.js + React + Three.js

## ความต้องการเบื้องต้น

- Node.js 20 ขึ้นไป (แนะนำใช้เวอร์ชัน LTS ล่าสุด)
- npm

## วิธีรันโปรเจกต์ (โหมดพัฒนา)

1. ติดตั้ง dependencies

```bash
npm install
```

2. รันเซิร์ฟเวอร์สำหรับพัฒนา

```bash
npm run dev
```

3. เปิดเบราว์เซอร์ที่

```text
http://localhost:3000
```

## วิธีรันแบบ Production

1. build โปรเจกต์

```bash
npm run build
```

2. start เซิร์ฟเวอร์

```bash
npm run start
```

## คำสั่งที่มีในโปรเจกต์

- `npm run dev` : รันโหมดพัฒนา
- `npm run build` : build สำหรับ production
- `npm run start` : รัน production server หลัง build แล้ว
- `npm run lint` : ตรวจสอบโค้ดด้วย ESLint

