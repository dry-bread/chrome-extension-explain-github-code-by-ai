import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // 输出到 dist 文件夹
    rollupOptions: {
      input: {
        options: 'options.html', // 将 HTML 文件作为入口
      },
      output: {
        dir: 'dist',
        entryFileNames: 'options.bundle.js',
      },
    }
  }
})
