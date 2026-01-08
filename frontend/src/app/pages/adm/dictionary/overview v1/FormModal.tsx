// src/app/pages/adm/dictionary/overview/FormModal.tsx
import React, {useEffect, useMemo, useState} from 'react'
import {Modal, Spinner} from 'react-bootstrap'

import type {AlertFn} from '@/app/pages/common/AlertType'
import type {Dictionary, CreateDictionaryReq, UpdateDictionaryReq} from '../Model'
import {createDictionary, updateDictionary} from '../Query'

type Mode = 'create' | 'edit'

type Props = {
  show: boolean
  mode: Mode
  initial?: Dictionary | null // edit 時必填
  showAlert?: AlertFn
  onClose: () => void
  onSuccess?: (createdOrUpdated?: Dictionary | null) => void | Promise<void>
}

type FormState = {
  code: string
  name: string
  enabled: boolean
  remark: string
}

export default function CreateDictionaryModal({
  show,
  mode,
  initial,
  showAlert,
  onClose,
  onSuccess,
}: Props) {
  const isEdit = mode === 'edit'

  const initialForm = useMemo<FormState>(() => {
    if (isEdit && initial) {
      return {
        code: initial.code ?? '',
        name: initial.name ?? '',
        enabled: initial.enabled ?? true,
        remark: initial.remark ?? '',
      }
    }
    return {
      code: '',
      name: '',
      enabled: true,
      remark: '',
    }
  }, [isEdit, initial])

  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>(initialForm)

  useEffect(() => {
    if (show) setForm(initialForm)
  }, [show, initialForm])

  const canSubmit = form.code.trim() && form.name.trim()

  const submit = async () => {
    if (!canSubmit) return

    setSaving(true)
    try {
      if (!isEdit) {
        const payload: CreateDictionaryReq = {
          code: form.code.trim(),
          name: form.name.trim(),
          enabled: form.enabled,
          remark: form.remark || undefined,
        }
        const ok = await createDictionary(payload, showAlert)
        if (ok) {
          onClose()
          await onSuccess?.(null)
        }
        return
      }

      if (!initial?.id) {
        showAlert?.('缺少字典 ID，無法更新', 'danger')
        return
      }

      const payload: UpdateDictionaryReq = {
        code: form.code.trim(),
        name: form.name.trim(),
        enabled: form.enabled,
        remark: form.remark || undefined,
      }
      const updated = await updateDictionary(initial.id, payload, showAlert)
      if (updated) {
        onClose()
        await onSuccess?.(updated)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const close = () => {
    if (saving) return
    onClose()
  }

  return (
    <Modal show={show} onHide={close} centered backdrop='static'>
      <Modal.Header closeButton={!saving}>
        <Modal.Title>{isEdit ? '編輯字典分類' : '新增字典分類'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className='d-flex flex-column gap-4'>
          <div>
            <label className='form-label required'>字典代碼 Code</label>
            <input
              className='form-control form-control-solid'
              value={form.code}
              onChange={(e) => setForm((p) => ({...p, code: e.target.value}))}
              placeholder='例如：ORDER_STATUS'
              disabled={saving || isEdit /* 建議 edit 時 code 不給改，可自行放開 */}
            />
            <div className='text-muted fs-8 mt-1'>
              建議全大寫＋底線（例：ORDER_STATUS / VEHICLE_TYPE）
            </div>
          </div>

          <div>
            <label className='form-label required'>字典名稱 Name</label>
            <input
              className='form-control form-control-solid'
              value={form.name}
              onChange={(e) => setForm((p) => ({...p, name: e.target.value}))}
              placeholder='例如：訂單狀態'
              disabled={saving}
            />
          </div>

          <div>
            <label className='form-label'>備註 Remark</label>
            <textarea
              className='form-control form-control-solid'
              rows={3}
              value={form.remark}
              onChange={(e) => setForm((p) => ({...p, remark: e.target.value}))}
              placeholder='可選填'
              disabled={saving}
            />
          </div>

          <div className='d-flex align-items-center justify-content-between'>
            <div className='form-check form-switch form-check-custom form-check-solid'>
              <input
                className='form-check-input'
                type='checkbox'
                checked={form.enabled}
                onChange={(e) => setForm((p) => ({...p, enabled: e.target.checked}))}
                disabled={saving}
              />
              <span className='form-check-label'>
                {form.enabled ? '啟用' : '停用'}
              </span>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button type='button' className='btn btn-light' onClick={close} disabled={saving}>
          取消
        </button>
        <button
          type='button'
          className='btn btn-primary'
          onClick={submit}
          disabled={!canSubmit || saving}
        >
          {saving ? (
            <>
              <Spinner animation='border' size='sm' className='me-2' />
              {isEdit ? '更新中...' : '建立中...'}
            </>
          ) : (
            <>{isEdit ? '更新' : '建立'}</>
          )}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
