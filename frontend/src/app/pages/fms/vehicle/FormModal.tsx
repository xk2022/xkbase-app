// src/app/pages/fms/vehicle/FormModal.tsx
import React, { useEffect, useState } from 'react'
import { KTIcon } from '@/_metronic/helpers'
import { AlertType } from '@/app/pages/common/AlertType'
import {
  Vehicle,
  VehicleType,
  VehicleStatus,
  CreateVehicleReq,
  UpdateVehicleReq,
} from './Model'
import { createVehicle, updateVehicle } from './Query'

type Props = {
  open: boolean
  onClose: () => void
  showAlert: (message: string, type: AlertType) => void
  onSaved: () => void
  editingVehicle: Vehicle | null // null = create, 非 null = edit
}

// 下拉用的車種選項（前端 label）
// value 要對應後端 VehicleType enum
const VEHICLE_TYPE_OPTIONS: { value: VehicleType; label: string }[] = [
  { value: 'TRACTOR', label: '車頭' },
  { value: 'TRAILER_20', label: '20 尺板車' },
  { value: 'TRAILER_40', label: '40 尺板車' },
  { value: 'SMALL_TRUCK', label: '小貨車 / 小型貨車' },
  { value: 'REFRIGERATED_TRUCK', label: '冷凍車' },
  { value: 'VAN', label: '廂型車' },
  { value: 'OTHER', label: '其他' },
]

// 車輛狀態選項（要跟後端 VehicleStatus 對齊）
const VEHICLE_STATUS_OPTIONS: { value: VehicleStatus; label: string }[] = [
  { value: 'AVAILABLE', label: '可用 / 空閒 (AVAILABLE)' },
  { value: 'IDLE', label: '閒置 (IDLE)' },
  { value: 'IN_USE', label: '執行中 (IN_USE)' },
  { value: 'BUSY', label: '忙碌 (BUSY)' },
  { value: 'MAINTENANCE', label: '維修中 (MAINTENANCE)' },
  { value: 'RESERVED', label: '已預約 (RESERVED)' },
  { value: 'INACTIVE', label: '停用 (INACTIVE)' },
  { value: 'SCRAPPED', label: '報廢 (SCRAPPED)' },
]

export const FormModal: React.FC<Props> = ({
  open,
  onClose,
  showAlert,
  onSaved,
  editingVehicle,
}) => {
  const [plateNo, setPlateNo] = useState('')
  const [type, setType] = useState<VehicleType | ''>('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [capacityTon, setCapacityTon] = useState<string>('')

  const [status, setStatus] = useState<VehicleStatus>('AVAILABLE')
  const [enabled, setEnabled] = useState(true)
  const [currentOdometer, setCurrentOdometer] = useState<string>('')
  const [remark, setRemark] = useState('')

  const [saving, setSaving] = useState(false)

  const isEdit = !!editingVehicle

  useEffect(() => {
    if (!editingVehicle) {
      // 🆕 Create 模式：預設值
      setPlateNo('')
      setType('')
      setBrand('')
      setModel('')
      setCapacityTon('')
      setStatus('AVAILABLE')
      setEnabled(true)
      setCurrentOdometer('')
      setRemark('')
      return
    }

    // ✏ Edit 模式：帶入原始資料
    setPlateNo(editingVehicle.plateNo)
    setType(editingVehicle.type)
    setBrand(editingVehicle.brand ?? '')
    setModel(editingVehicle.model ?? '')
    setCapacityTon(
      editingVehicle.capacityTon != null ? String(editingVehicle.capacityTon) : '',
    )
    setStatus(editingVehicle.status)
    setEnabled(editingVehicle.enabled)
    setCurrentOdometer(
      editingVehicle.currentOdometer != null
        ? String(editingVehicle.currentOdometer)
        : '',
    )
    setRemark(editingVehicle.remark ?? '')
  }, [editingVehicle])

  if (!open) return null

  const parseNumber = (value: string): number | undefined => {
    if (!value.trim()) return undefined
    const num = Number(value)
    return Number.isNaN(num) ? undefined : num
  }

  const handleSave = async () => {
    if (!plateNo.trim()) {
      showAlert('請輸入車牌號碼', 'warning')
      return
    }
    if (!type) {
      showAlert('請選擇車種', 'warning')
      return
    }

    try {
      setSaving(true)

      const payloadBase = {
        plateNo: plateNo.trim(),
        type: type as VehicleType,
        brand: brand.trim() || undefined,
        model: model.trim() || undefined,
        capacityTon: parseNumber(capacityTon),
        status,
        enabled,
        currentOdometer: parseNumber(currentOdometer),
        remark: remark.trim() || undefined,
      }

      let ok = false

      if (isEdit && editingVehicle) {
        const payload: UpdateVehicleReq = {
          ...payloadBase,
        }
        ok = await updateVehicle(editingVehicle.uuid, payload, showAlert)
      } else {
        const payload: CreateVehicleReq = {
          ...payloadBase,
        }
        ok = await createVehicle(payload, showAlert)
      }

      if (ok) {
        onSaved()
      }
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
              {isEdit ? '編輯車輛' : '新增車輛'}
            </h5>
            <button
              type='button'
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
              {/* 左側：基本車輛資訊 */}
              <div className='col-md-6 d-flex flex-column gap-3'>
                {/* 車牌號碼 */}
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
                    onChange={(e) => setType(e.target.value as VehicleType | '')}
                  >
                    <option value=''>請選擇車種</option>
                    {VEHICLE_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}（{opt.value}）
                      </option>
                    ))}
                  </select>
                </div>

                {/* 品牌 */}
                <div>
                  <label className='form-label'>品牌（brand）</label>
                  <input
                    className='form-control'
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder='例如：FUSO、HINO、SCANIA'
                  />
                </div>

                {/* 車款 / 型號 */}
                <div>
                  <label className='form-label'>車款 / 型號（model）</label>
                  <input
                    className='form-control'
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder='例如：Canter 3.5T、Actros 2653'
                  />
                </div>

                {/* 載重（噸） */}
                <div>
                  <label className='form-label'>核定載重（噸）（capacityTon）</label>
                  <input
                    className='form-control'
                    type='number'
                    step='0.1'
                    value={capacityTon}
                    onChange={(e) => setCapacityTon(e.target.value)}
                    placeholder='例如：3.5'
                  />
                </div>
              </div>

              {/* 右側：狀態 / 里程 / 備註 */}
              <div className='col-md-6 d-flex flex-column gap-3'>
                {/* 車輛狀態 */}
                <div>
                  <label className='form-label required'>車輛狀態（status）</label>
                  <select
                    className='form-select'
                    value={status}
                    onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                  >
                    {VEHICLE_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 啟用開關 */}
                <div className='form-check form-switch form-check-custom form-check-solid mt-2'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    id='vehicleEnabledSwitch'
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                  />
                  <label
                    className='form-check-label'
                    htmlFor='vehicleEnabledSwitch'
                  >
                    可指派 / 啟用（enabled）
                  </label>
                </div>

                {/* 目前里程數 */}
                <div>
                  <label className='form-label'>目前里程數（km）</label>
                  <input
                    className='form-control'
                    type='number'
                    step='1'
                    value={currentOdometer}
                    onChange={(e) => setCurrentOdometer(e.target.value)}
                    placeholder='例如：125000'
                  />
                  <div className='form-text'>
                    主要用於之後的保養 / 維修提醒，可選填。
                  </div>
                </div>

                {/* 備註 */}
                <div>
                  <label className='form-label'>備註（remark）</label>
                  <textarea
                    className='form-control'
                    rows={3}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder='可填寫車況、輪胎狀況、冷凍機型號、特殊用途等說明'
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
            <button
              className='btn btn-primary'
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '儲存中…' : '儲存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
