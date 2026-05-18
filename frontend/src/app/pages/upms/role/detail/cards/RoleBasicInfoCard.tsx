// src/app/pages/upms/role/detail/cards/RoleBasicInfoCard.tsx
import React from 'react'
import {KTIcon} from '@/_metronic/helpers'
import {Role} from '../../Model'

interface Props {
  detail: Role
}

const fmt = (v?: string | number | boolean | null) =>
  v === null || v === undefined || v === '' ? '-' : String(v)

export const RoleBasicInfoCard: React.FC<Props> = ({detail}) => {
  return (
    <div className='card h-100'>
      <div className='card-header border-0 pt-6'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>基本資訊</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            角色的基本資訊與設定
          </span>
        </h3>
      </div>

      <div className='card-body pt-0'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            <tbody>
              <tr>
                <td className='text-muted min-w-150px'>
                  <div className='d-flex align-items-center'>
                    <KTIcon iconName='code' className='fs-4 text-gray-500 me-2' />
                    <span className='fw-semibold'>角色代碼</span>
                  </div>
                </td>
                <td className='fw-bold text-gray-800'>
                  <span className='badge badge-light-info fs-6 fw-bold px-3 py-2'>
                    {fmt(detail.code)}
                  </span>
                  <span className='text-muted fs-7 ms-3'>（建立後不可修改）</span>
                </td>
              </tr>
              <tr>
                <td className='text-muted'>
                  <div className='d-flex align-items-center'>
                    <KTIcon iconName='user' className='fs-4 text-gray-500 me-2' />
                    <span className='fw-semibold'>角色名稱</span>
                  </div>
                </td>
                <td className='fw-bold text-gray-800'>{fmt(detail.name)}</td>
              </tr>
              <tr>
                <td className='text-muted'>
                  <div className='d-flex align-items-center'>
                    <KTIcon iconName='document' className='fs-4 text-gray-500 me-2' />
                    <span className='fw-semibold'>描述</span>
                  </div>
                </td>
                <td className='fw-bold text-gray-800'>
                  {detail.description ? (
                    <span className='text-gray-700'>{detail.description}</span>
                  ) : (
                    <span className='text-muted'>無描述</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className='text-muted'>
                  <div className='d-flex align-items-center'>
                    <KTIcon iconName='check-circle' className='fs-4 text-gray-500 me-2' />
                    <span className='fw-semibold'>狀態</span>
                  </div>
                </td>
                <td>
                  {detail.enabled ? (
                    <span className='badge badge-light-success fs-6 fw-bold px-3 py-2'>
                      啟用
                    </span>
                  ) : (
                    <span className='badge badge-light-secondary fs-6 fw-bold px-3 py-2'>
                      停用
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className='text-muted'>
                  <div className='d-flex align-items-center'>
                    <KTIcon iconName='shield-tick' className='fs-4 text-gray-500 me-2' />
                    <span className='fw-semibold'>權限數量</span>
                  </div>
                </td>
                <td>
                  <span className='badge badge-light-primary fs-6 fw-bold px-3 py-2'>
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
