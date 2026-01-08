// src/app/pages/fms/vehicle/Form.tsx
import React, { useEffect, useState } from 'react'
import { KTIcon } from '@/_metronic/helpers'
import { VehicleType, VehicleStatus } from './Model'

// ------------------------------------------------------------
// Form Values 型別
// ------------------------------------------------------------
export type VehicleFormValues = {
  plateNo: string
  type: VehicleType
  brand?: string
  model?: string
  capacityTon?: number
  status: VehicleStatus
  enabled?: boolean
  remark?: string
}

type Props = {
  mode: 'create' | 'edit'
  submitting?: boolean
  initialValues?: Partial<VehicleFormValues>
  onSubmit: (values: VehicleFormValues) => void | Promise<void>
  onCancel?: () => void
}

export const Form: React.FC<Props> = ({
  mode,
  submitting = false,
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [plateNo, setPlateNo] = useState('')
  const [type, setType] = useState<VehicleType>('TRACTOR')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [capacityTon, setCapacityTon] = useState<string>('') // 表單用字串
  const [status, setStatus] = useState<VehicleStatus>('AVAILABLE')
  const [enabled, setEnabled] = useState(true)
  const [remark, setRemark] = useState('')

  const isEdit = mode === 'edit'

  // ------------------------------------------------------------
  // 帶入 initialValues（編輯模式）
  // ------------------------------------------------------------
  useEffect(() => {
    if (!initialValues) return

    if (initialValues.plateNo !== undefined) setPlateNo(initialValues.plateNo)
    if (initialValues.type !== undefined) setType(initialValues.type)
    if (initialValues.brand !== undefined) setBrand(initialValues.brand || '')
    if (initialValues.model !== undefined) setModel(initialValues.model || '')
    if (initialValues.capacityTon !== undefined)
      setCapacityTon(String(initialValues.capacityTon))
    if (initialValues.status !== undefined) setStatus(initialValues.status)
    if (initialValues.enabled !== undefined) setEnabled(initialValues.enabled)
    if (initialValues.remark !== undefined) setRemark(initialValues.remark || '')
  }, [initialValues])

  // ------------------------------------------------------------
  // Submit
  // ------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!plateNo.trim()) {
      alert('請輸入車牌號碼')
      return
    }

    const values: VehicleFormValues = {
      plateNo: plateNo.trim(),
      type,
      brand: brand || undefined,
      model: model || undefined,
      capacityTon: capacityTon ? Number(capacityTon) : undefined,
      status,
      enabled,
      remark: remark || undefined,
    }

    await onSubmit(values)
  }

  return (
    <form className='form' noValidate onSubmit={handleSubmit}>
      <div className='row g-5'>
        {/* 左區塊 */}
        <div className='col-md-6 d-flex flex-column gap-4'>
          {/* 車牌 */}
          <div>
            <label className='form-label required'>車牌號碼（plateNo）</label>
            <input
              className='form-control'
              value={plateNo}
              onChange={(e) => setPlateNo(e.target.value)}
              placeholder='例如：ABC-1234'
            />
          </div>

          {/* 車種 */}
          <div>
            <label className='form-label required'>車種（type）</label>
            <select
              className='form-select'
              value={type}
              onChange={(e) => setType(e.target.value as VehicleType)}
            >
              <option value='TRACTOR'>車頭（Tractor）</option>
              <option value='TRAILER_20'>20 尺板車</option>
              <option value='TRAILER_40'>40 尺板車</option>
              <option value='REFRIGERATOR'>冷凍車</option>
              <option value='LIGHT_TRUCK'>小貨車</option>
              <option value='OTHER'>其他</option>
            </select>
          </div>

          {/* 品牌 */}
          <div>
            <label className='form-label'>品牌（brand）</label>
            <input
              className='form-control'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder='例如：VOLVO / SCANIA'
            />
          </div>

          {/* 型號 */}
          <div>
            <label className='form-label'>型號（model）</label>
            <input
              className='form-control'
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder='例如：FH16 / P410'
            />
          </div>
        </div>

        {/* 右區塊 */}
        <div className='col-md-6 d-flex flex-column gap-4'>
          {/* 載重量 ton */}
          <div>
            <label className='form-label'>載重（噸數, capacityTon）</label>
            <input
              className='form-control'
              type='number'
              min={0}
              step='0.1'
              value={capacityTon}
              onChange={(e) => setCapacityTon(e.target.value)}
              placeholder='例如：3.5'
            />
          </div>

          {/* 車輛狀態 */}
          <div>
            <label className='form-label required'>車輛狀態（status）</label>
            <select
              className='form-select'
              value={status}
              onChange={(e) => setStatus(e.target.value as VehicleStatus)}
            >
              <option value='AVAILABLE'>可接單（AVAILABLE）</option>
              <option value='IN_USE'>使用中（IN_USE）</option>
              <option value='MAINTENANCE'>維修（MAINTENANCE）</option>
              <option value='INACTIVE'>停用（INACTIVE）</option>
              <option value='SCRAPPED'>報廢（SCRAPPED）</option>
            </select>
          </div>

          {/* 啟用狀態 */}
          <div className='form-check form-switch form-check-custom form-check-solid'>
            <input
              className='form-check-input'
              type='checkbox'
              id='vehicleEnabledSwitch'
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            <label className='form-check-label' htmlFor='vehicleEnabledSwitch'>
              啟用（可指派）
            </label>
          </div>

          {/* 備註 */}
          <div>
            <label className='form-label'>備註（remark）</label>
            <textarea
              className='form-control'
              rows={3}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder='例如：固定給 A 司機、車況良好、新車…'
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
              {isEdit ? '更新資料' : '建立車輛'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
