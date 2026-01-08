// src/app/pages/tom/order/detail/cards/OrderBasicInfoCard.tsx
import React from 'react'
import type { OrderDetail } from './Model'

type Props = {
  detail: OrderDetail
  reload: () => void | Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fmt = (v?: any) =>
  v === null || v === undefined || v === '' ? '-' : String(v)

export const OrderBasicInfoCard: React.FC<Props> = ({ detail }) => {
  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-title'>
          <h3 className='fw-bold m-0'>基本資訊</h3>
        </div>
      </div>

      <div className='card-body'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-3'>
            <tbody>
              <tr>
                <td className='text-muted w-150px'>訂單編號</td>
                <td className='fw-semibold'>{fmt(detail.orderNo)}</td>
              </tr>

              <tr>
                <td className='text-muted'>訂單狀態</td>
                <td className='fw-semibold'>{fmt(detail.orderStatus)}</td>
              </tr>

              <tr>
                <td className='text-muted'>客戶名稱</td>
                <td className='fw-semibold'>{fmt(detail.customerName)}</td>
              </tr>

              <tr>
                <td className='text-muted'>提貨地點</td>
                <td className='fw-semibold'>{fmt(detail.pickupLocation)}</td>
              </tr>

              <tr>
                <td className='text-muted'>目的港口</td>
                <td className='fw-semibold'>{fmt(detail.destinationPort)}</td>
              </tr>

              <tr>
                <td className='text-muted'>提貨日期</td>
                <td className='fw-semibold'>{fmt(detail.pickupDate)}</td>
              </tr>

              <tr>
                <td className='text-muted'>貨櫃數量</td>
                <td className='fw-semibold'>{fmt(detail.containerCount)}</td>
              </tr>

              <tr>
                <td className='text-muted'>建立時間</td>
                <td className='fw-semibold'>{fmt(detail.createdTime)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='text-muted fs-8 mt-3'>
          ID：{fmt(detail.id)}
        </div>
      </div>
    </div>
  )
}
