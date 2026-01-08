import React from 'react'
import type { OrderDetail } from '../Model'

type Props = {
  detail: OrderDetail
  reload: () => void | Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fmt = (v?: any) => (v === null || v === undefined || v === '' ? '-' : String(v))

const getStatusBadgeClass = (status?: string) => {
  if (!status) return 'badge-light-secondary'
  const s = status.toLowerCase()
  if (s.includes('created') || s.includes('新建立')) return 'badge-light-info'
  if (s.includes('pending') || s.includes('待處理')) return 'badge-light-warning'
  if (s.includes('assigned') || s.includes('已指派') || s.includes('in_transit') || s.includes('運送中')) return 'badge-light-primary'
  if (s.includes('completed') || s.includes('已完成')) return 'badge-light-success'
  if (s.includes('cancelled') || s.includes('已取消')) return 'badge-light-danger'
  return 'badge-light-secondary'
}

export const OrderSummaryCard: React.FC<Props> = ({ detail }) => {
  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-title'>
          <h3 className='fw-bold m-0'>訂單摘要</h3>
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
                <td className='text-muted'>客戶名稱</td>
                <td className='fw-semibold'>{fmt(detail.customerName)}</td>
              </tr>
              <tr>
                <td className='text-muted'>起始地點 → 結束地點</td>
                <td className='fw-semibold'>
                  {fmt(detail.pickupLocation)} → {fmt(detail.destinationPort)}
                </td>
              </tr>
              <tr>
                <td className='text-muted'>提貨日期</td>
                <td className='fw-semibold'>{fmt(detail.pickupDate)}</td>
              </tr>
              <tr>
                <td className='text-muted'>訂單狀態</td>
                <td className='fw-semibold'>
                  <span className={`badge ${getStatusBadgeClass(detail.orderStatus)} fw-bold`}>
                    {fmt(detail.orderStatus)}
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
