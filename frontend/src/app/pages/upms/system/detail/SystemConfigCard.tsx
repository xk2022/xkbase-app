// src/app/pages/upms/system/detail/cards/SystemConfigCard.tsx
import React from 'react'
import type {System} from '../Model'

type Props = {
  detail: System
  reload: () => void | Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fmt = (v?: any) => (v === null || v === undefined || v === '' ? '-' : String(v))

export const SystemConfigCard: React.FC<Props> = ({detail}) => {
  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-title'>
          <h3 className='fw-bold m-0'>系統設定</h3>
        </div>
      </div>

      <div className='card-body'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-3'>
            <tbody>
              <tr>
                <td className='text-muted w-150px'>Base URL</td>
                {/* <td className='fw-semibold'>{fmt(detail.baseUrl)}</td> */}
              </tr>
              <tr>
                <td className='text-muted'>前端 URL</td>
                {/* <td className='fw-semibold'>{fmt(detail.frontendUrl)}</td> */}
              </tr>
              <tr>
                <td className='text-muted'>排序順序</td>
                {/* <td className='fw-semibold'>{fmt(detail.sortOrder)}</td> */}
              </tr>
              <tr>
                <td className='text-muted'>系統類型</td>
                {/* <td className='fw-semibold'>{fmt(detail.systemType)}</td> */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
