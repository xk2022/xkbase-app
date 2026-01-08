// src/app/pages/tom/order/index.tsx
/**
 * TOM - Order Module
 * ------------------------------------------------------------
 * 這個 index.tsx 作為「模組匯出中心」，目標：
 * - 統一 export TOM/Order 相關頁面
 * - 路由集中管理（overview/list/create/detail...）
 *
 * 命名規則（建議）：
 * - Page 結尾：xxxPage.tsx（畫面）
 * - components/：卡片、表單、表格等 UI 元件
 * - Query.ts：打 API 的封裝
 * - Model.ts：型別與 DTO
 */
import React from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '@/_metronic/layout/core'

// pages
import {CreatePage} from './create/CreatePage'
// import {OverviewPage} from './overview/OverviewPage'
import {ListPage} from './list/ListPage'
// import {DetailPage} from './detail/DetailPage'

/**
 * ===============================================================
 * Breadcrumbs
 * ===============================================================
 */
const breadCrumbs: Array<PageLink> = [
  {
    title: '訂單管理',
    path: '/tom/order/overview',
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

/**
 * ===============================================================
 * Page Entry
 * ===============================================================
 */
const TransportTasksPage: React.FC = () => {
  return (
    <Routes>
      {/* default redirect */}
      <Route path='' element={<Navigate to='overview' replace />} />

      {/* v1：Overview = 總覽 */}
      <Route
        path='overview'
        element={
          <>
            <PageTitle breadcrumbs={breadCrumbs}>訂單總覽</PageTitle>
            {/* <OverviewPage /> */}
          </>
        }
      />

      {/* 列表 */}
      <Route
        path='list'
        element={
          <>
            <PageTitle breadcrumbs={breadCrumbs}>訂單列表</PageTitle>
            <ListPage />
          </>
        }
      />

      {/* 建立 */}
      <Route
        path='create'
        element={
          <>
            <PageTitle breadcrumbs={breadCrumbs}>建立訂單</PageTitle>
            <CreatePage />
          </>
        }
      />

      {/* v2 - 指派流程（先卡位） */}
      <Route
        path='assign'
        element={
          <>
            <PageTitle breadcrumbs={breadCrumbs}>訂單指派</PageTitle>
            {/* <AssignPage /> */}
          </>
        }
      />

      {/* 詳情 */}
      <Route
        path=':id/detail'
        element={
          <>
            <PageTitle breadcrumbs={breadCrumbs}>訂單詳情</PageTitle>
            {/* <DetailPage /> */}
          </>
        }
      />

      {/* v3 - 報表（先卡位） */}
      <Route
        path='report'
        element={
          <>
            <PageTitle breadcrumbs={breadCrumbs}>訂單報表</PageTitle>
            {/* <ReportPage /> */}
          </>
        }
      />
    </Routes>
  )
}

export default TransportTasksPage
