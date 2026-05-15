# FarmLink GitHub Pages Config สำหรับ choengchair-cell

## กรณีที่แนะนำ
ถ้า GitHub username คือ `choengchair-cell` และ repo ชื่อ `farmlink-dashboard`

URL หลัง deploy จะเป็น:

```text
https://choengchair-cell.github.io/farmlink-dashboard/
```

ให้ใช้ไฟล์:

```text
vite.config.ts
.github/workflows/deploy.yml
```

โดย `vite.config.ts` ตั้งค่าไว้แล้ว:

```ts
base: "/farmlink-dashboard/"
```

## ถ้า repo ไม่ได้ชื่อ farmlink-dashboard
ให้แก้ใน `vite.config.ts`:

```ts
base: "/ชื่อ-repoของคุณ/"
```

ตัวอย่าง ถ้า repo ชื่อ `FarmLink`:

```ts
base: "/FarmLink/"
```

## ถ้า repo ชื่อ choengchair-cell.github.io
ให้ใช้ config แบบ username page:

```text
vite.config.username-page.ts
```

แล้วเปลี่ยนชื่อไฟล์เป็น:

```text
vite.config.ts
```

เพราะกรณีนี้ต้องใช้:

```ts
base: "/"
```

## ขั้นตอนใน VSCode

1. วาง `.github/workflows/deploy.yml` ในโปรเจกต์
2. วาง `vite.config.ts` ทับไฟล์เดิม
3. รัน:

```powershell
npm run build
```

4. push ขึ้น GitHub:

```powershell
git add .
git commit -m "Configure GitHub Pages deploy"
git push origin main
```

5. ที่ GitHub ไปที่:

```text
Settings → Pages → Source → GitHub Actions
```

6. ดูผลที่แท็บ Actions
