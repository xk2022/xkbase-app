// src/app/pages/upms/user/index.tsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { PageLink, PageTitle } from '@/_metronic/layout/core'

// 這幾個頁面檔案之後你可以依需求實作（先預留 import）
import { OverviewPage } from './overview/OverviewPage'
import { ListPage } from './list/ListPage'
import { CreatePage } from './create/CreatePage'
import { DetailPage } from './detail/DetailPage'
import { SecurityPage } from './security/SecurityPage'

const userBreadCrumbs: Array<PageLink> = [
  {
    title: '使用者管理',
    path: '/upms/user/overview',
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

const UserPage: React.FC = () => {
  return (
    <Routes>
      {/* v1 先以 Overview = 列表主畫面為主 */}
      <Route
        path='overview'
        element={
          <>
            <PageTitle breadcrumbs={userBreadCrumbs}>使用者總覽</PageTitle>
            <OverviewPage />
          </>
        }
      />
      {/* 如果你要多一個 /upms/user/list，也可以先共用 Overview */}
      <Route
        path='list'
        element={
          <>
            <PageTitle breadcrumbs={userBreadCrumbs}>使用者列表</PageTitle>
            <ListPage />
          </>
        }
      />

      <Route
        path='create'
        element={
          <>
            <PageTitle breadcrumbs={userBreadCrumbs}>新增使用者</PageTitle>
            <CreatePage />
          </>
        }
      />

      <Route
        path=':id/detail'
        element={
          <>
            <PageTitle breadcrumbs={userBreadCrumbs}>使用者詳情</PageTitle>
            <DetailPage />
          </>
        }
      />

      <Route
        path=':id/security'
        element={
          <>
            <PageTitle breadcrumbs={userBreadCrumbs}>使用者安全設定</PageTitle>
            <SecurityPage />
          </>
        }
      />
    </Routes>
  )
}

export default UserPage
