// src/app/pages/fms/vehicle/detail/VehicleBasicInfoCard.tsx
import React from 'react'
import { KTIcon } from '@/_metronic/helpers'
import { VehicleDetail } from './Model'

type Props = {
  detail: VehicleDetail
  reload?: () => void
}

export const VehicleBasicInfoCard: React.FC<Props> = ({ detail, reload }) => {
  return (
    <div className='card mb-5 mb-xl-8'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder text-dark'>
            車輛基本資訊
          </span>
          <span className='text-muted mt-1 fw-semibold'>
            {detail.plateNo} · {detail.type}
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
          <div className='text-muted'>車牌號碼</div>
          <div className='fs-6 fw-bold'>{detail.plateNo}</div>
        </div>

        <div className='mb-4'>
          <div className='text-muted'>車種</div>
          <div className='fs-6 fw-bold'>{detail.type}</div>
        </div>

        <div className='mb-4 row'>
          <div className='col-6'>
            <div className='text-muted'>品牌</div>
            <div className='fs-6 fw-bold'>{detail.brand || '-'}</div>
          </div>
          <div className='col-6'>
            <div className='text-muted'>型號</div>
            <div className='fs-6 fw-bold'>{detail.model || '-'}</div>
          </div>
        </div>

        <div className='mb-4'>
          <div className='text-muted'>載重（噸）</div>
          <div className='fs-6 fw-bold'>
            {detail.capacityTon != null ? `${detail.capacityTon} 噸` : '-'}
          </div>
        </div>

        <div className='mb-2'>
          <div className='text-muted'>備註</div>
          <div className='fs-6'>
            {detail.remark && detail.remark.trim().length > 0
              ? detail.remark
              : <span className='text-muted'>尚未填寫</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
