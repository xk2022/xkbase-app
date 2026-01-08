// src/app/pages/upms/user/security/cards/DeviceManagementCard.tsx
import React from 'react'
import {KTIcon} from '@/_metronic/helpers'
import type {AlertFn} from '@/app/pages/common/AlertType'

interface Props {
  userId: string
  onForceLogoutAll: () => Promise<void>
  showAlert?: AlertFn
}

export const DeviceManagementCard: React.FC<Props> = ({
  userId,
  onForceLogoutAll,
  showAlert,
}) => {
  return (
    <div className='card'>
      <div className='card-header border-0 pt-6'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>裝置管理</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            管理使用者的登入裝置
          </span>
        </h3>
      </div>

      <div className='card-body pt-0'>
        <div className='d-flex align-items-center mb-5'>
          <div className='flex-grow-1'>
            <h4 className='fw-bold mb-1'>強制登出所有裝置</h4>
            <p className='text-muted fs-7 mb-0'>
              此操作將使該使用者的所有已登入裝置立即登出，使用者需要重新登入才能繼續使用系統。
            </p>
          </div>
        </div>

        <div className='separator separator-dashed my-5'></div>

        <div className='d-flex justify-content-end'>
          <button
            type='button'
            className='btn btn-light-danger'
            onClick={onForceLogoutAll}
          >
            <KTIcon iconName='logout' className='fs-2 me-2' />
            強制登出所有裝置
          </button>
        </div>
      </div>
    </div>
  )
}
