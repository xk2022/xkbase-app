// src/app/pages/upms/dashboard/index.tsx
import {FC} from 'react'
import {PageTitle} from '@/_metronic/layout/core'
import {ToolbarWrapper} from '@/_metronic/layout/components/toolbar'
import UPMSDashboardPage from './DashboardPage'

const UPMSDashboardWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>UPMS 儀表板</PageTitle>
      <ToolbarWrapper />
      <UPMSDashboardPage />
    </>
  )
}

export default UPMSDashboardWrapper