// src/app/pages/upms/system/detail/cards/SystemBasicInfoCard.tsx
import React from 'react'
import type {System} from '../Model'

type Props = {
  detail: System
  reload: () => void | Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fmt = (v?: any) => (v === null || v === undefined || v === '' ? '-' : String(v))

export const SystemBasicInfoCard: React.FC<Props> = ({detail}) => {
  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-title'>
          <h3 className='fw-bold m-0'>基本資訊</h3>
        </div>
      </div>

      <div className='card-body'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-3'>
            <tbody>
              <tr>
                <td className='text-muted w-150px'>系統代碼</td>
                <td className='fw-semibold'>{fmt(detail.code)}</td>
              </tr>
              <tr>
                <td className='text-muted'>系統名稱</td>
                <td className='fw-semibold'>{fmt(detail.name)}</td>
              </tr>
              <tr>
                <td className='text-muted'>系統描述</td>
                <td className='fw-semibold'>{fmt(detail.remark)}</td>
              </tr>
              <tr>
                <td className='text-muted'>啟用狀態</td>
                <td className='fw-semibold'>
                  {detail.enabled ? '啟用' : '停用'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='text-muted fs-8'>
          UUID：{fmt(detail.id)}
        </div>
      </div>
    </div>
  )
}
