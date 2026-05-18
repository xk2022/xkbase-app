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
    phone: '', // 保留在 state 中但不在 UI 顯示
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
    const name = normalize(values.name)
    const password = normalize(values.password)
    const confirm = normalize(values.confirmPassword)
    const email = normalize(values.email)

    if (!username) e.username = '帳號為必填'
    if (!name) e.name = '顯示名稱為必填'
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

  const toggleRole = (code: string) => {
    setValues((p) => {
      const currentCodes = p.roleCodes ?? []
      if (currentCodes.includes(code)) {
        return {...p, roleCodes: currentCodes.filter((c) => c !== code)}
      } else {
        return {...p, roleCodes: [...currentCodes, code]}
      }
    })
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
        {/* 左側：輸入欄位 */}
        <div className='col-12 col-lg-7'>
          <div className='d-flex flex-column gap-5'>
            {/* 帳號 */}
            <div>
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

            {/* 顯示名稱 */}
            <div>
              <label className='form-label required fw-bold fs-6 text-gray-700 mb-2'>
                顯示名稱 <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className={`form-control form-control-solid ${invalid('name')}`}
                placeholder='例如：王小明'
                value={values.name ?? ''}
                onChange={setText('name')}
                onBlur={touch('name')}
                disabled={submitting}
              />
              {show('name') && <div className='invalid-feedback'>{errors.name}</div>}
            </div>

            {/* 初始密碼 */}
            <div>
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
              <div className='form-text text-muted fs-7 mt-1'>
                密碼規則：8–20 碼，需包含英文與數字
                <br />
                使用者首次登入後可自行修改密碼
              </div>
            </div>

            {/* 確認密碼 */}
            <div>
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

            {/* Email（選填） */}
            <div>
              <label className='form-label fw-bold fs-6 text-gray-700 mb-2'>
                Email <span className='text-muted fs-7'>(選填)</span>
              </label>
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
          </div>
        </div>

        {/* 右側：角色選擇 */}
        <div className='col-12 col-lg-5'>
          <div className='card card-flush h-100'>
            <div className='card-header border-0 pt-0 pb-4'>
              <div className='card-title'>
                <div className='form-text text-muted fs-7 mb-0'>
                  使用者權限由角色決定，請遵守最小權限原則
                </div>
              </div>
            </div>
            <div className='card-body pt-0'>
              <label className='form-label required fw-bold fs-6 text-gray-700 mb-3'>
                角色 <span className='text-danger'>*</span>{' '}
                {values.roleCodes.length > 0 && (
                  <span className='badge badge-light-info ms-2'>
                    已選 {values.roleCodes.length} 個
                  </span>
                )}
              </label>
              
              <div
                className={`border rounded p-3 ${invalid('roleCodes')}`}
                style={{
                  minHeight: 300,
                  maxHeight: 400,
                  overflowY: 'auto',
                  borderColor: show('roleCodes') ? 'var(--kt-danger)' : undefined,
                }}
                onBlur={touch('roleCodes')}
              >
                {loadingRoles ? (
                  <div className='text-center text-muted py-4'>
                    <span className='spinner-border spinner-border-sm me-2' />
                    載入角色中…
                  </div>
                ) : roleOptions.length === 0 ? (
                  <div className='text-center text-muted py-4'>
                    （目前沒有可選角色）
                  </div>
                ) : (
                  roleOptions.map((r) => (
                    <label
                      key={r.code}
                      className='form-check form-check-sm form-check-custom form-check-solid mb-3 d-flex align-items-center'
                      style={{cursor: submitting ? 'not-allowed' : 'pointer'}}
                    >
                      <input
                        type='checkbox'
                        className='form-check-input'
                        checked={values.roleCodes?.includes(r.code) ?? false}
                        onChange={() => toggleRole(r.code)}
                        disabled={submitting || loadingRoles}
                      />
                      <span className='form-check-label flex-grow-1'>
                        <span className='fw-semibold'>{r.name}</span>
                        <span className='text-muted fs-7 ms-2'>{r.code}</span>
                      </span>
                    </label>
                  ))
                )}
              </div>

              {show('roleCodes') && (
                <div className='invalid-feedback d-block mt-2'>{errors.roleCodes}</div>
              )}

              <div className='form-text text-muted fs-7 mt-3'>
                ⚠ 請避免給予 ADMIN 角色給非系統管理人員
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* begin::Actions */}
      <div className='d-flex justify-content-end gap-3 pt-5 border-top mt-6'>
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
