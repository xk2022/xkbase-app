// src/app/pages/fms/driver/detail/DriverStatsCard.tsx
import React from 'react'
import {DriverDetail} from './Model'
import {KTIcon} from '@/_metronic/helpers'

type Props = {
  detail: DriverDetail
}

export const DriverStatsCard: React.FC<Props> = ({detail}) => {
  return (
    <div className='card'>
      <div className='card-header'>
        <h3 className='card-title'>
          <KTIcon iconName='chart' className='fs-2 me-2' />
          司機統計資料（預留）
        </h3>
      </div>

      <div className='card-body'>
        <p className='text-muted'>
          這裡將顯示：
          <br />• 接單數量
          <br />• 完成率 / 準時率
          <br />• 表揚 / 申訴紀錄
          <br />• 歷史 OnDuty 記錄
          <br />
          <br />
          （目前為 MVP 預留區域）
        </p>

        <pre className='bg-light p-3 rounded'>{JSON.stringify(detail.status, null, 2)}</pre>
      </div>
    </div>
  )
}
