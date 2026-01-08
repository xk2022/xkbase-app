// src/app/pages/upms/system/detail/cards/SystemBasicInfoCard.tsx
import React, {useEffect, useMemo, useState} from 'react'
import { KTIcon } from '@/_metronic/helpers'
import { AlertFn } from '@/app/pages/common/AlertType'

import type {System} from '../Model'
import {updateSystem} from '../Query'

/**
 * Design decision:
 * - system.code 為穩定識別鍵（Stable Identifier）
 * - 建立後禁止修改，避免影響：
 *   - hardcode / enum mapping
 *   - 權限與設定關聯
 *   - 跨系統引用
 *
 * UI 僅顯示，不允許編輯；Update API 亦不送出 code 欄位
 */

type Props = {
  detail: System
  reload: () => void | Promise<void>
  showAlert?: AlertFn
}

const fmt = (v?: string | number | boolean | null) =>
  v === null || v === undefined || v === '' ? '-' : String(v);

type FormState = {
  name: string
  remark: string
  enabled: boolean
}

const normalize = (s: string) => s.trim()

const validate = (f: FormState) => {
  const name = normalize(f.name)

  if (!name) return '系統名稱不可為空'
  if (name.length > 128) return '系統名稱長度不可超過 128'
  if (f.remark?.length > 255) return '系統描述長度不可超過 255'

  return null
}

export const SystemBasicInfoCard: React.FC<Props> = (
    {detail, reload, showAlert}
  ) => {
  const initialForm = useMemo<FormState>(
    () => ({
      name: detail.name ?? '',
      remark: detail.remark ?? '',
      enabled: detail.enabled ?? false,
    }),
    [detail]
  )

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>(initialForm)

  // dirty / diff
  const dirty = useMemo(() => {
    return (
      normalize(form.name) !== normalize(initialForm.name) ||
      (form.remark ?? '') !== (initialForm.remark ?? '') ||
      !!form.enabled !== !!initialForm.enabled
    )
  }, [form, initialForm])

  const errorText = useMemo(() => validate(form), [form])

  // detail 變更（例如 reload 後）時：若不在編輯中，更新表單
  useEffect(() => {
    if (!editing) setForm(initialForm)
  }, [initialForm, editing])

  const onEdit = () => {
    setForm(initialForm) // 進入編輯前先對齊一次
    setEditing(true)
  }

  const onCancel = () => {
    setForm(initialForm) // 還原
    setEditing(false)
  }

  const onUpdate = async () => {
    const err = validate(form)
    if (err) {
      showAlert?.(err, 'warning')
      return
    }
    if (!dirty) {
      setEditing(false)
      return
    }

    setSaving(true)
    try {
      await updateSystem(detail.id, {
        name: normalize(form.name),
        remark: form.remark,
        enabled: form.enabled,
      })

      showAlert?.('更新成功', 'success')
      setEditing(false)
      await reload()
    } catch (e) {
      console.error(e)
      showAlert?.('更新失敗，請稍後再試', 'danger')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='card'>
      <div className='card-header align-items-center'>
        <div className='card-title m-0'>
          <div className='d-flex align-items-center gap-2'>
            <KTIcon iconName='information-4' className='fs-2' />
            <h3 className='fw-bold m-0'>基本資訊</h3>
          </div>
        </div>

        {/* 右上角：編輯 */}
        <div className='card-toolbar'>
          {!editing ? (
            <button type='button' className='btn btn-sm btn-light-primary' onClick={onEdit}>
              <KTIcon iconName='pencil' className='fs-3 me-1' />
              編輯
            </button>
          ) : (
            <div className='d-flex align-items-center gap-2'>
              <button
                type='button'
                className='btn btn-sm btn-primary'
                onClick={onUpdate}
                disabled={saving || !!errorText || !dirty}
                title={!dirty ? '尚未修改' : errorText ?? ''}
              >
                {saving ? (
                  <span className='d-flex align-items-center gap-2'>
                    <span className='spinner-border spinner-border-sm' />
                    更新中...
                  </span>
                ) : (
                  <>
                    <KTIcon iconName='check' className='fs-3 me-1' />
                    更新
                  </>
                )}
              </button>

              <button type='button' className='btn btn-sm btn-light' onClick={onCancel} disabled={saving}>
                取消
              </button>
            </div>
          )}
        </div>
      </div>

      <div className='card-body'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-3'>
            <tbody>
              <tr>
                <td className='text-muted w-150px'>系統代碼</td>
                <td className='fw-semibold'>
                  <span className='badge badge-light text-gray-800'>
                    {fmt(detail.code)}
                  </span>
                </td>
              </tr>

              <tr>
                <td className='text-muted'>系統名稱</td>
                <td className='fw-semibold'>
                  {!editing ? (
                    fmt(detail.name)
                  ) : (
                    <input
                      className='form-control form-control-sm'
                      value={form.name}
                      onChange={(e) => setForm((p) => ({...p, name: e.target.value}))}
                      placeholder='例如：權限管理系統'
                      disabled={saving}
                      maxLength={128}
                    />
                  )}
                </td>
              </tr>

              <tr>
                <td className='text-muted'>系統描述</td>
                <td className='fw-semibold'>
                  {!editing ? (
                    <div className='text-gray-800' style={{whiteSpace: 'pre-wrap'}}>
                      {fmt(detail.remark)}
                    </div>
                  ) : (
                    <textarea
                      className='form-control form-control-sm'
                      rows={3}
                      value={form.remark}
                      onChange={(e) => setForm((p) => ({...p, remark: e.target.value}))}
                      placeholder='備註 / 描述'
                      disabled={saving}
                      maxLength={255}
                    />
                  )}
                </td>
              </tr>

              <tr>
                <td className='text-muted'>啟用狀態</td>
                <td className='fw-semibold'>
                  {!editing ? (
                    detail.enabled ? (
                      <span className='badge badge-light-success'>啟用</span>
                    ) : (
                      <span className='badge badge-light-secondary'>停用</span>
                    )
                  ) : (
                    <div className='d-flex align-items-center gap-3'>
                      <div className='form-check form-switch form-check-custom form-check-solid m-0'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          checked={form.enabled}
                          onChange={(e) => setForm((p) => ({...p, enabled: e.target.checked}))}
                          disabled={saving}
                        />
                      </div>
                      <span className='text-muted fs-8'>
                        {form.enabled ? '啟用中（前端可使用此分類）' : '停用（保留資料，不建議硬刪）'}
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='d-flex justify-content-between align-items-center mt-3'>
          <div className='text-muted fs-8'>UUID：{fmt(detail.id)}</div>
        </div>
      </div>
    </div>
  )
}

export default SystemBasicInfoCard
