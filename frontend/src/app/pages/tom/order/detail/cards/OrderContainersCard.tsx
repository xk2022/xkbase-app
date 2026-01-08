import React from 'react'
import type { OrderDetail } from '../Model'

const getContainerStatusBadgeClass = (status?: string) => {
  if (!status) return 'badge-light-secondary'
  const s = status.toLowerCase()
  if (s.includes('ready') || s.includes('就緒') || s.includes('待運')) return 'badge-light-info'
  if (s.includes('loading') || s.includes('裝載中')) return 'badge-light-warning'
  if (s.includes('in_transit') || s.includes('運送中')) return 'badge-light-primary'
  if (s.includes('delivered') || s.includes('已送達') || s.includes('完成')) return 'badge-light-success'
  if (s.includes('damaged') || s.includes('損壞') || s.includes('異常')) return 'badge-light-danger'
  return 'badge-light-secondary'
}

type Props = {
  detail: OrderDetail
  reload: () => void | Promise<void>
}

export const OrderContainersCard: React.FC<Props> = ({ detail }) => {
  const containers = detail.containers || []

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-title'>
          <h3 className='fw-bold m-0'>貨櫃清單</h3>
        </div>
        <div className='card-toolbar'>
          {/* 先留按鈕位置，之後再接功能 */}
          <button className='btn btn-sm btn-light-primary' type='button' disabled>
            新增貨櫃（待開發）
          </button>
        </div>
      </div>

      <div className='card-body'>
        {containers.length === 0 ? (
          <div className='text-muted'>尚無貨櫃資料（後續可從 detail.containers 帶入）</div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-3'>
              <thead>
                <tr className='text-muted fw-bold'>
                  <th className='min-w-180px'>編號</th>
                  <th className='min-w-120px'>類型</th>
                  <th className='min-w-120px'>狀態</th>
                  <th className='min-w-200px'>特殊注記</th>
                </tr>
              </thead>
              <tbody>
                {containers.map((c, idx) => (
                  <tr key={`${c.containerNo}-${idx}`}>
                    <td className='fw-semibold'>{c.containerNo}</td>
                    <td>{c.containerType ?? '-'}</td>
                    <td>
                      {c.status ? (
                        <span className={`badge ${getContainerStatusBadgeClass(c.status)} fw-bold`}>
                          {c.status}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{c.remark ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className='text-muted fs-8 mt-3'>
          目前貨櫃數量：{containers.length}（或使用 detail.containerCount：{detail.containerCount}）
        </div>
      </div>
    </div>
  )
}
