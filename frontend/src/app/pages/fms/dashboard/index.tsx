// src/app/pages/fms/dashboard/index.tsx
import {FC} from 'react'
import {PageTitle} from '@/_metronic/layout/core'
import {ToolbarWrapper} from '@/_metronic/layout/components/toolbar'
import FMSDashboardPage from './DashboardPage'

const FMSDashboardWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>FMS 儀表板</PageTitle>
      <ToolbarWrapper />
      <FMSDashboardPage />
    </>
  )
}

export default FMSDashboardWrapper
