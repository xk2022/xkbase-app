// src/app/pages/tom/container/detail/cards/ContainerBillingCard.tsx
import React from 'react'
import type { ContainerDetail } from '../Model'

type Props = {
  detail: ContainerDetail
  reload: () => void | Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fmt = (v?: any) => (v === null || v === undefined || v === '' ? '-' : String(v))

export const ContainerBillingCard: React.FC<Props> = ({ detail }) => {
  const b = detail.billing

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-title'>
          <h3 className='fw-bold m-0'>計費與支付方式</h3>
        </div>
        <div className='card-toolbar'>
          <button className='btn btn-sm btn-light-warning' type='button' disabled>
            編輯（待開發）
          </button>
        </div>
      </div>

      <div className='card-body'>
        {!b ? (
          <div className='text-muted'>尚未建立計費資料</div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-3'>
              <tbody>
                <tr>
                  <td className='text-muted w-150px'>計費方式</td>
                  <td className='fw-semibold'>{fmt(b.pricingMode)}</td>
                </tr>
                <tr>
                  <td className='text-muted'>付款條件</td>
                  <td className='fw-semibold'>{fmt(b.paymentTerm)}</td>
                </tr>
                <tr>
                  <td className='text-muted'>付款狀態</td>
                  <td className='fw-semibold'>{fmt(b.paymentStatus)}</td>
                </tr>

                <tr>
                  <td className='text-muted'>小計</td>
                  <td className='fw-semibold'>
                    {fmt(b.subtotal)} {fmt(b.currency)}
                  </td>
                </tr>
                <tr>
                  <td className='text-muted'>稅額</td>
                  <td className='fw-semibold'>
                    {fmt(b.tax)} {fmt(b.currency)}
                  </td>
                </tr>
                <tr>
                  <td className='text-muted'>總計</td>
                  <td className='fw-semibold'>
                    {fmt(b.total)} {fmt(b.currency)}
                  </td>
                </tr>

                <tr>
                  <td className='text-muted'>需要發票</td>
                  <td className='fw-semibold'>{fmt(b.invoiceNeeded)}</td>
                </tr>
                <tr>
                  <td className='text-muted'>抬頭/統編</td>
                  <td className='fw-semibold'>
                    {fmt(b.invoiceTitle)} / {fmt(b.taxId)}
                  </td>
                </tr>

                <tr>
                  <td className='text-muted'>備註</td>
                  <td className='fw-semibold'>{fmt(b.remark)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
