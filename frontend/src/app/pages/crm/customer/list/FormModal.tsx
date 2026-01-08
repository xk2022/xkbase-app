// src/app/pages/crm/customer/list/FormModal.tsx
import React, { useEffect, useState } from 'react'
import { KTIcon } from '@/_metronic/helpers'

import type { AlertType } from '@/app/pages/common/AlertType'
import type {
  CustomerListItem,
  CreateCustomerReq,
  UpdateCustomerReq,
  CustomerStatus,
} from '../../Model'
import { createCustomer, updateCustomer } from '../../Query'

type Props = {
  open: boolean
  onClose: () => void
  onSaved: () => void
  showAlert: (message: string, type: AlertType) => void
  editingCustomer: CustomerListItem | null // null = create, 非 null = edit
}

const normalizeText = (v: string) => v.trim()

export const FormModal: React.FC<Props> = ({
  open,
  onClose,
  onSaved,
  showAlert,
  editingCustomer,
}) => {
  const isEdit = !!editingCustomer

  // Form State
  const [companyName, setCompanyName] = useState('')
  const [companyCode, setCompanyCode] = useState('')
  const [taxId, setTaxId] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<CustomerStatus>('active')
  const [saving, setSaving] = useState(false)

  // Init / Reset
  useEffect(() => {
    if (!open) return

    if (!editingCustomer) {
      setCompanyName('')
      setCompanyCode('')
      setTaxId('')
      setPhone('')
      setEmail('')
      setAddress('')
      setWebsite('')
      setStatus('active')
      return
    }

    setCompanyName(editingCustomer.companyName || '')
    setCompanyCode(editingCustomer.companyCode || '')
    setTaxId(editingCustomer.taxId || '')
    setPhone(editingCustomer.phone || '')
    setEmail(editingCustomer.email || '')
    setAddress(editingCustomer.address || '')
    setStatus(editingCustomer.status || 'active')
  }, [open, editingCustomer])

  // Validation
  const validate = () => {
    if (!normalizeText(companyName)) {
      showAlert('請輸入公司名稱', 'warning')
      return false
    }

    return true
  }

  // Save
  const handleSave = async () => {
    if (!validate()) return

    try {
      setSaving(true)

      if (isEdit && editingCustomer) {
        const payload: UpdateCustomerReq = {
          companyName: normalizeText(companyName),
          companyCode: normalizeText(companyCode) || undefined,
          taxId: normalizeText(taxId) || undefined,
          phone: normalizeText(phone) || undefined,
          email: normalizeText(email) || undefined,
          address: normalizeText(address) || undefined,
          website: normalizeText(website) || undefined,
          status,
        }
        await updateCustomer(editingCustomer.id, payload, showAlert)
      } else {
        const payload: CreateCustomerReq = {
          companyName: normalizeText(companyName),
          companyCode: normalizeText(companyCode) || undefined,
          taxId: normalizeText(taxId) || undefined,
          phone: normalizeText(phone) || undefined,
          email: normalizeText(email) || undefined,
          address: normalizeText(address) || undefined,
          website: normalizeText(website) || undefined,
        }
        await createCustomer(payload, showAlert)
      }

      onSaved()
    } catch (e) {
      console.error(e)
      showAlert('儲存失敗，請稍後再試', 'danger')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div
      className='modal fade show d-block'
      tabIndex={-1}
      style={{ backgroundColor: 'rgba(0,0,0,.25)' }}
      role='dialog'
      aria-modal='true'
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          {/* Header */}
          <div className='modal-header'>
            <h5 className='modal-title'>
              <KTIcon
                iconName={isEdit ? 'message-edit' : 'plus'}
                className='fs-2 me-2'
              />
              {isEdit ? '編輯客戶' : '新增客戶'}
            </h5>

            <button
              type='button'
              className='btn btn-sm btn-light'
              onClick={onClose}
              disabled={saving}
              aria-label='Close'
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className='modal-body'>
            <div className='row g-5'>
              {/* Left */}
              <div className='col-12 col-md-6 d-flex flex-column gap-3'>
                <div>
                  <label className='form-label required'>公司名稱</label>
                  <input
                    className='form-control'
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder='請輸入公司名稱'
                    autoFocus={!isEdit}
                  />
                </div>

                <div>
                  <label className='form-label'>公司代碼</label>
                  <input
                    className='form-control'
                    value={companyCode}
                    onChange={(e) => setCompanyCode(e.target.value)}
                    placeholder='例如：ABC001'
                  />
                </div>

                <div>
                  <label className='form-label'>統一編號</label>
                  <input
                    className='form-control'
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder='例如：12345678'
                  />
                </div>

                <div>
                  <label className='form-label'>公司電話</label>
                  <input
                    className='form-control'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder='例如：02-1234-5678'
                  />
                </div>

                {isEdit && (
                  <div>
                    <label className='form-label'>狀態</label>
                    <select
                      className='form-select'
                      value={status}
                      onChange={(e) => setStatus(e.target.value as CustomerStatus)}
                    >
                      <option value='active'>啟用</option>
                      <option value='inactive'>停用</option>
                      <option value='suspended'>暫停</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Right */}
              <div className='col-12 col-md-6 d-flex flex-column gap-3'>
                <div>
                  <label className='form-label'>公司郵箱</label>
                  <input
                    className='form-control'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='例如：info@company.com'
                  />
                </div>

                <div>
                  <label className='form-label'>公司地址</label>
                  <textarea
                    className='form-control'
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder='請輸入公司地址'
                  />
                </div>

                <div>
                  <label className='form-label'>公司網站</label>
                  <input
                    className='form-control'
                    type='url'
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder='例如：https://www.company.com'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='modal-footer'>
            <button className='btn btn-light' onClick={onClose} disabled={saving}>
              取消
            </button>
            <button className='btn btn-primary' onClick={handleSave} disabled={saving}>
              {saving ? '儲存中…' : '儲存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
