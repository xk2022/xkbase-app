// src/app/pages/common/ConfirmDeleteModal.tsx
import React from 'react'
import {KTIcon} from '@/_metronic/helpers'

type Props = {
  open: boolean
  title: string
  message: React.ReactNode
  deleting: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
}

export const ConfirmDeleteModal: React.FC<Props> = ({
  open,
  title,
  message,
  deleting,
  onClose,
  onConfirm,
}) => {
  if (!open) return null

  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <>
      <div
        className='modal fade show d-block'
        tabIndex={-1}
        style={{backgroundColor: 'rgba(0,0,0,.25)'}}
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title text-danger'>
                <KTIcon iconName='cross' className='fs-2 me-2 text-danger' />
                {title}
              </h5>
              <button
                type='button'
                className='btn btn-sm btn-light'
                onClick={onClose}
                disabled={deleting}
              >
                ×
              </button>
            </div>

            <div className='modal-body'>
              {typeof message === 'string' ? <p>{message}</p> : message}
            </div>

            <div className='modal-footer'>
              <button className='btn btn-light' onClick={onClose} disabled={deleting}>
                取消
              </button>
              <button className='btn btn-danger' onClick={handleConfirm} disabled={deleting}>
                {deleting ? '刪除中…' : '確認刪除'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='modal-backdrop fade show' />
    </>
  )
}
