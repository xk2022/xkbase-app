// src/app/pages/fms/driver/FormModal.tsx
import React, { useEffect, useState } from 'react'
import { KTIcon } from '@/_metronic/helpers'
import { AlertType } from '@/app/pages/common/AlertType'
import {
  Driver,
  DriverStatus,
  DriverLicenseType,
  CreateDriverReq,
  UpdateDriverReq,
} from './Model'
import { createDriver, updateDriver } from './Query'

type Props = {
  open: boolean
  onClose: () => void
  showAlert: (message: string, type: AlertType) => void
  onSaved: () => void
  editingDriver: Driver | null // null = create, 非 null = edit
}

// 駕照類型選項
const LICENSE_TYPE_OPTIONS: { value: DriverLicenseType; label: string }[] = [
  { value: 'SMALL', label: '小型車（SMALL）' },
  { value: 'MEDIUM', label: '中型車（MEDIUM）' },
  { value: 'LARGE', label: '大型車（LARGE）' },
  { value: 'TRAILER', label: '聯結車 / 拖車（TRAILER）' },
]

// 司機狀態選項
const DRIVER_STATUS_OPTIONS: { value: DriverStatus; label: string }[] = [
  { value: 'ACTIVE', label: '在職（ACTIVE）' },
  { value: 'INACTIVE', label: '停用 / 離職（INACTIVE）' },
  { value: 'LEAVE', label: '請假（LEAVE）' },
]

export const FormModal: React.FC<Props> = ({
  open,
  onClose,
  showAlert,
  onSaved,
  editingDriver,
}) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [licenseType, setLicenseType] = useState<DriverLicenseType>('LARGE')
  const [status, setStatus] = useState<DriverStatus>('ACTIVE')
  const [onDuty, setOnDuty] = useState(false)
  const [userId, setUserId] = useState('')
  const [currentVehicleId, setCurrentVehicleId] = useState('')

  const [saving, setSaving] = useState(false)

  const isEdit = !!editingDriver

  useEffect(() => {
    if (!editingDriver) {
      // 🆕 Create 預設值
      setName('')
      setPhone('')
      setLicenseType('LARGE')
      setStatus('ACTIVE')
      setOnDuty(false)
      setUserId('')
      setCurrentVehicleId('')
      return
    }

    // ✏ Edit 設定初始資料
    setName(editingDriver.name)
    setPhone(editingDriver.phone)
    setLicenseType(editingDriver.licenseType)
    setStatus(editingDriver.status)
    setOnDuty(editingDriver.onDuty ?? false)
    setUserId(editingDriver.userId ?? '')
    setCurrentVehicleId(editingDriver.currentVehicleId ?? '')
  }, [editingDriver])

  if (!open) return null

  const handleSave = async () => {
    if (!name.trim()) {
      showAlert('請輸入司機姓名', 'warning')
      return
    }
    if (!phone.trim()) {
      showAlert('請輸入聯絡電話', 'warning')
      return
    }

    try {
      setSaving(true)

      const payloadBase = {
        name: name.trim(),
        phone: phone.trim(),
        licenseType,
        status,
        onDuty,
        userId: userId.trim() || undefined,
        currentVehicleId: currentVehicleId.trim() || undefined,
      }

      let ok = false

      if (isEdit && editingDriver) {
        const payload: UpdateDriverReq = { ...payloadBase }
        ok = await updateDriver(editingDriver.uuid, payload, showAlert)
      } else {
        const payload: CreateDriverReq = { ...payloadBase }
        ok = await createDriver(payload, showAlert)
      }

      if (ok) onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className='modal fade show d-block'
      tabIndex={-1}
      style={{ backgroundColor: 'rgba(0,0,0,.25)' }}
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
              {isEdit ? '編輯司機' : '新增司機'}
            </h5>

            <button
              className='btn btn-sm btn-light'
              onClick={onClose}
              disabled={saving}
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className='modal-body'>
            <div className='row g-5'>
              {/* 左側 */}
              <div className='col-md-6 d-flex flex-column gap-3'>
                {/* 姓名 */}
                <div>
                  <label className='form-label required'>司機姓名</label>
                  <input
                    className='form-control'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='例如：王小明'
                  />
                </div>

                {/* 電話 */}
                <div>
                  <label className='form-label required'>聯絡電話</label>
                  <input
                    className='form-control'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder='例如：0912-345-678'
                  />
                </div>

                {/* 駕照類型 */}
                <div>
                  <label className='form-label required'>駕照類型</label>
                  <select
                    className='form-select'
                    value={licenseType}
                    onChange={(e) => setLicenseType(e.target.value as DriverLicenseType)}
                  >
                    {LICENSE_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 狀態 */}
                <div>
                  <label className='form-label required'>司機狀態</label>
                  <select
                    className='form-select'
                    value={status}
                    onChange={(e) => setStatus(e.target.value as DriverStatus)}
                  >
                    {DRIVER_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 右側 */}
              <div className='col-md-6 d-flex flex-column gap-3'>
                {/* 上線 OnDuty */}
                <div className='form-check form-switch form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    id='driverOnDutySwitch'
                    checked={onDuty}
                    onChange={(e) => setOnDuty(e.target.checked)}
                  />
                  <label className='form-check-label' htmlFor='driverOnDutySwitch'>
                    上線（可接任務）
                  </label>
                </div>

                {/* 綁定使用者 */}
                <div>
                  <label className='form-label'>綁定後台使用者（userId）</label>
                  <input
                    className='form-control'
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder='UPMS 使用者 UUID，可留空'
                  />
                </div>

                {/* 綁定車輛 */}
                <div>
                  <label className='form-label'>綁定車輛（currentVehicleId）</label>
                  <input
                    className='form-control'
                    value={currentVehicleId}
                    onChange={(e) => setCurrentVehicleId(e.target.value)}
                    placeholder='FMS 車輛 UUID，可留空'
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
