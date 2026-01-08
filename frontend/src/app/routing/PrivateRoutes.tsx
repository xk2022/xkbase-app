// src/app/routing/PrivateRoutes.tsx
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

  // UPMS
  UPMSDashboardPage: () => import("../pages/upms/dashboard/index"),
  RolePage: () => import("../pages/upms/role/index"),
  PermissionPage: () => import("../pages/upms/permission/index"),

  // TOM
  ContainerPage: () => import("../pages/tom/container/index"),
  TransportTasksPage: () => import("../pages/tom/tasks/index"),
  TOMDashboardPage: () => import("../pages/tom/dashboard/index"),

  // ADM
  ADMDashboardPage: () => import("../pages/adm/dashboard/index"),

  // FMS
  FMSDashboardPage: () => import("../pages/fms/dashboard/index"),

  // HRM
  HRMDashboardPage: () => import("../pages/hrm/dashboard/index"),

  SystemPage: () => import("../pages/upms/system/index"),
  UserPage: () => import("../pages/upms/user/index"),
  OrderPage: () => import("../pages/tom/order/index"),
  DictPage: () => import('../pages/adm/dictionary/index'),

  VehiclePage: () => import("../pages/fms/vehicle/index"),
  DriverPage: () => import('../pages/fms/driver/index'),
  HRMDriverPage: () => import('../pages/hrm/driver/index'),
  SchedulePage: () => import('../pages/hrm/schedule/index'),
  SalaryPage: () => import('../pages/hrm/salary/index'),
  SamplePage: () => import('../pages/sample/v1/index'),

  // PORT
  PortDashboardPage: () => import("../pages/port/dashboard/index"),
  PortPage: () => import("../pages/port/index"),

  // CRM
  CRMPage: () => import('../pages/crm/index'),

};

const routesConfig = [
  // TODO add page info here only 設定路由資訊
  { key: 'ExamplePage', path: 'example/*' },
  { key: 'ProfilePage', path: 'crafted/pages/profile/*' },
  { key: 'WizardsPage', path: 'crafted/pages/wizards/*' },
  { key: 'AccountPage', path: 'crafted/account/*' },
  { key: 'WidgetsPage', path: 'crafted/widgets/*' },
  { key: 'UsersPage', path: 'apps/user-management/*' },

  // UPMS
  { key: 'UPMSDashboardPage', path: 'upms/dashboard' },
  { key: 'RolePage', path: 'upms/role/*' },
  { key: 'PermissionPage', path: 'upms/permission/*' },

  // TOM
  { key: 'ContainerPage', path: 'tom/container/*' },
  { key: 'TransportTasksPage', path: 'tom/tasks/*' },
  { key: 'TOMDashboardPage', path: 'tom/dashboard' },

  // ADM
  { key: 'ADMDashboardPage', path: 'adm/dashboard' },

  // FMS
  { key: 'FMSDashboardPage', path: 'fms/dashboard' },

  // HRM
  { key: 'HRMDashboardPage', path: 'hrm/dashboard' },

  { key: 'SystemPage', path: 'upms/system/*' },
  { key: 'UserPage', path: 'upms/user/*' },
  { key: 'OrderPage', path: 'tom/order/*' },
  { key: 'DictPage', path: 'adm/dictionary/*' },
  { key: 'VehiclePage', path: 'fms/vehicle/*' },
  { key: 'DriverPage', path: 'fms/driver/*' },
  { key: 'HRMDriverPage', path: 'hrm/driver/*' },
  { key: 'SchedulePage', path: 'hrm/schedule/*' },
  { key: 'SalaryPage', path: 'hrm/salary/*' },
  { key: 'SamplePage', path: 'sample/v1/*' },

  // PORT
  { key: 'PortDashboardPage', path: 'port/dashboard' },
  { key: 'PortPage', path: 'port/*' },
  { key: 'CRMPage', path: 'crm/*' },
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

function RouteErrorBoundary({children}:{children:React.ReactNode}) {
  try { return <>{children}</> } catch (e) { 
    return <div className="p-5 text-danger">頁面載入失敗</div>
  }
}

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({ barColors:{'0': baseColor}, barThickness: 1, shadowBlur: 5 })
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
    </RouteErrorBoundary>
  )
}

export { PrivateRoutes }
