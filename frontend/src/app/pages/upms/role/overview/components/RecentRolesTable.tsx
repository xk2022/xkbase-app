// src/app/pages/upms/role/overview/components/RecentRolesTable.tsx
import React, {useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import {KTIcon} from '@/_metronic/helpers'
import {Role} from '../../Model'

export interface RecentRolesTableProps {
  roles: Role[]
  limit?: number
  getRoleCreatedTime: (role: Role) => string | undefined
}

/**
 * 最近建立的角色表格卡片元件
 */
export const RecentRolesTable: React.FC<RecentRolesTableProps> = ({
  roles,
  limit = 5,
  getRoleCreatedTime,
}) => {
  const navigate = useNavigate()

  // 取得最近建立的角色（按建立時間排序，取前 N 個）
  const recentRoles = useMemo(() => {
    return [...roles]
      .sort((a, b) => {
        const aTime = getRoleCreatedTime(a)
        const bTime = getRoleCreatedTime(b)
        
        if (!aTime && !bTime) return 0
        if (!aTime) return 1
        if (!bTime) return -1
        
        return new Date(bTime).getTime() - new Date(aTime).getTime()
      })
      .slice(0, limit)
  }, [roles, limit, getRoleCreatedTime])

  const enabledBadge = (enabled: boolean) => {
    return enabled ? (
      <span className='badge badge-light-success'>啟用</span>
    ) : (
      <span className='badge badge-light-secondary'>停用</span>
    )
  }

  return (
    <div className='card h-100'>
      <div className='card-header border-0 pt-6'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>最近建立的角色</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            最近建立的 {recentRoles.length} 個角色
          </span>
        </h3>
        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-light-primary'
            onClick={() => navigate('/upms/role/list')}
          >
            查看全部
            <KTIcon iconName='arrow-right' className='fs-4 ms-1' />
          </button>
        </div>
      </div>

      <div className='card-body pt-0'>
        {recentRoles.length === 0 ? (
          <div className='text-center py-10 text-muted'>
            <KTIcon iconName='information-5' className='fs-2x text-muted mb-3' />
            <p className='mb-0'>尚無角色資料</p>
          </div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0'>
              <thead>
                <tr className='fw-bold text-muted'>
                  <th className='min-w-150px'>角色代碼</th>
                  <th className='min-w-150px'>角色名稱</th>
                  <th className='min-w-100px'>權限數</th>
                  <th className='min-w-100px'>狀態</th>
                  <th className='min-w-100px text-end'>操作</th>
                </tr>
              </thead>
              <tbody>
                {recentRoles.map((role) => (
                  <tr key={role.id}>
                    <td>
                      <span className='badge badge-light-info fs-7 fw-bold'>
                        {role.code}
                      </span>
                    </td>
                    <td>
                      <span className='text-gray-800 fw-bold'>{role.name}</span>
                    </td>
                    <td>
                      <span className='badge badge-light-primary'>
                        {role.permissionCount ?? role.permissionCodes?.length ?? 0}
                      </span>
                    </td>
                    <td>{enabledBadge(role.enabled)}</td>
                    <td className='text-end'>
                      <button
                        type='button'
                        className='btn btn-sm btn-light-primary'
                        onClick={() => navigate(`/upms/role/${role.id}/detail`)}
                      >
                        詳情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
