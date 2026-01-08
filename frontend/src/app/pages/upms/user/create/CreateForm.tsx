// src/app/pages/upms/user/create/CreateForm.tsx
import React, {useEffect, useMemo, useState} from 'react'

import type {CreateUserFormValues} from '../Model'
import type {RoleOptionResp} from '../../role/Model'
import {fetchOptions} from '../../role/Query'

/** ===============================================================
 * Types
 * =============================================================== */
type Props = {
  submitting?: boolean
  onSubmit: (values: CreateUserFormValues) => void | Promise<void>
  onCancel: () => void
}

/** ===============================================================
 * Helpers
 * =============================================================== */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const normalize = (s?: string) => (s ?? '').trim()

/** ===============================================================
 * Component
 * =============================================================== */
export const CreateForm: React.FC<Props> = ({
  submitting = false,
  onSubmit,
  onCancel,
}) => {
  /** -----------------------------
   * State (single source of truth)
   * ------------------------------ */
  const [values, setValues] = useState<CreateUserFormValues>({
    username: '',
    password: '',
    confirmPassword: '',
    roleCodes: [],
    name: '',
    email: '',
    phone: '',
  })

  const [roleOptions, setRoleOptions] = useState<RoleOptionResp[]>([])
  const [loadingRoles, setLoadingRoles] = useState(false)

  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)

  /** -----------------------------
   * Load role options
   * ------------------------------ */
  useEffect(() => {
    let mounted = true

    const run = async () => {
      setLoadingRoles(true)
      try {
        const list = await fetchOptions() // 不依賴 showAlert
        if (!mounted) return
        setRoleOptions(list)
      } finally {
        if (mounted) setLoadingRoles(false)
      }
    }

    run()
    return () => {
      mounted = false
    }
  }, [])

  /** -----------------------------
   * Derived: errors
   * ------------------------------ */
  const errors: Partial<Record<keyof CreateUserFormValues, string>> = useMemo(() => {
    const e: Partial<Record<keyof CreateUserFormValues, string>> = {}

    const username = normalize(values.username)
    const password = normalize(values.password)
    const confirm = normalize(values.confirmPassword)
    const email = normalize(values.email)

    if (!username) e.username = '帳號為必填'
    if (!password) e.password = '密碼為必填'
    if (!confirm) e.confirmPassword = '請再次輸入密碼'
    if (password && confirm && password !== confirm)
      e.confirmPassword = '兩次密碼輸入不一致'

    if ((values.roleCodes ?? []).length === 0) e.roleCodes = '至少需選擇 1 個角色'

    if (email && !EMAIL_RE.test(email)) e.email = 'Email 格式不正確'

    return e
  }, [values])

  const show = (k: keyof CreateUserFormValues) =>
    (submitted || touched[k as string]) && !!errors[k]
  const invalid = (k: keyof CreateUserFormValues) => (show(k) ? 'is-invalid' : '')

  /** -----------------------------
   * Handlers
   * ------------------------------ */
  const setText =
    (k: keyof CreateUserFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((p) => ({...p, [k]: e.target.value}))

  const touch = (k: keyof CreateUserFormValues) => () =>
    setTouched((p) => ({...p, [k]: true}))

  const onRolesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const codes = Array.from(e.target.selectedOptions).map((o) => o.value)
    setValues((p) => ({...p, roleCodes: codes}))
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
      <div className='row g-5 mb-5'>
        {/* 第一行：帳號、顯示名稱 */}
        <div className='col-12 col-lg-6'>
          <label className='form-label required fw-bold fs-6 text-gray-700 mb-2'>
            帳號 <span className='text-danger'>*</span>
          </label>
          <input
            type='text'
            className={`form-control form-control-solid ${invalid('username')}`}
            placeholder='例如：admin'
            value={values.username}
            onChange={setText('username')}
            onBlur={touch('username')}
            autoComplete='off'
            disabled={submitting}
          />
          {show('username') && <div className='invalid-feedback'>{errors.username}</div>}
        </div>

        <div className='col-12 col-lg-6'>
          <label className='form-label fw-bold fs-6 text-gray-700 mb-2'>顯示名稱</label>
          <input
            type='text'
            className='form-control form-control-solid'
            placeholder='例如：王小明'
            value={values.name ?? ''}
            onChange={setText('name')}
            disabled={submitting}
          />
        </div>
      </div>

      <div className='row g-5 mb-5'>
        {/* 第二行：初始密碼、確認密碼 */}
        <div className='col-12 col-lg-6'>
          <label className='form-label required fw-bold fs-6 text-gray-700 mb-2'>
            初始密碼 <span className='text-danger'>*</span>
          </label>
          <input
            type='password'
            className={`form-control form-control-solid ${invalid('password')}`}
            placeholder='請輸入初始密碼'
            value={values.password}
            onChange={setText('password')}
            onBlur={touch('password')}
            autoComplete='new-password'
            disabled={submitting}
          />
          {show('password') && <div className='invalid-feedback'>{errors.password}</div>}
        </div>

        <div className='col-12 col-lg-6'>
          <label className='form-label required fw-bold fs-6 text-gray-700 mb-2'>
            確認密碼 <span className='text-danger'>*</span>
          </label>
          <input
            type='password'
            className={`form-control form-control-solid ${invalid('confirmPassword')}`}
            placeholder='請再次輸入密碼'
            value={values.confirmPassword}
            onChange={setText('confirmPassword')}
            onBlur={touch('confirmPassword')}
            autoComplete='new-password'
            disabled={submitting}
          />
          {show('confirmPassword') && (
            <div className='invalid-feedback'>{errors.confirmPassword}</div>
          )}
        </div>
      </div>

      <div className='row g-5 mb-5'>
        {/* 第三行：Email、電話 */}
        <div className='col-12 col-lg-6'>
          <label className='form-label fw-bold fs-6 text-gray-700 mb-2'>Email</label>
          <input
            type='email'
            className={`form-control form-control-solid ${invalid('email')}`}
            placeholder='example@company.com'
            value={values.email ?? ''}
            onChange={setText('email')}
            onBlur={touch('email')}
            disabled={submitting}
          />
          {show('email') && <div className='invalid-feedback'>{errors.email}</div>}
        </div>

        <div className='col-12 col-lg-6'>
          <label className='form-label fw-bold fs-6 text-gray-700 mb-2'>電話</label>
          <input
            type='tel'
            className='form-control form-control-solid'
            placeholder='例如：0912-345-678'
            value={values.phone ?? ''}
            onChange={setText('phone')}
            disabled={submitting}
          />
        </div>
      </div>

      <div className='mb-5'>
        {/* 角色選擇 */}
        <label className='form-label required fw-bold fs-6 text-gray-700 mb-2'>
          角色 <span className='text-danger'>*</span>{' '}
          {values.roleCodes.length > 0 && (
            <span className='badge badge-light-info ms-2'>
              已選 {values.roleCodes.length} 個
            </span>
          )}
        </label>
        <select
          className={`form-select form-select-solid ${invalid('roleCodes')}`}
          multiple
          value={values.roleCodes ?? []}
          onChange={onRolesChange}
          onBlur={touch('roleCodes')}
          disabled={submitting || loadingRoles}
          style={{minHeight: 100}}
        >
          {roleOptions.length === 0 ? (
            <option value='' disabled>
              {loadingRoles ? '載入角色中…' : '（目前沒有可選角色）'}
            </option>
          ) : (
            roleOptions.map((r) => (
              <option key={r.code} value={r.code}>
                {r.code}（{r.name}）
              </option>
            ))
          )}
        </select>

        {show('roleCodes') && (
          <div className='invalid-feedback d-block'>{errors.roleCodes}</div>
        )}

        <div className='form-text text-muted fs-7 mt-2'>
          按住 <kbd className='badge badge-light-primary fs-8'>⌘</kbd>（Mac）或{' '}
          <kbd className='badge badge-light-primary fs-8'>Ctrl</kbd>（Windows）可多選
        </div>
      </div>

      {/* begin::Actions */}
      <div className='d-flex justify-content-end gap-3 pt-5 border-top'>
        <button
          type='button'
          className='btn btn-light btn-active-light-primary'
          onClick={onCancel}
          disabled={submitting}
        >
          取消
        </button>
        <button type='submit' className='btn btn-primary' disabled={submitting}>
          {submitting && <span className='spinner-border spinner-border-sm align-middle me-2' />}
          {submitting ? '建立中...' : '建立使用者'}
        </button>
      </div>
      {/* end::Actions */}
    </form>
  )
}

export default CreateForm
