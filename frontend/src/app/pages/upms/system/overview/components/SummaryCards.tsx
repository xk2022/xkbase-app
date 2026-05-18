// src/app/pages/upms/system/overview/components/SummaryCards.tsx
import React, {useMemo} from 'react'
import {StatisticsCard} from './StatisticsCard'
import {System} from '../../Model'

/**
 * 系統統計資訊
 */
export interface SystemStatistics {
  total: number
  enabled: number
  disabled: number
}

export interface SummaryCardsProps {
  /** 所有系統列表 */
  systems: System[]
  /** 取得系統創建時間的函數 */
  getSystemCreatedTime: (system: System) => string | undefined
}

/**
 * 統計摘要卡片群組元件
 * 顯示系統總數、啟用/停用、最近創建等統計資訊
 */
export const SummaryCards: React.FC<SummaryCardsProps> = ({
  systems,
  getSystemCreatedTime,
}) => {
  // 計算系統統計資訊
  const statistics = useMemo<SystemStatistics>(() => {
    const total = systems.length
    const enabled = systems.filter((s) => s.enabled).length
    const disabled = total - enabled

    return {
      total,
      enabled,
      disabled,
    }
  }, [systems])

  // 最近創建的系統
  const recentSystem = useMemo(() => {
    const sorted = [...systems]
      .sort((a, b) => {
        const aTime = getSystemCreatedTime(a)
        const bTime = getSystemCreatedTime(b)
        
        if (!aTime && !bTime) return 0
        if (!aTime) return 1
        if (!bTime) return -1
        
        return new Date(bTime).getTime() - new Date(aTime).getTime()
      })
    
    return sorted[0]
  }, [systems, getSystemCreatedTime])

  // 格式化日期
  const formatDate = (ts?: string) => {
    if (!ts) return '-'
    try {
      const d = new Date(ts)
      if (Number.isNaN(d.getTime())) return ts
      return d.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    } catch {
      return ts
    }
  }

  return (
    <div className='row g-5 g-xl-8 mb-5 mb-xl-10'>
      <StatisticsCard
        title='系統總數'
        value={statistics.total}
        iconName='abstract-27'
        iconTheme='primary'
        subtitle='已啟用'
        subtitleValue={statistics.enabled}
      />

      <StatisticsCard
        title='啟用系統'
        value={statistics.enabled}
        iconName='check-circle'
        iconTheme='success'
        subtitle='停用'
        subtitleValue={statistics.disabled}
      />

      <StatisticsCard
        title='最近創建'
        value={recentSystem ? 1 : 0}
        iconName='time'
        iconTheme='warning'
        subtitle='創建時間'
        subtitleValue={recentSystem ? formatDate(getSystemCreatedTime(recentSystem)) : '-'}
      />
    </div>
  )
}
