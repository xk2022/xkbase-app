// src/app/pages/fms/driver/index.tsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { PageLink, PageTitle } from '@/_metronic/layout/core'

// === 頁面元件（你之後會逐步實作）===
import { Overview } from './Overview'
import { FormPage } from './FormPage'
import DetailPage from './detail/DetailPage'

// 預留 v2 / v3 功能
// import { DriverStatusPage } from './DriverStatusPage'
// import { DriverOnDutyPage } from './DriverOnDutyPage'
// import { DriverPerformancePage } from './DriverPerformancePage'

const driverBreadCrumbs: Array<PageLink> = [
  {
    title: '司機管理',
    path: '/fms/driver/overview',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const DriverPage: React.FC = () => {
  return (
    <Routes>
      {/* 預設導向列表頁 */}
      <Route index element={<Navigate to="list" />} />

      {/* 列表頁 */}
      <Route
        path="list"
        element={
          <>
            <PageTitle breadcrumbs={driverBreadCrumbs}>司機列表</PageTitle>
            <Overview />
          </>
        }
      />

      {/* 新增司機 */}
      <Route
        path="create"
        element={
          <>
            <PageTitle breadcrumbs={driverBreadCrumbs}>新增司機</PageTitle>
            <FormPage />
          </>
        }
      />

      {/* 司機詳情 */}
      <Route
        path=":id/detail"
        element={
          <>
            <PageTitle breadcrumbs={driverBreadCrumbs}>司機詳情</PageTitle>
            <DetailPage />
          </>
        }
      />

      {/* v2：狀態管理 */}
      {/* <Route
        path="status"
        element={
          <>
            <PageTitle breadcrumbs={driverBreadCrumbs}>司機狀態管理</PageTitle>
            <DriverStatusPage />
          </>
        }
      /> */}

      {/* v2：上線 On-duty */}
      {/* <Route
        path="on-duty"
        element={
          <>
            <PageTitle breadcrumbs={driverBreadCrumbs}>司機上線狀態</PageTitle>
            <DriverOnDutyPage />
          </>
        }
      /> */}

      {/* v3：績效管理 */}
      {/* <Route
        path="performance"
        element={
          <>
            <PageTitle breadcrumbs={driverBreadCrumbs}>司機績效分析</PageTitle>
            <DriverPerformancePage />
          </>
        }
      /> */}
    </Routes>
  )
}

export default DriverPage

