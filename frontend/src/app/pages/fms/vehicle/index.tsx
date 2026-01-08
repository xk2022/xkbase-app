// src/app/pages/fms/vehicle/index.tsx
import React from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '@/_metronic/layout/core'

// 這幾個頁面檔案之後你可以依需求實作（先預留 import）
import { Overview } from './Overview'
import { FormPage } from './FormPage'
import { DetailPage } from './detail/DetailPage'
// import {VehicleStatusPage} from './VehicleStatusPage'
// import {VehicleOnDutyPage} from './VehicleOnDutyPage'
// import {VehicleMaintenancePage} from './VehicleMaintenancePage'
// import {VehicleMileagePage} from './VehicleMileagePage'

const vehicleBreadCrumbs: Array<PageLink> = [
  {
    title: '車輛管理',
    path: '/fms/vehicle/overview',
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

const VehiclePage: React.FC = () => {
  return (
    <Routes>
      {/* 預設導到列表頁 */}
      <Route index element={<Navigate to='list' />} />

      {/* 車輛列表 */}
      <Route
        path='list'
        element={
          <>
            <PageTitle breadcrumbs={vehicleBreadCrumbs}>車輛列表</PageTitle>
            <Overview />
          </>
        }
      />

      {/* 新增車輛 */}
      <Route
        path='create'
        element={
          <>
            <PageTitle breadcrumbs={vehicleBreadCrumbs}>新增車輛</PageTitle>
            <FormPage />
          </>
        }
      />
      
      <Route
        path=':id/detail'
        element={
          <>
            <PageTitle breadcrumbs={vehicleBreadCrumbs}>車輛詳情</PageTitle>
            <DetailPage />
          </>
        }
      />


      {/* 車輛狀態總覽（v2） */}
      {/* <Route
        path='status'
        element={
          <>
            <PageTitle breadcrumbs={vehicleBreadCrumbs}>車輛狀態總覽</PageTitle>
            <VehicleStatusPage />
          </>
        }
      /> */}

      {/* 上線狀態（v2） */}
      {/* <Route
        path='on-duty'
        element={
          <>
            <PageTitle breadcrumbs={vehicleBreadCrumbs}>司機上線狀態</PageTitle>
            <VehicleOnDutyPage />
          </>
        }
      /> */}

      {/* 維修 / 保養（v3 預留） */}
      {/* <Route
        path='maintenance'
        element={
          <>
            <PageTitle breadcrumbs={vehicleBreadCrumbs}>維修 / 保養紀錄</PageTitle>
            <VehicleMaintenancePage />
          </>
        }
      /> */}

      {/* 里程 / 油耗（v3 預留） */}
      {/* <Route
        path='mileage'
        element={
          <>
            <PageTitle breadcrumbs={vehicleBreadCrumbs}>里程 / 油耗分析</PageTitle>
            <VehicleMileagePage />
          </>
        }
      /> */}
    </Routes>
  )
}

export default VehiclePage
