import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@server": path.resolve(__dirname, "../server"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  build: {
    copyPublicDir: false, // Disable copying of public directory
    emptyOutDir: false,   // Don't empty the outDir
  }
})