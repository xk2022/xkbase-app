// src/app/pages/upms/permission/detail/DetailPage.tsx
import React, {useCallback, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {Spinner} from 'react-bootstrap'

import {Content} from '@/_metronic/layout/components/content'
import {useAlert} from '@/app/pages/common/AlertType'
import {AppToolbar} from '@/app/pages/common/AppToolbar'

// 你之後要新增/調整欄位，只動 Model/Query/Card，不動 Page
import type {Permission} from '../Model'
import {fetchPermissionDetail} from '../Query'
// Cards（可先做空殼，逐步補）
import PermissionBasicInfoCard from './PermissionBasicInfoCard'
// import {PermissionSystemBindingCard} from './PermissionSystemBindingCard'
// import {PermissionRoleBindingCard} from './PermissionRoleBindingCard'
// import {PermissionAuditLogCard} from './PermissionAuditLogCard'

export const DetailPage: React.FC = () => {
  const {id} = useParams<{id: string}>()
  const {alert, showAlert, Alert} = useAlert()

  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<Permission | null>(null)

  const loadDetail = useCallback(async () => {
    if (!id) return
    setLoading(true)

    try {
      const data = await fetchPermissionDetail(id /*, showAlert */)
      setDetail(data)
    } catch (e) {
      console.error(e)
      showAlert('取得權限詳情失敗', 'danger')
      setDetail(null)
    } finally {
      setLoading(false)
    }
  }, [id, showAlert])

  useEffect(() => {
    loadDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Content>
      {/* Alert 顯示區 */}
      {alert && <Alert message={alert.message} type={alert.type} />}

      {/* Toolbar：標題 + 麵包屑 */}
      <AppToolbar
        title='權限詳情'
        breadcrumbs={[
          {label: '權限管理', href: '#'},
          {label: '權限', active: false},
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
          <div className='text-center py-10 text-muted'>查無權限資料</div>
        ) : (
          <div className='row g-6'>
            {/* 基本資訊 */}
            <div className='col-12 col-lg-6'>
              <PermissionBasicInfoCard detail={detail} reload={loadDetail} />
            </div>

            {/* 系統綁定 / 資源資訊（可擴充：顯示 system/resource/action 結構化資訊） */}
            <div className='col-12 col-lg-6'>
              {/* <PermissionSystemBindingCard detail={detail} reload={loadDetail} /> */}
            </div>

            {/* 角色綁定摘要（L3：Role x Permission） */}
            <div className='col-12 col-lg-6'>
              {/* <PermissionRoleBindingCard detail={detail} reload={loadDetail} /> */}
            </div>

            {/* 操作/審計紀錄 */}
            <div className='col-12 col-lg-6'>
              {/* <PermissionAuditLogCard detail={detail} /> */}
            </div>
          </div>
        )}
      </div>
    </Content>
  )
}
