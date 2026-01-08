// src/shared/api/http.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { getToken } from '@/app/modules/auth/core/AuthHelpers'

// =============================
// Constants
// =============================

// 你的前端 base path（因為你登入是 /xkBase/auth）
const APP_BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') || '' // e.g. "/xkBase"
const LOGIN_PATH = `${APP_BASE}/auth` // ✅ "/xkBase/auth"

// 1. 設定 baseURL（dev 走 Vite proxy，prod 用環境變數）
// dev：走 Vite proxy（''），prod：走環境變數
axios.defaults.baseURL = import.meta.env.DEV
  ? '' // dev：走 Vite proxy，例如 /api → http://localhost:8080/api
  : import.meta.env.VITE_API_BASE_URL ?? '' // prod：用環境變數

axios.defaults.headers.Accept = 'application/json'

// 防止重複註冊 interceptor
let interceptorsInstalled = false

// =============================
// Helpers
// =============================
function clearAuthStorage() {
  // 清理所有可能的認證相關 key（包括舊格式）
  localStorage.removeItem('AUTH_USER')
  localStorage.removeItem('AUTH_TOKEN')
  localStorage.removeItem('CURRENT_SYSTEM')
  // 清理舊格式的 key
  localStorage.removeItem('authUser')
  localStorage.removeItem('authToken')
  // 清理 Metronic 模板的舊 key
  localStorage.removeItem('kt-auth-react-v')
}

function redirectToLogin() {
  // 避免在登入頁還一直被導（無限 loop）
  if (window.location.pathname.startsWith(LOGIN_PATH)) return

  const from = encodeURIComponent(window.location.pathname + window.location.search)
  window.location.assign(`${LOGIN_PATH}?from=${from}`)
}

function isAuthError(status?: number) {
  return status === 401 || status === 403
}

// =============================
// Install interceptors once
// =============================
function setupInterceptors() {
  if (interceptorsInstalled) return
  interceptorsInstalled = true

  // 2. Request Interceptor：自動帶上 token

  //   ⚠️ 注意：不要用 axios.create
  // 因為：
  // ⛔ create() 不會繼承你在 setupAxios(axios) 的 interceptor
  // ⛔ 所以 token 永遠加不上去

  // export const http = axios.create({
  //   baseURL,
  //   headers: { Accept: 'application/json' },
  // })

  // 1) Request: attach Bearer token
  axios.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
    // const t = localStorage.getItem('token')
    const t = getToken()          // 這裡改成 AuthHelpers 的 token
    if (t) {
      cfg.headers = cfg.headers ?? {}
      cfg.headers.Authorization = `Bearer ${t}`
    }
    return cfg
  })

  // 3. Response Interceptor：處理 401，自動跳回登入頁

  // 之後若要 401 自動回登入，可在這裡加
  // http.interceptors.response.use(r => r, err => {
  //   if (err?.response?.status === 401) {
  //     localStorage.removeItem('token')
  //     location.assign('/auth/login')
  //   }
  //   return Promise.reject(err)
  // })

  // 2) Response: handle 401/403

  // axios.interceptors.response.use(
  //   (r) => r,
  //   (err) => {
  //     const status = err?.response?.status
  //     if (status === 401) {
  //     //   localStorage.removeItem('token')
  //       localStorage.removeItem('AUTH_USER')
  //       localStorage.removeItem('AUTH_TOKEN')
  //       localStorage.removeItem('CURRENT_SYSTEM')
  //       window.location.assign(
  //         '/auth/login?from=' +
  //           encodeURIComponent(location.pathname + location.search),
  //       )
  //     }
  //     return Promise.reject(err)
  //   },
  // )
  axios.interceptors.response.use(
    (r) => r,
    (err: AxiosError) => {
      const status = err.response?.status

      if (isAuthError(status)) {
        clearAuthStorage()
        redirectToLogin()
      }

      return Promise.reject(err)
    }
  )
}

setupInterceptors()

// 之後專案內一律 import { http } 來打 API
// 專案內統一用 http
export const http = axios
