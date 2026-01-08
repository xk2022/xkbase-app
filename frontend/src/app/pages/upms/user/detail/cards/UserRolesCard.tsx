// UserRolesCard.tsx
import React from 'react'
import { AlertFn } from '@/app/pages/common/AlertType'

import { UserProfile } from '../../Model'

interface Props {
  detail: UserProfile
  reload: () => void
  showAlert?: AlertFn
}

export const UserRolesCard: React.FC<Props> = ({ detail }) => {
  return (
    <div className='card mb-5'>
      <div className='card-header'>
        <h3 className='card-title'>角色與權限</h3>
      </div>

      <div className='card-body'>
        <div className='mb-4'>
          <h5>角色</h5>
          {detail.roles?.length > 0 ? (
            <ul>
              {detail.roles.map((r) => (
                <li key={r.code}>
                  <span className='badge badge-light-primary'>{r.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className='text-muted'>尚未指派角色</span>
          )}
        </div>

        <div>
          <h5>權限列表</h5>
          {detail.permissions?.length > 0 ? (
            <div className='d-flex flex-wrap gap-2'>
              {detail.permissions.map((p) => (
                <span key={p} className='badge badge-light-info'>
                  {p}
                </span>
              ))}
            </div>
          ) : (
            <span className='text-muted'>尚無權限</span>
          )}
        </div>
      </div>
    </div>
  )
}
