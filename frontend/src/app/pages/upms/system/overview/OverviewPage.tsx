// src/app/pages/upms/system/overview/OverviewPage.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Content } from '@/_metronic/layout/components/content'
import { KTIcon } from '@/_metronic/helpers'

import { useAlert } from '@/app/pages/common/AlertType'
import { AppToolbar } from '@/app/pages/common/AppToolbar'

import { System } from '../Model'
import { fetchSystems } from '../Query'
import { MOCK_SYSTEMS } from '../mockSystems'
import { shouldUseMockData } from '@/shared/utils/useMockData'

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
export function OverviewPage() {
  const navigate = useNavigate()
  const { alert, showAlert, Alert } = useAlert()

  const [loading, setLoading] = useState(true)
  const [allSystems, setAllSystems] = useState<System[]>([])

  // 載入所有系統（不分頁）
  const loadAllSystems = useCallback(async () => {
    setLoading(true)
    try {
      // 使用大 pageSize 獲取所有系統
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

  // 統計資訊
  const statistics = useMemo(() => {
    const total = allSystems.length
    const enabled = allSystems.filter((s) => s.enabled).length
    const disabled = total - enabled

    return {
      total,
      enabled,
      disabled,
    }
  }, [allSystems])

  // 最近創建的系統（按 createdTime 排序，取前 5 個）
  const recentSystems = useMemo(() => {
    // 如果是 Mock 模式，使用 MOCK_SYSTEMS 的 createdTime
    if (shouldUseMockData()) {
      const systemsWithTime: (System & { createdTime?: string })[] = allSystems.map((system) => {
        const mockSystem = MOCK_SYSTEMS.find((s) => s.id === system.id)
        return {
          ...system,
          createdTime: mockSystem?.createdTime,
        }
      })

      return systemsWithTime
        .sort((a, b) => {
          if (!a.createdTime && !b.createdTime) return 0
          if (!a.createdTime) return 1
          if (!b.createdTime) return -1
          return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
        })
        .slice(0, 5)
    }

    // 真實 API 模式：按 createdTime 倒序
    return [...allSystems]
      .sort((a, b) => {
        if (!a.createdTime && !b.createdTime) return 0
        if (!a.createdTime) return 1
        if (!b.createdTime) return -1
        return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
      })
      .slice(0, 5)
  }, [allSystems])

  // 格式化日期時間
  const formatDateTime = (ts?: string) => {
    if (!ts) return '-'
    try {
      const d = new Date(ts)
      if (Number.isNaN(d.getTime())) return ts
      return d.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return ts
    }
  }

  // 格式化日期
  const formatDate = (ts?: string) => {
    if (!ts) return '-'
    try {
      const d = new Date(ts)
      if (Number.isNaN(d.getTime())) return ts
      return d.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    } catch {
      return ts
    }
  }

  // 啟用狀態 Badge
  const enabledBadge = (enabled: boolean) => {
    return enabled ? (
      <span className='badge badge-light-success'>啟用</span>
    ) : (
      <span className='badge badge-light-secondary'>停用</span>
    )
  }

  const handleRefresh = () => {
    loadAllSystems()
  }

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
            {/* 統計卡片 */}
            <div className='row g-5 g-xl-8 mb-5 mb-xl-10'>
              {/* 系統總數 */}
              <div className='col-12 col-sm-6 col-xl-4'>
                <div className='card h-100'>
                  <div className='card-body d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='d-flex flex-column'>
                        <span className='text-muted fw-semibold fs-7'>系統總數</span>
                        <span className='fw-bold fs-2 text-gray-900 mt-1'>
                          {statistics.total}
                        </span>
                      </div>
                      <span className='badge badge-light-primary p-3'>
                        <KTIcon iconName='abstract-27' className='fs-2' />
                      </span>
                    </div>

                    <div className='separator my-4'></div>

                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='text-muted fs-8'>已啟用</span>
                      <span className='fw-bold text-gray-800'>{statistics.enabled}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 啟用系統 */}
              <div className='col-12 col-sm-6 col-xl-4'>
                <div className='card h-100'>
                  <div className='card-body d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='d-flex flex-column'>
                        <span className='text-muted fw-semibold fs-7'>啟用系統</span>
                        <span className='fw-bold fs-2 text-gray-900 mt-1'>
                          {statistics.enabled}
                        </span>
                      </div>
                      <span className='badge badge-light-success p-3'>
                        <KTIcon iconName='check-circle' className='fs-2' />
                      </span>
                    </div>

                    <div className='separator my-4'></div>

                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='text-muted fs-8'>停用</span>
                      <span className='fw-bold text-gray-800'>{statistics.disabled}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 最近創建的系統 */}
              <div className='col-12 col-sm-6 col-xl-4'>
                <div className='card h-100'>
                  <div className='card-body d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='d-flex flex-column'>
                        <span className='text-muted fw-semibold fs-7'>最近創建</span>
                        <span className='fw-bold fs-2 text-gray-900 mt-1'>
                          {recentSystems.length} 個
                        </span>
                      </div>
                      <span className='badge badge-light-warning p-3'>
                        <KTIcon iconName='time' className='fs-2' />
                      </span>
                    </div>

                    <div className='separator my-4'></div>

                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='text-muted fs-8'>創建時間</span>
                      <span className='fw-bold text-gray-800'>
                        {recentSystems.length > 0
                          ? formatDate(
                              shouldUseMockData()
                                ? MOCK_SYSTEMS.find((s) => s.id === recentSystems[0].id)?.createdTime
                                : recentSystems[0].createdTime
                            )
                          : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 最近創建的系統列表 */}
            <div className='row g-5 g-xl-8'>
              <div className='col-12'>
                <div className='card h-100'>
                  <div className='card-header border-0 pt-6'>
                    <h3 className='card-title align-items-start flex-column'>
                      <span className='card-label fw-bold fs-3 mb-1'>最近創建的系統</span>
                      <span className='text-muted mt-1 fw-semibold fs-7'>
                        最近創建的 5 個系統
                      </span>
                    </h3>
                    <div className='card-toolbar'>
                      <button
                        type='button'
                        className='btn btn-sm btn-light-primary'
                        onClick={() => navigate('/upms/system/list')}
                      >
                        查看全部
                        <KTIcon iconName='arrow-right' className='fs-4 ms-1' />
                      </button>
                    </div>
                  </div>

                  <div className='card-body pt-0'>
                    {recentSystems.length === 0 ? (
                      <div className='text-center py-10 text-muted'>
                        <KTIcon iconName='information-5' className='fs-2x text-muted mb-3' />
                        <p className='mb-0'>尚無系統資料</p>
                      </div>
                    ) : (
                      <div className='table-responsive'>
                        <table className='table table-row-dashed table-row-gray-300 align-middle gs-0'>
                          <thead>
                            <tr className='fw-bold text-muted'>
                              <th className='min-w-150px'>系統代碼</th>
                              <th className='min-w-200px'>系統名稱</th>
                              <th className='min-w-100px'>狀態</th>
                              <th className='min-w-150px'>創建時間</th>
                              <th className='min-w-100px text-end'>操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentSystems.map((system) => (
                              <tr key={system.id}>
                                <td>
                                  <span className='badge badge-light-info fs-7 fw-bold'>
                                    {system.code}
                                  </span>
                                </td>
                                <td>
                                  <span className='text-gray-800 fw-bold'>{system.name}</span>
                                </td>
                                <td>{enabledBadge(system.enabled)}</td>
                                <td>
                                  <span className='text-muted fs-7'>
                                    {formatDateTime(
                                      shouldUseMockData()
                                        ? MOCK_SYSTEMS.find((s) => s.id === system.id)?.createdTime
                                        : system.createdTime
                                    )}
                                  </span>
                                </td>
                                <td className='text-end'>
                                  <button
                                    type='button'
                                    className='btn btn-sm btn-light-primary'
                                    onClick={() => navigate(`/upms/system/${system.id}/detail`)}
                                  >
                                    詳情
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 快速操作 */}
            <div className='row g-5 g-xl-8 mt-1'>
              <div className='col-12'>
                <div className='card'>
                  <div className='card-header border-0 pt-6'>
                    <h3 className='card-title align-items-start flex-column'>
                      <span className='card-label fw-bold fs-3 mb-1'>快速操作</span>
                    </h3>
                  </div>

                  <div className='card-body pt-0'>
                    <div className='d-flex flex-wrap gap-3'>
                      <button
                        type='button'
                        className='btn btn-primary'
                        onClick={() => navigate('/upms/system/create')}
                      >
                        <KTIcon iconName='plus' className='fs-2 me-2' />
                        新增系統
                      </button>
                      <button
                        type='button'
                        className='btn btn-light-primary'
                        onClick={() => navigate('/upms/system/list')}
                      >
                        <KTIcon iconName='list' className='fs-2 me-2' />
                        查看所有系統
                      </button>
                      <button
                        type='button'
                        className='btn btn-light'
                        onClick={handleRefresh}
                      >
                        <KTIcon iconName='arrows-circle' className='fs-2 me-2' />
                        刷新
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Content>
  )
}

export default OverviewPage
