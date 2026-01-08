// src/app/pages/sample/v1/list/FormModal.tsx
import React, { useEffect, useState } from 'react'
import { KTIcon } from '@/_metronic/helpers'

import type { AlertType } from '@/app/pages/common/AlertType'
import type { CreateSampleReq, UpdateSampleReq, Sample, SampleStatus } from '../Model'
import { createSample, updateSample } from '../Query'

/**
 * ===============================================================
 * FormModal（Sample 快速編輯 Modal）
 * ---------------------------------------------------------------
 * 職責：
 * - Create / Edit 的「快速欄位」編輯
 * - Create：title / description / status / enabled / category
 * - Edit：title / description / status / enabled / category（不顯示密碼）
 * ===============================================================
 */

type Props = {
  open: boolean
  onClose: () => void
  onSaved: () => void
  showAlert: (message: string, type: AlertType) => void
  editingSample: Sample | null // null = create, 非 null = edit
}

export const FormModal: React.FC<Props> = ({
  open,
  onClose,
  onSaved,
  showAlert,
  editingSample,
}) => {
  // =============================================================
  // Derived State
  // =============================================================
  const isEdit = !!editingSample

  // =============================================================
  // Form State
  // =============================================================
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<SampleStatus>('ACTIVE')
  const [enabled, setEnabled] = useState(true)
  const [category, setCategory] = useState('')
  const [saving, setSaving] = useState(false)

  // =============================================================
  // Init / Reset when open or editingSample changes
  // =============================================================
  useEffect(() => {
    if (!open) return

    if (!editingSample) {
      // Create mode defaults
      setTitle('')
      setDescription('')
      setStatus('ACTIVE')
      setEnabled(true)
      setCategory('')
      return
    }

    // Edit mode - preload
    setTitle(editingSample.title ?? '')
    setDescription(editingSample.description ?? '')
    setStatus(editingSample.status ?? 'ACTIVE')
    setEnabled(!!editingSample.enabled)
    setCategory(editingSample.category ?? '')
  }, [open, editingSample])

  // =============================================================
  // Validation
  // =============================================================
  const validate = () => {
    if (!title.trim()) {
      showAlert('請輸入標題（title）', 'warning')
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

      if (isEdit && editingSample) {
        const payload: UpdateSampleReq = {
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          enabled,
          category: category.trim() || undefined,
        }
        await updateSample(editingSample.id, payload, showAlert)
      } else {
        const payload: CreateSampleReq = {
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          enabled,
          category: category.trim() || undefined,
        }
        await createSample(payload, showAlert)
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
              {isEdit ? '編輯 Sample' : '新增 Sample'}
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
                  <label className='form-label required'>標題（title）</label>
                  <input
                    className='form-control'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='例如：Sample 標題'
                    autoFocus
                  />
                </div>

                <div>
                  <label className='form-label'>描述（description）</label>
                  <textarea
                    className='form-control'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='請輸入描述'
                    rows={3}
                  />
                </div>

                <div>
                  <label className='form-label'>分類（category）</label>
                  <input
                    className='form-control'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder='例如：Type A'
                  />
                </div>
              </div>

              {/* Right */}
              <div className='col-12 col-md-6'>
                <div className='mb-5'>
                  <label className='form-label required'>狀態</label>
                  <select
                    className='form-select form-select-solid'
                    value={status}
                    onChange={(e) => setStatus(e.target.value as SampleStatus)}
                  >
                    <option value='ACTIVE'>啟用</option>
                    <option value='INACTIVE'>停用</option>
                    <option value='PENDING'>待處理</option>
                  </select>
                </div>

                <div className='form-check form-switch form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    id='sampleEnabledSwitch'
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                  />
                  <label className='form-check-label' htmlFor='sampleEnabledSwitch'>
                    啟用
                  </label>
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
