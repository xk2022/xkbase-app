// src/app/pages/upms/role/overview/OverviewPage.tsx
import React, {useCallback, useEffect, useState} from 'react'

import {Content} from '@/_metronic/layout/components/content'

import {useAlert} from '@/app/pages/common/AlertType'
import {AppToolbar} from '@/app/pages/common/AppToolbar'

import {Role} from '../Model'
import {fetchRoles, getRoleCreatedTime} from '../Query'
import {FastActionCard} from './components/FastActionCard'
import {SummaryCards} from './components/SummaryCards'
import {PermissionDistributionTable} from './components/PermissionDistributionTable'
import {RecentRolesTable} from './components/RecentRolesTable'

/**
 * ===============================================================
 * Role OverviewPage（角色總覽頁面）
 * ---------------------------------------------------------------
 * 功能：
 * - 角色總數統計
 * - 各角色權限數量統計
 * - 最近建立的角色列表
 * ===============================================================
 */
export const OverviewPage: React.FC = () => {
  const {alert, Alert, showAlert} = useAlert()
  const [loading, setLoading] = useState(true)
  const [allRoles, setAllRoles] = useState<Role[]>([])

  // 載入所有角色（不分頁）
  const loadAllRoles = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetchRoles(
        {
          page: 0,
          size: 1000,
        },
        showAlert
      )
      setAllRoles(result.content || [])
    } catch (e) {
      console.error(e)
      showAlert('載入角色資料失敗', 'danger')
    } finally {
      setLoading(false)
    }
  }, [showAlert])

  useEffect(() => {
    loadAllRoles()
  }, [loadAllRoles])

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='角色總覽'
        breadcrumbs={[
          {label: '權限管理', href: '#', active: false},
          {label: '角色', active: true},
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
              roles={allRoles}
              getRoleCreatedTime={getRoleCreatedTime}
            />

            {/* 統計表格 */}
            <div className='row g-5 g-xl-8'>
              <div className='col-12 col-xl-6'>
                <PermissionDistributionTable roles={allRoles} />
              </div>

              <div className='col-12 col-xl-6'>
                <RecentRolesTable
                  roles={allRoles}
                  getRoleCreatedTime={getRoleCreatedTime}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Content>
  )
}

export default OverviewPage
