import React from 'react'
import {Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {Overview} from './Overview'

const roleBreadCrumbs: Array<PageLink> = [
  {
    title: 'Role',
    path: '/auth/role/overview',
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
      <Route>
        <Route
          path='overview'
          element={
            <>
              <PageTitle breadcrumbs={roleBreadCrumbs}>Overview</PageTitle>
              <Overview />
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export default RolePage
