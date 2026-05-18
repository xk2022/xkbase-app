// src/app/pages/upms/user/overview/components/RecentUsersTable.tsx
import React, {useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import {KTIcon} from '@/_metronic/helpers'
import {User} from '../../Model'

export interface RecentUsersTableProps {
  users: User[]
  limit?: number
  getUserJoinedAt: (user: User) => string | undefined
}

/**
 * 最近加入的使用者表格卡片元件
 */
export const RecentUsersTable: React.FC<RecentUsersTableProps> = ({
  users,
  limit = 5,
  getUserJoinedAt,
}) => {
  const navigate = useNavigate()

  // 取得最近加入的使用者（按加入時間排序，取前 N 個）
  const recentUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => {
        const aTime = getUserJoinedAt(a)
        const bTime = getUserJoinedAt(b)
        
        if (!aTime && !bTime) return 0
        if (!aTime) return 1
        if (!bTime) return -1
        
        return new Date(bTime).getTime() - new Date(aTime).getTime()
      })
      .slice(0, limit)
  }, [users, limit, getUserJoinedAt])

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
          <span className='card-label fw-bold fs-3 mb-1'>最近加入的使用者</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            最近加入的 {recentUsers.length} 個使用者
          </span>
        </h3>
        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-light-primary'
            onClick={() => navigate('/upms/user/list')}
          >
            查看全部
            <KTIcon iconName='arrow-right' className='fs-4 ms-1' />
          </button>
        </div>
      </div>

      <div className='card-body pt-0'>
        {recentUsers.length === 0 ? (
          <div className='text-center py-10 text-muted'>
            <KTIcon iconName='information-5' className='fs-2x text-muted mb-3' />
            <p className='mb-0'>尚無使用者資料</p>
          </div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0'>
              <thead>
                <tr className='fw-bold text-muted'>
                  <th className='min-w-150px'>使用者名稱</th>
                  <th className='min-w-150px'>帳號</th>
                  <th className='min-w-100px'>角色數</th>
                  <th className='min-w-100px'>狀態</th>
                  <th className='min-w-100px text-end'>操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <span className='text-gray-800 fw-bold'>
                        {user.name || user.username}
                      </span>
                    </td>
                    <td>
                      <span className='badge badge-light-info fs-7 fw-bold'>
                        {user.username}
                      </span>
                    </td>
                    <td>
                      <span className='badge badge-light-primary'>
                        {user.roleCodes?.length ?? 0}
                      </span>
                    </td>
                    <td>{enabledBadge(user.enabled)}</td>
                    <td className='text-end'>
                      <button
                        type='button'
                        className='btn btn-sm btn-light-primary'
                        onClick={() => navigate(`/upms/user/${user.id}/detail`)}
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
