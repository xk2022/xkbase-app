// src/app/pages/upms/user/security/SecurityPage.tsx
import React, {useCallback, useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {Spinner} from 'react-bootstrap'

import {Content} from '@/_metronic/layout/components/content'
import {KTIcon} from '@/_metronic/helpers'
import {useAlert} from '@/app/pages/common/AlertType'
import {AppToolbar} from '@/app/pages/common/AppToolbar'

import {UserProfile} from '../Model'
import {fetchUserProfile, resetUserPassword} from '../Query'

// Security Cards
import {PasswordManagementCard} from './cards/PasswordManagementCard'
import {LoginHistoryCard} from './cards/LoginHistoryCard'
import {DeviceManagementCard} from './cards/DeviceManagementCard'
import {SecuritySummaryCard} from './cards/SecuritySummaryCard'

/**
 * ===============================================================
 * User Security Page（使用者安全設定頁面）
 * ---------------------------------------------------------------
 * 職責：
 * - 顯示使用者安全相關資訊
 * - 密碼管理（重設密碼）
 * - 登入紀錄（IP、時間、裝置）
 * - 裝置管理（強制登出所有裝置）
 * - 安全設定摘要
 * ===============================================================
 */
export const SecurityPage: React.FC = () => {
  const {id} = useParams<{id: string}>()
  const navigate = useNavigate()
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
      showAlert('取得使用者資訊失敗', 'danger')
      setDetail(null)
    } finally {
      setLoading(false)
    }
  }, [id, showAlert])

  useEffect(() => {
    loadDetail()
  }, [loadDetail])

  const handlePasswordReset = async (newPassword: string) => {
    if (!id) return false
    try {
      const ok = await resetUserPassword(id, newPassword, showAlert)
      if (ok) {
        showAlert('密碼已成功重設', 'success')
        return true
      }
      return false
    } catch (e) {
      console.error(e)
      showAlert('重設密碼失敗', 'danger')
      return false
    }
  }

  const handleForceLogoutAll = async () => {
    if (!id) return
    const confirmed = window.confirm(
      '確定要強制登出此使用者的所有裝置嗎？\n\n使用者需要重新登入才能繼續使用系統。'
    )
    if (!confirmed) return

    try {
      // TODO: 實現強制登出 API
      // const ok = await forceLogoutAllDevices(id, showAlert)
      showAlert('功能開發中，請稍後再試', 'warning')
      // if (ok) {
      //   showAlert('已強制登出所有裝置', 'success')
      //   await loadDetail()
      // }
    } catch (e) {
      console.error(e)
      showAlert('強制登出失敗', 'danger')
    }
  }

  if (loading) {
    return (
      <Content>
        <AppToolbar
          title='使用者安全設定'
          breadcrumbs={[
            {label: '權限管理', href: '#', active: false},
            {label: '使用者', active: false},
            {label: '安全設定', active: true},
          ]}
        />
        <div className='d-flex justify-content-center py-10'>
          <Spinner animation='border' />
        </div>
      </Content>
    )
  }

  if (!detail) {
    return (
      <Content>
        <AppToolbar
          title='使用者安全設定'
          breadcrumbs={[
            {label: '權限管理', href: '#', active: false},
            {label: '使用者', active: false},
            {label: '安全設定', active: true},
          ]}
        />
        <div className='text-center py-10 text-muted'>查無使用者資料</div>
      </Content>
    )
  }

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='使用者安全設定'
        breadcrumbs={[
          {label: '權限管理', href: '#', active: false},
          {label: '使用者', active: false},
          {label: detail.profile?.name || detail.username, href: `/upms/user/${id}/detail`, active: false},
          {label: '安全設定', active: true},
        ]}
      />

      <div className='app-container container-fluid'>
        <div className='row g-6'>
          {/* 左側：安全摘要 */}
          <div className='col-12 col-lg-4'>
            <SecuritySummaryCard detail={detail} />
          </div>

          {/* 右側：安全功能 */}
          <div className='col-12 col-lg-8'>
            {/* 密碼管理 */}
            <div className='mb-6'>
              <PasswordManagementCard
                userId={id!}
                username={detail.username}
                onPasswordReset={handlePasswordReset}
                showAlert={showAlert}
              />
            </div>

            {/* 裝置管理 */}
            <div className='mb-6'>
              <DeviceManagementCard
                userId={id!}
                onForceLogoutAll={handleForceLogoutAll}
                showAlert={showAlert}
              />
            </div>

            {/* 登入紀錄 */}
            <div className='mb-6'>
              <LoginHistoryCard detail={detail} />
            </div>
          </div>
        </div>
      </div>
    </Content>
  )
}

export default SecurityPage
