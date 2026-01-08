/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/pages/tom/order/detail/cards/OrderAssignmentCard.tsx
import React from 'react'
import type { OrderDetail } from './Model'

type Props = {
  detail: OrderDetail
  reload: () => void | Promise<void>
}

const fmt = (v?: any) => (v === null || v === undefined || v === '' ? '-' : String(v))

export const OrderAssignmentCard: React.FC<Props> = ({ detail }) => {
  const list = Array.isArray(detail.assignments) ? detail.assignments : []

  // 你後端如果有 current vehicle/driver uuid，可以直接放在 detail 上
  // 這裡先用「第一筆」當作最新（假設後端已 DESC）
  const latest = list[0]

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-title'>
          <h3 className='fw-bold m-0'>派單資訊</h3>
        </div>
      </div>

      <div className='card-body'>
        <div className='mb-6'>
          <div className='fw-bold mb-2'>目前指派</div>
          {!latest ? (
            <div className='text-muted'>尚未指派</div>
          ) : (
            <div className='table-responsive'>
              <table className='table table-sm table-row-dashed table-row-gray-300 align-middle'>
                <tbody>
                  <tr>
                    <td className='text-muted w-150px'>車輛 UUID</td>
                    <td className='fw-semibold'>{fmt(latest.vehicleUuid)}</td>
                  </tr>
                  <tr>
                    <td className='text-muted'>司機 UUID</td>
                    <td className='fw-semibold'>{fmt(latest.driverUuid)}</td>
                  </tr>
                  <tr>
                    <td className='text-muted'>指派時間</td>
                    <td className='fw-semibold'>{fmt(latest.assignedTime)}</td>
                  </tr>
                  <tr>
                    <td className='text-muted'>備註</td>
                    <td className='fw-semibold'>{fmt(latest.note)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <div className='fw-bold mb-2'>派單歷程</div>

          {list.length === 0 ? (
            <div className='text-muted'>無派單歷程</div>
          ) : (
            <div className='table-responsive'>
              <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-3'>
                <thead>
                  <tr className='fw-bold text-muted'>
                    <th>時間</th>
                    <th>車輛</th>
                    <th>司機</th>
                    <th>備註</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((x: any, idx: number) => (
                    <tr key={x.uuid ?? idx}>
                      <td className='fw-semibold'>{fmt(x.assignedTime)}</td>
                      <td className='fw-semibold'>{fmt(x.vehicleUuid)}</td>
                      <td className='fw-semibold'>{fmt(x.driverUuid)}</td>
                      <td className='fw-semibold text-muted'>{fmt(x.note)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
