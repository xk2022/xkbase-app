// src/app/pages/common/MockDataDialog.tsx
import React from 'react'
import { KTIcon } from '@/_metronic/helpers'

type Props = {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const MockDataDialog: React.FC<Props> = ({
  open,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null

  return (
    <>
      <div
        className='modal fade show d-block'
        tabIndex={-1}
        style={{ backgroundColor: 'rgba(0,0,0,.5)' }}
      >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title text-primary'>
                <KTIcon iconName='information-5' className='fs-2 me-2 text-primary' />
                使用 Mock 數據？
              </h5>
              <button
                type='button'
                className='btn btn-sm btn-light'
                onClick={onCancel}
              >
                ×
              </button>
            </div>

            <div className='modal-body'>
              <p className='mb-3'>
                系統偵測到 API 錯誤，是否要使用 Mock 數據來顯示頁面？
              </p>
              <p className='text-muted mb-0 small'>
                使用 Mock 數據可以讓您繼續查看頁面內容，但數據僅供展示使用。
              </p>
            </div>

            <div className='modal-footer'>
              <button className='btn btn-light' onClick={onCancel}>
                取消
              </button>
              <button className='btn btn-primary' onClick={onConfirm}>
                使用 Mock 數據
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='modal-backdrop fade show' />
    </>
  )
}
