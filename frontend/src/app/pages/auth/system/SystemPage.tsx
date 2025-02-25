import React from 'react'
import {Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {Overview} from './Overview'

const systemBreadCrumbs: Array<PageLink> = [
  {
    title: 'System',
    path: '/auth/system/overview',
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

const SystemPage: React.FC = () => {
  return (
    <Routes>
      <Route>
        <Route
          path='overview'
          element={
            <>
              <PageTitle breadcrumbs={systemBreadCrumbs}>Overview</PageTitle>
              <Overview />
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export default SystemPage
