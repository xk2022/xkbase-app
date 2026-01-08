// src/app/pages/hrm/schedule/list/FormModal.tsx
import React, { useEffect, useState } from 'react'
import { KTIcon } from '@/_metronic/helpers'

import type { AlertType } from '@/app/pages/common/AlertType'
import type {
  CreateScheduleReq,
  ScheduleListItem,
  UpdateScheduleReq,
} from '../Model'
import { createSchedule, updateSchedule } from '../Query'

type Props = {
  open: boolean
  onClose: () => void
  onSaved: () => void
  showAlert: (message: string, type: AlertType) => void
  editingSchedule: ScheduleListItem | null
}

export const FormModal: React.FC<Props> = ({
  open,
  onClose,
  onSaved,
  showAlert,
  editingSchedule,
}) => {
  const isEdit = !!editingSchedule

  const [driverId, setDriverId] = useState('')
  const [weekStartDate, setWeekStartDate] = useState('')
  const [weekEndDate, setWeekEndDate] = useState('')
  const [mondayHours, setMondayHours] = useState<number | ''>('')
  const [tuesdayHours, setTuesdayHours] = useState<number | ''>('')
  const [wednesdayHours, setWednesdayHours] = useState<number | ''>('')
  const [thursdayHours, setThursdayHours] = useState<number | ''>('')
  const [fridayHours, setFridayHours] = useState<number | ''>('')
  const [saturdayHours, setSaturdayHours] = useState<number | ''>('')
  const [sundayHours, setSundayHours] = useState<number | ''>('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return

    if (!editingSchedule) {
      setDriverId('')
      setWeekStartDate('')
      setWeekEndDate('')
      setMondayHours('')
      setTuesdayHours('')
      setWednesdayHours('')
      setThursdayHours('')
      setFridayHours('')
      setSaturdayHours('')
      setSundayHours('')
      setNotes('')
      return
    }

    setDriverId(editingSchedule.driverId || '')
    setWeekStartDate(editingSchedule.weekStartDate || '')
    setWeekEndDate(editingSchedule.weekEndDate || '')
    setMondayHours(editingSchedule.mondayHours || '')
    setTuesdayHours(editingSchedule.tuesdayHours || '')
    setWednesdayHours(editingSchedule.wednesdayHours || '')
    setThursdayHours(editingSchedule.thursdayHours || '')
    setFridayHours(editingSchedule.fridayHours || '')
    setSaturdayHours(editingSchedule.saturdayHours || '')
    setSundayHours(editingSchedule.sundayHours || '')
  }, [open, editingSchedule])

  const validate = () => {
    if (!driverId.trim()) {
      showAlert('請選擇司機', 'warning')
      return false
    }

    if (!weekStartDate) {
      showAlert('請選擇週開始日期', 'warning')
      return false
    }

    if (!weekEndDate) {
      showAlert('請選擇週結束日期', 'warning')
      return false
    }

    return true
  }

  const handleSave = async () => {
    if (!validate()) return

    try {
      setSaving(true)

      const payload: CreateScheduleReq | UpdateScheduleReq = {
        ...(isEdit ? { id: editingSchedule!.id } : {}),
        driverId: driverId.trim(),
        weekStartDate,
        weekEndDate,
        mondayHours: mondayHours === '' ? undefined : Number(mondayHours),
        tuesdayHours: tuesdayHours === '' ? undefined : Number(tuesdayHours),
        wednesdayHours: wednesdayHours === '' ? undefined : Number(wednesdayHours),
        thursdayHours: thursdayHours === '' ? undefined : Number(thursdayHours),
        fridayHours: fridayHours === '' ? undefined : Number(fridayHours),
        saturdayHours: saturdayHours === '' ? undefined : Number(saturdayHours),
        sundayHours: sundayHours === '' ? undefined : Number(sundayHours),
        notes: notes.trim() || undefined,
      }

      if (isEdit && editingSchedule) {
        await updateSchedule(editingSchedule.id, payload as UpdateScheduleReq, showAlert)
      } else {
        await createSchedule(payload as CreateScheduleReq, showAlert)
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
              {isEdit ? '編輯工時規劃' : '新增工時規劃'}
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
                  <label className='form-label required'>司機 ID</label>
                  <input
                    className='form-control'
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                    placeholder='請輸入司機 ID'
                    autoFocus={!isEdit}
                  />
                </div>

                <div>
                  <label className='form-label required'>週開始日期</label>
                  <input
                    className='form-control'
                    type='date'
                    value={weekStartDate}
                    onChange={(e) => setWeekStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className='form-label required'>週結束日期</label>
                  <input
                    className='form-control'
                    type='date'
                    value={weekEndDate}
                    onChange={(e) => setWeekEndDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className='form-label'>週一工時</label>
                  <input
                    className='form-control'
                    type='number'
                    min='0'
                    max='24'
                    value={mondayHours}
                    onChange={(e) => setMondayHours(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder='小時'
                  />
                </div>

                <div>
                  <label className='form-label'>週二工時</label>
                  <input
                    className='form-control'
                    type='number'
                    min='0'
                    max='24'
                    value={tuesdayHours}
                    onChange={(e) => setTuesdayHours(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder='小時'
                  />
                </div>

                <div>
                  <label className='form-label'>週三工時</label>
                  <input
                    className='form-control'
                    type='number'
                    min='0'
                    max='24'
                    value={wednesdayHours}
                    onChange={(e) => setWednesdayHours(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder='小時'
                  />
                </div>

                <div>
                  <label className='form-label'>週四工時</label>
                  <input
                    className='form-control'
                    type='number'
                    min='0'
                    max='24'
                    value={thursdayHours}
                    onChange={(e) => setThursdayHours(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder='小時'
                  />
                </div>
              </div>

              <div className='col-12 col-md-6 d-flex flex-column gap-3'>
                <div>
                  <label className='form-label'>週五工時</label>
                  <input
                    className='form-control'
                    type='number'
                    min='0'
                    max='24'
                    value={fridayHours}
                    onChange={(e) => setFridayHours(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder='小時'
                  />
                </div>

                <div>
                  <label className='form-label'>週六工時</label>
                  <input
                    className='form-control'
                    type='number'
                    min='0'
                    max='24'
                    value={saturdayHours}
                    onChange={(e) => setSaturdayHours(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder='小時'
                  />
                </div>

                <div>
                  <label className='form-label'>週日工時</label>
                  <input
                    className='form-control'
                    type='number'
                    min='0'
                    max='24'
                    value={sundayHours}
                    onChange={(e) => setSundayHours(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder='小時'
                  />
                </div>

                <div>
                  <label className='form-label'>備註</label>
                  <textarea
                    className='form-control'
                    rows={5}
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
