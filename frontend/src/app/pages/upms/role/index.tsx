// src/app/pages/upms/role/index.tsx
import React from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '@/_metronic/layout/core'

// 這幾個頁面檔案之後你可以依需求實作（先預留 import）
import { OverviewPage } from './overview/OverviewPage'
import { ListPage } from './list/ListPage'
import { CreatePage } from './create/CreatePage'
import { DetailPage } from './detail/DetailPage'
import { PermissionPage } from './permissions/PermissionPage'

const roleBreadCrumbs: Array<PageLink> = [
  {
    title: '角色與權限',
    path: '/upms/role/overview',
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

const RolePage: React.FC = () => {
  return (
    <Routes>
      {/* 預設導到總覽頁 */}
      <Route element={<Navigate to='overview' />} index />

      {/* 角色總覽 */}
      <Route
        path='overview'
        element={
          <>
            <PageTitle breadcrumbs={roleBreadCrumbs}>角色總覽</PageTitle>
            <OverviewPage />
          </>
        }
      />
      
      {/* 角色列表 */}
      <Route
        path='list'
        element={
          <>
            <PageTitle breadcrumbs={roleBreadCrumbs}>角色列表</PageTitle>
            <ListPage />
          </>
        }
      />

      {/* 建立角色 */}
      <Route
        path='create'
        element={
          <>
            <PageTitle breadcrumbs={roleBreadCrumbs}>新增角色</PageTitle>
            <CreatePage />
          </>
        }
      />

      {/* 角色詳情 */}
      <Route
        path=':id/detail'
        element={
          <>
            <PageTitle breadcrumbs={roleBreadCrumbs}>角色詳情</PageTitle>
            <DetailPage />
          </>
        }
      />

      {/* 角色權限設定 */}
      <Route
        path=':id/permissions'
        element={
          <>
            <PageTitle breadcrumbs={roleBreadCrumbs}>角色權限設定</PageTitle>
            <PermissionPage />
          </>
        }
      />
    </Routes>
  )
}

export default RolePage
