// src/app/pages/tom/container/index.tsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { PageLink, PageTitle } from '@/_metronic/layout/core'

// pages
// import { OverviewPage } from './overview/OverviewPage'
import { ListPage } from './list/ListPage'
import { CreatePage } from './create/CreatePage'
import { DetailPage } from './detail/DetailPage'

/**
 * ===============================================================
 * Breadcrumbs
 * ===============================================================
 */
const containerBreadCrumbs: Array<PageLink> = [
  {
    title: '貨櫃管理',
    path: '/tom/container',
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
const ContainerPage: React.FC = () => {
  return (
    <Routes>
      {/* v1：Overview = 主列表畫面 */}
      {/* <Route
        path='overview'
        element={
          <>
            <PageTitle breadcrumbs={systemBreadCrumbs}>系統總覽</PageTitle>
            <OverviewPage />
          </>
        }
      /> */}

      {/* list 可直接共用或獨立 */}
      <Route
        path='list'
        element={
          <>
            <PageTitle breadcrumbs={containerBreadCrumbs}>系統列表</PageTitle>
            <ListPage />
          </>
        }
      />

      {/* 建立系統 */}
      <Route
        path='create'
        element={
          <>
            <PageTitle breadcrumbs={containerBreadCrumbs}>新增系統</PageTitle>
            <CreatePage />
          </>
        }
      />

      {/* 系統詳情（v2 之後） */}
      <Route
        path=':id/detail'
        element={
          <>
            <PageTitle breadcrumbs={containerBreadCrumbs}>系統詳情</PageTitle>
            <DetailPage />
          </>
        }
      />
     
    </Routes>
  )
}

export default ContainerPage
