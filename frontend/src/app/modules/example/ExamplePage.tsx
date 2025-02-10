import React from 'react'
import {Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {Overview} from './components/Overview'

const exampleBreadCrumbs: Array<PageLink> = [
  {
    title: 'Example',
    path: '/example/overview',
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

const ExamplePage: React.FC = () => {
  return (
    <Routes>
      <Route>
        <Route
          path='overview'
          element={
            <>
              <PageTitle breadcrumbs={exampleBreadCrumbs}>Overview</PageTitle>
              <Overview />
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export default ExamplePage
