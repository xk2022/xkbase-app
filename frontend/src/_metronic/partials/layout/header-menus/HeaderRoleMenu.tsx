import {FC, useState, createContext, useContext, ReactNode, useMemo} from 'react'
import {getRolePermissions, hasRolePermission} from '@/app/config/rolePermissions'

// 創建角色 Context
type RoleContextType = {
  selectedRole: string
  setSelectedRole: (role: string) => void
  rolePermissions: string[]
  hasPermission: (permission: string) => boolean
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export const useRole = () => {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used within RoleProvider')
  }
  return context
}

export const RoleProvider = ({children}: {children: ReactNode}) => {
  const [selectedRole, setSelectedRole] = useState<string>('系統管理員')

  const rolePermissions = useMemo(() => {
    return getRolePermissions(selectedRole)
  }, [selectedRole])

  const hasPermission = (permission: string) => {
    return hasRolePermission(selectedRole, permission)
  }

  return (
    <RoleContext.Provider value={{selectedRole, setSelectedRole, rolePermissions, hasPermission}}>
      {children}
    </RoleContext.Provider>
  )
}

const HeaderRoleMenu: FC = () => {
  const {selectedRole, setSelectedRole} = useRole()

  const roles = [
    '系統管理員',
    '內勤人員',
    '調度員',
    '司機',
    '人資管理員',
    '客戶',
    '港口管理員',
  ]

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
    // 可以在這裡添加切換角色的邏輯
    // 例如：更新用戶角色、重新載入權限等
  }

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-200px'
      data-kt-menu='true'
    >
      {roles.map((role) => (
        <div key={role} className='menu-item px-3'>
          <a
            onClick={() => handleRoleSelect(role)}
            className={`menu-link px-3 ${selectedRole === role ? 'active' : ''}`}
          >
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>{role}</span>
          </a>
        </div>
      ))}
    </div>
  )
}

export {HeaderRoleMenu}
