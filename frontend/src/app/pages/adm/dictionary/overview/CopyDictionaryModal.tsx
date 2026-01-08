import React, {useMemo, useState} from 'react'
import type {AlertFn} from '@/app/pages/common/AlertType'
import type {Dictionary} from '../Model'
import {copyDictionary} from '../Query'

type Props = {
  show: boolean
  source: Dictionary | null
  showAlert?: AlertFn
  onClose: () => void
  onSuccess: (newCategory?: Dictionary | null) => void | Promise<void>
}

export default function CopyDictionaryModal({show, source, showAlert, onClose, onSuccess}: Props) {
  const [newCode, setNewCode] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = useMemo(() => {
    return !!source?.id && newCode.trim().length > 0 && !submitting
  }, [newCode, source?.id, submitting])

  if (!show) return null

  const submit = async () => {
    if (!source?.id) {
      showAlert?.('請先選取要複製的字典分類', 'warning')
      return
    }
    const code = newCode.trim()
    if (!code) {
      showAlert?.('請輸入新分類 code', 'warning')
      return
    }

    setSubmitting(true)
    try {
      const created = await copyDictionary(source.id, code, showAlert)
      await onSuccess(created)
      setNewCode('')
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='modal fade show d-block' role='dialog' aria-modal='true'>
      <div className='modal-dialog modal-dialog-centered mw-600px'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h3 className='modal-title fw-bold'>複製字典分類</h3>
            <button type='button' className='btn btn-icon btn-sm btn-active-light-primary' onClick={onClose}>
              <i className='bi bi-x fs-2' />
            </button>
          </div>

          <div className='modal-body'>
            {!source ? (
              <div className='text-muted'>尚未選取分類</div>
            ) : (
              <>
                <div className='mb-6'>
                  <div className='text-muted fs-8 mb-1'>來源分類</div>
                  <div className='fw-bold'>{source.name}</div>
                  <div className='text-muted fs-8'>Code：{source.code}</div>
                  <div className='text-muted fs-8'>UUID：{source.id}</div>
                </div>

                <div className='mb-3'>
                  <label className='form-label fw-bold'>新分類 Code</label>
                  <input
                    type='text'
                    className='form-control form-control-solid'
                    placeholder='例如：TOM.ORDER_STATUS'
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                  />
                  <div className='text-muted fs-8 mt-2'>
                    複製會建立新分類（uuid=null）並複製所有 items 到新分類底下。
                  </div>
                </div>
              </>
            )}
          </div>

          <div className='modal-footer'>
            <button type='button' className='btn btn-light' onClick={onClose} disabled={submitting}>
              取消
            </button>
            <button type='button' className='btn btn-primary' onClick={submit} disabled={!canSubmit}>
              {submitting ? '處理中…' : '開始複製'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
