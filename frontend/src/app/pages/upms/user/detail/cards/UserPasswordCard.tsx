// UserPasswordCard.tsx
import React, { useState } from 'react'
import { resetUserPassword } from '../../Query'

interface Props {
  userId: string
}

export const UserPasswordCard: React.FC<Props> = ({ userId }) => {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!password) return alert('請輸入新密碼')

    setLoading(true)
    const ok = await resetUserPassword(userId, password)
    setLoading(false)

    if (ok) {
      alert('密碼已成功更新')
      setPassword('')
    } else {
      alert('更新失敗')
    }
  }

  return (
    <div className='card mb-5'>
      <div className='card-header'>
        <h3 className='card-title'>重設密碼</h3>
      </div>

      <div className='card-body'>
        <div className='mb-3'>
          <label className='form-label'>新密碼</label>
          <input
            type='password'
            className='form-control'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className='btn btn-primary'
          onClick={submit}
          disabled={loading}
        >
          {loading ? '更新中...' : '更新密碼'}
        </button>
      </div>
    </div>
  )
}
