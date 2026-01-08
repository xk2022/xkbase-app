// src/app/pages/upms/role/create/CreateForm.tsx
import React, {useMemo, useState} from 'react'
import {KTIcon} from '@/_metronic/helpers'

import {trim, toUndef, upper, CODE_RE} from '@/app/pages/common/form/formUtils'
import {useFormMeta} from '@/app/pages/common/form/useFormMeta'

/** ===============================================================
 * Types
 * =============================================================== */
export type RoleFormValues = {
  code: string
  name: string
  description?: string
  enabled: boolean
  /**
   * 逗號分隔的權限代碼字串
   * 例如： "UPMS_USER_VIEW, UPMS_USER_CREATE"
   */
  permissionCodes?: string
}

type Props = {
  submitting?: boolean
  onSubmit: (values: RoleFormValues) => void | Promise<void>
  onCancel?: () => void
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
  const [values, setValues] = useState<RoleFormValues>({
    code: '',
    name: '',
    description: '',
    enabled: true,
    permissionCodes: '',
  })

  const {touch, markSubmitted, showError, invalidClass} =
    useFormMeta<RoleFormValues>()

  /** -----------------------------
   * Validation
   * ------------------------------ */
  const errors: Partial<Record<keyof RoleFormValues, string>> = useMemo(() => {
    const e: Partial<Record<keyof RoleFormValues, string>> = {}

    const code = upper(values.code)
    const name = trim(values.name)

    if (!code) e.code = '角色代碼為必填'
    else if (!CODE_RE.test(code))
      e.code = '格式不正確（2~50，英數 + _-，需以英數開頭）'

    if (!name) e.name = '角色名稱為必填'
    else if (name.length > 100) e.name = '角色名稱長度不可超過 100'

    if (values.description && trim(values.description).length > 500)
      e.description = '說明長度不可超過 500'

    if (values.permissionCodes && trim(values.permissionCodes).length > 2000)
      e.permissionCodes = '權限代碼字串過長'

    return e
  }, [values])

  /** -----------------------------
   * Handlers
   * ------------------------------ */
  const set =
    (k: keyof RoleFormValues) =>
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
      code: upper(values.code),
      name: trim(values.name),
      description: toUndef(values.description),
      enabled: !!values.enabled,
      permissionCodes: toUndef(values.permissionCodes),
    })
  }

  /** -----------------------------
   * Render
   * ------------------------------ */
  return (
    <form onSubmit={submit} className='form'>
      <div className='row g-6'>
        {/* Left: Basic */}
        <div className='col-12 col-lg-6 d-flex flex-column gap-6'>
          {/* code */}
          <div>
            <label className='form-label fw-bold'>
              角色代碼 <span className='text-danger'>*</span>
            </label>
            <input
              className={`form-control form-control-solid ${invalidClass(
                'code',
                errors,
              )}`}
              placeholder='例如：SYS_ADMIN / DRIVER'
              value={values.code}
              onChange={(e) =>
                setValues((p) => ({...p, code: e.target.value.toUpperCase()}))
              }
              onBlur={touch('code')}
              disabled={submitting}
            />
            {showError('code', errors) && (
              <div className='invalid-feedback'>{errors.code}</div>
            )}
            <div className='form-text text-muted'>
              建議使用全大寫英數與底線（例如 SYS_ADMIN）
            </div>
          </div>

          {/* name */}
          <div>
            <label className='form-label fw-bold'>
              角色名稱 <span className='text-danger'>*</span>
            </label>
            <input
              className={`form-control form-control-solid ${invalidClass(
                'name',
                errors,
              )}`}
              placeholder='例如：系統管理員 / 司機'
              value={values.name}
              onChange={set('name')}
              onBlur={touch('name')}
              disabled={submitting}
            />
            {showError('name', errors) && (
              <div className='invalid-feedback'>{errors.name}</div>
            )}
          </div>

          {/* description */}
          <div>
            <label className='form-label fw-bold'>說明</label>
            <textarea
              className={`form-control form-control-solid ${invalidClass(
                'description',
                errors,
              )}`}
              placeholder='可填寫此角色的權限範圍、使用場景…'
              rows={3}
              value={values.description ?? ''}
              onChange={set('description')}
              onBlur={touch('description')}
              disabled={submitting}
            />
            {showError('description', errors) && (
              <div className='invalid-feedback d-block'>
                {errors.description}
              </div>
            )}
          </div>

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
            停用後通常不會被指派或不顯示於下拉選單
          </div>
        </div>

        {/* Right: Permissions */}
        <div className='col-12 col-lg-6'>
          <label className='form-label fw-bold'>權限代碼</label>
          <textarea
            className={`form-control form-control-solid ${invalidClass(
              'permissionCodes',
              errors,
            )}`}
            rows={10}
            placeholder='以逗號分隔多個權限代碼，例如：UPMS_USER_VIEW, UPMS_USER_CREATE'
            value={values.permissionCodes ?? ''}
            onChange={set('permissionCodes')}
            onBlur={touch('permissionCodes')}
            disabled={submitting}
          />
          {showError('permissionCodes', errors) && (
            <div className='invalid-feedback d-block'>
              {errors.permissionCodes}
            </div>
          )}
          <div className='form-text text-muted'>
            目前使用逗號分隔字串；未來可升級為多選清單或權限樹
          </div>
        </div>
      </div>

      <div className='d-flex justify-content-end gap-3 mt-10'>
        {onCancel && (
          <button
            type='button'
            className='btn btn-light'
            onClick={onCancel}
            disabled={submitting}
          >
            取消
          </button>
        )}
        <button type='submit' className='btn btn-primary' disabled={submitting}>
          <KTIcon iconName='plus' className='fs-2 me-2' />
          新增角色
        </button>
      </div>
    </form>
  )
}
