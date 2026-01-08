// src/app/pages/crm/dashboard/index.tsx
import {FC} from 'react'
import {PageTitle} from '@/_metronic/layout/core'
import {ToolbarWrapper} from '@/_metronic/layout/components/toolbar'
import CRMDashboardPage from './DashboardPage'

const CRMDashboardWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>CRM 儀表板</PageTitle>
      <ToolbarWrapper />
      <CRMDashboardPage />
    </>
  )
}

export default CRMDashboardWrapper
