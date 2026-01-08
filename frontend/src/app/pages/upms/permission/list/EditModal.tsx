// src/app/pages/upms/permission/list/EditModal.tsx
import React, {useEffect, useMemo, useState} from 'react'
import {KTIcon} from '@/_metronic/helpers'

import type {AlertType} from '@/app/pages/common/AlertType'
import type {Permission, UpdatePermissionReq} from '../Model'
import {updatePermission} from '../Query'

/**
 * ===============================================================
 * EditModal（UPMS Permission 快速編輯 Modal）
 * ---------------------------------------------------------------
 * 職責：
 * - List 內快速編輯（v1 先做：name / enabled / description / sortOrder）
 * - 不改 code / systemCode / resourceCode / actionCode（避免破壞授權邏輯）
 *
 * 不做：
 * - Create（權限建立建議走 CreatePage，避免在列表塞太多欄位）
 * - 權限關聯（RolePermission 綁定）
 * ===============================================================
 */

type Props = {
  open: boolean
  onClose: () => void
  onSaved: () => void
  showAlert: (message: string, type: AlertType) => void
  editingPermission: Permission | null
}

const trim = (v?: string) => (v ?? '').trim()
const toUndef = (v?: string) => {
  const t = trim(v)
  return t ? t : undefined
}
const toIntOrUndef = (v: string): number | undefined => {
  const t = trim(v)
  if (!t) return undefined
  const n = Number.parseInt(t, 10)
  return Number.isFinite(n) ? n : undefined
}

export const EditModal: React.FC<Props> = ({
  open,
  onClose,
  onSaved,
  showAlert,
  editingPermission,
}) => {
  // =============================================================
  // Guards
  // =============================================================
  const isEdit = !!editingPermission
  const id = editingPermission?.id

  // =============================================================
  // Form State
  // =============================================================
  const [name, setName] = useState('')
  const [enabled, setEnabled] = useState(true)
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [saving, setSaving] = useState(false)

  // =============================================================
  // Init / Reset
  // =============================================================
  useEffect(() => {
    if (!open) return

    if (!editingPermission) {
      // 沒有目標就直接清空（理論上不會發生）
      setName('')
      setEnabled(true)
      setDescription('')
      setSortOrder('0')
      return
    }

    setName(editingPermission.name ?? '')
    setEnabled(!!editingPermission.enabled)
    setDescription(editingPermission.description ?? '')
    setSortOrder(String(editingPermission.sortOrder ?? 0))
  }, [open, editingPermission])

  // =============================================================
  // Validation
  // =============================================================
  const errors = useMemo(() => {
    const e: {name?: string; sortOrder?: string; description?: string} = {}

    const n = trim(name)
    if (!n) e.name = '請輸入權限名稱（name）'
    else if (n.length > 200) e.name = '權限名稱長度不可超過 200'

    const s = trim(sortOrder)
    if (s) {
      const parsed = Number.parseInt(s, 10)
      if (!Number.isFinite(parsed)) e.sortOrder = '排序必須是整數'
      else if (parsed < 0) e.sortOrder = '排序不可小於 0'
      else if (parsed > 999999) e.sortOrder = '排序過大（<= 999999）'
    }

    if (description && trim(description).length > 500) {
      e.description = '描述長度不可超過 500'
    }

    return e
  }, [name, sortOrder, description])

  const hasErrors = Object.keys(errors).length > 0

  // =============================================================
  // Save
  // =============================================================
  const handleSave = async () => {
    if (!isEdit || !id) {
      showAlert('缺少權限識別碼，無法更新', 'danger')
      return
    }
    if (hasErrors) {
      showAlert('請先修正欄位錯誤再儲存', 'warning')
      return
    }

    const payload: UpdatePermissionReq = {
      name: trim(name),
      enabled,
      description: toUndef(description),
      sortOrder: toIntOrUndef(sortOrder),
    }

    try {
      setSaving(true)
      const updated = await updatePermission(String(id), payload, showAlert)
      if (updated) onSaved()
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
      style={{backgroundColor: 'rgba(0,0,0,.25)'}}
      role='dialog'
      aria-modal='true'
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          {/* Header */}
          <div className='modal-header'>
            <h5 className='modal-title'>
              <KTIcon iconName='message-edit' className='fs-2 me-2' />
              編輯權限
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
            {/* immutable info */}
            <div className='mb-6'>
              <div className='d-flex flex-wrap gap-2 align-items-center'>
                <span className='badge badge-light fw-bolder'>
                  code：{editingPermission?.code ?? '-'}
                </span>
                <span className='badge badge-light fw-bolder'>
                  system：{editingPermission?.systemCode ?? '-'}
                </span>
                <span className='badge badge-light fw-bolder'>
                  resource：{editingPermission?.resourceCode ?? '-'}
                </span>
                <span className='badge badge-light fw-bolder'>
                  action：{editingPermission?.actionCode ?? '-'}
                </span>
              </div>
              {editingPermission?.id && (
                <div className='text-muted fs-8 mt-2'>
                  Permission ID：<span className='fw-semibold'>{String(editingPermission.id)}</span>
                </div>
              )}
            </div>

            <div className='row g-5'>
              {/* Left */}
              <div className='col-12 col-md-6 d-flex flex-column gap-3'>
                <div>
                  <label className='form-label required'>權限名稱（name）</label>
                  <input
                    className={`form-control form-control-solid ${errors.name ? 'is-invalid' : ''}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='例如：角色-查詢'
                    autoFocus
                    disabled={saving}
                  />
                  {errors.name && <div className='invalid-feedback'>{errors.name}</div>}
                </div>

                <div>
                  <label className='form-label'>排序（sortOrder）</label>
                  <input
                    type='number'
                    className={`form-control form-control-solid ${errors.sortOrder ? 'is-invalid' : ''}`}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    min={0}
                    step={1}
                    disabled={saving}
                  />
                  {errors.sortOrder && (
                    <div className='invalid-feedback'>{errors.sortOrder}</div>
                  )}
                  <div className='text-muted fs-8 mt-1'>用於列表/樹狀顯示排序（0 起）</div>
                </div>

                <div className='form-check form-switch form-check-custom form-check-solid mt-2'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    id='permissionEnabledSwitch'
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    disabled={saving}
                  />
                  <label className='form-check-label' htmlFor='permissionEnabledSwitch'>
                    啟用（enabled）
                  </label>
                </div>
              </div>

              {/* Right */}
              <div className='col-12 col-md-6 d-flex flex-column gap-3'>
                <div>
                  <label className='form-label'>描述（description）</label>
                  <textarea
                    className={`form-control form-control-solid ${errors.description ? 'is-invalid' : ''}`}
                    rows={7}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='可留空'
                    disabled={saving}
                  />
                  {errors.description && (
                    <div className='invalid-feedback d-block'>{errors.description}</div>
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
            <button className='btn btn-primary' onClick={handleSave} disabled={saving || hasErrors}>
              {saving ? '儲存中…' : '儲存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
