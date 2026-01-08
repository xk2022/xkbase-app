// src/app/pages/tom/container/detail/cards/ContainerDispatchCard.tsx
import React from 'react'
import type { ContainerDetail } from '../Model'

type Props = {
  detail: ContainerDetail
  reload: () => void | Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fmt = (v?: any) => (v === null || v === undefined || v === '' ? '-' : String(v))

export const ContainerDispatchCard: React.FC<Props> = ({ detail }) => {
  const d = detail.dispatch

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-title'>
          <h3 className='fw-bold m-0'>派遣資訊</h3>
        </div>
        <div className='card-toolbar'>
          <button className='btn btn-sm btn-light-primary' type='button' disabled>
            指派（待開發）
          </button>
        </div>
      </div>

      <div className='card-body'>
        {!d ? (
          <div className='text-muted'>尚無派遣資訊</div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-3'>
              <tbody>
                <tr>
                  <td className='text-muted w-150px'>狀態</td>
                  <td className='fw-semibold'>{fmt(d.status)}</td>
                </tr>
                <tr>
                  <td className='text-muted'>司機</td>
                  <td className='fw-semibold'>{fmt(d.driverName)}</td>
                </tr>
                <tr>
                  <td className='text-muted'>車輛</td>
                  <td className='fw-semibold'>{fmt(d.vehicleNo)}</td>
                </tr>
                <tr>
                  <td className='text-muted'>指派時間</td>
                  <td className='fw-semibold'>{fmt(d.assignedAt)}</td>
                </tr>
                <tr>
                  <td className='text-muted'>預計到場</td>
                  <td className='fw-semibold'>{fmt(d.etaAt)}</td>
                </tr>
                <tr>
                  <td className='text-muted'>備註</td>
                  <td className='fw-semibold'>{fmt(d.remark)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
