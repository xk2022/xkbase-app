// src/app/pages/port/dashboard/index.tsx
import {FC} from 'react'
import {PageTitle} from '@/_metronic/layout/core'
import {ToolbarWrapper} from '@/_metronic/layout/components/toolbar'
import PortDashboardPage from './DashboardPage'

const PortDashboardWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>PORT 儀表板</PageTitle>
      <ToolbarWrapper />
      <PortDashboardPage />
    </>
  )
}

export default PortDashboardWrapper
