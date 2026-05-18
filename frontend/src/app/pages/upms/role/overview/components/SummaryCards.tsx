// src/app/pages/upms/role/overview/components/SummaryCards.tsx
import React, {useMemo} from 'react'
import {StatisticsCard} from './StatisticsCard'
import {Role} from '../../Model'

/**
 * 角色統計資訊
 */
export interface RoleStatistics {
  total: number
  enabled: number
  disabled: number
  totalPermissions: number
  avgPermissions: number
}

export interface SummaryCardsProps {
  /** 所有角色列表 */
  roles: Role[]
  /** 取得角色建立時間的函數 */
  getRoleCreatedTime: (role: Role) => string | undefined
}

/**
 * 統計摘要卡片群組元件
 * 顯示角色總數、啟用/停用、權限統計等統計資訊
 */
export const SummaryCards: React.FC<SummaryCardsProps> = ({
  roles,
  getRoleCreatedTime,
}) => {
  // 計算角色統計資訊
  const statistics = useMemo<RoleStatistics>(() => {
    const total = roles.length
    const enabled = roles.filter((r) => r.enabled).length
    const disabled = total - enabled
    const totalPermissions = roles.reduce(
      (sum, r) => sum + (r.permissionCount ?? r.permissionCodes?.length ?? 0),
      0
    )
    const avgPermissions = total > 0 ? Math.round(totalPermissions / total) : 0

    return {
      total,
      enabled,
      disabled,
      totalPermissions,
      avgPermissions,
    }
  }, [roles])

  // 計算近 7 日新增的角色數量
  const recent7DaysRoles = useMemo(() => {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    return roles.filter((role) => {
      const createdTime = getRoleCreatedTime(role)
      if (!createdTime) return false
      
      const createdDate = new Date(createdTime)
      return createdDate >= sevenDaysAgo
    })
  }, [roles, getRoleCreatedTime])

  return (
    <div className='row g-5 g-xl-8 mb-5 mb-xl-10'>
      {/* 角色總數 */}
      <StatisticsCard
        title='角色總數'
        value={statistics.total}
        iconName='abstract-27'
        iconTheme='primary'
        subtitle='已啟用'
        subtitleValue={statistics.enabled}
      />

      {/* 啟用角色 */}
      <StatisticsCard
        title='啟用角色'
        value={statistics.enabled}
        iconName='check-circle'
        iconTheme='success'
        subtitle='停用'
        subtitleValue={statistics.disabled}
      />

      {/* 總權限數 */}
      <StatisticsCard
        title='總權限數'
        value={statistics.totalPermissions}
        iconName='shield-tick'
        iconTheme='info'
        subtitle='平均'
        subtitleValue={`${statistics.avgPermissions} 個/角色`}
      />

      {/* 近 7 日新增 */}
      <StatisticsCard
        title='近 7 日新增'
        value={recent7DaysRoles.length}
        iconName='time'
        iconTheme='warning'
        subtitle='新增趨勢'
        subtitleValue={recent7DaysRoles.length > 0 ? '活躍' : '無新增'}
      />
    </div>
  )
}
