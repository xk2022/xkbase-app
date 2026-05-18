// src/app/pages/upms/system/overview/OverviewPage.tsx
import React, { useCallback, useEffect, useState } from 'react'

import { Content } from '@/_metronic/layout/components/content'

import { useAlert } from '@/app/pages/common/AlertType'
import { AppToolbar } from '@/app/pages/common/AppToolbar'

import { System } from '../Model'
import { fetchSystems, getSystemCreatedTime } from '../Query'
import { FastActionCard } from './components/FastActionCard'
import { SummaryCards } from './components/SummaryCards'
import { RecentSystemsTable } from './components/RecentSystemsTable'

/**
 * ===============================================================
 * System OverviewPage（系統總覽頁面）
 * ---------------------------------------------------------------
 * 功能：
 * - 系統總數統計
 * - 系統狀態統計（啟用/停用）
 * - 最近創建的系統列表
 * - 快速操作按鈕
 * ===============================================================
 */
export const OverviewPage: React.FC = () => {
  const { alert, Alert, showAlert } = useAlert()
  const [loading, setLoading] = useState(true)
  const [allSystems, setAllSystems] = useState<System[]>([])

  // 載入所有系統（不分頁）
  const loadAllSystems = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetchSystems(
        {
          page: 0,
          size: 1000,
        },
        showAlert
      )
      setAllSystems(result.content || [])
    } catch (e) {
      console.error(e)
      showAlert('載入系統資料失敗', 'danger')
    } finally {
      setLoading(false)
    }
  }, [showAlert])

  useEffect(() => {
    loadAllSystems()
  }, [loadAllSystems])

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='系統總覽'
        breadcrumbs={[
          { label: '權限管理', href: '#', active: false },
          { label: '系統管理', active: true },
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
              systems={allSystems}
              getSystemCreatedTime={getSystemCreatedTime}
            />

            {/* 統計表格 */}
            <div className='row g-5 g-xl-8'>
              <div className='col-12'>
                <RecentSystemsTable
                  systems={allSystems}
                  getSystemCreatedTime={getSystemCreatedTime}
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
