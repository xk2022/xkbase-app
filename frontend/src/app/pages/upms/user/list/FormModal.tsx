// src/app/pages/upms/user/FormModal.tsx
import React, { useEffect, useState } from 'react'
import { KTIcon } from '@/_metronic/helpers'

import type { AlertType } from '@/app/pages/common/AlertType'
import type { Role } from '../../role/Model'
import type { CreateUserReq, UpdateUserReq, User } from '../Model'
import { createUser, updateUser } from '../Query'

/**
 * ===============================================================
 * FormModal（UPMS 使用者快速編輯 Modal）
 * ---------------------------------------------------------------
 * 職責：
 * - Create / Edit 的「快速欄位」編輯
 * - Create：username / password / enabled / roleCodes
 * - Edit：username / enabled / roleCodes（不顯示密碼）
 *
 * 不做：
 * - Profile 詳細欄位（交給 detail page）
 * - 跳頁（交給父層 Overview）
 * ===============================================================
 */

type Props = {
  open: boolean
  onClose: () => void
  onSaved: () => void
  showAlert: (message: string, type: AlertType) => void
  roles: Role[]
  editingUser: User | null // null = create, 非 null = edit
}

const normalizeUsername = (v: string) => v.trim().toLowerCase()

export const FormModal: React.FC<Props> = ({
  open,
  onClose,
  onSaved,
  showAlert,
  roles,
  editingUser,
}) => {
  // =============================================================
  // Derived State
  // =============================================================
  const isEdit = !!editingUser

  // =============================================================
  // Form State
  // =============================================================
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('') // create-only
  const [enabled, setEnabled] = useState(true)
  const [roleCodes, setRoleCodes] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  // =============================================================
  // Init / Reset when open or editingUser changes
  // =============================================================
  useEffect(() => {
    if (!open) return

    if (!editingUser) {
      // Create mode defaults
      setUsername('')
      setPassword('')
      setEnabled(true)
      setRoleCodes([])
      return
    }

    // Edit mode - preload
    setUsername(editingUser.username ?? '')
    setPassword('') // Edit 不顯示密碼
    setEnabled(!!editingUser.enabled)
    setRoleCodes(editingUser.roleCodes ?? [])
  }, [open, editingUser])

  // =============================================================
  // Role Toggle
  // =============================================================
  const toggleRole = (code: string) => {
    setRoleCodes((prev) =>
      prev.includes(code) ? prev.filter((x) => x !== code) : [...prev, code],
    )
  }

  // =============================================================
  // Validation
  // =============================================================
  const validate = () => {
    if (!normalizeUsername(username)) {
      showAlert('請輸入帳號（username）', 'warning')
      return false
    }
    if (!isEdit && !password.trim()) {
      showAlert('請輸入初始密碼（password）', 'warning')
      return false
    }
    if (!roleCodes.length) {
      showAlert('請至少選擇 1 個角色（roleCodes）', 'warning')
      return false
    }
    return true
  }

  // =============================================================
  // Save Handler
  // =============================================================
  const handleSave = async () => {
    if (!validate()) return

    try {
      setSaving(true)

      if (isEdit && editingUser) {
        const payload: UpdateUserReq = {
          username: normalizeUsername(username),
          enabled,
          roleCodes,
        }
        await updateUser(editingUser.id, payload, showAlert)
      } else {
        const payload: CreateUserReq = {
          username: normalizeUsername(username),
          password: password.trim(),
          roleCodes,
        }
        await createUser(payload, showAlert)
      }

      onSaved()
    } catch (e) {
      console.error(e)
      showAlert('儲存失敗，請稍後再試', 'danger')
    } finally {
      setSaving(false)
    }
  }

  // =============================================================
  // Render Guards
  // =============================================================
  if (!open) return null

  // =============================================================
  // Render
  // =============================================================
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
          {/* Header */}
          <div className='modal-header'>
            <h5 className='modal-title'>
              <KTIcon
                iconName={isEdit ? 'message-edit' : 'plus'}
                className='fs-2 me-2'
              />
              {isEdit ? '編輯使用者' : '新增使用者'}
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

          {/* Body */}
          <div className='modal-body'>
            <div className='row g-5'>
              {/* Left */}
              <div className='col-12 col-md-6 d-flex flex-column gap-3'>
                <div>
                  <label className='form-label required'>帳號（username）</label>
                  <input
                    className='form-control'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='例如：admin'
                    autoFocus
                  />
                  <div className='text-muted fs-8 mt-1'>
                    會自動 trim + lower（避免 Admin / admin 重複）
                  </div>
                </div>

                {!isEdit && (
                  <div>
                    <label className='form-label required'>初始密碼（password）</label>
                    <input
                      className='form-control'
                      type='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder='請輸入初始密碼'
                    />
                  </div>
                )}

                <div className='form-check form-switch form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    id='userEnabledSwitch'
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                  />
                  <label className='form-check-label' htmlFor='userEnabledSwitch'>
                    啟用
                  </label>
                </div>
              </div>

              {/* Right */}
              <div className='col-12 col-md-6'>
                <label className='form-label required'>角色（至少 1）</label>

                <div
                  className='border rounded p-3'
                  style={{ maxHeight: 260, overflowY: 'auto' }}
                >
                  {roles.length === 0 ? (
                    <div className='text-muted'>目前尚無角色資料</div>
                  ) : (
                    roles.map((r) => (
                      <label
                        key={r.id}
                        className='form-check form-check-sm form-check-custom mb-2'
                      >
                        <input
                          type='checkbox'
                          className='form-check-input'
                          checked={roleCodes.includes(r.code)}
                          onChange={() => toggleRole(r.code)}
                        />
                        <span className='form-check-label'>
                          {r.code} - {r.name}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
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
