// src/app/pages/upms/system/detail/DetailPage.tsx
import React, {useCallback, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {Spinner} from 'react-bootstrap'

import {Content} from '@/_metronic/layout/components/content'
import {useAlert} from '@/app/pages/common/AlertType'
import {AppToolbar} from '@/app/pages/common/AppToolbar'

// 你之後要新增/調整欄位，只動 Model/Query/Card，不動 Page
import { System } from '../Model'
import { fetchSystemDetail } from '../Query'
// Cards（你可以先做空殼，逐步補）
import {SystemBasicInfoCard} from './SystemBasicInfoCard'
// import {SystemConfigCard} from './SystemConfigCard'
// import {SystemPermissionSummaryCard} from './SystemPermissionSummaryCard'
// import {SystemAuditLogCard} from './SystemAuditLogCard'

export const DetailPage: React.FC = () => {
  const {id} = useParams<{id: string}>()
  const {alert, showAlert, Alert} = useAlert()

  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<System | null>(null)

  const loadDetail = useCallback(async () => {
    if (!id) return
    setLoading(true)

    try {
      const data = await fetchSystemDetail(id /*, showAlert */)
      setDetail(data)
    } catch (e) {
      console.error(e)
      showAlert('取得系統詳情失敗', 'danger')
      setDetail(null)
    } finally {
      setLoading(false)
    }
  }, [id, showAlert])

  useEffect(() => {
    loadDetail()
  }, [])

  return (
    <Content>
      {/* Alert 顯示區 */}
      {alert && <Alert message={alert.message} type={alert.type} />}

      {/* Toolbar：標題 + 麵包屑 */}
      <AppToolbar
        title='系統詳情'
        breadcrumbs={[
          {label: '系統管理', href: '#'},
          {label: '系統', active: false},
          {label: '詳情', active: true},
        ]}
      />

      {/* Content：控制寬度同 Overview */}
      <div className='app-container container-fluid'>
        {loading ? (
          <div className='d-flex justify-content-center py-10'>
            <Spinner animation='border' />
          </div>
        ) : !detail ? (
          <div className='text-center py-10 text-muted'>查無系統資料</div>
        ) : (
          <div className='row g-6'>
            {/* 基本資訊 */}
            <div className='col-12 col-lg-6'>
              <SystemBasicInfoCard detail={detail} reload={loadDetail} />
            </div>

            {/* 系統設定 / URL / 狀態等 */}
            <div className='col-12 col-lg-6'>
              {/* <SystemConfigCard detail={detail} reload={loadDetail} /> */}
            </div>

            {/* 權限摘要（可顯示角色/資源/權限概況） */}
            <div className='col-12 col-lg-6'>
              {/* <SystemPermissionSummaryCard detail={detail} reload={loadDetail} /> */}
            </div>

            {/* 操作/審計紀錄 */}
            <div className='col-12 col-lg-6'>
              {/* <SystemAuditLogCard detail={detail} /> */}
            </div>
          </div>
        )}
      </div>
    </Content>
  )
}
