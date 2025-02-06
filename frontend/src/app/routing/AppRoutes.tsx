/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

/* Main import libraries */
import {FC} from 'react'
/* Routes & Route：定義各個 頁面路由 */
/* BrowserRouter：提供 前端路由管理 */
/* Navigate：用來 重新導向（Redirect） */
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'

/* 私有 & 公開頁面 */
/* PrivateRoutes：需要登入 才能訪問的頁面（例如 /dashboard）。 */
import {PrivateRoutes} from './PrivateRoutes'
/* ErrorsPage：錯誤頁面（如 404、500）。 */
import {ErrorsPage} from '../modules/errors/ErrorsPage'
/* AuthPage：登入 / 註冊頁面。 */
/* Logout：登出頁面（清除登入狀態）。 */
/* useAuth：用來 獲取目前使用者 currentUser。 */
import {Logout, AuthPage, useAuth} from '../modules/auth'
import {App} from '../App'

/**
 * Base URL of the website. 設定 BASE_URL
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const {BASE_URL} = import.meta.env

/**
 * (1) currentUser 確認使用者狀態：useAuth() 會回傳 currentUser，用來判斷 使用者是否登入。
 * (2) BrowserRouter 負責前端路由管理：管理網站的 URL，basename={BASE_URL} 讓應用根據 BASE_URL 正確運行。
 * (3) Route 定義各個路由
 * 
 * @returns 
 */
const AppRoutes: FC = () => {
  const {currentUser} = useAuth()
  return (
    <BrowserRouter basename={BASE_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          /** 登入狀態分流 */
          {currentUser ? ( // 如果已登入
            <>
              <Route path='/*' element={<PrivateRoutes />} />
              <Route index element={<Navigate to='/example/overview' />} />
            </>
          ) : ( // 未登入
            <>
              <Route path='auth/*' element={<AuthPage />} />
              <Route path='*' element={<Navigate to='/auth' />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {AppRoutes}
