/* Main import libraries */
/* lazy()：讓 React 懶加載（Lazy Load）組件，減少初始載入時間。 */
/* Suspense：用來 處理懶加載時的 UI 過渡效果。 */
import React, {lazy, FC, Suspense} from 'react'
/* Navigate：用來 重新導向（Redirect）。 */
import {Route, Routes, Navigate} from 'react-router-dom'
/* MasterLayout：應用的主要佈局（Header、Sidebar、Footer）。 */
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
/* TopBarProgress：頁面載入進度條（類似 YouTube 上方的紅色進度條）。 */
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
/* getCSSVariableValue()：獲取 CSS 變數，用於設定 TopBarProgress 的顏色。 */
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'

// 懶加載頁面
// 懶加載頁面，為每個頁面指定具體的 React 組件類型
const pageImports: Record<string, () => Promise<{ default: React.ComponentType<Record<string, never>> }>> = {
  ExamplePage: () => import("../modules/example/ExamplePage"),
  ProfilePage: () => import("../modules/profile/ProfilePage"),
  WizardsPage: () => import("../modules/wizards/WizardsPage"),
  AccountPage: () => import("../modules/accounts/AccountPage"),
  WidgetsPage: () => import("../modules/widgets/WidgetsPage"),
  UsersPage: () => import("../modules/apps/user-management/UsersPage"),

  UserPage: () => import("../pages/permission/user/UserPage"),
};

const routesConfig = [
  // TODO add page info here only 設定路由資訊
  { key: 'ExamplePage', path: 'example/*' },
  { key: 'ProfilePage', path: 'crafted/pages/profile/*' },
  { key: 'WizardsPage', path: 'crafted/pages/wizards/*' },
  { key: 'AccountPage', path: 'crafted/account/*' },
  { key: 'WidgetsPage', path: 'crafted/widgets/*' },
  { key: 'UsersPage', path: 'apps/user-management/*' },

  { key: 'UserPage', path: 'permission/user/*' },
]
// 使用 `map()` 統一處理 `lazy()`
const pages = routesConfig.map(({ key, path }) => ({
  key,
  path,
  // component: lazy(() => import(/* @vite-ignore */ `${importPath}`)),
  component: lazy(pageImports[key]), // 這樣就不會觸發 Vite 警告！
}))
/**
 * Vite 動態 import 警告 (dynamic import cannot be analyzed)
 * lazy(() => import(`${importPath}`))
 * 在 Vite 中會出現 動態 import() 無法被分析 的錯誤，因為 Vite 不支持 這種類型的變數導入。
 * Vite 使用 Rollup 進行打包，而 Rollup 無法靜態解析 變數形式的 import()：
 * import(`${importPath}`) // ❌ 無法解析
 * 必須提供 靜態字符串 或 可解析的固定模板。
 * 不支持 直接用變數代入 import()，因為 Vite 在構建時需要 預先確定所有依賴關係。
 */

const PrivateRoutes = () => {
  /** 
   * 懶加載頁面
   * 
   * 這些組件只有在真正訪問時才會載入，減少應用的初始加載時間。
   * 懶加載適合大型應用，減少 JS Bundle 大小。
   */
  // const ExamplePage = lazy(() => import('../modules/example/ExamplePage'))
  // const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  // const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  // const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  // const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  // const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />

        {/* Pages 主頁 */}
        <Route path='dashboard' element={<DashboardWrapper />} />

        {/* <Route path='example/*' element={
            <SuspensedView>
              <ExamplePage />
            </SuspensedView>
          }
        />
        <Route path='crafted/pages/profile/*' element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route path='crafted/pages/wizards/*' element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route path='crafted/widgets/*' element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route path='crafted/account/*' element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route path='apps/user-management/*' element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        /> */}
        
        {/* Lazy Modules 懶加載頁面 */}
        {pages.map(({ key, path, component: Component }) => (
          <Route key={key} path={path} element={<SuspensedView> <Component /> </SuspensedView>} />
        ))}

        {/* Page Not Found 頁面未找到 */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: { '0': baseColor },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
