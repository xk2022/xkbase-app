// src/app/pages/tom/dashboard/index.tsx
import {FC} from 'react'
import {PageTitle} from '@/_metronic/layout/core'
import {ToolbarWrapper} from '@/_metronic/layout/components/toolbar'
import TOMDashboardPage from './DashboardPage'

const TOMDashboardWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>TOM 儀表板</PageTitle>
      <ToolbarWrapper />
      <TOMDashboardPage />
    </>
  )
}

export default TOMDashboardWrapper
