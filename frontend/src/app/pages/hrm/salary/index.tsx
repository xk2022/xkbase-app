// src/app/pages/hrm/salary/index.tsx
import React from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '@/_metronic/layout/core'

import {ListPage} from './list/ListPage'

const breadCrumbs: Array<PageLink> = [
  {
    title: '薪資計算公式',
    path: '/hrm/salary/list',
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

const SalaryPage: React.FC = () => {
  return (
    <Routes>
      <Route path='' element={<Navigate to='list' replace />} />

      <Route
        path='list'
        element={
          <>
            <PageTitle breadcrumbs={breadCrumbs}>薪資計算公式</PageTitle>
            <ListPage />
          </>
        }
      />
    </Routes>
  )
}

export default SalaryPage
