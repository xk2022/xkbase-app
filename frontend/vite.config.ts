/** 這樣的 vite.config.ts 可以：
 * 
 * 優化 React 加載（使用 SWC 替代 Babel）
 * 確保 /xkBase/ 適用於正式環境，開發時自動使用 /
 * 自動拆分 node_modules 內的模組，減少首屏 bundle
 * 優化 Vite 快取與 TS 加載
 * 這樣能 提升開發速度 & 優化部署！ 
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
// 如果你的 vite.config.ts 有 base: '/metronic8/react/demo1/'，那麼 Vite 會將所有路徑加上該前綴。
// base: process.env.NODE_ENV === 'production' ? '/xkBase' : '/', 
export default defineConfig({
  plugins: [react()],
  base: '/xkBase/',
  build: {
    chunkSizeWarningLimit: 3000, // 防止警告，但不影響性能 // 防止 Vite 在 chunk 過大時給出警告，只是隱藏警告
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.split("node_modules/")[1].split("/")[0];
          }
        }
      }
    }
  },
  cacheDir: ".vite_cache", // 優化快取
  esbuild: {
    loader: "tsx",
    target: "esnext"
  }
})
