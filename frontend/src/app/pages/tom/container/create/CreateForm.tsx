// src/app/pages/tom/container/create/CreateForm.tsx
import React from 'react'
import { useFormik } from 'formik'

import type { ContainerStatus, ContainerType, CreateContainerFormValues } from '../Model'

interface Props {
  submitting: boolean
  onSubmit: (v: CreateContainerFormValues) => void | Promise<void>
  onCancel: () => void
}

/**
 * ===============================================================
 * CreateForm (MVP)
 * - 只收集「最小建檔」欄位
 * - 驗證只做 required（HTML required），不要在 MVP 卡太死
 *
 * MVP 欄位：
 * - containerNo
 * - type
 * - status
 * - weight? / remark?
 * ===============================================================
 */

const STATUS_OPTIONS: Array<{ value: ContainerStatus; label: string }> = [
  { value: 'UNASSIGNED', label: '未指派' },
  { value: 'ASSIGNED', label: '已指派' },
  { value: 'IN_PROGRESS', label: '進行中' },
  { value: 'DONE', label: '已完成' },
  { value: 'CANCELLED', label: '已取消' },
]

const TYPE_OPTIONS: Array<{ value: ContainerType; label: string }> = [
  { value: '20GP', label: '20GP' },
  { value: '40GP', label: '40GP' },
  { value: '40HQ', label: '40HQ' },
  { value: '45HQ', label: '45HQ' },
  { value: '40RH', label: '40RH（冷鏈）' },
  { value: 'OTHER', label: '其他' },
]

export const CreateForm: React.FC<Props> = ({ submitting, onSubmit, onCancel }) => {
  const formik = useFormik<CreateContainerFormValues>({
    initialValues: {
      containerNo: '',
      type: '20GP',
      status: 'UNASSIGNED',
      weight: '',
      remark: '',
    },
    onSubmit,
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='row g-5'>
        {/* 貨櫃編號 */}
        <div className='col-md-6'>
          <label className='form-label required'>貨櫃編號</label>
          <input
            type='text'
            className='form-control'
            placeholder='例如：OOLU1234567'
            {...formik.getFieldProps('containerNo')}
            required
            disabled={submitting}
          />
          <div className='form-text'>MVP：先手動輸入；後續可加「掃碼/校驗規則」。</div>
        </div>

        {/* 櫃型 */}
        <div className='col-md-3'>
          <label className='form-label required'>櫃型</label>
          <select
            className='form-select'
            {...formik.getFieldProps('type')}
            required
            disabled={submitting}
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* 狀態 */}
        <div className='col-md-3'>
          <label className='form-label required'>狀態</label>
          <select
            className='form-select'
            {...formik.getFieldProps('status')}
            required
            disabled={submitting}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* 重量（可選） */}
        <div className='col-md-6'>
          <label className='form-label'>重量（可選）</label>
          <input
            type='text'
            className='form-control'
            placeholder='例如：12800 kg'
            {...formik.getFieldProps('weight')}
            disabled={submitting}
          />
          <div className='form-text'>MVP：先用文字；後續再改成數字欄位 + 單位。</div>
        </div>

        {/* 特殊需求 / 備註（可選） */}
        <div className='col-md-12'>
          <label className='form-label'>特殊需求（可選）</label>
          <textarea
            className='form-control'
            rows={3}
            placeholder='例如：冷鏈、危品、需吊掛、勿碰撞...'
            {...formik.getFieldProps('remark')}
            disabled={submitting}
          />
        </div>
      </div>

      {/* actions */}
      <div className='d-flex justify-content-end gap-3 mt-8'>
        <button type='button' className='btn btn-light' onClick={onCancel} disabled={submitting}>
          取消
        </button>
        <button type='submit' className='btn btn-primary' disabled={submitting}>
          {submitting ? '建立中…' : '建立貨櫃'}
        </button>
      </div>
    </form>
  )
}
