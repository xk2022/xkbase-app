// src/app/pages/upms/permission/overview/OverviewPage.tsx
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {Content} from '@/_metronic/layout/components/content'
import {KTIcon} from '@/_metronic/helpers'
import {useAlert} from '@/app/pages/common/AlertType'
import {AppToolbar} from '@/app/pages/common/AppToolbar'

import {Permission} from '../Model'
import {fetchPermissions} from '../Query'

/**
 * ===============================================================
 * Permission Overview Page（權限總覽頁面）
 * ---------------------------------------------------------------
 * 職責：
 * - 顯示權限總數統計
 * - 各系統權限數量統計
 * - 最近建立的權限
 * ===============================================================
 */
export const OverviewPage: React.FC = () => {
  const navigate = useNavigate()
  const {alert, showAlert, Alert} = useAlert()

  const [loading, setLoading] = useState(true)
  const [permissions, setPermissions] = useState<Permission[]>([])

  const loadPermissions = useCallback(async () => {
    setLoading(true)
    try {
      const query = {
        page: 0,
        size: 1000, // 取得所有權限用於統計
      }
      const data = await fetchPermissions(query, showAlert)
      setPermissions(data.content || [])
    } catch (e) {
      console.error(e)
      showAlert('取得權限列表失敗', 'danger')
    } finally {
      setLoading(false)
    }
  }, [showAlert])

  useEffect(() => {
    loadPermissions()
  }, [loadPermissions])

  // 統計計算
  const stats = useMemo(() => {
    const total = permissions.length
    const enabled = permissions.filter((p) => p.enabled).length
    const disabled = total - enabled

    // 按系統分組統計
    const bySystem: Record<string, number> = {}
    permissions.forEach((p) => {
      bySystem[p.systemCode] = (bySystem[p.systemCode] || 0) + 1
    })

    // 最近建立的權限（按 createdTime 排序，取前 5 個）
    const recent = [...permissions]
      .sort((a, b) => {
        const timeA = a.createdTime ? new Date(a.createdTime).getTime() : 0
        const timeB = b.createdTime ? new Date(b.createdTime).getTime() : 0
        return timeB - timeA
      })
      .slice(0, 5)

    return {
      total,
      enabled,
      disabled,
      bySystem,
      recent,
    }
  }, [permissions])

  const formatDateTime = (ts?: string) => {
    if (!ts) return '-'
    try {
      const d = new Date(ts)
      if (Number.isNaN(d.getTime())) return ts
      return d.toLocaleString('zh-TW', {
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

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='權限總覽'
        breadcrumbs={[
          {label: '權限管理', href: '#', active: false},
          {label: '權限', active: false},
          {label: '總覽', active: true},
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
          <div className='row g-6'>
            {/* 統計卡片 */}
            <div className='col-12 col-lg-3'>
              <div className='card'>
                <div className='card-body'>
                  <div className='d-flex align-items-center'>
                    <div className='flex-grow-1'>
                      <span className='text-muted fw-semibold fs-7 d-block'>總權限數</span>
                      <span className='text-gray-800 fw-bold fs-2x'>{stats.total}</span>
                    </div>
                    <KTIcon iconName='shield-tick' className='fs-1 text-primary' />
                  </div>
                </div>
              </div>
            </div>

            <div className='col-12 col-lg-3'>
              <div className='card'>
                <div className='card-body'>
                  <div className='d-flex align-items-center'>
                    <div className='flex-grow-1'>
                      <span className='text-muted fw-semibold fs-7 d-block'>啟用中</span>
                      <span className='text-gray-800 fw-bold fs-2x'>{stats.enabled}</span>
                    </div>
                    <KTIcon iconName='check-circle' className='fs-1 text-success' />
                  </div>
                </div>
              </div>
            </div>

            <div className='col-12 col-lg-3'>
              <div className='card'>
                <div className='card-body'>
                  <div className='d-flex align-items-center'>
                    <div className='flex-grow-1'>
                      <span className='text-muted fw-semibold fs-7 d-block'>已停用</span>
                      <span className='text-gray-800 fw-bold fs-2x'>{stats.disabled}</span>
                    </div>
                    <KTIcon iconName='cross-circle' className='fs-1 text-danger' />
                  </div>
                </div>
              </div>
            </div>

            <div className='col-12 col-lg-3'>
              <div className='card'>
                <div className='card-body'>
                  <div className='d-flex align-items-center'>
                    <div className='flex-grow-1'>
                      <span className='text-muted fw-semibold fs-7 d-block'>系統數量</span>
                      <span className='text-gray-800 fw-bold fs-2x'>
                        {Object.keys(stats.bySystem).length}
                      </span>
                    </div>
                    <KTIcon iconName='element-11' className='fs-1 text-info' />
                  </div>
                </div>
              </div>
            </div>

            {/* 各系統權限數量統計 */}
            <div className='col-12 col-lg-6'>
              <div className='card'>
                <div className='card-header border-0 pt-6'>
                  <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bold fs-3 mb-1'>各系統權限數量</span>
                    <span className='text-muted mt-1 fw-semibold fs-7'>
                      依系統代碼分組統計
                    </span>
                  </h3>
                  <div className='card-toolbar'>
                    <button
                      type='button'
                      className='btn btn-sm btn-light-primary'
                      onClick={() => navigate('/upms/permission/list')}
                    >
                      查看全部
                      <KTIcon iconName='arrow-right' className='fs-4 ms-1' />
                    </button>
                  </div>
                </div>
                <div className='card-body pt-0'>
                  {Object.keys(stats.bySystem).length === 0 ? (
                    <div className='text-center py-10 text-muted'>
                      <KTIcon iconName='shield-tick' className='fs-2x text-muted mb-3' />
                      <p className='mb-0'>目前沒有權限資料</p>
                    </div>
                  ) : (
                    <div className='table-responsive'>
                      <table className='table table-row-dashed table-row-gray-300 align-middle gs-0'>
                        <thead>
                          <tr className='fw-bold text-muted'>
                            <th className='min-w-150px'>系統代碼</th>
                            <th className='min-w-100px text-end'>權限數量</th>
                            <th className='min-w-100px text-end'>操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(stats.bySystem)
                            .sort(([, a], [, b]) => b - a)
                            .map(([systemCode, count]) => (
                              <tr key={systemCode}>
                                <td>
                                  <span className='badge badge-light-info fs-6 fw-bold'>
                                    {systemCode}
                                  </span>
                                </td>
                                <td className='text-end'>
                                  <span className='text-gray-800 fw-bold'>{count}</span>
                                </td>
                                <td className='text-end'>
                                  <button
                                    type='button'
                                    className='btn btn-sm btn-light-primary'
                                    onClick={() =>
                                      navigate(`/upms/permission/list?systemCode=${systemCode}`)
                                    }
                                  >
                                    查看
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

            {/* 最近建立的權限 */}
            <div className='col-12 col-lg-6'>
              <div className='card'>
                <div className='card-header border-0 pt-6'>
                  <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bold fs-3 mb-1'>最近建立的權限</span>
                    <span className='text-muted mt-1 fw-semibold fs-7'>
                      顯示最近 5 筆建立的權限
                    </span>
                  </h3>
                  <div className='card-toolbar'>
                    <button
                      type='button'
                      className='btn btn-sm btn-light-primary'
                      onClick={() => navigate('/upms/permission/create')}
                    >
                      <KTIcon iconName='plus' className='fs-2' />
                      新增權限
                    </button>
                  </div>
                </div>
                <div className='card-body pt-0'>
                  {stats.recent.length === 0 ? (
                    <div className='text-center py-10 text-muted'>
                      <KTIcon iconName='shield-tick' className='fs-2x text-muted mb-3' />
                      <p className='mb-0'>目前沒有權限資料</p>
                      <button
                        type='button'
                        className='btn btn-sm btn-primary mt-3'
                        onClick={() => navigate('/upms/permission/create')}
                      >
                        立即建立權限
                      </button>
                    </div>
                  ) : (
                    <div className='table-responsive'>
                      <table className='table table-row-dashed table-row-gray-300 align-middle gs-0'>
                        <thead>
                          <tr className='fw-bold text-muted'>
                            <th className='min-w-200px'>權限代碼</th>
                            <th className='min-w-150px'>權限名稱</th>
                            <th className='min-w-100px'>系統</th>
                            <th className='min-w-150px'>建立時間</th>
                            <th className='min-w-100px text-end'>操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recent.map((permission) => (
                            <tr key={permission.id}>
                              <td>
                                <span className='badge badge-light-info fs-7 fw-bold'>
                                  {permission.code}
                                </span>
                              </td>
                              <td>
                                <span className='text-gray-800 fw-bold'>{permission.name}</span>
                              </td>
                              <td>
                                <span className='badge badge-light-primary fs-7'>
                                  {permission.systemCode}
                                </span>
                              </td>
                              <td>
                                <span className='text-muted fs-7'>
                                  {formatDateTime(permission.createdTime)}
                                </span>
                              </td>
                              <td className='text-end'>
                                <button
                                  type='button'
                                  className='btn btn-sm btn-light-primary'
                                  onClick={() =>
                                    navigate(`/upms/permission/${permission.id}/detail`)
                                  }
                                >
                                  查看詳情
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
        )}
      </div>
    </Content>
  )
}

export default OverviewPage
