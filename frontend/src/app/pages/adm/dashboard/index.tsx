// src/app/pages/adm/dashboard/index.tsx
import {FC} from 'react'
import {PageTitle} from '@/_metronic/layout/core'
import {ToolbarWrapper} from '@/_metronic/layout/components/toolbar'
import ADMDashboardPage from './DashboardPage'

const ADMDashboardWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>ADM 儀表板</PageTitle>
      <ToolbarWrapper />
      <ADMDashboardPage />
    </>
  )
}

export default ADMDashboardWrapper
