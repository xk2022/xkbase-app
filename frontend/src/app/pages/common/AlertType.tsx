// src/app/pages/common/AlertType.tsx
import { useCallback, useEffect, useRef, useState } from 'react'

export type AlertType = 'success' | 'warning' | 'danger' | 'error' | 'info'
export type AlertFn = (message: string, type: AlertType) => void

type AlertState =
  | {
      message: string
      type: AlertType
    }
  | null

export const useAlert = (autoCloseMs: number = 3000) => {
  const [alert, setAlert] = useState<AlertState>(null)
  const timerRef = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const showAlert = useCallback<AlertFn>(
    (message, type) => {
      setAlert({ message, type })

      clearTimer()
      timerRef.current = window.setTimeout(() => {
        setAlert(null)
        timerRef.current = null
      }, autoCloseMs)
    },
    [autoCloseMs, clearTimer]
  )

  const dismiss = useCallback(() => {
    clearTimer()
    setAlert(null)
  }, [clearTimer])

  // 避免 component unmount 後 timer 還在 setState
  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  const Alert = ({ message, type }: { message: string; type: AlertType }) => {
    const bsType = type === 'error' ? 'danger' : type

    return (
      <div
        className={`alert alert-${bsType} d-flex align-items-center p-5 mb-5`}
        role='alert'
      >
        <div className='d-flex flex-column flex-grow-1'>
          <span className='fw-bold'>{message}</span>
        </div>

        <button
          type='button'
          className='btn btn-sm btn-icon btn-light ms-3'
          onClick={dismiss}
          aria-label='Close'
        >
          ✕
        </button>
      </div>
    )
  }

  return { alert, showAlert, dismiss, Alert }
}
