// src/app/pages/adm/dictionary/index.tsx
import React from 'react'
import {Routes, Route} from 'react-router-dom'
import {PageLink, PageTitle} from '@/_metronic/layout/core'
import { OverviewPage } from './overview/OverviewPage'

// pages
// import {ListPage} from './list/ListPage'
// import {CreatePage} from './create/CreatePage'
// import {DetailPage} from './detail/DetailPage'

/**
 * ===============================================================
 * Breadcrumbs
 * ===============================================================
 */
const dictionaryBreadCrumbs: Array<PageLink> = [
  {
    title: 'ADM 系統設定',
    path: '/adm',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '字典檔',
    path: '/adm/dictionary',
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
const DictPage: React.FC = () => {
  return (
    <Routes>
      {/* v1：Overview（保留擴充） */}
      
      <Route
        path='overview'
        element={
          <>
            <PageTitle breadcrumbs={dictionaryBreadCrumbs}>
              字典檔總覽
            </PageTitle>
            <OverviewPage />
          </>
        }
      />
     

      {/* 字典列表 */}
      <Route
        path='overview'
        element={
          <>
            <PageTitle breadcrumbs={dictionaryBreadCrumbs}>
              字典檔列表
            </PageTitle>
            {/* <Overview /> */}
          </>
        }
      />

      {/* 新增字典 */}
      <Route
        path='create'
        element={
          <>
            <PageTitle breadcrumbs={dictionaryBreadCrumbs}>
              新增字典
            </PageTitle>
            {/* <CreatePage /> */}
          </>
        }
      />

      {/* 字典詳情 / 編輯 */}
      <Route
        path=':id/detail'
        element={
          <>
            <PageTitle breadcrumbs={dictionaryBreadCrumbs}>
              字典詳情
            </PageTitle>
            {/* <DetailPage /> */}
          </>
        }
      />
    </Routes>
  )
}

export default DictPage
