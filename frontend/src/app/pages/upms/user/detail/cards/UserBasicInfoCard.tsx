// UserBasicInfoCard.tsx
import React, {useEffect, useMemo, useState} from 'react'
import {KTIcon} from '@/_metronic/helpers'
import type {AlertFn} from '@/app/pages/common/AlertType'

import { UserProfile } from '../../Model'
import { updateUserProfile } from '../../Query'

/**
 * Design decision:
 * - username 為穩定識別鍵（Stable Identifier）→ UI 僅顯示不可改
 * - 本卡片只編輯「個人資料 Profile」：name / email / phone
 * - enabled/locked 屬於狀態/安全管理：此卡片先「顯示」於右上角與表格，避免混進更新 payload
 */

type Props = {
  detail: UserProfile
  reload: () => void | Promise<void>
  showAlert?: AlertFn
}

const fmt = (v?: string | number | boolean | null) =>
  v === null || v === undefined || v === '' ? '-' : String(v)

type FormState = {
  name: string
  email: string
  phone: string
}

const normalize = (s: string) => s.trim()

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
const isPhoneLoose = (s: string) => /^[0-9+\-()\s]{6,20}$/.test(s)

const validate = (f: FormState) => {
  const name = normalize(f.name)
  const email = normalize(f.email)
  const phone = normalize(f.phone)

  if (!name) return '姓名不可為空'
  if (name.length > 128) return '姓名長度不可超過 128'

  if (email) {
    if (email.length > 128) return 'Email 長度不可超過 128'
    if (!isEmail(email)) return 'Email 格式不正確'
  }

  if (phone) {
    if (phone.length > 32) return '手機長度不可超過 32'
    if (!isPhoneLoose(phone)) return '手機格式不正確'
  }

  return null
}

export const UserBasicInfoCard: React.FC<Props> = ({detail, reload, showAlert}) => {
  const initialForm = useMemo<FormState>(
    () => ({
      name: detail.profile?.name ?? '',
      email: detail.profile?.email ?? '',
      phone: detail.profile?.phone ?? '',
    }),
    [detail]
  )

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>(initialForm)

  const dirty = useMemo(() => {
    return (
      normalize(form.name) !== normalize(initialForm.name) ||
      normalize(form.email) !== normalize(initialForm.email) ||
      normalize(form.phone) !== normalize(initialForm.phone)
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
      await updateUserProfile(detail.id, {
        name: normalize(form.name),
        email: normalize(form.email) || null,
        phone: normalize(form.phone) || null,
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

        <div className='card-toolbar d-flex align-items-center gap-2'>
          {/* 右上角狀態（展示用） */}
          {detail.enabled ? (
            <span className='badge badge-light-success'>啟用</span>
          ) : (
            <span className='badge badge-light-secondary'>停用</span>
          )}

          {detail.locked ? (
            <span className='badge badge-light-danger'>已鎖定</span>
          ) : (
            <span className='badge badge-light-success'>未鎖定</span>
          )}

          {/* 右上角：編輯 */}
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
                <td className='text-muted'>帳號</td>
                <td className='fw-semibold'>
                  <span className='badge badge-light text-gray-800'>{fmt(detail.username)}</span>
                  <span className='text-muted fs-8 ms-3'>（建立後不可修改）</span>
                </td>
              </tr>

              <tr>
                <td className='text-muted'>姓名</td>
                <td className='fw-semibold'>
                  {!editing ? (
                    fmt(detail.profile?.name ?? null)
                  ) : (
                    <input
                      className='form-control form-control-sm'
                      value={form.name}
                      onChange={(e) => setForm((p) => ({...p, name: e.target.value}))}
                      placeholder='例如：王小明'
                      disabled={saving}
                      maxLength={128}
                    />
                  )}
                </td>
              </tr>

              <tr>
                <td className='text-muted'>Email</td>
                <td className='fw-semibold'>
                  {!editing ? (
                    fmt(detail.profile?.email ?? null)
                  ) : (
                    <input
                      className='form-control form-control-sm'
                      value={form.email}
                      onChange={(e) => setForm((p) => ({...p, email: e.target.value}))}
                      placeholder='例如：user@example.com'
                      disabled={saving}
                      maxLength={128}
                      inputMode='email'
                    />
                  )}
                </td>
              </tr>

              <tr>
                <td className='text-muted'>手機</td>
                <td className='fw-semibold'>
                  {!editing ? (
                    fmt(detail.profile?.phone ?? null)
                  ) : (
                    <input
                      className='form-control form-control-sm'
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({...p, phone: e.target.value}))}
                      placeholder='例如：0912-345-678'
                      disabled={saving}
                      maxLength={32}
                      inputMode='tel'
                    />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='d-flex justify-content-between align-items-center mt-3'>
          <div className='text-muted fs-8'>UUID：{fmt(detail.id)}</div>
        </div>

        {editing && (
          <div className='text-muted fs-8 mt-3'>提示：Email/手機可留空；若要清空請刪除內容後更新。</div>
        )}
      </div>
    </div>
  )
}

export default UserBasicInfoCard

