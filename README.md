# FarmLink Dashboard

โปรเจกต์นี้เป็นโปรโตไทป์สำหรับระบบ FarmLink ซึ่งเป็นระบบประสานงานจัดซื้อสินค้าเกษตรแบบ B2B ที่ช่วยให้ผู้ซื้อสร้างคำขอซื้อ ผู้ขาย/เกษตรกรส่งข้อเสนอขาย ระบบสร้างคำสั่งซื้อ บันทึกหลักฐานการส่งมอบ แจ้งเตือนความเสี่ยง และสร้างรายงานให้หน่วยงานภายนอกผ่านผู้ดูแลระบบ

## โครงสร้างโปรเจกต์

```
farmlink-dashboard
├── public
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── logo.svg
│   ├── components
│   │   ├── DashboardCard.tsx
│   │   ├── NavBar.tsx
│   │   └── Sidebar.tsx
│   ├── data
│   │   ├── buyers.ts
│   │   ├── sellers.ts
│   │   └── orders.ts
│   ├── pages
│   │   ├── BuyerDashboard.tsx
│   │   ├── SellerDashboard.tsx
│   │   └── AdminDashboard.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## วิธีการรันโปรเจกต์

1. รันคำสั่ง `npm install` เพื่อติดตั้ง dependencies
2. รันคำสั่ง `npm run dev` เพื่อเริ่มเซิร์ฟเวอร์พัฒนา

## ข้อมูลสำคัญ

- แอปพลิเคชันจะรันบน localhost
- UI ถูกออกแบบเป็นภาษาไทย
- ข้อมูลทั้งหมดเป็น mock data
- ไม่มี backend, database, หรือฟังก์ชันการเข้าสู่ระบบในโปรโตไทป์นี้

## บทบาทในระบบ

โปรโตไทป์นี้รองรับ 3 บทบาทหลัก:
1. ผู้ซื้อ
2. ผู้ขาย/เกษตรกร
3. ผู้ดูแลระบบ

**หมายเหตุ:** ห้ามสร้าง dashboard หรือ login สำหรับ ธ.ก.ส. สหกรณ์ จังหวัด หรือหน่วยงานภายนอกใน MVP แรก หน่วยงานภายนอกอยู่ใน phase 2 และขอรายงานผ่านผู้ดูแลระบบเท่านั้น