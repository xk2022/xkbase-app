// src/app/pages/crm/index.tsx
/**
 * CRM - Customer Relationship Management Module
 * ------------------------------------------------------------
 * 這個 index.tsx 作為「模組匯出中心」，目標：
 * - 統一 export CRM 相關頁面
 * - 路由集中管理（customer/contract/portal...）
 */
import React from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '@/_metronic/layout/core'

// pages
import CRMDashboardWrapper from './dashboard/index'
import {ListPage as CustomerListPage} from './customer/list/ListPage'
import {DetailPage as CustomerDetailPage} from './customer/detail/DetailPage'
import {ListPage as ContractListPage} from './contract/list/ListPage'
import {PortalPage} from './portal/PortalPage'

/**
 * ===============================================================
 * Breadcrumbs
 * ===============================================================
 */
const breadCrumbs: Array<PageLink> = [
  {
    title: 'CRM 客戶管理',
    path: '/crm/customer/list',
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
const CRMPage: React.FC = () => {
  return (
    <Routes>
      {/* default redirect */}
      <Route path='' element={<Navigate to='dashboard' replace />} />

      {/* Dashboard */}
      <Route
        path='dashboard'
        element={
          <>
            <PageTitle breadcrumbs={breadCrumbs}>CRM 儀表板</PageTitle>
            <CRMDashboardWrapper />
          </>
        }
      />

      {/* 客戶清單 */}
      <Route
        path='customer/list'
        element={
          <>
            <PageTitle breadcrumbs={breadCrumbs}>客戶清單</PageTitle>
            <CustomerListPage />
          </>
        }
      />

      {/* 客戶詳情 */}
      <Route
        path='customer/:id/detail'
        element={
          <>
            <PageTitle breadcrumbs={breadCrumbs}>客戶詳情</PageTitle>
            <CustomerDetailPage />
          </>
        }
      />

      {/* 合約模板 */}
      <Route
        path='contract/list'
        element={
          <>
            <PageTitle breadcrumbs={breadCrumbs}>合約模板</PageTitle>
            <ContractListPage />
          </>
        }
      />

      {/* 客戶入口 */}
      <Route
        path='portal'
        element={
          <>
            <PageTitle breadcrumbs={breadCrumbs}>客戶入口</PageTitle>
            <PortalPage />
          </>
        }
      />
    </Routes>
  )
}

export default CRMPage
