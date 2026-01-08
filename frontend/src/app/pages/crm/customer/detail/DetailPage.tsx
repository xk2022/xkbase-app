// src/app/pages/crm/customer/detail/DetailPage.tsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { Content } from '@/_metronic/layout/components/content'
import { KTIcon } from '@/_metronic/helpers'

import { useAlert } from '@/app/pages/common/AlertType'
import { AppToolbar } from '@/app/pages/common/AppToolbar'
import { Error500WithLayout } from '@/app/pages/common/Error500WithLayout'
import { ApiError } from '@/app/pages/common/ApiError'
import { enableTempMockData } from '@/shared/utils/useMockData'

import type { CustomerDetail } from '../../Model'
import { fetchCustomerDetail } from '../../Query'

/**
 * ===============================================================
 * DetailPage（客戶詳情頁）
 * ===============================================================
 */
export function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { alert, showAlert, Alert } = useAlert()

  const [customer, setCustomer] = useState<CustomerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showError500, setShowError500] = useState(false)

  useEffect(() => {
    if (!id) {
      showAlert('缺少客戶 ID', 'danger')
      navigate('/crm/customer/list')
      return
    }

    loadCustomerDetail()
  }, [id])

  const loadCustomerDetail = async () => {
    if (!id) return

    setLoading(true)
    setShowError500(false)

    try {
      const data = await fetchCustomerDetail(id, showAlert)
      setCustomer(data)
    } catch (error) {
      const apiError = ApiError.fromAxiosError(error)
      if (apiError.isServerError) {
        setShowError500(true)
      } else {
        showAlert('取得客戶詳情失敗，請稍後再試', 'danger')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUseMockData = () => {
    enableTempMockData()
    setShowError500(false)
    loadCustomerDetail()
  }

  const handleRetry = () => {
    setShowError500(false)
    loadCustomerDetail()
  }

  if (showError500) {
    return (
      <Content>
        <Error500WithLayout
          onRetry={handleRetry}
          showMockOption={true}
          onUseMock={handleUseMockData}
        />
      </Content>
    )
  }

  if (loading) {
    return (
      <Content>
        <AppToolbar
          title='客戶詳情'
          breadcrumbs={[
            { label: 'CRM 客戶管理', href: '#'},
            { label: '客戶詳情', active: true },
          ]}
        />
        <div className='flex-column-fluid'>
          <div className='card'>
            <div className='card-body text-center py-10'>
              <div className='spinner-border text-primary' role='status'>
                <span className='visually-hidden'>載入中…</span>
              </div>
            </div>
          </div>
        </div>
      </Content>
    )
  }

  if (!customer) {
    return (
      <Content>
        <AppToolbar
          title='客戶詳情'
          breadcrumbs={[
            { label: 'CRM 客戶管理', href: '#'},
            { label: '客戶詳情', active: true },
          ]}
        />
        <div className='flex-column-fluid'>
          <div className='card'>
            <div className='card-body text-center py-10'>
              <p className='text-muted'>找不到客戶資料</p>
              <button
                className='btn btn-primary'
                onClick={() => navigate('/crm/customer/list')}
              >
                返回列表
              </button>
            </div>
          </div>
        </div>
      </Content>
    )
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-light-success'
      case 'inactive':
        return 'badge-light-secondary'
      case 'suspended':
        return 'badge-light-warning'
      default:
        return 'badge-light-secondary'
    }
  }

  const statusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '啟用'
      case 'inactive':
        return '停用'
      case 'suspended':
        return '暫停'
      default:
        return status
    }
  }

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='客戶詳情'
        breadcrumbs={[
          { label: 'CRM 客戶管理', href: '/crm/customer/list'},
          { label: '客戶詳情', active: true },
        ]}
      />

      <div className='flex-column-fluid'>
        <div className='card'>
          <div className='card-header border-0 pt-6'>
            <div className='card-title'>
              <h3 className='fw-bold m-0'>{customer.companyName}</h3>
            </div>
            <div className='card-toolbar'>
              <button
                className='btn btn-sm btn-light'
                onClick={() => navigate('/crm/customer/list')}
              >
                返回列表
              </button>
            </div>
          </div>

          <div className='card-body'>
            <div className='row g-5'>
              {/* 基本資訊 */}
              <div className='col-12 col-lg-6'>
                <div className='card card-flush h-100'>
                  <div className='card-header pt-5'>
                    <h3 className='card-title align-items-start flex-column'>
                      <span className='card-label fw-bold fs-3 mb-1'>基本資訊</span>
                    </h3>
                  </div>
                  <div className='card-body pt-0'>
                    <div className='table-responsive'>
                      <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
                        <tbody>
                          <tr>
                            <td className='text-gray-600 fw-bold min-w-150px'>公司名稱</td>
                            <td className='text-gray-800'>{customer.companyName}</td>
                          </tr>
                          {customer.companyCode && (
                            <tr>
                              <td className='text-gray-600 fw-bold'>公司代碼</td>
                              <td className='text-gray-800'>{customer.companyCode}</td>
                            </tr>
                          )}
                          {customer.taxId && (
                            <tr>
                              <td className='text-gray-600 fw-bold'>統一編號</td>
                              <td className='text-gray-800'>{customer.taxId}</td>
                            </tr>
                          )}
                          <tr>
                            <td className='text-gray-600 fw-bold'>狀態</td>
                            <td>
                              <span className={`badge ${statusBadge(customer.status)} fw-bold`}>
                                {statusLabel(customer.status)}
                              </span>
                            </td>
                          </tr>
                          {customer.phone && (
                            <tr>
                              <td className='text-gray-600 fw-bold'>公司電話</td>
                              <td className='text-gray-800'>
                                <KTIcon iconName='phone' className='fs-7 me-1' />
                                {customer.phone}
                              </td>
                            </tr>
                          )}
                          {customer.email && (
                            <tr>
                              <td className='text-gray-600 fw-bold'>公司郵箱</td>
                              <td className='text-gray-800'>
                                <KTIcon iconName='sms' className='fs-7 me-1' />
                                {customer.email}
                              </td>
                            </tr>
                          )}
                          {customer.address && (
                            <tr>
                              <td className='text-gray-600 fw-bold'>公司地址</td>
                              <td className='text-gray-800'>{customer.address}</td>
                            </tr>
                          )}
                          {customer.website && (
                            <tr>
                              <td className='text-gray-600 fw-bold'>公司網站</td>
                              <td className='text-gray-800'>
                                <a href={customer.website} target='_blank' rel='noopener noreferrer'>
                                  {customer.website}
                                </a>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* 聯絡人資訊 */}
              <div className='col-12 col-lg-6'>
                <div className='card card-flush h-100'>
                  <div className='card-header pt-5'>
                    <h3 className='card-title align-items-start flex-column'>
                      <span className='card-label fw-bold fs-3 mb-1'>聯絡人資訊</span>
                      <span className='text-muted pt-1 fw-semibold fs-7'>
                        共 {customer.contacts?.length || 0} 位聯絡人
                      </span>
                    </h3>
                  </div>
                  <div className='card-body pt-0'>
                    {customer.contacts && customer.contacts.length > 0 ? (
                      <div className='table-responsive'>
                        <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
                          <thead>
                            <tr className='text-gray-600 fw-bold fs-7 text-uppercase'>
                              <th>姓名</th>
                              <th>職稱</th>
                              <th>聯絡方式</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customer.contacts.map((contact) => (
                              <tr key={contact.id || contact.name}>
                                <td>
                                  <div className='d-flex align-items-center'>
                                    {contact.name}
                                    {contact.isPrimary && (
                                      <span className='badge badge-light-primary ms-2'>主要</span>
                                    )}
                                  </div>
                                </td>
                                <td>{contact.title || '-'}</td>
                                <td>
                                  <div className='d-flex flex-column gap-1'>
                                    {contact.phone && (
                                      <span className='text-gray-600 fs-7'>
                                        <KTIcon iconName='phone' className='fs-7 me-1' />
                                        {contact.phone}
                                      </span>
                                    )}
                                    {contact.mobile && (
                                      <span className='text-gray-600 fs-7'>
                                        <KTIcon iconName='phone' className='fs-7 me-1' />
                                        {contact.mobile}
                                      </span>
                                    )}
                                    {contact.email && (
                                      <span className='text-gray-600 fs-7'>
                                        <KTIcon iconName='sms' className='fs-7 me-1' />
                                        {contact.email}
                                      </span>
                                    )}
                                    {!contact.phone && !contact.mobile && !contact.email && (
                                      <span className='text-muted fs-7'>-</span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className='text-center text-muted py-10'>
                        <p>尚無聯絡人資料</p>
                      </div>
                    )}
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
