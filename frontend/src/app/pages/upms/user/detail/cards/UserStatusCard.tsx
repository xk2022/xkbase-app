// src/app/pages/upms/user/detail/UserStatusCard.tsx
import React, {useMemo, useState} from 'react'
import {KTIcon} from '@/_metronic/helpers'
import type {AlertFn} from '@/app/pages/common/AlertType'

import { UserProfile } from '../../Model'
import { updateUserStatus } from '../../Query'

type Props = {
  detail: UserProfile
  reload: () => void | Promise<void>
  showAlert?: AlertFn
}

const fmt = (v?: string | number | boolean | null) =>
  v === null || v === undefined || v === '' ? '-' : String(v)

export const UserStatusCard: React.FC<Props> = ({detail, reload, showAlert}) => {
  const [saving, setSaving] = useState(false)

  const nextEnabled = useMemo(() => !detail.enabled, [detail.enabled])
  const nextLocked = useMemo(() => !detail.locked, [detail.locked])

  const confirmText = (kind: 'enabled' | 'locked', next: boolean) => {
    if (kind === 'enabled') {
      return next
        ? '確認要「啟用」此帳號？\n\n啟用後：使用者可登入（仍受 locked/權限影響）。'
        : '確認要「停用」此帳號？\n\n停用後：使用者將無法登入（建議用於離職/停權）。'
    }
    return next
      ? '確認要「鎖定」此帳號？\n\n鎖定後：使用者即使 enabled 仍無法登入。'
      : '確認要「解除鎖定」此帳號？\n\n解除後：若 enabled=true，使用者即可登入。'
  }

  const doToggle = async (kind: 'enabled' | 'locked') => {
    if (saving) return

    const next = kind === 'enabled' ? nextEnabled : nextLocked
    const ok = window.confirm(confirmText(kind, next))
    if (!ok) return

    setSaving(true)
    try {
      const payload = kind === 'enabled' ? {enabled: next} : {locked: next}
      const updated = await updateUserStatus(detail.id, payload, showAlert)
      if (!updated) return

      showAlert?.('更新成功', 'success')
      await reload()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='card'>
      <div className='card-header align-items-center'>
        <div className='card-title m-0'>
          <div className='d-flex align-items-center gap-2'>
            <KTIcon iconName='shield-tick' className='fs-2' />
            <h3 className='fw-bold m-0'>狀態與安全</h3>
          </div>
        </div>

        <div className='card-toolbar'>
          {saving && (
            <span className='text-muted fs-8 d-flex align-items-center gap-2'>
              <span className='spinner-border spinner-border-sm' />
              更新中...
            </span>
          )}
        </div>
      </div>

      <div className='card-body'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-3'>
            <tbody>
              <tr>
                <td className='text-muted w-150px'>帳號狀態</td>
                <td className='fw-semibold'>
                  <div className='d-flex align-items-center justify-content-between gap-4 flex-wrap'>
                    <div>
                      {detail.enabled ? (
                        <span className='badge badge-light-success'>啟用</span>
                      ) : (
                        <span className='badge badge-light-secondary'>停用</span>
                      )}
                      <span className='text-muted fs-8 ms-3'>
                        {detail.enabled ? '可登入（仍受鎖定影響）' : '不可登入'}
                      </span>
                    </div>

                    <button
                      type='button'
                      className={`btn btn-sm ${detail.enabled ? 'btn-light-secondary' : 'btn-light-success'}`}
                      disabled={saving}
                      onClick={() => doToggle('enabled')}
                    >
                      <KTIcon iconName={detail.enabled ? 'cross-circle' : 'check-circle'} className='fs-3 me-1' />
                      {detail.enabled ? '停用' : '啟用'}
                    </button>
                  </div>
                </td>
              </tr>

              <tr>
                <td className='text-muted'>鎖定狀態</td>
                <td className='fw-semibold'>
                  <div className='d-flex align-items-center justify-content-between gap-4 flex-wrap'>
                    <div>
                      {detail.locked ? (
                        <span className='badge badge-light-danger'>已鎖定</span>
                      ) : (
                        <span className='badge badge-light-success'>未鎖定</span>
                      )}
                      <span className='text-muted fs-8 ms-3'>
                        {detail.locked ? '強制禁止登入（高風險/安全用途）' : '正常'}
                      </span>
                    </div>

                    <button
                      type='button'
                      className={`btn btn-sm ${detail.locked ? 'btn-light-success' : 'btn-light-danger'}`}
                      disabled={saving}
                      onClick={() => doToggle('locked')}
                    >
                      <KTIcon iconName={detail.locked ? 'unlock' : 'lock'} className='fs-3 me-1' />
                      {detail.locked ? '解除鎖定' : '鎖定'}
                    </button>
                  </div>
                </td>
              </tr>

              <tr>
                <td className='text-muted'>備註</td>
                <td className='fw-semibold text-muted fs-8'>
                  建議：enabled 用於停權/離職；locked 用於安全事件（風險操作），避免混用。
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='text-muted fs-8 mt-3'>UUID：{fmt(detail.id)}</div>
      </div>
    </div>
  )
}

export default UserStatusCard
