// src/app/pages/upms/permission/detail/PermissionBasicInfoCard.tsx
import React, {useEffect, useMemo, useState} from 'react'
import {KTIcon} from '@/_metronic/helpers'
import type {AlertFn} from '@/app/pages/common/AlertType'

import type {Permission, UpdatePermissionReq} from '../Model'
import {updatePermission} from '../Query'

/**
 * Design decision:
 * - permission.code / systemCode / resourceCode / actionCode 為穩定識別鍵（Stable Identifier）
 * - 建立後禁止修改，避免影響：
 *   - RBAC 綁定（role-permission）
 *   - 前後端 hardcode / enum mapping
 *   - 稽核/權限核對成本
 *
 * UI 僅顯示，不允許編輯；Update API 亦不送出上述欄位
 */

type Props = {
  detail: Permission
  reload: () => void | Promise<void>
  showAlert?: AlertFn
}

const fmt = (v?: string | number | boolean | null) =>
  v === null || v === undefined || v === '' ? '-' : String(v)

type FormState = {
  name: string
  description: string
  enabled: boolean
  sortOrder: number
}

const normalize = (s: string) => s.trim()

const safeInt = (v: unknown, fallback = 0) => {
  const n = typeof v === 'number' ? v : Number(v)
  if (Number.isNaN(n)) return fallback
  return Math.trunc(n)
}

const validate = (f: FormState) => {
  const name = normalize(f.name)
  const desc = normalize(f.description)

  if (!name) return '權限名稱不可為空'
  if (name.length > 100) return '權限名稱長度不可超過 100'
  if (desc.length > 500) return '權限描述長度不可超過 500'
  if (!Number.isFinite(f.sortOrder)) return '排序必須為數字'
  if (f.sortOrder < 0) return '排序不可小於 0'

  return null
}

export const PermissionBasicInfoCard: React.FC<Props> = ({
  detail,
  reload,
  showAlert,
}) => {
  const initialForm = useMemo<FormState>(
    () => ({
      name: detail.name ?? '',
      description: detail.description ?? '',
      enabled: detail.enabled ?? false,
      sortOrder: safeInt(detail.sortOrder, 0),
    }),
    [detail],
  )

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>(initialForm)

  const dirty = useMemo(() => {
    return (
      normalize(form.name) !== normalize(initialForm.name) ||
      normalize(form.description) !== normalize(initialForm.description) ||
      !!form.enabled !== !!initialForm.enabled ||
      safeInt(form.sortOrder, 0) !== safeInt(initialForm.sortOrder, 0)
    )
  }, [form, initialForm])

  const errorText = useMemo(() => validate(form), [form])

  useEffect(() => {
    if (!editing) setForm(initialForm)
  }, [initialForm, editing])

  const onEdit = () => {
    setForm(initialForm)
    setEditing(true)
  }

  const onCancel = () => {
    setForm(initialForm)
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
      const req: UpdatePermissionReq = {
        name: normalize(form.name),
        description: normalize(form.description),
        enabled: !!form.enabled,
        sortOrder: safeInt(form.sortOrder, 0),
      }

      await updatePermission(detail.id, req)

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

  const badgeEnabled = detail.enabled ? (
    <span className='badge badge-light-success'>啟用</span>
  ) : (
    <span className='badge badge-light-secondary'>停用</span>
  )

  return (
    <div className='card'>
      <div className='card-header align-items-center'>
        <div className='card-title m-0'>
          <div className='d-flex align-items-center gap-2'>
            <KTIcon iconName='information-4' className='fs-2' />
            <h3 className='fw-bold m-0'>基本資訊</h3>
          </div>
        </div>

        <div className='card-toolbar'>
          {!editing ? (
            <button
              type='button'
              className='btn btn-sm btn-light-primary'
              onClick={onEdit}
            >
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

              <button
                type='button'
                className='btn btn-sm btn-light'
                onClick={onCancel}
                disabled={saving}
              >
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
                <td className='text-muted w-150px'>權限代碼</td>
                <td className='fw-semibold'>
                  <span className='badge badge-light text-gray-800'>
                    {fmt(detail.code)}
                  </span>
                </td>
              </tr>

              <tr>
                <td className='text-muted'>System</td>
                <td className='fw-semibold'>
                  <span className='badge badge-light text-gray-800'>
                    {fmt(detail.systemCode)}
                  </span>
                </td>
              </tr>

              <tr>
                <td className='text-muted'>Resource</td>
                <td className='fw-semibold'>
                  <span className='badge badge-light text-gray-800'>
                    {fmt(detail.resourceCode)}
                  </span>
                </td>
              </tr>

              <tr>
                <td className='text-muted'>Action</td>
                <td className='fw-semibold'>
                  <span className='badge badge-light text-gray-800'>
                    {fmt(detail.actionCode)}
                  </span>
                </td>
              </tr>

              <tr>
                <td className='text-muted'>分組鍵</td>
                <td className='fw-semibold'>
                  <span className='badge badge-light text-gray-800'>
                    {fmt(detail.groupKey)}
                  </span>
                </td>
              </tr>

              <tr>
                <td className='text-muted'>權限名稱</td>
                <td className='fw-semibold'>
                  {!editing ? (
                    fmt(detail.name)
                  ) : (
                    <input
                      className='form-control form-control-sm'
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({...p, name: e.target.value}))
                      }
                      placeholder='例如：使用者-查詢 / 訂單-建立'
                      disabled={saving}
                      maxLength={100}
                    />
                  )}
                </td>
              </tr>

              <tr>
                <td className='text-muted'>權限描述</td>
                <td className='fw-semibold'>
                  {!editing ? (
                    <div className='text-gray-800' style={{whiteSpace: 'pre-wrap'}}>
                      {fmt(detail.description)}
                    </div>
                  ) : (
                    <textarea
                      className='form-control form-control-sm'
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        setForm((p) => ({...p, description: e.target.value}))
                      }
                      placeholder='可留空'
                      disabled={saving}
                      maxLength={500}
                    />
                  )}
                </td>
              </tr>

              <tr>
                <td className='text-muted'>排序</td>
                <td className='fw-semibold'>
                  {!editing ? (
                    fmt(detail.sortOrder)
                  ) : (
                    <input
                      className='form-control form-control-sm'
                      type='number'
                      min={0}
                      step={1}
                      value={form.sortOrder}
                      onChange={(e) => {
                        const raw = e.target.value
                        const n = raw === '' ? 0 : Number(raw)
                        setForm((p) => ({
                          ...p,
                          sortOrder: Number.isNaN(n) ? p.sortOrder : Math.max(0, Math.trunc(n)),
                        }))
                      }}
                      disabled={saving}
                    />
                  )}
                </td>
              </tr>

              <tr>
                <td className='text-muted'>啟用狀態</td>
                <td className='fw-semibold'>
                  {!editing ? (
                    badgeEnabled
                  ) : (
                    <div className='d-flex align-items-center gap-3'>
                      <div className='form-check form-switch form-check-custom form-check-solid m-0'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          checked={!!form.enabled}
                          onChange={(e) =>
                            setForm((p) => ({...p, enabled: e.target.checked}))
                          }
                          disabled={saving}
                        />
                      </div>
                      <span className='text-muted fs-8'>
                        {form.enabled ? '啟用中（可被指派給角色）' : '停用（保留資料，不建議硬刪）'}
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

export default PermissionBasicInfoCard
