import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// สำหรับ GitHub Pages แบบ Project Page:
// https://choengchair-cell.github.io/farmlink-dashboard/
// ถ้า repo ของคุณชื่ออื่น ให้เปลี่ยน base ให้ตรงกับชื่อ repo นั้น
export default defineConfig({
  plugins: [react()],
  base: "/farmlink-dashboard/",
});
