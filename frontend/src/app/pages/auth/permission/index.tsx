import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import { Overview } from './Overview'

const permissionBreadCrumbs: Array<PageLink> = [
  {
    title: 'Permisssion',
    path: '/auth/permission/overview',
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

const PermissionPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='overview'
        element={
          <>
            <PageTitle breadcrumbs={permissionBreadCrumbs}>Overview</PageTitle>
            <Overview />
          </>
        }
      />
    </Routes>
  )
}

export default PermissionPage
