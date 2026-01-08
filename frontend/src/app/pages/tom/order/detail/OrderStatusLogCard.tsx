/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/pages/tom/order/detail/cards/OrderStatusLogCard.tsx
import React from 'react'
import type { OrderDetail } from './Model'

type Props = {
  detail: OrderDetail
}

const fmt = (v?: any) => (v === null || v === undefined || v === '' ? '-' : String(v))

export const OrderStatusLogCard: React.FC<Props> = ({ detail }) => {
  const list = Array.isArray(detail.statusLogs) ? detail.statusLogs : []

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-title'>
          <h3 className='fw-bold m-0'>狀態歷程</h3>
        </div>
      </div>

      <div className='card-body'>
        {list.length === 0 ? (
          <div className='text-muted'>無狀態變更紀錄</div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-3'>
              <thead>
                <tr className='fw-bold text-muted'>
                  <th>時間</th>
                  <th>From</th>
                  <th>To</th>
                  <th>原因/備註</th>
                </tr>
              </thead>
              <tbody>
                {list.map((x: any, idx: number) => (
                  <tr key={x.uuid ?? idx}>
                    <td className='fw-semibold'>{fmt(x.createdTime)}</td>
                    <td className='fw-semibold'>{fmt(x.fromStatus)}</td>
                    <td className='fw-semibold'>{fmt(x.toStatus)}</td>
                    <td className='fw-semibold text-muted'>{fmt(x.reason)}</td>
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
