// src/app/pages/fms/driver/Form.tsx
import React, { useEffect, useState } from 'react'
import { KTIcon } from '@/_metronic/helpers'
import { DriverStatus, DriverLicenseType } from './Model'

// ------------------------------------------------------------
// Form Values 型別
// ------------------------------------------------------------
export type DriverFormValues = {
  name: string
  phone: string
  licenseType: DriverLicenseType
  status: DriverStatus
  onDuty?: boolean
  userId?: string
  currentVehicleId?: string
}

type Props = {
  mode: 'create' | 'edit'
  submitting?: boolean
  initialValues?: Partial<DriverFormValues>
  onSubmit: (values: DriverFormValues) => void | Promise<void>
  onCancel?: () => void
}

export const Form: React.FC<Props> = ({
  mode,
  submitting = false,
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [licenseType, setLicenseType] = useState<DriverLicenseType>('LARGE')
  const [status, setStatus] = useState<DriverStatus>('ACTIVE')
  const [onDuty, setOnDuty] = useState(false)
  const [userId, setUserId] = useState('')
  const [currentVehicleId, setCurrentVehicleId] = useState('')

  const isEdit = mode === 'edit'

  // ------------------------------------------------------------
  // 帶入 initialValues（編輯模式）
  // ------------------------------------------------------------
  useEffect(() => {
    if (!initialValues) return

    if (initialValues.name !== undefined) setName(initialValues.name)
    if (initialValues.phone !== undefined) setPhone(initialValues.phone)
    if (initialValues.licenseType !== undefined)
      setLicenseType(initialValues.licenseType)
    if (initialValues.status !== undefined) setStatus(initialValues.status)
    if (initialValues.onDuty !== undefined) setOnDuty(initialValues.onDuty)
    if (initialValues.userId !== undefined) setUserId(initialValues.userId || '')
    if (initialValues.currentVehicleId !== undefined)
      setCurrentVehicleId(initialValues.currentVehicleId || '')
  }, [initialValues])

  // ------------------------------------------------------------
  // Submit
  // ------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      alert('請輸入司機姓名')
      return
    }

    if (!phone.trim()) {
      alert('請輸入聯絡電話')
      return
    }

    const values: DriverFormValues = {
      name: name.trim(),
      phone: phone.trim(),
      licenseType,
      status,
      onDuty,
      userId: userId || undefined,
      currentVehicleId: currentVehicleId || undefined,
    }

    await onSubmit(values)
  }

  return (
    <form className='form' noValidate onSubmit={handleSubmit}>
      <div className='row g-5'>
        {/* 左區塊：司機基本資料 */}
        <div className='col-md-6 d-flex flex-column gap-4'>
          {/* 姓名 */}
          <div>
            <label className='form-label required'>司機姓名（name）</label>
            <input
              className='form-control'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='例如：王小明'
            />
          </div>

          {/* 電話 */}
          <div>
            <label className='form-label required'>聯絡電話（phone）</label>
            <input
              className='form-control'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder='例如：0912-345-678'
            />
            <div className='form-text'>
              將會套用唯一限制（unique），避免重複建立同一個司機。
            </div>
          </div>

          {/* 駕照類型 */}
          <div>
            <label className='form-label required'>駕照類型（licenseType）</label>
            <select
              className='form-select'
              value={licenseType}
              onChange={(e) => setLicenseType(e.target.value as DriverLicenseType)}
            >
              <option value='SMALL'>小型車（SMALL）</option>
              <option value='MEDIUM'>中型車（MEDIUM）</option>
              <option value='LARGE'>大型車（LARGE）</option>
              <option value='TRAILER'>聯結車 / 拖車（TRAILER）</option>
            </select>
          </div>
        </div>

        {/* 右區塊：狀態 / 綁定資訊 */}
        <div className='col-md-6 d-flex flex-column gap-4'>
          {/* 司機狀態 */}
          <div>
            <label className='form-label required'>司機狀態（status）</label>
            <select
              className='form-select'
              value={status}
              onChange={(e) => setStatus(e.target.value as DriverStatus)}
            >
              <option value='ACTIVE'>在職（ACTIVE）</option>
              <option value='INACTIVE'>停用 / 離職（INACTIVE）</option>
              <option value='LEAVE'>請假 / 暫停派遣（LEAVE）</option>
            </select>
          </div>

          {/* 上線狀態 */}
          <div className='form-check form-switch form-check-custom form-check-solid'>
            <input
              className='form-check-input'
              type='checkbox'
              id='driverOnDutySwitch'
              checked={onDuty}
              onChange={(e) => setOnDuty(e.target.checked)}
            />
            <label className='form-check-label' htmlFor='driverOnDutySwitch'>
              上線中（可接任務）
            </label>
          </div>

          {/* 綁定使用者（UPMS User） */}
          <div>
            <label className='form-label'>綁定使用者 UUID（userId）</label>
            <input
              className='form-control'
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder='可留空，之後在詳情頁綁定 UPMS 使用者'
            />
            <div className='form-text'>
              未來可改為「下拉選擇使用者」，目前先使用 UUID 手動輸入。
            </div>
          </div>

          {/* 綁定車輛 UUID */}
          <div>
            <label className='form-label'>當前綁定車輛 UUID（currentVehicleId）</label>
            <input
              className='form-control'
              value={currentVehicleId}
              onChange={(e) => setCurrentVehicleId(e.target.value)}
              placeholder='例如：對應 fms_vehicle.uuid，可留空'
            />
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className='mt-8 d-flex justify-content-end'>
        {onCancel && (
          <button
            type='button'
            className='btn btn-light me-3'
            onClick={onCancel}
            disabled={submitting}
          >
            取消
          </button>
        )}
        <button type='submit' className='btn btn-primary' disabled={submitting}>
          {submitting ? (
            <>
              <span className='indicator-label'>儲存中…</span>
              <span className='indicator-progress'>
                請稍候…
                <span className='spinner-border spinner-border-sm align-middle ms-2' />
              </span>
            </>
          ) : (
            <>
              <KTIcon
                iconName={isEdit ? 'message-edit' : 'plus'}
                className='fs-2 me-2'
              />
              {isEdit ? '更新司機' : '建立司機'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
