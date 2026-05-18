// src/app/pages/upms/role/detail/cards/RoleUsersCard.tsx
import React, {useCallback, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {KTIcon} from '@/_metronic/helpers'
import {AlertFn} from '@/app/pages/common/AlertType'
import {fetchUsersByRole} from '../../Query'

interface Props {
  roleId: string
  showAlert?: AlertFn
}

interface UserInfo {
  id: string
  username: string
  name?: string
  enabled: boolean
}

/**
 * 角色使用者卡片元件
 * 顯示擁有此角色的使用者列表
 */
export const RoleUsersCard: React.FC<Props> = ({roleId, showAlert}) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<UserInfo[]>([])

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchUsersByRole(roleId, showAlert)
      setUsers(data)
    } catch (e) {
      console.error(e)
      showAlert?.('取得使用者列表失敗', 'danger')
    } finally {
      setLoading(false)
    }
  }, [roleId, showAlert])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const enabledBadge = (enabled: boolean) => {
    return enabled ? (
      <span className='badge badge-light-success fs-7 fw-bold px-3 py-2'>啟用</span>
    ) : (
      <span className='badge badge-light-secondary fs-7 fw-bold px-3 py-2'>停用</span>
    )
  }

  return (
    <div className='card'>
      <div className='card-header border-0 pt-6'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>使用者列表</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            擁有此角色的所有使用者
          </span>
        </h3>
        <div className='card-toolbar'>
          <span className='badge badge-light-primary fs-6 fw-bold px-3 py-2'>
            {users.length} 個使用者
          </span>
        </div>
      </div>

      <div className='card-body pt-0'>
        {loading ? (
          <div className='d-flex justify-content-center py-10'>
            <div className='spinner-border' role='status'>
              <span className='visually-hidden'>載入中...</span>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className='text-center py-10'>
            <KTIcon iconName='user' className='fs-2x text-muted mb-4' />
            <div className='text-gray-600 fw-semibold fs-5 mb-2'>尚無使用者擁有此角色</div>
            <div className='text-muted fs-7'>
              目前沒有任何使用者被分配到此角色
            </div>
          </div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              <thead>
                <tr className='fw-bold text-muted'>
                  <th className='min-w-200px'>使用者名稱</th>
                  <th className='min-w-150px'>帳號</th>
                  <th className='min-w-100px'>狀態</th>
                  <th className='min-w-100px text-end'>操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className='d-flex align-items-center'>
                        <div className='symbol symbol-circle symbol-45px me-3'>
                          <div className='symbol-label bg-light-primary text-primary fs-6 fw-bold'>
                            {(user.name || user.username).charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className='d-flex flex-column'>
                          <span className='text-gray-800 fw-bold fs-6'>
                            {user.name || user.username}
                          </span>
                          {user.name && (
                            <span className='text-muted fs-7'>{user.username}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className='badge badge-light-info fs-7 fw-bold px-3 py-2'>
                        {user.username}
                      </span>
                    </td>
                    <td>{enabledBadge(user.enabled)}</td>
                    <td className='text-end'>
                      <button
                        type='button'
                        className='btn btn-sm btn-light-primary'
                        onClick={() => navigate(`/upms/user/${user.id}/detail`)}
                      >
                        <KTIcon iconName='eye' className='fs-3 me-1' />
                        查看
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
