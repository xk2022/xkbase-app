// src/app/pages/sample/v1/index.tsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { PageLink, PageTitle } from '@/_metronic/layout/core'

import { OverviewPage } from './overview/OverviewPage'
import { ListPage } from './list/ListPage'

const sampleBreadCrumbs: Array<PageLink> = [
  {
    title: 'Sample 管理',
    path: '/sample/v1/overview',
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

const SamplePage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='overview'
        element={
          <>
            <PageTitle breadcrumbs={sampleBreadCrumbs}>Sample 總覽</PageTitle>
            <OverviewPage />
          </>
        }
      />
      <Route
        path='list'
        element={
          <>
            <PageTitle breadcrumbs={sampleBreadCrumbs}>Sample 列表</PageTitle>
            <ListPage />
          </>
        }
      />
    </Routes>
  )
}

export default SamplePage
