// src/app/pages/upms/user/overview/OverviewPage.tsx
import React from 'react'

import {Content} from '@/_metronic/layout/components/content'

import {useAlert} from '@/app/pages/common/AlertType'
import {AppToolbar} from '@/app/pages/common/AppToolbar'
import {useCallback, useEffect, useState} from 'react'

import {User} from '../Model'
import {fetchUsers, getLockedUserIds, getUserJoinedAt} from '../Query'
import {FastActionCard} from './components/FastActionCard'
import {SummaryCards} from './components/SummaryCards'
import {RoleDistributionTable} from './components/RoleDistributionTable'
import {RecentUsersTable} from './components/RecentUsersTable'

/**
 * ===============================================================
 * User OverviewPage（使用者總覽頁面）
 * ---------------------------------------------------------------
 * 功能：
 * - 使用者總數統計
 * - 使用者狀態統計（啟用/停用/鎖定）
 * - 使用者角色分布統計
 * - 最近加入的使用者列表
 * ===============================================================
 */
export const OverviewPage: React.FC = () => {
  const {alert, Alert, showAlert} = useAlert()
  const [loading, setLoading] = useState(true)
  const [allUsers, setAllUsers] = useState<User[]>([])

  // 載入所有使用者（不分頁）
  const loadAllUsers = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetchUsers(
        {
          page: 0,
          size: 1000,
        },
        showAlert
      )
      setAllUsers(result.content || [])
    } catch (e) {
      console.error(e)
      showAlert('載入使用者資料失敗', 'danger')
    } finally {
      setLoading(false)
    }
  }, [showAlert])

  useEffect(() => {
    loadAllUsers()
  }, [loadAllUsers])

  // 取得鎖定使用者的 ID 集合
  const lockedUserIds = getLockedUserIds()

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='使用者總覽'
        breadcrumbs={[
          {label: '權限管理', href: '#', active: false},
          {label: '使用者', active: true},
        ]}
      />

      <div className='app-container container-fluid'>
        {loading ? (
          <div className='d-flex justify-content-center py-10'>
            <div className='spinner-border' role='status'>
              <span className='visually-hidden'>載入中...</span>
            </div>
          </div>
        ) : (
          <>
            {/* 快速操作 */}
            <FastActionCard />

            {/* 統計卡片 */}
            <SummaryCards
              users={allUsers}
              lockedUserIds={lockedUserIds}
              getUserJoinedAt={getUserJoinedAt}
            />

            {/* 統計表格 */}
            <div className='row g-5 g-xl-8'>
              <div className='col-12 col-xl-6'>
                <RoleDistributionTable users={allUsers} />
              </div>

              <div className='col-12 col-xl-6'>
                <RecentUsersTable users={allUsers} getUserJoinedAt={getUserJoinedAt} />
              </div>
            </div>
          </>
        )}
      </div>
    </Content>
  )
}

export default OverviewPage
