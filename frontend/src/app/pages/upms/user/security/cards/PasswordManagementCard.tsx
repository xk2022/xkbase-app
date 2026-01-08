// src/app/pages/upms/user/security/cards/PasswordManagementCard.tsx
import React, {useState} from 'react'
import {KTIcon} from '@/_metronic/helpers'
import type {AlertFn} from '@/app/pages/common/AlertType'

interface Props {
  userId: string
  username: string
  onPasswordReset: (newPassword: string) => Promise<boolean>
  showAlert?: AlertFn
}

export const PasswordManagementCard: React.FC<Props> = ({
  userId,
  username,
  onPasswordReset,
  showAlert,
}) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async () => {
    if (!password) {
      showAlert?.('請輸入新密碼', 'warning')
      return
    }

    if (password.length < 8) {
      showAlert?.('密碼長度至少需要 8 個字元', 'warning')
      return
    }

    if (password !== confirmPassword) {
      showAlert?.('兩次輸入的密碼不一致', 'warning')
      return
    }

    setLoading(true)
    try {
      const ok = await onPasswordReset(password)
      if (ok) {
        setPassword('')
        setConfirmPassword('')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGeneratePassword = () => {
    // 生成隨機密碼（12 位，包含大小寫字母和數字）
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let generated = ''
    for (let i = 0; i < 12; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(generated)
    setConfirmPassword(generated)
  }

  return (
    <div className='card'>
      <div className='card-header border-0 pt-6'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>密碼管理</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            重設使用者密碼
          </span>
        </h3>
      </div>

      <div className='card-body pt-0'>
        <div className='mb-5'>
          <label className='form-label fw-bold'>帳號</label>
          <input
            type='text'
            className='form-control form-control-solid'
            value={username}
            disabled
          />
        </div>

        <div className='mb-5'>
          <label className='form-label fw-bold'>
            新密碼 <span className='text-danger'>*</span>
          </label>
          <div className='position-relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              className='form-control form-control-solid'
              placeholder='請輸入新密碼（至少 8 個字元）'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type='button'
              className='btn btn-sm btn-icon btn-light position-absolute end-0 top-50 translate-middle-y me-2'
              onClick={() => setShowPassword(!showPassword)}
            >
              <KTIcon iconName={showPassword ? 'eye-slash' : 'eye'} className='fs-2' />
            </button>
          </div>
          <div className='form-text'>密碼長度至少需要 8 個字元</div>
        </div>

        <div className='mb-5'>
          <label className='form-label fw-bold'>
            確認密碼 <span className='text-danger'>*</span>
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            className='form-control form-control-solid'
            placeholder='請再次輸入新密碼'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className='d-flex justify-content-end gap-3'>
          <button
            type='button'
            className='btn btn-light'
            onClick={handleGeneratePassword}
            disabled={loading}
          >
            <KTIcon iconName='arrows-circle' className='fs-2 me-2' />
            產生隨機密碼
          </button>
          <button
            type='button'
            className='btn btn-primary'
            onClick={handleSubmit}
            disabled={loading || !password || !confirmPassword}
          >
            {loading ? (
              <>
                <span className='spinner-border spinner-border-sm me-2' />
                重設中...
              </>
            ) : (
              <>
                <KTIcon iconName='check' className='fs-2 me-2' />
                重設密碼
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
