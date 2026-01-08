// src/app/pages/port/index.tsx
/**
 * PORT - Port Module
 * ------------------------------------------------------------
 * 港口整合模組路由配置
 */
import React from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '@/_metronic/layout/core'

// pages
import {CreatePage} from './create/CreatePage'
import {ListPage} from './list/ListPage'
import {DetailPage} from './detail/DetailPage'

/**
 * ===============================================================
 * Breadcrumbs
 * ===============================================================
 */
const breadCrumbs: Array<PageLink> = [
  {
    title: '港口整合',
    path: '/port/list',
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
const PortPage: React.FC = () => {
  return (
    <Routes>
      {/* default redirect */}
      <Route path='' element={<Navigate to='list' replace />} />

      {/* 列表 */}
      <Route
        path='list'
        element={
          <>
            <PageTitle breadcrumbs={breadCrumbs}>港口列表</PageTitle>
            <ListPage />
          </>
        }
      />

      {/* 建立 */}
      <Route
        path='create'
        element={
          <>
            <PageTitle breadcrumbs={breadCrumbs}>建立港口</PageTitle>
            <CreatePage />
          </>
        }
      />

      {/* 詳情 */}
      <Route
        path=':id/detail'
        element={
          <>
            <PageTitle breadcrumbs={breadCrumbs}>港口詳情</PageTitle>
            <DetailPage />
          </>
        }
      />
    </Routes>
  )
}

export default PortPage

// ------------------------------------------------------------
// Named exports
// ------------------------------------------------------------
export {CreatePage} from './create/CreatePage'
export {ListPage} from './list/ListPage'
export {DetailPage} from './detail/DetailPage'
