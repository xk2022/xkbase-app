// src/app/pages/fms/vehicle/detail/VehicleDriverCard.tsx
import React from 'react'
import { KTIcon } from '@/_metronic/helpers'
import { VehicleDetail } from './Model'

type Props = {
  detail: VehicleDetail
  reload?: () => void
}

export const VehicleDriverCard: React.FC<Props> = ({ detail, reload }) => {
  const driver = detail.driver

  return (
    <div className='card mb-5 mb-xl-8'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder text-dark'>綁定司機</span>
          <span className='text-muted mt-1 fw-semibold'>
            顯示目前指派此車輛的司機資訊
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
        {!driver ? (
          <div className='text-muted'>
            目前尚未綁定司機，可由調度員於指派流程中設定。
          </div>
        ) : (
          <>
            <div className='mb-3 d-flex align-items-center'>
              <div className='symbol symbol-45px me-3'>
                <div className='symbol-label bg-light-primary text-primary fw-bold'>
                  {driver.name?.[0] ?? '司'}
                </div>
              </div>
              <div>
                <div className='fw-bolder fs-6'>{driver.name}</div>
                <div className='text-muted fs-7'>
                  {driver.licenseType || '—'}
                </div>
              </div>
            </div>

            <div className='mb-3'>
              <div className='text-muted'>聯絡電話</div>
              <div className='fs-6 fw-bold'>
                {driver.phone || <span className='text-muted'>尚未填寫</span>}
              </div>
            </div>

            <div className='mb-3'>
              <div className='text-muted'>上線狀態</div>
              <div className='mt-1'>
                {driver.onDuty ? (
                  <span className='badge badge-light-success fw-bolder px-4 py-3'>
                    上線中
                  </span>
                ) : (
                  <span className='badge badge-light-secondary fw-bolder px-4 py-3'>
                    未上線
                  </span>
                )}
              </div>
            </div>
          </>
        )}

        {/* 預留操作按鈕（之後可以開 modal 換 driver） */}
        <div className='mt-5'>
          <button
            type='button'
            className='btn btn-sm btn-light-primary'
            disabled={true} // 先鎖死，之後再接 API
          >
            <KTIcon iconName='swap' className='fs-4 me-1' />
            變更綁定司機（預留）
          </button>
        </div>
      </div>
    </div>
  )
}
