// UserLoginHistoryCard.tsx
import React from 'react'
import { UserProfile } from '../../Model'

interface Props {
  detail: UserProfile
}

export const UserLoginHistoryCard: React.FC<Props> = ({ detail }) => {
  // 🔐 防呆：確保一定是陣列
  const history = detail.loginHistory ?? []

  return (
    <div className='card mb-5'>
      <div className='card-header'>
        <h3 className='card-title'>最近登入紀錄</h3>
      </div>

      <div className='card-body'>
        {history.length === 0 ? (
          <span className='text-muted'>尚無登入紀錄</span>
        ) : (
          <table className='table table-row-bordered'>
            <thead>
              <tr>
                <th>時間</th>
                <th>IP 位址</th>
              </tr>
            </thead>
            <tbody>
              {history.map((l, idx) => (
                <tr key={idx}>
                  <td>{l.time}</td>
                  <td>{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
