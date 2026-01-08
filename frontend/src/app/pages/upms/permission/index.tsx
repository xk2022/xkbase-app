// src/app/pages/upms/permission/index.tsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
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
const permissionBreadCrumbs: Array<PageLink> = [
  {
    title: '權限管理',
    path: '/upms/permission/list',
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
const PermissionPage: React.FC = () => {
  return (
    <Routes>
      {/* Overview */}
      <Route
        path='overview'
        element={
          <>
            <PageTitle breadcrumbs={permissionBreadCrumbs}>權限總覽</PageTitle>
            <OverviewPage />
          </>
        }
      />

      {/* List */}
      <Route
        path='list'
        element={
          <>
            <PageTitle breadcrumbs={permissionBreadCrumbs}>權限列表</PageTitle>
            <ListPage />
          </>
        }
      />

      {/* Create */}
      <Route
        path='create'
        element={
          <>
            <PageTitle breadcrumbs={permissionBreadCrumbs}>新增權限</PageTitle>
            <CreatePage />
          </>
        }
      />

      {/* Detail */}
      <Route
        path=':id/detail'
        element={
          <>
            <PageTitle breadcrumbs={permissionBreadCrumbs}>權限詳情</PageTitle>
            <DetailPage />
          </>
        }
      />
    </Routes>
  )
}

export default PermissionPage
