// src/app/pages/fms/driver/detail/DriverStatusCard.tsx
import React from 'react'
import {DriverDetail} from './Model'
import {KTIcon} from '@/_metronic/helpers'

type Props = {
  detail: DriverDetail
  reload?: () => void
}

export const DriverStatusCard: React.FC<Props> = ({detail}) => {
  const statusBadge = (() => {
    switch (detail.status) {
      case 'ACTIVE':
        return <span className='badge badge-light-success'>ACTIVE</span>
      case 'LEAVE':
        return <span className='badge badge-light-warning'>LEAVE</span>
      case 'INACTIVE':
        return <span className='badge badge-light-secondary'>INACTIVE</span>
      default:
        return <span className='badge badge-light'>{detail.status}</span>
    }
  })()

  return (
    <div className='card'>
      <div className='card-header'>
        <h3 className='card-title'>
          <KTIcon iconName='shield-tick' className='fs-2 me-2' />
          狀態資訊
        </h3>
      </div>

      <div className='card-body'>
        <div className='mb-4'>
          <label className='fw-bold text-muted'>目前狀態</label>
          <div>{statusBadge}</div>
        </div>

        <div className='mb-4'>
          <label className='fw-bold text-muted'>是否上線中（On duty）</label>
          <div>
            {detail.onDuty ? (
              <span className='badge badge-light-success'>上線中</span>
            ) : (
              <span className='badge badge-light-secondary'>未上線</span>
            )}
          </div>
        </div>

        <div>
          <label className='fw-bold text-muted'>駕照類型</label>
          <div className='fs-6'>{detail.licenseType ?? '—'}</div>
        </div>
      </div>
    </div>
  )
}
