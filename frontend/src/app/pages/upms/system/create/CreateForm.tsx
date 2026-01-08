// src/app/pages/upms/system/create/CreateForm.tsx
import React, {useMemo, useState} from 'react'

import {trim, toUndef, upper, CODE_RE} from '@/app/pages/common/form/formUtils'
import {useFormMeta} from '@/app/pages/common/form/useFormMeta'

import type {CreateSystemReq} from '../Model'

/** ===============================================================
 * Types
 * =============================================================== */
type Props = {
  submitting?: boolean
  onSubmit: (values: CreateSystemReq) => void | Promise<void>
  onCancel: () => void
}

/** ===============================================================
 * Component
 * =============================================================== */
export const CreateForm: React.FC<Props> = ({
  submitting = false,
  onSubmit,
  onCancel,
}) => {
  /** -----------------------------
   * State
   * ------------------------------ */
  const [values, setValues] = useState<CreateSystemReq>({
    code: '',
    name: '',
    enabled: true,
    remark: '',
  })

  /** ===============================================================
   * Helpers
   * =============================================================== */
  const {touch, markSubmitted, showError, invalidClass} =
    useFormMeta<CreateSystemReq>()

  /** -----------------------------
   * Derived
   * ------------------------------ */
  const errors: Partial<Record<keyof CreateSystemReq, string>> = useMemo(() => {
    const e: Partial<Record<keyof CreateSystemReq, string>> = {}

    const code = upper(values.code)
    const name = trim(values.name)

    if (!code) e.code = '系統代碼為必填'
    else if (!CODE_RE.test(code))
      e.code = '格式不正確（2~50，英數 + _-，且需以英數開頭）'

    if (!name) e.name = '系統名稱為必填'
    else if (name.length > 100) e.name = '系統名稱長度不可超過 100'

    // remark 可選
    if (values.remark && trim(values.remark).length > 500)
      e.remark = '備註長度不可超過 500'

    return e
  }, [values])

  /** -----------------------------
   * Handlers
   * ------------------------------ */
  const set =
    (k: keyof CreateSystemReq) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setValues((p) => ({...p, [k]: e.target.value}))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    markSubmitted()
    if (Object.keys(errors).length) return

    await onSubmit({
      ...values,
      code: upper(values.code),
      name: trim(values.name),
      remark: toUndef(values.remark),
      enabled: !!values.enabled,
    })
  }

  return (
    <form onSubmit={submit} className='form'>
      <div className='row g-6'>
        {/* code */}
        <div className='col-12 col-lg-4'>
          <label className='form-label fw-bold'>
            系統代碼 <span className='text-danger'>*</span>
          </label>
          <input
            className={`form-control form-control-solid ${invalidClass(
              'code',
              errors,
            )}`}
            placeholder='例如：UPMS / TOM / ADM'
            value={values.code}
            onChange={(e) =>
              setValues((p) => ({...p, code: e.target.value.toUpperCase()}))
            }
            onBlur={touch('code')}
            disabled={submitting}
            autoFocus
          />
          <div className='form-text text-muted'>
            會自動轉大寫；允許英數 + <code>_</code> / <code>-</code>
          </div>
          {showError('code', errors) && (
            <div className='invalid-feedback'>{errors.code}</div>
          )}
        </div>

        {/* name */}
        <div className='col-12 col-lg-8'>
          <label className='form-label fw-bold'>
            系統名稱 <span className='text-danger'>*</span>
          </label>
          <input
            className={`form-control form-control-solid ${invalidClass(
              'name',
              errors,
            )}`}
            placeholder='例如：權限管理系統'
            value={values.name}
            onChange={set('name')}
            onBlur={touch('name')}
            disabled={submitting}
          />
          {showError('name', errors) && (
            <div className='invalid-feedback'>{errors.name}</div>
          )}
        </div>

        {/* enabled */}
        <div className='col-12'>
          <div className='form-check form-switch'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={!!values.enabled}
              onChange={(e) =>
                setValues((p) => ({...p, enabled: e.target.checked}))
              }
              disabled={submitting}
            />
            <label className='form-check-label'>啟用</label>
          </div>
          <div className='text-muted fs-8 mt-1'>
            停用後通常不允許登入或不顯示於下拉選單（視後端規則）
          </div>
        </div>

        {/* remark */}
        <div className='col-12'>
          <label className='form-label fw-bold'>備註</label>
          <textarea
            className={`form-control form-control-solid ${invalidClass(
              'remark',
              errors,
            )}`}
            placeholder='可留空'
            rows={3}
            value={values.remark ?? ''}
            onChange={set('remark')}
            onBlur={touch('remark')}
            disabled={submitting}
          />
          {showError('remark', errors) && (
            <div className='invalid-feedback d-block'>{errors.remark}</div>
          )}
        </div>
      </div>

      <div className='d-flex justify-content-end gap-3 mt-10'>
        <button
          type='button'
          className='btn btn-light'
          onClick={onCancel}
          disabled={submitting}
        >
          取消
        </button>
        <button type='submit' className='btn btn-primary' disabled={submitting}>
          新增系統
        </button>
      </div>
    </form>
  )
}
