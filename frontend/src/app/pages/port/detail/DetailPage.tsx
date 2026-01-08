// src/app/pages/port/detail/DetailPage.tsx
import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'

import { Content } from '@/_metronic/layout/components/content'
import { KTIcon } from '@/_metronic/helpers'
import { useAlert } from '@/app/pages/common/AlertType'
import { Error500WithLayout } from '@/app/pages/common/Error500WithLayout'
import { MockDataDialog } from '@/app/pages/common/MockDataDialog'
import { ApiError } from '@/app/pages/common/ApiError'
import { enableTempMockData } from '@/shared/utils/useMockData'

import type { PortDetail, EntryTimeRule, PortOperationRule } from '../Model'
import { fetchPortDetail } from '../Query'

import { AppToolbar } from '@/app/pages/common/AppToolbar'

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { alert, showAlert, Alert } = useAlert()

  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<PortDetail | null>(null)

  // 錯誤處理狀態
  const [showError500, setShowError500] = useState(false)
  const [showMockDialog, setShowMockDialog] = useState(false)

  const loadDetail = useCallback(async () => {
    if (!id) {
      setDetail(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setShowError500(false)
    try {
      const data = await fetchPortDetail(id, showAlert)
      setDetail(data)
    } catch (error) {
      console.error(error)
      
      // 檢查是否為 API 500 錯誤
      const apiError = ApiError.fromAxiosError(error)
      if (apiError.isServerError) {
        setShowError500(true)
        setShowMockDialog(true)
      } else {
        // 其他錯誤，顯示提示
        showAlert('取得港口詳情失敗', 'danger')
        setDetail(null)
      }
    } finally {
      setLoading(false)
    }
  }, [id, showAlert])

  const handleUseMockData = useCallback(() => {
    enableTempMockData()
    setShowMockDialog(false)
    setShowError500(false)
    // 重新載入數據
    loadDetail()
  }, [loadDetail])

  const handleRetry = useCallback(() => {
    setShowError500(false)
    loadDetail()
  }, [loadDetail])

  useEffect(() => {
    loadDetail()
  }, [loadDetail])

  // 如果顯示 500 錯誤頁面
  if (showError500) {
    return (
      <>
        <Error500WithLayout
          onRetry={handleRetry}
          showMockOption={true}
          onUseMock={handleUseMockData}
        />
        <MockDataDialog
          open={showMockDialog}
          onConfirm={handleUseMockData}
          onCancel={() => setShowMockDialog(false)}
        />
      </>
    )
  }

  if (loading) {
    return (
      <Content>
        <AppToolbar
          title='港口詳情'
          breadcrumbs={[
            { label: '港口整合', href: '#'},
            { label: '港口列表', href: '/port/list'},
            { label: '港口詳情', active: true },
          ]}
        />
        <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '400px' }}>
          <Spinner animation='border' variant='primary' />
        </div>
      </Content>
    )
  }

  if (!detail) {
    return (
      <Content>
        <AppToolbar
          title='港口詳情'
          breadcrumbs={[
            { label: '港口整合', href: '#'},
            { label: '港口列表', href: '/port/list'},
            { label: '港口詳情', active: true },
          ]}
        />
        <div className='card'>
          <div className='card-body text-center py-10'>
            <p className='text-gray-600'>找不到港口資料</p>
            <button
              className='btn btn-primary'
              onClick={() => navigate('/port/list')}
            >
              返回列表
            </button>
          </div>
        </div>
      </Content>
    )
  }

  const { port, entryTimeRules, operationRules } = detail

  const statusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return { label: '啟用', className: 'badge-light-success' }
      case 'inactive':
        return { label: '停用', className: 'badge-light-danger' }
      case 'maintenance':
        return { label: '維護中', className: 'badge-light-warning' }
      default:
        return { label: status, className: 'badge-light-secondary' }
    }
  }

  const dayOfWeekLabel = (day: string) => {
    const map: Record<string, string> = {
      monday: '星期一',
      tuesday: '星期二',
      wednesday: '星期三',
      thursday: '星期四',
      friday: '星期五',
      saturday: '星期六',
      sunday: '星期日',
    }
    return map[day] || day
  }

  const operationTypeLabel = (type: string) => {
    switch (type) {
      case 'loading':
        return '裝貨'
      case 'unloading':
        return '卸貨'
      case 'both':
        return '裝卸貨'
      default:
        return type
    }
  }

  const statusInfo = statusLabel(port.status)

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='港口詳情'
        breadcrumbs={[
          { label: '港口整合', href: '#'},
          { label: '港口列表', href: '/port/list'},
          { label: port.name, active: true },
        ]}
      />

      <div className='flex-column-fluid'>
        {/* 港口基本資訊 */}
        <div className='card mb-5'>
          <div className='card-header border-0 pt-6'>
            <div className='card-title'>
              <h3 className='fw-bold m-0'>港口基本資訊</h3>
            </div>
            <div className='card-toolbar'>
              <button
                type='button'
                className='btn btn-sm btn-primary'
                onClick={() => navigate(`/port/${port.id}/edit`)}
              >
                <KTIcon iconName='pencil' className='fs-2' />
                編輯
              </button>
            </div>
          </div>
          <div className='card-body pt-0'>
            <div className='row mb-7'>
              <label className='col-lg-4 fw-semibold text-muted'>港口代碼</label>
              <div className='col-lg-8'>
                <span className='fw-bold fs-6 text-gray-800'>{port.code}</span>
              </div>
            </div>
            <div className='row mb-7'>
              <label className='col-lg-4 fw-semibold text-muted'>港口名稱</label>
              <div className='col-lg-8'>
                <span className='fw-bold fs-6 text-gray-800'>{port.name}</span>
              </div>
            </div>
            <div className='row mb-7'>
              <label className='col-lg-4 fw-semibold text-muted'>地址</label>
              <div className='col-lg-8'>
                <span className='fw-bold fs-6 text-gray-800'>{port.address}</span>
              </div>
            </div>
            {port.contactPhone && (
              <div className='row mb-7'>
                <label className='col-lg-4 fw-semibold text-muted'>聯絡電話</label>
                <div className='col-lg-8'>
                  <span className='fw-bold fs-6 text-gray-800'>{port.contactPhone}</span>
                </div>
              </div>
            )}
            {port.contactEmail && (
              <div className='row mb-7'>
                <label className='col-lg-4 fw-semibold text-muted'>聯絡信箱</label>
                <div className='col-lg-8'>
                  <span className='fw-bold fs-6 text-gray-800'>{port.contactEmail}</span>
                </div>
              </div>
            )}
            <div className='row mb-7'>
              <label className='col-lg-4 fw-semibold text-muted'>狀態</label>
              <div className='col-lg-8'>
                <span className={`badge ${statusInfo.className} fs-7 fw-bold`}>
                  {statusInfo.label}
                </span>
              </div>
            </div>
            {port.description && (
              <div className='row mb-7'>
                <label className='col-lg-4 fw-semibold text-muted'>描述</label>
                <div className='col-lg-8'>
                  <span className='fw-bold fs-6 text-gray-800'>{port.description}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 進場時段規則 */}
        <div className='card mb-5'>
          <div className='card-header border-0 pt-6'>
            <div className='card-title'>
              <h3 className='fw-bold m-0'>進場時段規則</h3>
            </div>
            <div className='card-toolbar'>
              <button
                type='button'
                className='btn btn-sm btn-primary'
                onClick={() => navigate(`/port/${port.id}/entry-time-rules/create`)}
              >
                <KTIcon iconName='plus' className='fs-2' />
                新增規則
              </button>
            </div>
          </div>
          <div className='card-body pt-0'>
            {entryTimeRules.length === 0 ? (
              <div className='text-center py-10'>
                <p className='text-gray-600'>尚無進場時段規則</p>
              </div>
            ) : (
              <div className='table-responsive'>
                <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
                  <thead>
                    <tr className='fw-bold text-muted'>
                      <th className='min-w-120px'>星期</th>
                      <th className='min-w-120px'>開始時間</th>
                      <th className='min-w-120px'>結束時間</th>
                      <th className='min-w-120px text-end'>容量限制</th>
                      <th className='min-w-100px text-end'>已使用</th>
                      <th className='min-w-100px'>狀態</th>
                      <th className='min-w-150px text-end'>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entryTimeRules.map((rule) => (
                      <tr key={rule.id}>
                        <td>
                          <span className='text-gray-800 fw-bold'>{dayOfWeekLabel(rule.dayOfWeek)}</span>
                        </td>
                        <td>
                          <span className='text-gray-600'>{rule.startTime}</span>
                        </td>
                        <td>
                          <span className='text-gray-600'>{rule.endTime}</span>
                        </td>
                        <td className='text-end'>
                          <span className='text-gray-800 fw-bold'>{rule.maxCapacity}</span>
                        </td>
                        <td className='text-end'>
                          <span className='text-gray-600'>{rule.currentCapacity || 0}</span>
                        </td>
                        <td>
                          <span className={`badge ${rule.isActive ? 'badge-light-success' : 'badge-light-danger'} fs-7 fw-bold`}>
                            {rule.isActive ? '啟用' : '停用'}
                          </span>
                        </td>
                        <td className='text-end'>
                          <button
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                            onClick={() => navigate(`/port/${port.id}/entry-time-rules/${rule.id}/edit`)}
                            title='編輯'
                          >
                            <KTIcon iconName='pencil' className='fs-3' />
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

        {/* 港口作業規則 */}
        <div className='card mb-5'>
          <div className='card-header border-0 pt-6'>
            <div className='card-title'>
              <h3 className='fw-bold m-0'>港口作業規則</h3>
            </div>
            <div className='card-toolbar'>
              <button
                type='button'
                className='btn btn-sm btn-primary'
                onClick={() => navigate(`/port/${port.id}/operation-rules/create`)}
              >
                <KTIcon iconName='plus' className='fs-2' />
                新增規則
              </button>
            </div>
          </div>
          <div className='card-body pt-0'>
            {operationRules.length === 0 ? (
              <div className='text-center py-10'>
                <p className='text-gray-600'>尚無港口作業規則</p>
              </div>
            ) : (
              <div className='table-responsive'>
                <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
                  <thead>
                    <tr className='fw-bold text-muted'>
                      <th className='min-w-120px'>作業類型</th>
                      <th className='min-w-200px'>貨櫃類型限制</th>
                      <th className='min-w-120px text-end'>最大同時作業數</th>
                      <th className='min-w-200px'>特殊要求</th>
                      <th className='min-w-100px'>狀態</th>
                      <th className='min-w-150px text-end'>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {operationRules.map((rule) => (
                      <tr key={rule.id}>
                        <td>
                          <span className='text-gray-800 fw-bold'>{operationTypeLabel(rule.operationType)}</span>
                        </td>
                        <td>
                          <div className='d-flex flex-wrap gap-2'>
                            {rule.containerTypeLimits.map((limit, idx) => (
                              <span
                                key={idx}
                                className={`badge ${limit.isAllowed ? 'badge-light-success' : 'badge-light-danger'} fs-7`}
                              >
                                {limit.containerType}
                                {limit.maxWeight && ` (${limit.maxWeight}噸)`}
                                {limit.maxHeight && ` H:${limit.maxHeight}m`}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className='text-end'>
                          <span className='text-gray-800 fw-bold'>{rule.maxConcurrentOperations || '-'}</span>
                        </td>
                        <td>
                          <span className='text-gray-600'>{rule.specialRequirements || '-'}</span>
                        </td>
                        <td>
                          <span className={`badge ${rule.isActive ? 'badge-light-success' : 'badge-light-danger'} fs-7 fw-bold`}>
                            {rule.isActive ? '啟用' : '停用'}
                          </span>
                        </td>
                        <td className='text-end'>
                          <button
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                            onClick={() => navigate(`/port/${port.id}/operation-rules/${rule.id}/edit`)}
                            title='編輯'
                          >
                            <KTIcon iconName='pencil' className='fs-3' />
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
    </Content>
  )
}
