// src/app/pages/hrm/driver/index.tsx
import React from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '@/_metronic/layout/core'

import {ListPage} from './list/ListPage'

const breadCrumbs: Array<PageLink> = [
  {
    title: '司機資料台帳',
    path: '/hrm/driver/list',
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

const DriverPage: React.FC = () => {
  return (
    <Routes>
      <Route path='' element={<Navigate to='list' replace />} />

      <Route
        path='list'
        element={
          <>
            <PageTitle breadcrumbs={breadCrumbs}>司機資料台帳</PageTitle>
            <ListPage />
          </>
        }
      />
    </Routes>
  )
}

export default DriverPage
