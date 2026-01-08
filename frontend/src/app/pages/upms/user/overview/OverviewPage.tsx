// src/app/pages/upms/user/overview/OverviewPage.tsx
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {Content} from '@/_metronic/layout/components/content'
import {KTIcon} from '@/_metronic/helpers'

import {useAlert} from '@/app/pages/common/AlertType'
import {AppToolbar} from '@/app/pages/common/AppToolbar'

import {User} from '../Model'
import {fetchUsers} from '../Query'
import {MOCK_USERS} from '../mockUsers'
import {shouldUseMockData} from '@/shared/utils/useMockData'

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
  const navigate = useNavigate()
  const {alert, showAlert, Alert} = useAlert()

  const [loading, setLoading] = useState(true)
  const [allUsers, setAllUsers] = useState<User[]>([])

  // 載入所有使用者（不分頁）
  const loadAllUsers = useCallback(async () => {
    setLoading(true)
    try {
      // 使用大 pageSize 獲取所有使用者
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

  // 統計資訊
  const statistics = useMemo(() => {
    const total = allUsers.length
    const enabled = allUsers.filter((u) => u.enabled).length
    const disabled = total - enabled
    const locked = allUsers.filter((u) => {
      // 從 UserListResp 中檢查 locked 狀態
      const mockUser = MOCK_USERS.find((mu) => mu.id === u.id)
      return mockUser?.locked ?? false
    }).length
    const totalRoles = allUsers.reduce(
      (sum, u) => sum + (u.roleCodes?.length ?? 0),
      0
    )
    const avgRoles = total > 0 ? Math.round(totalRoles / total) : 0

    return {
      total,
      enabled,
      disabled,
      locked,
      totalRoles,
      avgRoles,
    }
  }, [allUsers])

  // 最近加入的使用者（按 joined_day 排序，取前 5 個）
  const recentUsers = useMemo(() => {
    // 如果是 Mock 模式，使用 MOCK_USERS 的 joinedAt
    if (shouldUseMockData()) {
      const usersWithTime: (User & {joinedAt?: string})[] = allUsers.map((user) => {
        const mockUser = MOCK_USERS.find((u) => u.id === user.id)
        return {
          ...user,
          joinedAt: mockUser?.joinedAt ?? undefined,
        }
      })

      return usersWithTime
        .sort((a, b) => {
          if (!a.joinedAt && !b.joinedAt) return 0
          if (!a.joinedAt) return 1
          if (!b.joinedAt) return -1
          return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
        })
        .slice(0, 5)
    }

    // 真實 API 模式：按 joined_day 倒序
    return [...allUsers]
      .sort((a, b) => {
        if (!a.joined_day && !b.joined_day) return 0
        if (!a.joined_day) return 1
        if (!b.joined_day) return -1
        return new Date(b.joined_day).getTime() - new Date(a.joined_day).getTime()
      })
      .slice(0, 5)
  }, [allUsers])

  // 使用者角色數量統計（按角色數量分組）
  const roleStats = useMemo(() => {
    const stats: Record<string, number> = {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4+': 0,
    }

    allUsers.forEach((user) => {
      const count = user.roleCodes?.length ?? 0
      if (count === 0) {
        stats['0']++
      } else if (count === 1) {
        stats['1']++
      } else if (count === 2) {
        stats['2']++
      } else if (count === 3) {
        stats['3']++
      } else {
        stats['4+']++
      }
    })

    return stats
  }, [allUsers])

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
    loadAllUsers()
  }

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
            {/* 統計卡片 */}
            <div className='row g-5 g-xl-8 mb-5 mb-xl-10'>
              {/* 使用者總數 */}
              <div className='col-12 col-sm-6 col-xl-3'>
                <div className='card h-100'>
                  <div className='card-body d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='d-flex flex-column'>
                        <span className='text-muted fw-semibold fs-7'>使用者總數</span>
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

              {/* 啟用使用者 */}
              <div className='col-12 col-sm-6 col-xl-3'>
                <div className='card h-100'>
                  <div className='card-body d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='d-flex flex-column'>
                        <span className='text-muted fw-semibold fs-7'>啟用使用者</span>
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

              {/* 鎖定使用者 */}
              <div className='col-12 col-sm-6 col-xl-3'>
                <div className='card h-100'>
                  <div className='card-body d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='d-flex flex-column'>
                        <span className='text-muted fw-semibold fs-7'>鎖定使用者</span>
                        <span className='fw-bold fs-2 text-gray-900 mt-1'>
                          {statistics.locked}
                        </span>
                      </div>
                      <span className='badge badge-light-danger p-3'>
                        <KTIcon iconName='lock' className='fs-2' />
                      </span>
                    </div>

                    <div className='separator my-4'></div>

                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='text-muted fs-8'>平均角色數</span>
                      <span className='fw-bold text-gray-800'>
                        {statistics.avgRoles} 個/使用者
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 最近加入的使用者 */}
              <div className='col-12 col-sm-6 col-xl-3'>
                <div className='card h-100'>
                  <div className='card-body d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='d-flex flex-column'>
                        <span className='text-muted fw-semibold fs-7'>最近加入</span>
                        <span className='fw-bold fs-2 text-gray-900 mt-1'>
                          {recentUsers.length} 個
                        </span>
                      </div>
                      <span className='badge badge-light-warning p-3'>
                        <KTIcon iconName='time' className='fs-2' />
                      </span>
                    </div>

                    <div className='separator my-4'></div>

                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='text-muted fs-8'>加入時間</span>
                      <span className='fw-bold text-gray-800'>
                        {recentUsers.length > 0
                          ? formatDate(
                              shouldUseMockData()
                                ? MOCK_USERS.find((u) => u.id === recentUsers[0].id)?.joinedAt ?? undefined
                                : recentUsers[0].joined_day ?? undefined
                            )
                          : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='row g-5 g-xl-8'>
              {/* 使用者角色數量分布 */}
              <div className='col-12 col-xl-6'>
                <div className='card h-100'>
          <div className='card-header border-0 pt-6'>
                    <h3 className='card-title align-items-start flex-column'>
                      <span className='card-label fw-bold fs-3 mb-1'>角色數量分布</span>
                      <span className='text-muted mt-1 fw-semibold fs-7'>
                        各使用者擁有的角色數量統計
                      </span>
                    </h3>
                  </div>

                  <div className='card-body pt-0'>
                    <div className='table-responsive'>
                      <table className='table table-row-dashed table-row-gray-300 align-middle gs-0'>
                        <thead>
                          <tr className='fw-bold text-muted'>
                            <th className='min-w-150px'>角色數量</th>
                            <th className='min-w-100px text-end'>使用者數量</th>
                            <th className='min-w-150px'>比例</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(roleStats).map(([range, count]) => {
                            const percentage =
                              statistics.total > 0
                                ? Math.round((count / statistics.total) * 100)
                                : 0
                            return (
                              <tr key={range}>
                                <td>
                                  <span className='text-gray-800 fw-bold'>
                                    {range === '0'
                                      ? '無角色'
                                      : range === '4+'
                                        ? '4 個以上'
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

              {/* 最近加入的使用者 */}
              <div className='col-12 col-xl-6'>
                <div className='card h-100'>
                  <div className='card-header border-0 pt-6'>
                    <h3 className='card-title align-items-start flex-column'>
                      <span className='card-label fw-bold fs-3 mb-1'>最近加入的使用者</span>
                      <span className='text-muted mt-1 fw-semibold fs-7'>
                        最近加入的 5 個使用者
                      </span>
                    </h3>
                    <div className='card-toolbar'>
                      <button
                        type='button'
                        className='btn btn-sm btn-light-primary'
                        onClick={() => navigate('/upms/user/list')}
                      >
                        查看全部
                        <KTIcon iconName='arrow-right' className='fs-4 ms-1' />
                      </button>
                    </div>
                  </div>

                  <div className='card-body pt-0'>
                    {recentUsers.length === 0 ? (
                      <div className='text-center py-10 text-muted'>
                        <KTIcon iconName='information-5' className='fs-2x text-muted mb-3' />
                        <p className='mb-0'>尚無使用者資料</p>
                      </div>
                    ) : (
                      <div className='table-responsive'>
                        <table className='table table-row-dashed table-row-gray-300 align-middle gs-0'>
                          <thead>
                            <tr className='fw-bold text-muted'>
                              <th className='min-w-150px'>使用者名稱</th>
                              <th className='min-w-150px'>帳號</th>
                              <th className='min-w-100px'>角色數</th>
                              <th className='min-w-100px'>狀態</th>
                              <th className='min-w-100px text-end'>操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentUsers.map((user) => (
                              <tr key={user.id}>
                                <td>
                                  <span className='text-gray-800 fw-bold'>{user.name || user.username}</span>
                                </td>
                                <td>
                                  <span className='badge badge-light-info fs-7 fw-bold'>
                                    {user.username}
                                  </span>
                                </td>
                                <td>
                                  <span className='badge badge-light-primary'>
                                    {user.roleCodes?.length ?? 0}
                                  </span>
                                </td>
                                <td>{enabledBadge(user.enabled)}</td>
                                <td className='text-end'>
                                  <button
                                    type='button'
                                    className='btn btn-sm btn-light-primary'
                                    onClick={() => navigate(`/upms/user/${user.id}/detail`)}
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
                        onClick={() => navigate('/upms/user/create')}
                >
                        <KTIcon iconName='plus' className='fs-2 me-2' />
                  新增使用者
                </button>
                      <button
                        type='button'
                        className='btn btn-light-primary'
                        onClick={() => navigate('/upms/user/list')}
                      >
                        <KTIcon iconName='list' className='fs-2 me-2' />
                        查看所有使用者
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
