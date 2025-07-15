import React from 'react'

interface ToastNotificationProps {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  onClose: () => void
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ message, type, onClose }) => {
  const alertClass = {
    success: 'alert-success',
    error: 'alert-danger',
    warning: 'alert-warning',
    info: 'alert-info'
  }[type]

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000) // 5秒後自動關閉

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`alert ${alertClass} alert-dismissible fade show`} role="alert">
      <div className="alert-text">{message}</div>
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={onClose}
      ></button>
    </div>
  )
}
