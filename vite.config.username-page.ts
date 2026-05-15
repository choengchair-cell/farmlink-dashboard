import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ใช้ไฟล์นี้เฉพาะกรณี repo ชื่อ choengchair-cell.github.io
// URL จะเป็น https://choengchair-cell.github.io/
// ให้ตั้ง base เป็น "/"
export default defineConfig({
  plugins: [react()],
  base: "/",
});
