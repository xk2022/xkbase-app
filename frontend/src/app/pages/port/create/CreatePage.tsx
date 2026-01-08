// src/app/pages/port/create/CreatePage.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Content } from '@/_metronic/layout/components/content'
import { KTIcon } from '@/_metronic/helpers'

import { useAlert } from '@/app/pages/common/AlertType'
import { AppToolbar } from '@/app/pages/common/AppToolbar'

import { CreatePortReq } from '../Model'
import { createPort } from '../Query'

export function CreatePage() {
  const navigate = useNavigate()
  const { alert, showAlert, Alert } = useAlert()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreatePortReq>({
    code: '',
    name: '',
    address: '',
    contactPhone: '',
    contactEmail: '',
    description: '',
    status: 'active',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.code.trim() || !formData.name.trim() || !formData.address.trim()) {
      showAlert('請填寫必填欄位（代碼、名稱、地址）', 'danger')
      return
    }

    setLoading(true)
    try {
      const success = await createPort(formData, showAlert)
      if (success) {
        navigate('/port/list')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='建立港口'
        breadcrumbs={[
          { label: '港口整合', href: '#'},
          { label: '港口列表', href: '/port/list'},
          { label: '建立港口', active: true },
        ]}
      />

      <div className='flex-column-fluid'>
        <div className='card'>
          <div className='card-header border-0 pt-6'>
            <div className='card-title'>
              <h3 className='fw-bold m-0'>建立港口</h3>
            </div>
          </div>
          <div className='card-body pt-0'>
            <form onSubmit={handleSubmit}>
              <div className='row mb-7'>
                <label className='col-lg-4 fw-semibold text-muted required'>
                  港口代碼
                </label>
                <div className='col-lg-8'>
                  <input
                    type='text'
                    className='form-control form-control-solid'
                    placeholder='例如：TPE'
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
              </div>

              <div className='row mb-7'>
                <label className='col-lg-4 fw-semibold text-muted required'>
                  港口名稱
                </label>
                <div className='col-lg-8'>
                  <input
                    type='text'
                    className='form-control form-control-solid'
                    placeholder='例如：台北港'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className='row mb-7'>
                <label className='col-lg-4 fw-semibold text-muted required'>
                  地址
                </label>
                <div className='col-lg-8'>
                  <input
                    type='text'
                    className='form-control form-control-solid'
                    placeholder='完整地址'
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className='row mb-7'>
                <label className='col-lg-4 fw-semibold text-muted'>
                  聯絡電話
                </label>
                <div className='col-lg-8'>
                  <input
                    type='text'
                    className='form-control form-control-solid'
                    placeholder='例如：02-1234-5678'
                    value={formData.contactPhone || ''}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className='row mb-7'>
                <label className='col-lg-4 fw-semibold text-muted'>
                  聯絡信箱
                </label>
                <div className='col-lg-8'>
                  <input
                    type='email'
                    className='form-control form-control-solid'
                    placeholder='例如：contact@port.gov.tw'
                    value={formData.contactEmail || ''}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  />
                </div>
              </div>

              <div className='row mb-7'>
                <label className='col-lg-4 fw-semibold text-muted'>
                  描述
                </label>
                <div className='col-lg-8'>
                  <textarea
                    className='form-control form-control-solid'
                    rows={3}
                    placeholder='港口描述資訊'
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className='row mb-7'>
                <label className='col-lg-4 fw-semibold text-muted'>
                  狀態
                </label>
                <div className='col-lg-8'>
                  <select
                    className='form-select form-select-solid'
                    value={formData.status || 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value='active'>啟用</option>
                    <option value='inactive'>停用</option>
                    <option value='maintenance'>維護中</option>
                  </select>
                </div>
              </div>

              <div className='card-footer d-flex justify-content-end py-6 px-9'>
                <button
                  type='button'
                  className='btn btn-light me-3'
                  onClick={() => navigate('/port/list')}
                  disabled={loading}
                >
                  取消
                </button>
                <button
                  type='submit'
                  className='btn btn-primary'
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className='spinner-border spinner-border-sm me-2' />
                      建立中...
                    </>
                  ) : (
                    <>
                      <KTIcon iconName='check' className='fs-2' />
                      建立港口
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Content>
  )
}
