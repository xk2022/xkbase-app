// src/app/pages/upms/user/security/cards/SecuritySummaryCard.tsx
import React from 'react'
import {KTIcon} from '@/_metronic/helpers'
import {UserProfile} from '../../Model'

interface Props {
  detail: UserProfile
}

export const SecuritySummaryCard: React.FC<Props> = ({detail}) => {
  const loginHistory = detail.loginHistory ?? []
  const lastLogin = loginHistory.length > 0 ? loginHistory[0] : null

  return (
    <div className='card mb-5'>
      <div className='card-header border-0 pt-6'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>安全摘要</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            使用者帳號安全狀態總覽
          </span>
        </h3>
      </div>

      <div className='card-body pt-0'>
        <table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-3'>
          <tbody>
            <tr>
              <td className='text-muted w-150px'>帳號狀態</td>
              <td>
                {detail.enabled ? (
                  <span className='badge badge-light-success'>啟用</span>
                ) : (
                  <span className='badge badge-light-secondary'>停用</span>
                )}
                {detail.locked && (
                  <span className='badge badge-light-danger ms-2'>已鎖定</span>
                )}
              </td>
            </tr>
            <tr>
              <td className='text-muted'>帳號名稱</td>
              <td className='fw-semibold'>{detail.username}</td>
            </tr>
            <tr>
              <td className='text-muted'>最後登入</td>
              <td>
                {lastLogin ? (
                  <div>
                    <div className='fw-semibold'>{lastLogin.time}</div>
                    <div className='text-muted fs-7'>IP: {lastLogin.ip}</div>
                  </div>
                ) : (
                  <span className='text-muted'>無登入紀錄</span>
                )}
              </td>
            </tr>
            <tr>
              <td className='text-muted'>登入次數</td>
              <td>
                <span className='badge badge-light-primary fs-6 fw-bold'>
                  {loginHistory.length} 次
                </span>
              </td>
            </tr>
            <tr>
              <td className='text-muted'>兩步驟驗證</td>
              <td>
                <span className='badge badge-light-secondary'>未啟用</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div className='separator separator-dashed my-6'></div>

        <div className='d-flex align-items-center'>
          <div className='flex-grow-1'>
            <span className='text-muted fs-7'>
              安全等級：<strong className='text-primary'>中等</strong>
            </span>
          </div>
          <button
            type='button'
            className='btn btn-sm btn-light'
            onClick={() => window.location.href = `/upms/user/${detail.id}/detail`}
          >
            查看詳情
            <KTIcon iconName='arrow-right' className='fs-4 ms-1' />
          </button>
        </div>
      </div>
    </div>
  )
}
