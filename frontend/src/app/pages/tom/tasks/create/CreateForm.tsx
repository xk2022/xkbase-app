// src/app/pages/tom/task/create/CreateForm.tsx
import React, { useMemo } from 'react'
import { useFormik } from 'formik'

import type { CreateTomTaskReq, TaskSubjectType, TomTaskStatus } from '../Model'

interface Props {
  submitting: boolean
  onSubmit: (req: CreateTomTaskReq) => void | Promise<void>
  onCancel: () => void
}

const SUBJECT_OPTIONS: Array<{ value: TaskSubjectType; label: string }> = [
  { value: 'CONTAINER', label: '貨櫃（CONTAINER）' },
  { value: 'TRAILER', label: '板車（TRAILER）' },
  { value: 'EMPTY_MOVE', label: '空車/空板回位（EMPTY_MOVE）' },
  { value: 'VEHICLE', label: '車頭（VEHICLE）' },
  { value: 'OTHER', label: '其他（OTHER）' },
]

const STATUS_OPTIONS: Array<{ value: TomTaskStatus; label: string }> = [
  { value: 'UNASSIGNED', label: '未指派' },
  { value: 'ASSIGNED', label: '已指派' },
  { value: 'IN_PROGRESS', label: '進行中' },
  { value: 'DONE', label: '已完成' },
  { value: 'CANCELLED', label: '已取消' },
]

export const CreateForm: React.FC<Props> = ({ submitting, onSubmit, onCancel }) => {
  const formik = useFormik<CreateTomTaskReq>({
    initialValues: {
      subjectType: 'CONTAINER',

      // subject
      subjectId: '',
      subjectNo: '',

      // links (optional)
      orderId: '',
      orderNo: '',
      containerId: '',
      containerNo: '',

      fromLocation: '',
      toLocation: '',
      plannedStartAt: '',

      status: 'UNASSIGNED',
      remark: '',
    },
    onSubmit,
  })

  const subjectType = formik.values.subjectType

  const showContainerFields = subjectType === 'CONTAINER'
  const showTrailerFields = subjectType === 'TRAILER'
  const showVehicleFields = subjectType === 'VEHICLE'

  const subjectHint = useMemo(() => {
    switch (subjectType) {
      case 'CONTAINER':
        return 'MVP：可先手動輸入 containerNo（之後接貨櫃選擇器）'
      case 'TRAILER':
        return '可指定板車編號（例如 TR-102），或留空表示「拉任一空板」改用 EMPTY_MOVE 更語意化'
      case 'EMPTY_MOVE':
        return '空車/空板回位：通常不需要輸入標的編號'
      case 'VEHICLE':
        return '可輸入車頭/車牌（例如 KDD-5566）'
      default:
        return '其他類型：可在備註描述標的'
    }
  }, [subjectType])

  // normalize：把空字串轉 undefined，避免送出一堆空白欄位
  const toUndef = (s?: string) => {
    const v = (s ?? '').trim()
    return v ? v : undefined
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // minimal required checks（MVP：不要卡太死）
    if (!formik.values.fromLocation.trim()) return
    if (!formik.values.toLocation.trim()) return

    const v = formik.values
    await onSubmit({
      subjectType: v.subjectType,

      subjectId: toUndef(v.subjectId),
      subjectNo: toUndef(v.subjectNo),

      orderId: toUndef(v.orderId),
      orderNo: toUndef(v.orderNo),

      containerId: showContainerFields ? toUndef(v.containerId) : undefined,
      containerNo: showContainerFields ? toUndef(v.containerNo) : undefined,

      fromLocation: v.fromLocation.trim(),
      toLocation: v.toLocation.trim(),
      plannedStartAt: toUndef(v.plannedStartAt),

      status: v.status,
      remark: toUndef(v.remark),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='row g-5'>
        {/* 類型 */}
        <div className='col-12 col-md-4'>
          <label className='form-label'>任務類型</label>
          <select className='form-select' {...formik.getFieldProps('subjectType')} disabled={submitting}>
            {SUBJECT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* 狀態 */}
        <div className='col-12 col-md-4'>
          <label className='form-label'>狀態</label>
          <select className='form-select' {...formik.getFieldProps('status')} disabled={submitting}>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* 預計時間 */}
        <div className='col-12 col-md-4'>
          <label className='form-label'>預計時間（可選）</label>
          <input
            type='datetime-local'
            className='form-control'
            {...formik.getFieldProps('plannedStartAt')}
            disabled={submitting}
          />
        </div>

        {/* subject fields（依類型顯示） */}
        {(showContainerFields || showTrailerFields || showVehicleFields) && (
          <>
            <div className='col-12 col-md-6'>
              <label className='form-label'>{showContainerFields ? '貨櫃編號' : showTrailerFields ? '板車編號' : '車牌/車頭編號'}</label>
              <input
                type='text'
                className='form-control'
                placeholder={showContainerFields ? '例如：OOLU1234567' : showTrailerFields ? '例如：TR-102' : '例如：KDD-5566'}
                {...formik.getFieldProps('subjectNo')}
                disabled={submitting}
              />
              <div className='form-text'>{subjectHint}</div>
            </div>

            <div className='col-12 col-md-6'>
              <label className='form-label'>標的 ID（可選）</label>
              <input
                type='text'
                className='form-control'
                placeholder='MVP 可留空（之後接 FMS/資產選擇器）'
                {...formik.getFieldProps('subjectId')}
                disabled={submitting}
              />
            </div>
          </>
        )}

        {subjectType === 'EMPTY_MOVE' && (
          <div className='col-12'>
            <div className='alert alert-info mb-0'>
              {subjectHint}
            </div>
          </div>
        )}

        {/* links（optional） */}
        <div className='col-12 col-md-6'>
          <label className='form-label'>訂單編號（可選）</label>
          <input
            type='text'
            className='form-control'
            placeholder='例如：TOM-2026-0001'
            {...formik.getFieldProps('orderNo')}
            disabled={submitting}
          />
          <div className='form-text'>若此任務源自訂單，可填入做關聯（MVP：先手動）。</div>
        </div>

        {showContainerFields && (
          <div className='col-12 col-md-6'>
            <label className='form-label'>貨櫃編號（關聯）（可選）</label>
            <input
              type='text'
              className='form-control'
              placeholder='例如：OOLU1234567'
              {...formik.getFieldProps('containerNo')}
              disabled={submitting}
            />
            <div className='form-text'>若此任務是貨櫃任務，這裡也可填（之後可由選擇器自動帶入）。</div>
          </div>
        )}

        {/* route */}
        <div className='col-12 col-md-6'>
          <label className='form-label'>起點</label>
          <input
            type='text'
            className='form-control'
            placeholder='例如：基隆港堆場'
            {...formik.getFieldProps('fromLocation')}
            required
            disabled={submitting}
          />
        </div>

        <div className='col-12 col-md-6'>
          <label className='form-label'>終點</label>
          <input
            type='text'
            className='form-control'
            placeholder='例如：桃園南崁倉'
            {...formik.getFieldProps('toLocation')}
            required
            disabled={submitting}
          />
        </div>

        {/* remark */}
        <div className='col-12'>
          <label className='form-label'>備註（可選）</label>
          <textarea
            className='form-control'
            rows={3}
            placeholder='例如：冷鏈/危品/需吊掛/拉空板回倉...'
            {...formik.getFieldProps('remark')}
            disabled={submitting}
          />
        </div>
      </div>

      <div className='d-flex justify-content-end gap-3 mt-8'>
        <button type='button' className='btn btn-light' onClick={onCancel} disabled={submitting}>
          取消
        </button>
        <button type='submit' className='btn btn-primary' disabled={submitting}>
          {submitting ? '建立中…' : '建立任務'}
        </button>
      </div>
    </form>
  )
}
