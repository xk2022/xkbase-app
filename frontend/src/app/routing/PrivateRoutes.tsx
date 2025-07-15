/* Main import libraries */
/* lazy()：讓 React 懶加載（Lazy Load）組件，減少初始載入時間。 */
/* Suspense：用來 處理懶加載時的 UI 過渡效果。 */
import React, { lazy, FC, Suspense } from 'react'
/* Navigate：用來 重新導向（Redirect）。 */
import { Route, Routes, Navigate } from 'react-router-dom'
/* MasterLayout：應用的主要佈局（Header、Sidebar、Footer）。 */
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
/* TopBarProgress：頁面載入進度條（類似 YouTube 上方的紅色進度條）。 */
import TopBarProgress from 'react-topbar-progress-indicator'
import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper'
/* getCSSVariableValue()：獲取 CSS 變數，用於設定 TopBarProgress 的顏色。 */
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { WithChildren } from '../../_metronic/helpers'
import { SystemProvider } from '../../app/pages/common/SystemContext';

// 懶加載頁面
// 懶加載頁面，為每個頁面指定具體的 React 組件類型
const pageImports: Record<string, () => Promise<{ default: React.ComponentType<Record<string, never>> }>> = {
  ExamplePage: () => import("../modules/example/ExamplePage"),
  ProfilePage: () => import("../modules/profile/ProfilePage"),
  WizardsPage: () => import("../modules/wizards/WizardsPage"),
  AccountPage: () => import("../modules/accounts/AccountPage"),
  WidgetsPage: () => import("../modules/widgets/WidgetsPage"),
  UsersPage: () => import("../modules/apps/user-management/UsersPage"),

  SystemPage: () => import("../pages/auth/system/index"),
  UserPage: () => import("../pages/auth/user/index"),
  RolePage: () => import("../pages/auth/role/index"),
  PermissionPage: () => import("../pages/auth/permission/index"),
  OrderPage: () => import("../pages/order/index"),
};

const routesConfig = [
  // TODO add page info here only 設定路由資訊
  { key: 'ExamplePage', path: 'example/*' },
  { key: 'ProfilePage', path: 'crafted/pages/profile/*' },
  { key: 'WizardsPage', path: 'crafted/pages/wizards/*' },
  { key: 'AccountPage', path: 'crafted/account/*' },
  { key: 'WidgetsPage', path: 'crafted/widgets/*' },
  { key: 'UsersPage', path: 'apps/user-management/*' },

  { key: 'SystemPage', path: 'auth/system/*' },
  { key: 'UserPage', path: 'auth/user/*' },
  { key: 'RolePage', path: 'auth/role/*' },
  { key: 'PermissionPage', path: 'auth/permission/*' },
  { key: 'OrderPage', path: 'order/*' },
]
// 使用 `map()` 統一處理 `lazy()`
const pages = routesConfig.map(({ key, path }) => ({
  key,
  path,
  component: lazy(pageImports[key]), // 這樣就不會觸發 Vite 警告！
}))

const PrivateRoutes = () => {
  return (
    <SystemProvider>
      <Routes>
        <Route element={<MasterLayout />}>
          <Route path='auth/*' element={<Navigate to='/dashboard' />} />

          {/* Pages 主頁 */}
          <Route path='dashboard' element={<DashboardWrapper />} />

          {/* Lazy Modules 懶加載頁面 */}
          {pages.map(({ key, path, component: Component }) => (
            <Route key={key} path={path} element={<SuspensedView> <Component /> </SuspensedView>} />
          ))}

          {/* Page Not Found 頁面未找到 */}
          <Route path='*' element={<Navigate to='/error/404' />} />
        </Route>
      </Routes>
    </SystemProvider>
  )
}

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: { '0': baseColor },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export { PrivateRoutes }
