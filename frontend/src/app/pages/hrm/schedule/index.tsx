// src/app/pages/hrm/schedule/index.tsx
import React from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '@/_metronic/layout/core'

import {ListPage} from './list/ListPage'

const breadCrumbs: Array<PageLink> = [
  {
    title: '工時規劃',
    path: '/hrm/schedule/list',
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

const SchedulePage: React.FC = () => {
  return (
    <Routes>
      <Route path='' element={<Navigate to='list' replace />} />

      <Route
        path='list'
        element={
          <>
            <PageTitle breadcrumbs={breadCrumbs}>工時規劃</PageTitle>
            <ListPage />
          </>
        }
      />
    </Routes>
  )
}

export default SchedulePage
