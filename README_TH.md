# FarmLink Dual Deploy Config

ชุดไฟล์นี้ทำให้ FarmLink ใช้ได้ทั้ง Vercel และ GitHub Pages

## ไฟล์ที่ต้องวางในโปรเจกต์

วางไฟล์เหล่านี้ที่ root ของโปรเจกต์ farmlink-dashboard:

- vite.config.ts
- vercel.json
- .github/workflows/deploy-pages.yml

## การทำงาน

### Vercel
ใช้ base path /

คำสั่ง:
```powershell
npm run build
vercel --prod --force
```

### GitHub Pages
GitHub Action จะตั้งค่า:
DEPLOY_TARGET=github-pages

ทำให้ build ออกมาเป็น:
/farmlink-dashboard/assets/...

## Cloudinary สำหรับ GitHub Actions

ถ้าใช้ GitHub Pages และต้องการให้ Cloudinary ใช้ได้ตอน build ให้เพิ่ม Secrets ใน GitHub:

GitHub repo -> Settings -> Secrets and variables -> Actions -> New repository secret

เพิ่ม:
VITE_CLOUDINARY_CLOUD_NAME
VITE_CLOUDINARY_UPLOAD_PRESET
VITE_CLOUDINARY_FOLDER

ค่าตัวอย่าง:
VITE_CLOUDINARY_CLOUD_NAME=dx75bhwky
VITE_CLOUDINARY_UPLOAD_PRESET=farmlink_unsigned
VITE_CLOUDINARY_FOLDER=farmlink/products

## หมายเหตุ

ไม่ต้องแก้ index.html
