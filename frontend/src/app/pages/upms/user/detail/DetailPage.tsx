// src/app/pages/upms/user/detail/DetailPage.tsx
import React, {useCallback, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {Spinner} from 'react-bootstrap'

import {Content} from '@/_metronic/layout/components/content'
import {useAlert} from '@/app/pages/common/AlertType'
import {AppToolbar} from '@/app/pages/common/AppToolbar'

import { UserProfile } from '../Model'
import { fetchUserProfile } from '../Query'

// MVP 4 cards
import UserBasicInfoCard from './cards/UserBasicInfoCard'
import UserStatusCard from './cards/UserStatusCard'
import { UserRolesCard } from './cards/UserRolesCard'
import UserPermissionSummaryCard from './cards/UserPermissionSummaryCard'
// import UserStatusCard from './cards/UserStatusCard'
// import UserRolesCard from './cards/UserRolesCard'
// import UserPermissionSummaryCard from './cards/UserPermissionSummaryCard'

// v2 cards（先保留註解，避免 Page 常改）
// import UserLoginHistoryCard from './cards/UserLoginHistoryCard'
// import UserPasswordCard from './cards/UserPasswordCard'
// import UserAuditLogCard from './cards/UserAuditLogCard'

export const DetailPage: React.FC = () => {
  const {id} = useParams<{id: string}>()
  const {alert, showAlert, Alert} = useAlert()

  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<UserProfile | null>(null)

  const loadDetail = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await fetchUserProfile(id)
      setDetail(data)
    } catch (e) {
      console.error(e)
      showAlert('取得使用者詳情失敗', 'danger')
      setDetail(null)
    } finally {
      setLoading(false)
    }
  }, [id, showAlert])

  useEffect(() => {
    loadDetail()
  }, [loadDetail])

  return (
    <Content>
      {/* Alert */}
      {alert && <Alert message={alert.message} type={alert.type} />}

      {/* Toolbar */}
      <AppToolbar
        title='使用者詳情'
        breadcrumbs={[
          {label: '權限管理', href: '#'},
          {label: '使用者', active: false},
          {label: '詳情', active: true},
        ]}
      />

      <div className='app-container container-fluid'>
        {loading ? (
          <div className='d-flex justify-content-center py-10'>
            <Spinner animation='border' />
          </div>
        ) : !detail ? (
          <div className='text-center py-10 text-muted'>查無使用者資料</div>
        ) : (
          <div className='row g-6'>
            {/* 1) 基本資訊：可編輯 name/email/phone；username 不可改 */}
            <div className='col-12 col-lg-6'>
              <UserBasicInfoCard detail={detail} reload={loadDetail} showAlert={showAlert} />
            </div>

            {/* 2) 狀態與安全：enabled/locked 在這張卡片操作（避免 Basic 混雜管理權限） */}
            <div className='col-12 col-lg-6'>
              <UserStatusCard detail={detail} reload={loadDetail} showAlert={showAlert} />
            </div>

            {/* 3) 角色：新增/移除角色 */}
            <div className='col-12 col-lg-6'>
              <UserRolesCard detail={detail} reload={loadDetail} showAlert={showAlert} />
            </div>

            {/* 4) 權限摘要：顯示有效權限（由角色/例外計算），用於除錯與驗證 */}
            <div className='col-12 col-lg-6'>
              <UserPermissionSummaryCard detail={detail} showAlert={showAlert} />
            </div>

            {/* v2：登入紀錄 / 密碼 / 稽核 */}
            {/* <div className='col-12'>
              <UserLoginHistoryCard detail={detail} />
            </div>

            <div className='col-12'>
              <UserPasswordCard userId={id!} showAlert={showAlert} />
            </div>

            <div className='col-12'>
              <UserAuditLogCard userId={id!} />
            </div> */}
          </div>
        )}
      </div>
    </Content>
  )
}

export default DetailPage
