// src/app/pages/tom/container/detail/cards/ContainerSummaryCard.tsx
import React from 'react'
import type { ContainerDetail } from '../Model'

type Props = {
  detail: ContainerDetail
  reload: () => void | Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fmt = (v?: any) => (v === null || v === undefined || v === '' ? '-' : String(v))

export const ContainerSummaryCard: React.FC<Props> = ({ detail }) => {
  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-title'>
          <h3 className='fw-bold m-0'>基本貨櫃資料</h3>
        </div>
      </div>

      <div className='card-body'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-3'>
            <tbody>
              <tr>
                <td className='text-muted w-150px'>櫃號</td>
                <td className='fw-semibold'>{fmt(detail.containerNo)}</td>
              </tr>
              <tr>
                <td className='text-muted'>櫃型</td>
                <td className='fw-semibold'>{fmt(detail.type)}</td>
              </tr>
              <tr>
                <td className='text-muted'>狀態</td>
                <td className='fw-semibold'>{fmt(detail.status)}</td>
              </tr>
              <tr>
                <td className='text-muted'>重量</td>
                <td className='fw-semibold'>{fmt(detail.weight)}</td>
              </tr>
              <tr>
                <td className='text-muted'>特殊需求</td>
                <td className='fw-semibold'>{fmt(detail.remark)}</td>
              </tr>

              <tr>
                <td className='text-muted'>所屬訂單</td>
                <td className='fw-semibold'>{fmt(detail.orderNo)}</td>
              </tr>
              <tr>
                <td className='text-muted'>客戶</td>
                <td className='fw-semibold'>{fmt(detail.customerName)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='text-muted fs-8 mt-3'>ID：{fmt(detail.id)}</div>
      </div>
    </div>
  )
}
