// src/app/pages/upms/role/detail/cards/RolePermissionsCard.tsx
import React from 'react'
import {useNavigate} from 'react-router-dom'
import {KTIcon} from '@/_metronic/helpers'
import {Role} from '../../Model'

interface Props {
  detail: Role
}

export const RolePermissionsCard: React.FC<Props> = ({detail}) => {
  const navigate = useNavigate()
  const permissions = detail.permissionCodes ?? []

  const handleNavigateToPermissions = () => {
    navigate(`/upms/role/${detail.id}/permissions`)
  }

  return (
    <div className='card h-100'>
      <div className='card-header border-0 pt-6'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>權限列表</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            此角色擁有的所有權限
          </span>
        </h3>
        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-light-primary'
            onClick={handleNavigateToPermissions}
          >
            <KTIcon iconName='setting-2' className='fs-3 me-1' />
            管理權限
          </button>
        </div>
      </div>

      <div className='card-body pt-0'>
        {permissions.length > 0 ? (
          <>
            <div className='d-flex align-items-center mb-5'>
              <div className='flex-grow-1'>
                <div className='d-flex align-items-center'>
                  <KTIcon iconName='shield-tick' className='fs-2x text-primary me-3' />
                  <div>
                    <div className='fs-4 fw-bold text-gray-800'>
                      {permissions.length} 個權限
                    </div>
                    <div className='fs-7 text-muted'>已分配給此角色</div>
                  </div>
                </div>
              </div>
            </div>

            <div className='separator separator-dashed my-5'></div>

            <div className='d-flex flex-wrap gap-2'>
              {permissions.map((permission, index) => (
                <span
                  key={`${permission}-${index}`}
                  className='badge badge-light-info fs-7 fw-bold px-3 py-2'
                >
                  {permission}
                </span>
              ))}
            </div>
          </>
        ) : (
          <div className='text-center py-10'>
            <KTIcon iconName='shield-cross' className='fs-2x text-muted mb-4' />
            <div className='text-gray-600 fw-semibold fs-5 mb-2'>尚未設定任何權限</div>
            <div className='text-muted fs-7 mb-5'>
              點擊「管理權限」按鈕來為此角色分配權限
            </div>
            <button
              type='button'
              className='btn btn-primary'
              onClick={handleNavigateToPermissions}
            >
              <KTIcon iconName='plus' className='fs-2 me-2' />
              立即設定權限
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
