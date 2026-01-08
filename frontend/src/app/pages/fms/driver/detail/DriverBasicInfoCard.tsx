// src/app/pages/fms/driver/detail/DriverBasicInfoCard.tsx
import React from 'react'
import {DriverDetail} from './Model'
import {KTIcon} from '@/_metronic/helpers'

type Props = {
  detail: DriverDetail
  reload?: () => void
}

export const DriverBasicInfoCard: React.FC<Props> = ({detail}) => {
  return (
    <div className='card'>
      <div className='card-header'>
        <h3 className='card-title'>
          <KTIcon iconName='user' className='fs-2 me-2' />
          基本資訊
        </h3>
      </div>

      <div className='card-body'>
        <div className='mb-4'>
          <label className='fw-bold text-muted'>姓名</label>
          <div className='fs-5'>{detail.name}</div>
        </div>

        <div className='mb-4'>
          <label className='fw-bold text-muted'>電話</label>
          <div>{detail.phone ?? '—'}</div>
        </div>

        <div className='mb-4'>
          <label className='fw-bold text-muted'>綁定使用者帳號</label>
          <div>{detail.userId ?? '（未綁定）'}</div>
        </div>

        <div className='mb-4'>
          <label className='fw-bold text-muted'>建立時間</label>
          <div>{detail.createdTime ?? '—'}</div>
        </div>

        <div>
          <label className='fw-bold text-muted'>最後更新時間</label>
          <div>{detail.updatedTime ?? '—'}</div>
        </div>
      </div>
    </div>
  )
}
