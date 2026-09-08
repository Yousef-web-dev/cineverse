import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 👈 إضافة البلاجن

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/cineverse/', 
})