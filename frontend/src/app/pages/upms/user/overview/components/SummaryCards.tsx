// src/app/pages/upms/user/overview/components/SummaryCards.tsx
import React, {useMemo} from 'react'
import {StatisticsCard} from './StatisticsCard'
import {User} from '../../Model'

/**
 * 使用者統計資訊
 */
export interface UserStatistics {
  total: number
  enabled: number
  disabled: number
  locked: number
  totalRoles: number
  avgRoles: number
}

export interface SummaryCardsProps {
  /** 所有使用者列表 */
  users: User[]
  /** 鎖定使用者的 ID 集合 */
  lockedUserIds: Set<string>
  /** 取得使用者加入時間的函數 */
  getUserJoinedAt: (user: User) => string | undefined
}

/**
 * 統計摘要卡片群組元件
 * 顯示使用者總數、啟用/停用、鎖定、最近加入等統計資訊
 */
export const SummaryCards: React.FC<SummaryCardsProps> = ({
  users,
  lockedUserIds,
  getUserJoinedAt,
}) => {
  // 計算使用者統計資訊
  const statistics = useMemo<UserStatistics>(() => {
    const total = users.length
    const enabled = users.filter((u) => u.enabled).length
    const disabled = total - enabled
    const locked = users.filter((u) => lockedUserIds.has(u.id)).length
    const totalRoles = users.reduce((sum, u) => sum + (u.roleCodes?.length ?? 0), 0)
    const avgRoles = total > 0 ? Math.round(totalRoles / total) : 0

    return {
      total,
      enabled,
      disabled,
      locked,
      totalRoles,
      avgRoles,
    }
  }, [users, lockedUserIds])

  // 計算近 7 日新增的使用者數量
  const recent7DaysUsers = useMemo(() => {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    return users.filter((user) => {
      const joinedAt = getUserJoinedAt(user)
      if (!joinedAt) return false
      
      const joinedDate = new Date(joinedAt)
      return joinedDate >= sevenDaysAgo
    })
  }, [users, getUserJoinedAt])

  return (
    <div className='row g-5 g-xl-8 mb-5 mb-xl-10'>
      {/* 使用者總數 - 保留 */}
      <StatisticsCard
        title='使用者總數'
        value={statistics.total}
        iconName='abstract-27'
        iconTheme='primary'
        subtitle='已啟用'
        subtitleValue={statistics.enabled}
      />

      {/* 啟用使用者 - 綠色 + Active icon */}
      <StatisticsCard
        title='啟用使用者'
        value={statistics.enabled}
        iconName='check-circle'
        iconTheme='success'
        subtitle='停用'
        subtitleValue={statistics.disabled}
      />

      {/* 鎖定使用者 - 紅色 icon（強化風險感） */}
      <StatisticsCard
        title='鎖定使用者'
        value={statistics.locked}
        iconName='cross-circle'
        iconTheme='danger'
        subtitle={statistics.locked > 0 ? '⚠️ 需處理' : '✓ 正常'}
        subtitleValue={
          statistics.locked > 0 ? (
            <span className='text-danger fw-bold'>異常</span>
          ) : (
            <span className='text-success'>無異常</span>
          )
        }
      />

      {/* 近 7 日新增 */}
      <StatisticsCard
        title='近 7 日新增'
        value={recent7DaysUsers.length}
        iconName='user-plus'
        iconTheme='info'
        subtitle='新增趨勢'
        subtitleValue={recent7DaysUsers.length > 0 ? '活躍' : '穩定'}
      />
    </div>
  )
}
