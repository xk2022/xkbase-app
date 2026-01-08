// src/app/pages/<module>/<entity>/create/CreateForm.tsx
import React, {useEffect, useMemo, useState} from 'react'
import type {AlertFn} from '@/app/pages/common/AlertType'

/** ===============================================================
 * Types
 * - FormValues：表單用型別（可以和 API Req 不同）
 * =============================================================== */
export type CreateXxxFormValues = {
  name: string
  remark?: string
  enabled: boolean

  // 若有多選
  roleCodes?: string[]
}

type Props = {
  submitting?: boolean
  onSubmit: (values: CreateXxxFormValues) => void | Promise<void>
  onCancel: () => void
}

/** ===============================================================
 * Helpers
 * =============================================================== */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const CreateForm: React.FC<Props> = ({
  submitting = false,
  onSubmit,
  onCancel,
}) => {
  /** -----------------------------
   * State
   * ------------------------------ */
  const [values, setValues] = useState<CreateXxxFormValues>({
    name: '',
    remark: '',
    enabled: true,
    roleCodes: [],
  })

  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)

  /** -----------------------------
   * Options (example)
   * - 下拉選項屬於 UI 資料，放在 Form
   * ------------------------------ */
  // const {showAlert} = useAlert() // 如果需要在 Form 內提示
  // useEffect(() => { loadOptions(showAlert) }, [])

  /** -----------------------------
   * Derived: errors
   * ------------------------------ */
  const errors: Partial<Record<keyof CreateXxxFormValues, string>> = useMemo(() => {
    const e: Partial<Record<keyof CreateXxxFormValues, string>> = {}

    if (!values.name.trim()) e.name = '名稱為必填'
    if ((values.remark ?? '').length > 255) e.remark = '備註不可超過 255'

    // 若有多選角色
    if ((values.roleCodes ?? []).length === 0) e.roleCodes = '至少需選擇 1 個角色'

    return e
  }, [values])

  const show = (k: keyof CreateXxxFormValues) =>
    (submitted || touched[k as string]) && !!errors[k]

  const invalid = (k: keyof CreateXxxFormValues) => (show(k) ? 'is-invalid' : '')

  /** -----------------------------
   * Handlers
   * ------------------------------ */
  const set =
    (k: keyof CreateXxxFormValues) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) =>
      setValues((p) => ({...p, [k]: e.target.value}))

  const touch = (k: keyof CreateXxxFormValues) => () =>
    setTouched((p) => ({...p, [k]: true}))

  // 多選角色範例
  const setMulti = (k: 'roleCodes') => (e: React.ChangeEvent<HTMLSelectElement>) => {
    const arr = Array.from(e.target.selectedOptions).map((o) => o.value)
    setValues((p) => ({...p, [k]: arr}))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length) return
    await onSubmit(values)
  }

  /** -----------------------------
   * Render
   * ------------------------------ */
  return (
    <form onSubmit={submit} className='form'>
      <div className='row g-6'>
        <div className='col-12 col-lg-6'>
          <label className='form-label fw-bold'>
            名稱 <span className='text-danger'>*</span>
          </label>
          <input
            className={`form-control form-control-solid ${invalid('name')}`}
            value={values.name}
            onChange={set('name')}
            onBlur={touch('name')}
            disabled={submitting}
            placeholder='請輸入名稱'
          />
          {show('name') && <div className='invalid-feedback'>{errors.name}</div>}
        </div>

        <div className='col-12'>
          <label className='form-label fw-bold'>備註</label>
          <textarea
            className={`form-control form-control-solid ${invalid('remark')}`}
            rows={3}
            value={values.remark ?? ''}
            onChange={set('remark')}
            onBlur={touch('remark')}
            disabled={submitting}
            placeholder='可留空'
          />
          {show('remark') && (
            <div className='invalid-feedback d-block'>{errors.remark}</div>
          )}
        </div>

        <div className='col-12'>
          <div className='form-check form-switch'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={!!values.enabled}
              onChange={(e) => setValues((p) => ({...p, enabled: e.target.checked}))}
              disabled={submitting}
            />
            <label className='form-check-label'>啟用</label>
          </div>
        </div>

        {/* 多選角色範例（若無可刪） */}
        <div className='col-12'>
          <label className='form-label fw-bold'>
            角色 <span className='text-danger'>*</span>
          </label>
          <select
            className={`form-select form-select-solid ${invalid('roleCodes')}`}
            multiple
            value={values.roleCodes ?? []}
            onChange={setMulti('roleCodes')}
            onBlur={touch('roleCodes')}
            disabled={submitting}
            style={{minHeight: 140}}
          >
            {/* options map */}
          </select>
          {show('roleCodes') && (
            <div className='invalid-feedback d-block'>{errors.roleCodes}</div>
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
          {submitting ? '送出中…' : '建立'}
        </button>
      </div>
    </form>
  )
}
