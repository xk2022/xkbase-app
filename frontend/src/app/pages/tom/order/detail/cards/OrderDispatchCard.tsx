import React from 'react'
import type { OrderDetail } from '../Model'

type Props = {
  detail: OrderDetail
  reload: () => void | Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fmt = (v?: any) => (v === null || v === undefined || v === '' ? '-' : String(v))

const getDispatchStatusBadgeClass = (status?: string) => {
  if (!status) return 'badge-light-secondary'
  const s = status.toLowerCase()
  if (s.includes('unassigned') || s.includes('未指派')) return 'badge-light-secondary'
  if (s.includes('assigned') || s.includes('已指派')) return 'badge-light-info'
  if (s.includes('in_progress') || s.includes('進行中')) return 'badge-light-primary'
  if (s.includes('done') || s.includes('完成')) return 'badge-light-success'
  if (s.includes('cancelled') || s.includes('已取消')) return 'badge-light-danger'
  return 'badge-light-secondary'
}

export const OrderDispatchCard: React.FC<Props> = ({ detail }) => {
  const d = detail.dispatch

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-title'>
          <h3 className='fw-bold m-0'>派車資訊</h3>
        </div>
        <div className='card-toolbar'>
          <button className='btn btn-sm btn-light-primary' type='button' disabled>
            指派（待開發）
          </button>
        </div>
      </div>

      <div className='card-body'>
        {!d ? (
          <div className='text-muted'>尚未指派</div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-3'>
              <tbody>
                <tr>
                  <td className='text-muted w-150px'>車頭</td>
                  <td className='fw-semibold'>{fmt(d.vehicleNo)}</td>
                </tr>
                <tr>
                  <td className='text-muted'>板車</td>
                  <td className='fw-semibold'>{fmt(d.trailerNo) || '-'}</td>
                </tr>
                <tr>
                  <td className='text-muted'>司機</td>
                  <td className='fw-semibold'>{fmt(d.driverName)}</td>
                </tr>
                <tr>
                  <td className='text-muted'>執行狀態</td>
                  <td className='fw-semibold'>
                    {d.status ? (
                      <span className={`badge ${getDispatchStatusBadgeClass(d.status)} fw-bold`}>
                        {fmt(d.status)}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
                <tr>
                  <td className='text-muted'>指派時間</td>
                  <td className='fw-semibold'>{fmt(d.assignedAt)}</td>
                </tr>
                <tr>
                  <td className='text-muted'>預計到場</td>
                  <td className='fw-semibold'>{fmt(d.etaAt)}</td>
                </tr>
                {d.remark && (
                  <tr>
                    <td className='text-muted'>備註</td>
                    <td className='fw-semibold'>{fmt(d.remark)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
