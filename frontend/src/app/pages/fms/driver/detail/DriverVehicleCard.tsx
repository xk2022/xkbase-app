// src/app/pages/fms/driver/detail/DriverVehicleCard.tsx
import React from 'react'
import {DriverDetail} from './Model'
import {KTIcon} from '@/_metronic/helpers'

type Props = {
  detail: DriverDetail
  reload?: () => void
}

export const DriverVehicleCard: React.FC<Props> = ({detail}) => {
  const vehicleId = detail.currentVehicleId

  return (
    <div className='card'>
      <div className='card-header'>
        <h3 className='card-title'>
          <KTIcon iconName='car' className='fs-2 me-2' />
          綁定車輛
        </h3>
      </div>

      <div className='card-body'>
        {!vehicleId ? (
          <div className='text-muted'>目前未綁定車輛</div>
        ) : (
          <>
            <div className='mb-4'>
              <label className='fw-bold text-muted'>車輛 ID</label>
              <div>{vehicleId}</div>
            </div>

            <div className='text-muted'>
              （之後可改成顯示車牌、車種、狀態 — 需後端提供 VehicleDetail）
            </div>
          </>
        )}
      </div>
    </div>
  )
}
