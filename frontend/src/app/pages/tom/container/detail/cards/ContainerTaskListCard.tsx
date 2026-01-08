// src/app/pages/tom/container/detail/cards/ContainerTaskListCard.tsx
import React from 'react'
import type { ContainerDetail } from '../Model'

type Props = {
  detail: ContainerDetail
  reload: () => void | Promise<void>
}

const fmtDateTime = (ts?: string) => {
  if (!ts) return '-'
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ts
  return d.toLocaleString('zh-TW')
}

export const ContainerTaskListCard: React.FC<Props> = ({ detail }) => {
  const tasks = detail.tasks || []

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-title'>
          <h3 className='fw-bold m-0'>任務清單</h3>
        </div>
        <div className='card-toolbar'>
          <button className='btn btn-sm btn-light-primary' type='button' disabled>
            新增任務（待開發）
          </button>
        </div>
      </div>

      <div className='card-body'>
        {tasks.length === 0 ? (
          <div className='text-muted'>尚無任務資料</div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-3'>
              <thead>
                <tr className='text-muted fw-bold'>
                  <th className='min-w-70px'>序</th>
                  <th className='min-w-260px'>起訖</th>
                  <th className='min-w-220px'>時間窗</th>
                  <th className='min-w-180px'>司機/車輛</th>
                  <th className='min-w-120px'>狀態</th>
                  <th className='min-w-200px'>備註</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => {
                  const dv = [t.driverName, t.vehicleNo].filter(Boolean).join(' / ') || '-'
                  return (
                    <tr key={t.taskId}>
                      <td className='fw-semibold'>{t.seq}</td>
                      <td>
                        {(t.fromLocation ?? '-') + ' -> ' + (t.toLocation ?? '-')}
                      </td>
                      <td>
                        {fmtDateTime(t.plannedStartAt)} ~ {fmtDateTime(t.plannedEndAt)}
                      </td>
                      <td>{dv}</td>
                      <td className='fw-semibold'>{t.status}</td>
                      <td>{t.remark ?? '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
