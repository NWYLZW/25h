import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.BASE === 'None'
    ? ''
    : (process.env.BASE ?? '/25h'),
  plugins: [react()]
})
