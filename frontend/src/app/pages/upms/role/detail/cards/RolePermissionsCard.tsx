// RolePermissionsCard.tsx
import React from 'react'
import {useNavigate} from 'react-router-dom'
import {KTIcon} from '@/_metronic/helpers'
import type {AlertFn} from '@/app/pages/common/AlertType'

import {Role} from '../../Model'

interface Props {
  detail: Role
  showAlert?: AlertFn
}

export const RolePermissionsCard: React.FC<Props> = ({detail, showAlert}) => {
  const navigate = useNavigate()
  const permissions = detail.permissionCodes ?? []

  const handleNavigateToPermissions = () => {
    navigate(`/upms/role/${detail.id}/permissions`)
  }

  return (
    <div className='card mb-5'>
      <div className='card-header'>
        <h3 className='card-title'>權限列表</h3>
        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-light-primary'
            onClick={handleNavigateToPermissions}
          >
            <KTIcon iconName='setting-2' className='fs-3 me-1' />
            設定權限
          </button>
        </div>
      </div>

      <div className='card-body'>
        {permissions.length > 0 ? (
          <div className='d-flex flex-wrap gap-2'>
            {permissions.map((permission, index) => (
              <span
                key={`${permission}-${index}`}
                className='badge badge-light-info'
              >
                {permission}
              </span>
            ))}
          </div>
        ) : (
          <span className='text-muted'>尚無權限</span>
        )}
      </div>
    </div>
  )
}
