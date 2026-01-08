// src/app/pages/fms/vehicle/detail/VehicleMaintenanceCard.tsx
import React from 'react'
import { KTIcon } from '@/_metronic/helpers'
import { VehicleDetail } from './Model'

type Props = {
  detail: VehicleDetail
}

export const VehicleMaintenanceCard: React.FC<Props> = ({ detail }) => {
  const records = detail.recentMaintenances ?? []

  return (
    <div className='card mb-5 mb-xl-8'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder text-dark'>
            維修 / 保養紀錄（最近）
          </span>
          <span className='text-muted mt-1 fw-semibold'>
            後端目前可先回空陣列，畫面預留結構
          </span>
        </h3>
        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-light'
            disabled={true}
          >
            <KTIcon iconName='plus' className='fs-4 me-1' />
            新增維修紀錄（預留）
          </button>
        </div>
      </div>

      <div className='card-body pt-3'>
        {records.length === 0 ? (
          <div className='text-muted'>
            目前尚無維修 / 保養紀錄。未來可在此呈現最近 5 筆紀錄，以及連結至完整列表。
          </div>
        ) : (
          <div className='table-responsive'>
            <table className='table align-middle table-row-dashed fs-6 gy-4'>
              <thead>
                <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
                  <th className='min-w-100px'>日期</th>
                  <th className='min-w-120px'>種類</th>
                  <th className='min-w-100px'>里程數</th>
                  <th className='min-w-200px'>說明</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id}>
                    <td>{r.date}</td>
                    <td>{r.type}</td>
                    <td>
                      {r.mileage != null
                        ? `${r.mileage.toLocaleString()} km`
                        : '-'}
                    </td>
                    <td>{r.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
