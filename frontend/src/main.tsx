/* React 掛載點 createRoot 來自 react-dom/client，是 React 18 的新掛載 API。作用：用來渲染 React 應用至 #root 容器。 */
import {createRoot} from 'react-dom/client'

/* Axios（HTTP 請求管理） 用於發送 HTTP 請求。 */
import axios from 'axios'
import {AuthProvider, setupAxios} from './app/modules/auth'
/* Chart.js（圖表功能） 是流行的圖表繪製庫。 */
/* registerables 註冊插件：讓 Chart.js 繪製折線圖、長條圖等。 */
import {Chart, registerables} from 'chart.js'
/* React Query（狀態管理） */
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

/* Apps 全域樣式 & UI 資源 */
import './_metronic/assets/sass/style.react.scss'
import './_metronic/assets/fonticon/fonticon.css'
import './_metronic/assets/keenicons/duotone/style.css'
import './_metronic/assets/keenicons/outline/style.css'
import './_metronic/assets/keenicons/solid/style.css'
/**
 * TIP: Replace this style import with rtl styles to enable rtl mode
 * 如果要支援 RTL（阿拉伯文等）模式，可以改用
 * import './_metronic/assets/css/style.rtl.css'
 **/
import './_metronic/assets/sass/style.scss'
import {AppRoutes} from './app/routing/AppRoutes'
/**
 * Creates `axios-mock-adapter` instance for provided `axios` instance, add basic Metronic mocks and returns it.
 * @see https://github.com/ctimmerm/axios-mock-adapter
 */
/**
 * Inject Metronic interceptors for axios.
 * @see https://github.com/axios/axios#interceptors
 */

setupAxios(axios)
Chart.register(...registerables)
const queryClient = new QueryClient();

/**
 * 掛載流程
 * 1. 讀取 #root 容器
 * 2. 使用 createRoot 掛載 React 應用，QueryClientProvider 包裝全域狀態
 * 3. 提供 AuthProvider（用戶驗證）、QueryClientProvider（API 狀態）
 * 4. 載入 AppRoutes，顯示 React 應用畫面
 */
const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  )
}
