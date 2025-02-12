import React from 'react'
import {Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {Overview} from './Overview'

const userBreadCrumbs: Array<PageLink> = [
  {
    title: 'User',
    path: '/auth/user/overview',
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
      <Route>
        <Route
          path='overview'
          element={
            <>
              <PageTitle breadcrumbs={userBreadCrumbs}>Overview</PageTitle>
              <Overview />
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export default UserPage
