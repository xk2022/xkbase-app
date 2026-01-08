// src/app/pages/upms/system/index.tsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { PageLink, PageTitle } from '@/_metronic/layout/core'

// pages
import { OverviewPage } from './overview/OverviewPage'
import { ListPage } from './list/ListPage'
import { CreatePage } from './create/CreatePage'
import { DetailPage } from './detail/DetailPage'

/**
 * ===============================================================
 * Breadcrumbs
 * ===============================================================
 */
const systemBreadCrumbs: Array<PageLink> = [
  {
    title: '系統管理',
    path: '/upms/system/overview',
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
const SystemPage: React.FC = () => {
  return (
    <Routes>
      {/* 預設導到 overview */}
      <Route index element={<Navigate to='overview' replace />} />

      {/* v1：Overview = 主列表畫面 */}
      <Route
        path='overview'
        element={
          <>
            <PageTitle breadcrumbs={systemBreadCrumbs}>系統總覽</PageTitle>
            <OverviewPage />
          </>
        }
      />

      {/* list 可直接共用或獨立 */}
      <Route
        path='list'
        element={
          <>
            <PageTitle breadcrumbs={systemBreadCrumbs}>系統列表</PageTitle>
            <ListPage />
          </>
        }
      />

      {/* 建立系統 */}
      <Route
        path='create'
        element={
          <>
            <PageTitle breadcrumbs={systemBreadCrumbs}>新增系統</PageTitle>
            <CreatePage />
          </>
        }
      />

      {/* 系統詳情（v2 之後） */}
      <Route
        path=':id/detail'
        element={
          <>
            <PageTitle breadcrumbs={systemBreadCrumbs}>系統詳情</PageTitle>
            <DetailPage />
          </>
        }
      />
     
    </Routes>
  )
}

export default SystemPage
