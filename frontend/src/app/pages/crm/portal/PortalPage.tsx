// src/app/pages/crm/portal/PortalPage.tsx
import React, { useState } from 'react'

import { Content } from '@/_metronic/layout/components/content'
import { KTIcon } from '@/_metronic/helpers'

import { useAlert } from '@/app/pages/common/AlertType'
import { AppToolbar } from '@/app/pages/common/AppToolbar'

import type { ContainerProgress, CreateBookingReq } from '../Model'
import { fetchContainerProgress, createBooking } from '../Query'

/**
 * ===============================================================
 * PortalPage（客戶入口頁面）
 * ===============================================================
 */
export function PortalPage() {
  const { alert, showAlert, Alert } = useAlert()

  // 貨櫃進度查詢
  const [containerNo, setContainerNo] = useState('')
  const [containerProgress, setContainerProgress] = useState<ContainerProgress | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(false)

  // 線上提單
  const [bookingForm, setBookingForm] = useState<CreateBookingReq>({
    customerId: '',
    containerNo: '',
    pickupAddress: '',
    deliveryAddress: '',
    pickupDate: '',
    deliveryDate: '',
    containerType: '',
    note: '',
  })
  const [submittingBooking, setSubmittingBooking] = useState(false)

  const handleSearchProgress = async () => {
    if (!containerNo.trim()) {
      showAlert('請輸入貨櫃號', 'warning')
      return
    }

    setLoadingProgress(true)
    try {
      const progress = await fetchContainerProgress(containerNo.trim(), showAlert)
      setContainerProgress(progress)
      if (!progress) {
        showAlert('找不到該貨櫃的進度資訊', 'warning')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingProgress(false)
    }
  }

  const handleSubmitBooking = async () => {
    if (!bookingForm.customerId.trim()) {
      showAlert('請輸入客戶 ID', 'warning')
      return
    }
    if (!bookingForm.containerNo.trim()) {
      showAlert('請輸入貨櫃號', 'warning')
      return
    }
    if (!bookingForm.pickupAddress.trim()) {
      showAlert('請輸入提貨地址', 'warning')
      return
    }
    if (!bookingForm.deliveryAddress.trim()) {
      showAlert('請輸入送貨地址', 'warning')
      return
    }
    if (!bookingForm.pickupDate.trim()) {
      showAlert('請選擇提貨日期', 'warning')
      return
    }

    setSubmittingBooking(true)
    try {
      const result = await createBooking(bookingForm, showAlert)
      if (result) {
        showAlert(`提單建立成功！提單編號：${result.bookingNo}`, 'success')
        // 重置表單
        setBookingForm({
          customerId: '',
          containerNo: '',
          pickupAddress: '',
          deliveryAddress: '',
          pickupDate: '',
          deliveryDate: '',
          containerType: '',
          note: '',
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSubmittingBooking(false)
    }
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'badge-light-warning'
      case 'in_transit':
        return 'badge-light-primary'
      case 'arrived':
        return 'badge-light-info'
      case 'delivered':
        return 'badge-light-success'
      case 'returned':
        return 'badge-light-secondary'
      default:
        return 'badge-light-secondary'
    }
  }

  const statusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return '待處理'
      case 'in_transit':
        return '運送中'
      case 'arrived':
        return '已到達'
      case 'delivered':
        return '已交付'
      case 'returned':
        return '已歸還'
      default:
        return status
    }
  }

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='客戶入口'
        breadcrumbs={[
          { label: 'CRM 客戶管理', href: '#'},
          { label: '客戶入口', active: true },
        ]}
      />

      <div className='flex-column-fluid'>
        <div className='row g-5'>
          {/* 貨櫃進度查詢 */}
          <div className='col-12 col-lg-6'>
            <div className='card'>
              <div className='card-header'>
                <h3 className='card-title align-items-start flex-column'>
                  <span className='card-label fw-bold fs-3 mb-1'>貨櫃進度查詢</span>
                  <span className='text-muted pt-1 fw-semibold fs-7'>
                    輸入貨櫃號查詢即時進度
                  </span>
                </h3>
              </div>
              <div className='card-body'>
                <div className='mb-5'>
                  <label className='form-label required'>貨櫃號</label>
                  <div className='d-flex gap-2'>
                    <input
                      className='form-control'
                      value={containerNo}
                      onChange={(e) => setContainerNo(e.target.value)}
                      placeholder='例如：TGHU1234567'
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearchProgress()
                        }
                      }}
                    />
                    <button
                      className='btn btn-primary'
                      onClick={handleSearchProgress}
                      disabled={loadingProgress}
                    >
                      {loadingProgress ? '查詢中…' : '查詢'}
                    </button>
                  </div>
                </div>

                {containerProgress && (
                  <div className='card card-flush bg-light'>
                    <div className='card-body'>
                      <h5 className='fw-bold mb-4'>查詢結果</h5>
                      <div className='table-responsive'>
                        <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
                          <tbody>
                            <tr>
                              <td className='text-gray-600 fw-bold min-w-150px'>貨櫃號</td>
                              <td className='text-gray-800'>{containerProgress.containerNo}</td>
                            </tr>
                            <tr>
                              <td className='text-gray-600 fw-bold'>訂單編號</td>
                              <td className='text-gray-800'>{containerProgress.orderNo}</td>
                            </tr>
                            <tr>
                              <td className='text-gray-600 fw-bold'>狀態</td>
                              <td>
                                <span className={`badge ${statusBadge(containerProgress.status)} fw-bold`}>
                                  {statusLabel(containerProgress.status)}
                                </span>
                              </td>
                            </tr>
                            {containerProgress.currentLocation && (
                              <tr>
                                <td className='text-gray-600 fw-bold'>當前位置</td>
                                <td className='text-gray-800'>{containerProgress.currentLocation}</td>
                              </tr>
                            )}
                            {containerProgress.pickupDate && (
                              <tr>
                                <td className='text-gray-600 fw-bold'>提貨日期</td>
                                <td className='text-gray-800'>
                                  {new Date(containerProgress.pickupDate).toLocaleDateString('zh-TW')}
                                </td>
                              </tr>
                            )}
                            {containerProgress.estimatedDeliveryDate && (
                              <tr>
                                <td className='text-gray-600 fw-bold'>預計交付日期</td>
                                <td className='text-gray-800'>
                                  {new Date(containerProgress.estimatedDeliveryDate).toLocaleDateString('zh-TW')}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {containerProgress.trackingEvents && containerProgress.trackingEvents.length > 0 && (
                        <div className='mt-5'>
                          <h6 className='fw-bold mb-3'>追蹤事件</h6>
                          <div className='timeline timeline-border-dashed'>
                            {containerProgress.trackingEvents.map((event) => (
                              <div key={event.id} className='timeline-item'>
                                <div className='timeline-line w-40px'></div>
                                <div className='timeline-icon symbol symbol-circle symbol-40px'>
                                  <div className='symbol-label bg-light'>
                                    <KTIcon iconName='check' className='fs-2 text-primary' />
                                  </div>
                                </div>
                                <div className='timeline-content mb-10 mt-n1'>
                                  <div className='pe-3 mb-5'>
                                    <div className='fs-5 fw-semibold mb-2'>{event.description}</div>
                                    <div className='d-flex align-items-center mb-3'>
                                      <span className='text-muted me-2 fs-7'>
                                        {new Date(event.time).toLocaleString('zh-TW')}
                                      </span>
                                      {event.location && (
                                        <>
                                          <span className='text-muted me-2'>•</span>
                                          <span className='text-muted fs-7'>
                                            <KTIcon iconName='geolocation' className='fs-7 me-1' />
                                            {event.location}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                    {event.operator && (
                                      <span className='badge badge-light-primary fs-7'>
                                        {event.operator}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 線上提單 */}
          <div className='col-12 col-lg-6'>
            <div className='card'>
              <div className='card-header'>
                <h3 className='card-title align-items-start flex-column'>
                  <span className='card-label fw-bold fs-3 mb-1'>線上提單</span>
                  <span className='text-muted pt-1 fw-semibold fs-7'>
                    填寫提單資訊建立新訂單
                  </span>
                </h3>
              </div>
              <div className='card-body'>
                <div className='row g-5'>
                  <div className='col-12'>
                    <label className='form-label required'>客戶 ID</label>
                    <input
                      className='form-control'
                      value={bookingForm.customerId}
                      onChange={(e) => setBookingForm({ ...bookingForm, customerId: e.target.value })}
                      placeholder='請輸入客戶 ID'
                    />
                  </div>
                  <div className='col-12'>
                    <label className='form-label required'>貨櫃號</label>
                    <input
                      className='form-control'
                      value={bookingForm.containerNo}
                      onChange={(e) => setBookingForm({ ...bookingForm, containerNo: e.target.value })}
                      placeholder='例如：TGHU1234567'
                    />
                  </div>
                  <div className='col-12'>
                    <label className='form-label required'>提貨地址</label>
                    <textarea
                      className='form-control'
                      rows={2}
                      value={bookingForm.pickupAddress}
                      onChange={(e) => setBookingForm({ ...bookingForm, pickupAddress: e.target.value })}
                      placeholder='請輸入提貨地址'
                    />
                  </div>
                  <div className='col-12'>
                    <label className='form-label required'>送貨地址</label>
                    <textarea
                      className='form-control'
                      rows={2}
                      value={bookingForm.deliveryAddress}
                      onChange={(e) => setBookingForm({ ...bookingForm, deliveryAddress: e.target.value })}
                      placeholder='請輸入送貨地址'
                    />
                  </div>
                  <div className='col-12 col-md-6'>
                    <label className='form-label required'>提貨日期</label>
                    <input
                      className='form-control'
                      type='date'
                      value={bookingForm.pickupDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, pickupDate: e.target.value })}
                    />
                  </div>
                  <div className='col-12 col-md-6'>
                    <label className='form-label'>送貨日期</label>
                    <input
                      className='form-control'
                      type='date'
                      value={bookingForm.deliveryDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, deliveryDate: e.target.value })}
                    />
                  </div>
                  <div className='col-12'>
                    <label className='form-label'>貨櫃類型</label>
                    <input
                      className='form-control'
                      value={bookingForm.containerType}
                      onChange={(e) => setBookingForm({ ...bookingForm, containerType: e.target.value })}
                      placeholder='例如：20呎、40呎'
                    />
                  </div>
                  <div className='col-12'>
                    <label className='form-label'>備註</label>
                    <textarea
                      className='form-control'
                      rows={3}
                      value={bookingForm.note}
                      onChange={(e) => setBookingForm({ ...bookingForm, note: e.target.value })}
                      placeholder='可選'
                    />
                  </div>
                  <div className='col-12'>
                    <button
                      className='btn btn-primary w-100'
                      onClick={handleSubmitBooking}
                      disabled={submittingBooking}
                    >
                      {submittingBooking ? '提交中…' : '提交提單'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Content>
  )
}
