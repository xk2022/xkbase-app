// src/app/pages/hrm/driver/list/FormModal.tsx
import React, { useEffect, useState } from 'react'
import { KTIcon } from '@/_metronic/helpers'

import type { AlertType } from '@/app/pages/common/AlertType'
import type {
  CreateDriverReq,
  DriverListItem,
  UpdateDriverReq,
} from '../Model'
import { createDriver, updateDriver } from '../Query'

type Props = {
  open: boolean
  onClose: () => void
  onSaved: () => void
  showAlert: (message: string, type: AlertType) => void
  editingDriver: DriverListItem | null
}

const normalizeText = (v: string) => v.trim()

export const FormModal: React.FC<Props> = ({
  open,
  onClose,
  onSaved,
  showAlert,
  editingDriver,
}) => {
  const isEdit = !!editingDriver

  const [name, setName] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [licenseType, setLicenseType] = useState('')
  const [licenseExpiryDate, setLicenseExpiryDate] = useState('')
  const [qualificationCert, setQualificationCert] = useState('')
  const [qualificationExpiryDate, setQualificationExpiryDate] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [emergencyContact, setEmergencyContact] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return

    if (!editingDriver) {
      setName('')
      setLicenseNumber('')
      setLicenseType('')
      setLicenseExpiryDate('')
      setQualificationCert('')
      setQualificationExpiryDate('')
      setPhone('')
      setEmail('')
      setAddress('')
      setEmergencyContact('')
      setEmergencyPhone('')
      setNotes('')
      return
    }

    setName(editingDriver.name || '')
    setLicenseNumber(editingDriver.licenseNumber || '')
    setLicenseType(editingDriver.licenseType || '')
    setLicenseExpiryDate(editingDriver.licenseExpiryDate || '')
    setQualificationCert(editingDriver.qualificationCert || '')
    setQualificationExpiryDate(editingDriver.qualificationExpiryDate || '')
    setPhone(editingDriver.phone || '')
    setEmail(editingDriver.email || '')
  }, [open, editingDriver])

  const validate = () => {
    if (!normalizeText(name)) {
      showAlert('請輸入姓名', 'warning')
      return false
    }

    if (!normalizeText(licenseNumber)) {
      showAlert('請輸入駕照號碼', 'warning')
      return false
    }

    if (!normalizeText(licenseType)) {
      showAlert('請輸入駕照類型', 'warning')
      return false
    }

    return true
  }

  const handleSave = async () => {
    if (!validate()) return

    try {
      setSaving(true)

      if (isEdit && editingDriver) {
        const payload: UpdateDriverReq = {
          id: editingDriver.id,
          name: normalizeText(name),
          licenseNumber: normalizeText(licenseNumber),
          licenseType: normalizeText(licenseType),
          licenseExpiryDate: licenseExpiryDate || undefined,
          qualificationCert: normalizeText(qualificationCert) || undefined,
          qualificationExpiryDate: qualificationExpiryDate || undefined,
          phone: normalizeText(phone) || undefined,
          email: normalizeText(email) || undefined,
          address: normalizeText(address) || undefined,
          emergencyContact: normalizeText(emergencyContact) || undefined,
          emergencyPhone: normalizeText(emergencyPhone) || undefined,
          notes: normalizeText(notes) || undefined,
        }
        await updateDriver(editingDriver.id, payload, showAlert)
      } else {
        const payload: CreateDriverReq = {
          name: normalizeText(name),
          licenseNumber: normalizeText(licenseNumber),
          licenseType: normalizeText(licenseType),
          licenseExpiryDate: licenseExpiryDate || undefined,
          qualificationCert: normalizeText(qualificationCert) || undefined,
          qualificationExpiryDate: qualificationExpiryDate || undefined,
          phone: normalizeText(phone) || undefined,
          email: normalizeText(email) || undefined,
          address: normalizeText(address) || undefined,
          emergencyContact: normalizeText(emergencyContact) || undefined,
          emergencyPhone: normalizeText(emergencyPhone) || undefined,
          notes: normalizeText(notes) || undefined,
        }
        await createDriver(payload, showAlert)
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
          <div className='modal-header'>
            <h5 className='modal-title'>
              <KTIcon
                iconName={isEdit ? 'message-edit' : 'plus'}
                className='fs-2 me-2'
              />
              {isEdit ? '編輯司機資料' : '新增司機資料'}
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

          <div className='modal-body'>
            <div className='row g-5'>
              <div className='col-12 col-md-6 d-flex flex-column gap-3'>
                <div>
                  <label className='form-label required'>姓名</label>
                  <input
                    className='form-control'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='請輸入姓名'
                    autoFocus={!isEdit}
                  />
                </div>

                <div>
                  <label className='form-label required'>駕照號碼</label>
                  <input
                    className='form-control'
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder='請輸入駕照號碼'
                  />
                </div>

                <div>
                  <label className='form-label required'>駕照類型</label>
                  <select
                    className='form-select'
                    value={licenseType}
                    onChange={(e) => setLicenseType(e.target.value)}
                  >
                    <option value=''>請選擇</option>
                    <option value='大貨車'>大貨車</option>
                    <option value='聯結車'>聯結車</option>
                    <option value='小貨車'>小貨車</option>
                    <option value='其他'>其他</option>
                  </select>
                </div>

                <div>
                  <label className='form-label'>駕照到期日</label>
                  <input
                    className='form-control'
                    type='date'
                    value={licenseExpiryDate}
                    onChange={(e) => setLicenseExpiryDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className='form-label'>資格證</label>
                  <input
                    className='form-control'
                    value={qualificationCert}
                    onChange={(e) => setQualificationCert(e.target.value)}
                    placeholder='請輸入資格證號碼'
                  />
                </div>

                <div>
                  <label className='form-label'>資格證到期日</label>
                  <input
                    className='form-control'
                    type='date'
                    value={qualificationExpiryDate}
                    onChange={(e) => setQualificationExpiryDate(e.target.value)}
                  />
                </div>
              </div>

              <div className='col-12 col-md-6 d-flex flex-column gap-3'>
                <div>
                  <label className='form-label'>聯絡電話</label>
                  <input
                    className='form-control'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder='請輸入聯絡電話'
                  />
                </div>

                <div>
                  <label className='form-label'>電子郵件</label>
                  <input
                    className='form-control'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='請輸入電子郵件'
                  />
                </div>

                <div>
                  <label className='form-label'>地址</label>
                  <textarea
                    className='form-control'
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder='請輸入地址'
                  />
                </div>

                <div>
                  <label className='form-label'>緊急聯絡人</label>
                  <input
                    className='form-control'
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder='請輸入緊急聯絡人姓名'
                  />
                </div>

                <div>
                  <label className='form-label'>緊急聯絡電話</label>
                  <input
                    className='form-control'
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder='請輸入緊急聯絡電話'
                  />
                </div>

                <div>
                  <label className='form-label'>備註</label>
                  <textarea
                    className='form-control'
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder='請輸入備註'
                  />
                </div>
              </div>
            </div>
          </div>

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
