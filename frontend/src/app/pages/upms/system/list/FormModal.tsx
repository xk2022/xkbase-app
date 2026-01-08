// src/app/pages/upms/system/list/FormModal.tsx
import React, {useEffect, useState} from 'react'
import {KTIcon} from '@/_metronic/helpers'

import type {AlertType} from '@/app/pages/common/AlertType'
import type {CreateSystemReq, System, UpdateSystemReq} from '../Model'
import {createSystem, updateSystem} from '../Query'

/**
 * ===============================================================
 * FormModal（UPMS System 快速編輯 Modal）
 * ---------------------------------------------------------------
 * 職責：
 * - Create / Edit 的「快速欄位」編輯（列表用）
 * - Create：code / name / enabled / remark
 * - Edit：code(通常不可改，可依需求放開) / name / enabled / remark
 *
 * 不做：
 * - System detail page 的進階欄位（交給 detail page）
 * - 跳頁（交給父層 ListPage）
 * ===============================================================
 */

type Props = {
  open: boolean
  onClose: () => void
  onSaved: () => void
  showAlert: (message: string, type: AlertType) => void
  editingSystem: System | null // null = create, 非 null = edit
  /** 若你希望「編輯時禁止改 code」就維持預設 true */
  disableCodeOnEdit?: boolean
}

const normalizeCode = (v: string) => v.trim().toUpperCase()
const normalizeText = (v: string) => v.trim()

export const FormModal: React.FC<Props> = ({
  open,
  onClose,
  onSaved,
  showAlert,
  editingSystem,
  disableCodeOnEdit = true,
}) => {
  // =============================================================
  // Derived
  // =============================================================
  const isEdit = !!editingSystem
  const codeDisabled = isEdit && disableCodeOnEdit

  // =============================================================
  // Form State
  // =============================================================
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [enabled, setEnabled] = useState(true)
  const [remark, setRemark] = useState('')
  const [saving, setSaving] = useState(false)

  // =============================================================
  // Init / Reset
  // =============================================================
  useEffect(() => {
    if (!open) return

    if (!editingSystem) {
      // Create defaults
      setCode('')
      setName('')
      setEnabled(true)
      setRemark('')
      return
    }

    // Edit preload
    setCode(editingSystem.code ?? '')
    setName(editingSystem.name ?? '')
    setEnabled(!!editingSystem.enabled)
    setRemark(editingSystem.remark ?? '')
  }, [open, editingSystem])

  // =============================================================
  // Validation
  // =============================================================
  const validate = () => {
    if (!normalizeCode(code)) {
      showAlert('請輸入系統代碼（code）', 'warning')
      return false
    }
    if (!normalizeText(name)) {
      showAlert('請輸入系統名稱（name）', 'warning')
      return false
    }
    return true
  }

  // =============================================================
  // Save
  // =============================================================
  const handleSave = async () => {
    if (!validate()) return

    try {
      setSaving(true)

      if (isEdit && editingSystem) {
        const payload: UpdateSystemReq = {
          // 若後端不允許改 code，這裡就不要送 code（避免誤改）
          ...(codeDisabled ? {} : {code: normalizeCode(code)}),
          name: normalizeText(name),
          enabled,
          remark: remark.trim() || undefined,
        }
        await updateSystem(editingSystem.id, payload, showAlert)
      } else {
        const payload: CreateSystemReq = {
          code: normalizeCode(code),
          name: normalizeText(name),
          enabled,
          remark: remark.trim() || undefined,
        }
        await createSystem(payload, showAlert)
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
      style={{backgroundColor: 'rgba(0,0,0,.25)'}}
      role='dialog'
      aria-modal='true'
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          {/* Header */}
          <div className='modal-header'>
            <h5 className='modal-title'>
              <KTIcon iconName={isEdit ? 'message-edit' : 'plus'} className='fs-2 me-2' />
              {isEdit ? '編輯系統' : '新增系統'}
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
                  <label className='form-label required'>系統代碼（code）</label>
                  <input
                    className='form-control'
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder='例如：TOM / UPMS / ADM'
                    autoFocus
                    disabled={codeDisabled}
                  />
                  <div className='text-muted fs-8 mt-1'>會自動 trim + upper（避免 tom / TOM 重複）</div>
                </div>

                <div>
                  <label className='form-label required'>系統名稱（name）</label>
                  <input
                    className='form-control'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='例如：訂單管理'
                  />
                </div>

                <div className='form-check form-switch form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    id='systemEnabledSwitch'
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                  />
                  <label className='form-check-label' htmlFor='systemEnabledSwitch'>
                    啟用
                  </label>
                </div>
              </div>

              {/* Right */}
              <div className='col-12 col-md-6 d-flex flex-column gap-3'>
                <div>
                  <label className='form-label'>備註（remark）</label>
                  <textarea
                    className='form-control'
                    rows={6}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder='可留空'
                  />
                </div>

                {isEdit && editingSystem?.id && (
                  <div className='text-muted fs-8'>
                    系統 ID：<span className='fw-semibold'>{String(editingSystem.id)}</span>
                  </div>
                )}
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
