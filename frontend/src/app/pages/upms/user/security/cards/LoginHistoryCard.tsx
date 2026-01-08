// src/app/pages/upms/user/security/cards/LoginHistoryCard.tsx
import React from 'react'
import {KTIcon} from '@/_metronic/helpers'
import {UserProfile} from '../../Model'

interface Props {
  detail: UserProfile
}

const formatDateTime = (ts?: string) => {
  if (!ts) return '-'
  try {
    const d = new Date(ts)
    if (Number.isNaN(d.getTime())) return ts
    
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const HH = String(d.getHours()).padStart(2, '0')
    const MM = String(d.getMinutes()).padStart(2, '0')

    return `${yyyy}/${mm}/${dd} ${HH}:${MM}`
  } catch {
    return ts
  }
}

export const LoginHistoryCard: React.FC<Props> = ({detail}) => {
  const history = detail.loginHistory ?? []

  return (
    <div className='card'>
      <div className='card-header border-0 pt-6'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>登入紀錄</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            最近登入活動紀錄
          </span>
        </h3>
      </div>

      <div className='card-body pt-0'>
        {history.length === 0 ? (
          <div className='text-center py-10'>
            <KTIcon iconName='lock' className='fs-2x text-muted mb-3' />
            <p className='text-muted mb-0'>尚無登入紀錄</p>
          </div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0'>
              <thead>
                <tr className='fw-bold text-muted'>
                  <th className='min-w-150px'>登入時間</th>
                  <th className='min-w-120px'>IP 位址</th>
                  <th className='min-w-100px'>裝置</th>
                  <th className='min-w-100px'>狀態</th>
                </tr>
              </thead>
              <tbody>
                {history.map((login, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className='text-gray-800 fw-bold'>
                        {formatDateTime(login.time)}
                      </span>
                    </td>
                    <td>
                      <span className='badge badge-light-info fs-7 fw-bold'>
                        {login.ip || '-'}
                      </span>
                    </td>
                    <td>
                      <span className='text-muted fs-7'>
                        {login.device || '未知裝置'}
                      </span>
                    </td>
                    <td>
                      <span className='badge badge-light-success fs-7'>成功</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {history.length > 0 && (
          <>
            <div className='separator separator-dashed my-6'></div>
            <div className='d-flex align-items-center'>
              <div className='flex-grow-1'>
                <span className='text-muted fs-7'>
                  顯示最近 <strong>{history.length}</strong> 筆登入紀錄
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
