import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  preview:{
    host:true,
    port:8000,
    allowedHosts:['normal-kite-krishnesh-6e63647c.koyeb.app']
  }
})
