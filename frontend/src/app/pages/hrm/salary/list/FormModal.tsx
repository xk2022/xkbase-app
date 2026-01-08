// src/app/pages/hrm/salary/list/FormModal.tsx
import React, { useEffect, useState } from 'react'
import { KTIcon } from '@/_metronic/helpers'

import type { AlertType } from '@/app/pages/common/AlertType'
import type {
  CreateSalaryFormulaReq,
  SalaryFormulaListItem,
  UpdateSalaryFormulaReq,
} from '../Model'
import { createSalaryFormula, updateSalaryFormula } from '../Query'

type Props = {
  open: boolean
  onClose: () => void
  onSaved: () => void
  showAlert: (message: string, type: AlertType) => void
  editingFormula: SalaryFormulaListItem | null
}

export const FormModal: React.FC<Props> = ({
  open,
  onClose,
  onSaved,
  showAlert,
  editingFormula,
}) => {
  const isEdit = !!editingFormula

  const [formulaName, setFormulaName] = useState('')
  const [driverId, setDriverId] = useState('')
  const [tripFee, setTripFee] = useState<number | ''>('')
  const [overtimeRate, setOvertimeRate] = useState<number | ''>('')
  const [nightShiftSubsidy, setNightShiftSubsidy] = useState<number | ''>('')
  const [effectiveDate, setEffectiveDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return

    if (!editingFormula) {
      setFormulaName('')
      setDriverId('')
      setTripFee('')
      setOvertimeRate('')
      setNightShiftSubsidy('')
      setEffectiveDate('')
      setExpiryDate('')
      setNotes('')
      return
    }

    setFormulaName(editingFormula.formulaName || '')
    setDriverId(editingFormula.driverId || '')
    setTripFee(editingFormula.tripFee || '')
    setOvertimeRate(editingFormula.overtimeRate || '')
    setNightShiftSubsidy(editingFormula.nightShiftSubsidy || '')
    setEffectiveDate(editingFormula.effectiveDate || '')
    setExpiryDate(editingFormula.expiryDate || '')
  }, [open, editingFormula])

  const validate = () => {
    if (!formulaName.trim()) {
      showAlert('請輸入公式名稱', 'warning')
      return false
    }

    if (tripFee === '' || Number.isNaN(Number(tripFee)) || Number(tripFee) < 0) {
      showAlert('請輸入有效的趟次費', 'warning')
      return false
    }

    if (overtimeRate === '' || Number.isNaN(Number(overtimeRate)) || Number(overtimeRate) < 0) {
      showAlert('請輸入有效的加班費率', 'warning')
      return false
    }

    if (nightShiftSubsidy === '' || Number.isNaN(Number(nightShiftSubsidy)) || Number(nightShiftSubsidy) < 0) {
      showAlert('請輸入有效的夜間補貼', 'warning')
      return false
    }

    if (!effectiveDate) {
      showAlert('請選擇生效日期', 'warning')
      return false
    }

    return true
  }

  const handleSave = async () => {
    if (!validate()) return

    try {
      setSaving(true)

      const payload: CreateSalaryFormulaReq | UpdateSalaryFormulaReq = {
        ...(isEdit ? { id: editingFormula!.id } : {}),
        formulaName: formulaName.trim(),
        driverId: driverId.trim() || undefined,
        tripFee: Number(tripFee),
        overtimeRate: Number(overtimeRate),
        nightShiftSubsidy: Number(nightShiftSubsidy),
        effectiveDate,
        expiryDate: expiryDate || undefined,
        notes: notes.trim() || undefined,
      }

      if (isEdit && editingFormula) {
        await updateSalaryFormula(editingFormula.id, payload as UpdateSalaryFormulaReq, showAlert)
      } else {
        await createSalaryFormula(payload as CreateSalaryFormulaReq, showAlert)
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
              {isEdit ? '編輯薪資計算公式' : '新增薪資計算公式'}
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
                  <label className='form-label required'>公式名稱</label>
                  <input
                    className='form-control'
                    value={formulaName}
                    onChange={(e) => setFormulaName(e.target.value)}
                    placeholder='請輸入公式名稱'
                    autoFocus={!isEdit}
                  />
                </div>

                <div>
                  <label className='form-label'>司機 ID</label>
                  <input
                    className='form-control'
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                    placeholder='請輸入司機 ID（選填）'
                  />
                </div>

                <div>
                  <label className='form-label required'>趟次費</label>
                  <input
                    className='form-control'
                    type='number'
                    min='0'
                    value={tripFee}
                    onChange={(e) => setTripFee(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder='請輸入趟次費'
                  />
                </div>

                <div>
                  <label className='form-label required'>加班費率（每小時）</label>
                  <input
                    className='form-control'
                    type='number'
                    min='0'
                    value={overtimeRate}
                    onChange={(e) => setOvertimeRate(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder='請輸入加班費率'
                  />
                </div>

                <div>
                  <label className='form-label required'>夜間補貼（每小時）</label>
                  <input
                    className='form-control'
                    type='number'
                    min='0'
                    value={nightShiftSubsidy}
                    onChange={(e) => setNightShiftSubsidy(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder='請輸入夜間補貼'
                  />
                </div>
              </div>

              <div className='col-12 col-md-6 d-flex flex-column gap-3'>
                <div>
                  <label className='form-label required'>生效日期</label>
                  <input
                    className='form-control'
                    type='date'
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className='form-label'>失效日期</label>
                  <input
                    className='form-control'
                    type='date'
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className='form-label'>備註</label>
                  <textarea
                    className='form-control'
                    rows={8}
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
