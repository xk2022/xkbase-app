/**
 * 統一管理專案的 Base Path 配置
 * 
 * 此檔案集中管理所有與 base path 相關的設定，避免在多處重複定義。
 * 當需要修改 base path 時，只需在此檔案中修改即可。
 * 
 * @example
 * ```ts
 * import { APP_BASE_PATH } from '@/shared/config/path.config'
 * // 在開發環境：APP_BASE_PATH = '/xkBase/'
 * // 在生產環境：APP_BASE_PATH = '/'
 * ```
 */

/**
 * 應用程式的 Base Path
 * 
 * - 開發環境：使用 '/xkBase/' (子路徑)
 * - 生產環境：使用 '/' (根路徑)
 * 
 * 注意：此值必須與 vite.config.ts 中的 base 設定保持一致
 */
export const APP_BASE_PATH = import.meta.env.PROD ? '/' : '/xkBase/'

/**
 * 應用程式的 Base Path（不含結尾斜線）
 * 用於需要不含結尾斜線的場景（例如：路徑拼接）
 * 
 * @example
 * ```ts
 * const loginPath = `${APP_BASE_PATH_NO_TRAILING}/auth` // "/xkBase/auth"
 * ```
 */
export const APP_BASE_PATH_NO_TRAILING = APP_BASE_PATH.replace(/\/$/, '') || ''

/**
 * 登入頁面路徑
 */
export const LOGIN_PATH = `${APP_BASE_PATH_NO_TRAILING}/auth`

/**
 * 獲取完整的絕對路徑
 * 
 * @param pathname - 相對路徑（例如：'/dashboard'）
 * @returns 完整的絕對路徑（例如：'/xkBase/dashboard'）
 * 
 * @example
 * ```ts
 * toAbsolutePath('/dashboard') // 開發環境：'/xkBase/dashboard'
 * toAbsolutePath('/dashboard') // 生產環境：'/dashboard'
 * ```
 */
export const toAbsolutePath = (pathname: string): string => {
  // 確保 pathname 以 / 開頭
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${APP_BASE_PATH_NO_TRAILING}${normalizedPath}`
}

/**
 * 配置說明
 * 
 * 此配置檔案影響以下位置：
 * 1. vite.config.ts - Vite 構建配置中的 base 選項
 * 2. vercel.json - Vercel 部署配置中的 rewrites 和 headers
 * 3. netlify.toml - Netlify 部署配置中的 redirects
 * 4. src/app/routing/AppRoutes.tsx - React Router 的 basename
 * 5. src/shared/api/http.ts - API 請求中的路徑處理
 * 6. src/_metronic/helpers/AssetHelpers.ts - 靜態資源路徑處理
 * 
 * 修改此配置後，請同步更新上述所有檔案。
 */
