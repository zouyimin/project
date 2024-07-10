import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    // 服务器主机名，默认是 localhost
    host: 'localhost',
    // 端口号，默认是 5173
    port: 8081,
    // 是否开启 https
    https: false,
    // 服务器代理配置
    proxy: {
      '^/api': {
        target: 'https://v1.jinrishici.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    // 是否开启自动刷新
    // hmr: true,
    // 是否开启自动打开浏览器
    open: true,
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
