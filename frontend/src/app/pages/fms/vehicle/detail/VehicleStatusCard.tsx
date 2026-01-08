// src/app/pages/fms/vehicle/detail/VehicleStatusCard.tsx
import React from 'react'
import { KTIcon } from '@/_metronic/helpers'
import { VehicleDetail } from './Model'

type Props = {
  detail: VehicleDetail
  reload?: () => void
}

export const VehicleStatusCard: React.FC<Props> = ({ detail, reload }) => {
  const statusBadge = (() => {
    switch (detail.status) {
      case 'IDLE':
        return { label: '閒置', className: 'badge-light-success' }
      case 'IN_USE':
        return { label: '執行中', className: 'badge-light-primary' }
      case 'MAINTENANCE':
        return { label: '維修中', className: 'badge-light-warning' }
      case 'RESERVED':
        return { label: '已預約', className: 'badge-light-info' }
      case 'SCRAPPED':
        return { label: '報廢 / 停用', className: 'badge-light-danger' }
      default:
        return { label: detail.status, className: 'badge-light-secondary' }
    }
  })()

  return (
    <div className='card mb-5 mb-xl-8'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder text-dark'>狀態與里程</span>
          <span className='text-muted mt-1 fw-semibold'>
            即時掌握車輛可用狀態
          </span>
        </h3>
        {reload && (
          <div className='card-toolbar'>
            <button
              type='button'
              className='btn btn-sm btn-light'
              onClick={reload}
            >
              <KTIcon iconName='refresh' className='fs-4 me-1' />
              重新整理
            </button>
          </div>
        )}
      </div>

      <div className='card-body pt-3'>
        <div className='mb-4'>
          <div className='text-muted'>車輛狀態</div>
          <div className='mt-1'>
            <span className={`badge fw-bolder px-4 py-3 ${statusBadge.className}`}>
              {statusBadge.label}
            </span>
          </div>
        </div>

        <div className='mb-4'>
          <div className='text-muted'>是否可指派</div>
          <div className='mt-1'>
            {detail.enabled ? (
              <span className='badge badge-light-success fw-bolder px-4 py-3'>
                可指派
              </span>
            ) : (
              <span className='badge badge-light-secondary fw-bolder px-4 py-3'>
                不可指派
              </span>
            )}
          </div>
        </div>

        <div className='mb-4'>
          <div className='text-muted'>目前里程數</div>
          <div className='fs-6 fw-bold'>
            {detail.currentOdometer != null
              ? `${detail.currentOdometer.toLocaleString()} km`
              : '-'}
          </div>
        </div>

        <div className='mb-2 row'>
          <div className='col-6'>
            <div className='text-muted'>建立時間</div>
            <div className='fs-7'>
              {detail.createdTime || <span className='text-muted'>-</span>}
            </div>
          </div>
          <div className='col-6'>
            <div className='text-muted'>最後更新</div>
            <div className='fs-7'>
              {detail.updatedTime || <span className='text-muted'>-</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
