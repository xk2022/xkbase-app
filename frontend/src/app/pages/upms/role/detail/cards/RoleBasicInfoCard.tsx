// RoleBasicInfoCard.tsx
import React from 'react'
import {KTIcon} from '@/_metronic/helpers'
import type {AlertFn} from '@/app/pages/common/AlertType'

import {Role} from '../../Model'

type Props = {
  detail: Role
  reload: () => void | Promise<void>
  showAlert?: AlertFn
  onEdit?: () => void
  onDelete?: () => void
}

const fmt = (v?: string | number | boolean | null) =>
  v === null || v === undefined || v === '' ? '-' : String(v)

const enabledBadge = (enabled: boolean) => {
  if (enabled) {
    return (
      <span className='badge badge-light-success fw-bolder px-4 py-3'>啟用</span>
    )
  }
  return (
    <span className='badge badge-light-secondary fw-bolder px-4 py-3'>停用</span>
  )
}

export const RoleBasicInfoCard: React.FC<Props> = ({
  detail,
  reload,
  showAlert,
  onEdit,
  onDelete,
}) => {
  return (
    <div className='card mb-5'>
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

          {/* 右上角：編輯 */}
          {onEdit && (
            <button
              type='button'
              className='btn btn-sm btn-light-primary'
              onClick={onEdit}
            >
              <KTIcon iconName='pencil' className='fs-3 me-1' />
              編輯
            </button>
          )}
          {onDelete && (
            <button
              type='button'
              className='btn btn-sm btn-light-danger'
              onClick={onDelete}
            >
              <KTIcon iconName='trash' className='fs-3 me-1' />
              刪除
            </button>
          )}
        </div>
      </div>

      <div className='card-body'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-3'>
            <tbody>
              <tr>
                <td className='text-muted'>角色代碼</td>
                <td className='fw-semibold'>
                  <span className='badge badge-light text-gray-800'>{fmt(detail.code)}</span>
                  <span className='text-muted fs-8 ms-3'>（建立後不可修改）</span>
                </td>
              </tr>
              <tr>
                <td className='text-muted'>角色名稱</td>
                <td className='fw-semibold'>{fmt(detail.name)}</td>
              </tr>
              <tr>
                <td className='text-muted'>描述</td>
                <td className='fw-semibold'>
                  {detail.description ? (
                    <span>{detail.description}</span>
                  ) : (
                    <span className='text-muted'>無描述</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className='text-muted'>狀態</td>
                <td className='fw-semibold'>
                  {detail.enabled ? (
                    <span className='badge badge-light-success'>啟用</span>
                  ) : (
                    <span className='badge badge-light-secondary'>停用</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className='text-muted'>權限數量</td>
                <td className='fw-semibold'>
                  <span className='badge badge-light-primary'>
                    {detail.permissionCount ?? detail.permissionCodes?.length ?? 0} 個權限
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
