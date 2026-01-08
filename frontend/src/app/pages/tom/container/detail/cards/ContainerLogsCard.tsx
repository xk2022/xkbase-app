// src/app/pages/tom/container/detail/cards/ContainerLogsCard.tsx
import React from 'react'
import type { ContainerDetail } from '../Model'

type Props = {
  detail: ContainerDetail
}

export const ContainerLogsCard: React.FC<Props> = ({ detail }) => {
  const logs = detail.logs || []

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-title'>
          <h3 className='fw-bold m-0'>狀態歷程</h3>
        </div>
      </div>

      <div className='card-body'>
        {logs.length === 0 ? (
          <div className='text-muted'>尚無紀錄</div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-3'>
              <thead>
                <tr className='text-muted fw-bold'>
                  <th className='min-w-180px'>時間</th>
                  <th className='min-w-160px'>動作</th>
                  <th className='min-w-160px'>操作者</th>
                  <th className='min-w-220px'>備註</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l, idx) => (
                  <tr key={`${l.time}-${idx}`}>
                    <td>{l.time}</td>
                    <td className='fw-semibold'>{l.action}</td>
                    <td>{l.operator ?? '-'}</td>
                    <td>{l.remark ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
