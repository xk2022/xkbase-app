// src/app/pages/upms/role/overview/OverviewPage.tsx
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {Content} from '@/_metronic/layout/components/content'
import {KTIcon} from '@/_metronic/helpers'

import {useAlert} from '@/app/pages/common/AlertType'
import {AppToolbar} from '@/app/pages/common/AppToolbar'

import {Role} from '../Model'
import {fetchRoles} from '../Query'
import {MOCK_ROLES} from '../mockRoles'
import {shouldUseMockData} from '@/shared/utils/useMockData'

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
  const navigate = useNavigate()
  const {alert, showAlert, Alert} = useAlert()

  const [loading, setLoading] = useState(true)
  const [allRoles, setAllRoles] = useState<Role[]>([])

  // 載入所有角色（不分頁）
  const loadAllRoles = useCallback(async () => {
    setLoading(true)
    try {
      // 使用大 pageSize 獲取所有角色
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

  // 統計資訊
  const statistics = useMemo(() => {
    const total = allRoles.length
    const enabled = allRoles.filter((r) => r.enabled).length
    const disabled = total - enabled
    const totalPermissions = allRoles.reduce(
      (sum, r) => sum + (r.permissionCount ?? r.permissionCodes?.length ?? 0),
      0
    )
    const avgPermissions =
      total > 0 ? Math.round(totalPermissions / total) : 0

    return {
      total,
      enabled,
      disabled,
      totalPermissions,
      avgPermissions,
    }
  }, [allRoles])

  // 最近建立的角色（按 createdTime 排序，取前 5 個）
  const recentRoles = useMemo(() => {
    // 如果是 Mock 模式，使用 MOCK_ROLES 的 createdTime
    if (shouldUseMockData()) {
      const rolesWithTime: (Role & {createdTime?: string})[] = allRoles.map((role) => {
        const mockRole = MOCK_ROLES.find((r) => r.id === role.id)
        return {
          ...role,
          createdTime: mockRole?.createdTime,
        }
      })

      return rolesWithTime
        .sort((a, b) => {
          if (!a.createdTime && !b.createdTime) return 0
          if (!a.createdTime) return 1
          if (!b.createdTime) return -1
          return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
        })
        .slice(0, 5)
    }

    // 真實 API 模式：按 id 倒序（假設新建立的 id 較大）
    return [...allRoles]
      .sort((a, b) => b.id.localeCompare(a.id))
      .slice(0, 5)
  }, [allRoles])

  // 各角色權限數量統計（按權限數量分組）
  const permissionStats = useMemo(() => {
    const stats: Record<string, number> = {
      '0': 0,
      '1-5': 0,
      '6-10': 0,
      '11-20': 0,
      '21+': 0,
    }

    allRoles.forEach((role) => {
      const count = role.permissionCount ?? role.permissionCodes?.length ?? 0
      if (count === 0) {
        stats['0']++
      } else if (count <= 5) {
        stats['1-5']++
      } else if (count <= 10) {
        stats['6-10']++
      } else if (count <= 20) {
        stats['11-20']++
      } else {
        stats['21+']++
      }
    })

    return stats
  }, [allRoles])

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

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='角色總覽'
        breadcrumbs={[
          {label: '權限管理', href: '#'},
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
            {/* 統計卡片 */}
            <div className='row g-5 g-xl-8 mb-5'>
              {/* 角色總數 */}
              <div className='col-12 col-sm-6 col-xl-3'>
                <div className='card h-100'>
                  <div className='card-body d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='d-flex flex-column'>
                        <span className='text-muted fw-semibold fs-7'>角色總數</span>
                        <span className='fw-bold fs-2 text-gray-900 mt-1'>
                          {statistics.total}
                        </span>
                      </div>
                      <span className='badge badge-light-primary p-3'>
                        <KTIcon iconName='people' className='fs-2' />
                      </span>
                    </div>

                    <div className='separator my-4'></div>

                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='text-muted fs-8'>啟用</span>
                      <span className='fw-bold text-gray-800'>{statistics.enabled}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 啟用角色數 */}
              <div className='col-12 col-sm-6 col-xl-3'>
                <div className='card h-100'>
                  <div className='card-body d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='d-flex flex-column'>
                        <span className='text-muted fw-semibold fs-7'>啟用角色</span>
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

              {/* 總權限數 */}
              <div className='col-12 col-sm-6 col-xl-3'>
                <div className='card h-100'>
                  <div className='card-body d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='d-flex flex-column'>
                        <span className='text-muted fw-semibold fs-7'>總權限數</span>
                        <span className='fw-bold fs-2 text-gray-900 mt-1'>
                          {statistics.totalPermissions}
                        </span>
                      </div>
                      <span className='badge badge-light-info p-3'>
                        <KTIcon iconName='shield-tick' className='fs-2' />
                      </span>
                    </div>

                    <div className='separator my-4'></div>

                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='text-muted fs-8'>平均</span>
                      <span className='fw-bold text-gray-800'>
                        {statistics.avgPermissions} 個/角色
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 平均權限數 */}
              <div className='col-12 col-sm-6 col-xl-3'>
                <div className='card h-100'>
                  <div className='card-body d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='d-flex flex-column'>
                        <span className='text-muted fw-semibold fs-7'>平均權限數</span>
                        <span className='fw-bold fs-2 text-gray-900 mt-1'>
                          {statistics.avgPermissions}
                        </span>
                      </div>
                      <span className='badge badge-light-warning p-3'>
                        <KTIcon iconName='chart-simple' className='fs-2' />
                      </span>
                    </div>

                    <div className='separator my-4'></div>

                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='text-muted fs-8'>總計</span>
                      <span className='fw-bold text-gray-800'>
                        {statistics.totalPermissions} 個
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='row g-5 g-xl-8'>
              {/* 各角色權限數量統計 */}
              <div className='col-12 col-xl-6'>
                <div className='card h-100'>
                  <div className='card-header border-0 pt-6'>
                    <h3 className='card-title align-items-start flex-column'>
                      <span className='card-label fw-bold fs-3 mb-1'>權限數量分布</span>
                      <span className='text-muted mt-1 fw-semibold fs-7'>
                        各角色擁有的權限數量統計
                      </span>
                    </h3>
                  </div>

                  <div className='card-body pt-0'>
                    <div className='table-responsive'>
                      <table className='table table-row-dashed table-row-gray-300 align-middle gs-0'>
                        <thead>
                          <tr className='fw-bold text-muted'>
                            <th className='min-w-150px'>權限數量範圍</th>
                            <th className='min-w-100px text-end'>角色數量</th>
                            <th className='min-w-150px'>比例</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(permissionStats).map(([range, count]) => {
                            const percentage =
                              statistics.total > 0
                                ? Math.round((count / statistics.total) * 100)
                                : 0
                            return (
                              <tr key={range}>
                                <td>
                                  <span className='text-gray-800 fw-bold'>
                                    {range === '0'
                                      ? '無權限'
                                      : range === '21+'
                                        ? '21 個以上'
                                        : `${range} 個`}
                                  </span>
                                </td>
                                <td className='text-end'>
                                  <span className='fw-bold text-gray-900'>{count}</span>
                                </td>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    <div className='progress w-100 me-3' style={{height: '8px'}}>
                                      <div
                                        className='progress-bar bg-primary'
                                        role='progressbar'
                                        style={{width: `${percentage}%`}}
                                        aria-valuenow={percentage}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                      />
                                    </div>
                                    <span className='text-muted fs-7 fw-bold min-w-50px text-end'>
                                      {percentage}%
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* 最近建立的角色 */}
              <div className='col-12 col-xl-6'>
                <div className='card h-100'>
                  <div className='card-header border-0 pt-6'>
                    <h3 className='card-title align-items-start flex-column'>
                      <span className='card-label fw-bold fs-3 mb-1'>最近建立的角色</span>
                      <span className='text-muted mt-1 fw-semibold fs-7'>
                        最近建立的 5 個角色
                      </span>
                    </h3>
                    <div className='card-toolbar'>
                      <button
                        type='button'
                        className='btn btn-sm btn-light-primary'
                        onClick={() => navigate('/upms/role/list')}
                      >
                        查看全部
                        <KTIcon iconName='arrow-right' className='fs-4 ms-1' />
                      </button>
                    </div>
                  </div>

                  <div className='card-body pt-0'>
                    {recentRoles.length === 0 ? (
                      <div className='text-center py-10 text-muted'>
                        <KTIcon iconName='information-5' className='fs-2x text-muted mb-3' />
                        <p className='mb-0'>尚無角色資料</p>
                      </div>
                    ) : (
                      <div className='table-responsive'>
                        <table className='table table-row-dashed table-row-gray-300 align-middle gs-0'>
                          <thead>
                            <tr className='fw-bold text-muted'>
                              <th className='min-w-150px'>角色代碼</th>
                              <th className='min-w-150px'>角色名稱</th>
                              <th className='min-w-100px'>權限數</th>
                              <th className='min-w-100px'>狀態</th>
                              <th className='min-w-100px text-end'>操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentRoles.map((role) => (
                              <tr key={role.id}>
                                <td>
                                  <span className='badge badge-light-info fs-7 fw-bold'>
                                    {role.code}
                                  </span>
                                </td>
                                <td>
                                  <span className='text-gray-800 fw-bold'>{role.name}</span>
                                </td>
                                <td>
                                  <span className='badge badge-light-primary'>
                                    {role.permissionCount ?? role.permissionCodes?.length ?? 0}
                                  </span>
                                </td>
                                <td>
                                  {role.enabled ? (
                                    <span className='badge badge-light-success'>啟用</span>
                                  ) : (
                                    <span className='badge badge-light-secondary'>停用</span>
                                  )}
                                </td>
                                <td className='text-end'>
                                  <button
                                    type='button'
                                    className='btn btn-sm btn-light-primary'
                                    onClick={() => navigate(`/upms/role/${role.id}/detail`)}
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
                        onClick={() => navigate('/upms/role/create')}
                      >
                        <KTIcon iconName='plus' className='fs-2 me-2' />
                        新增角色
                      </button>
                      <button
                        type='button'
                        className='btn btn-light-primary'
                        onClick={() => navigate('/upms/role/list')}
                      >
                        <KTIcon iconName='list' className='fs-2 me-2' />
                        查看所有角色
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
