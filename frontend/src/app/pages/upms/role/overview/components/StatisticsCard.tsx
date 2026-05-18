// src/app/pages/upms/role/overview/components/StatisticsCard.tsx
import React from 'react'
import {KTIcon} from '@/_metronic/helpers'

export interface StatisticsCardProps {
  /** 標題 */
  title: string
  /** 主要數值 */
  value: number | string
  /** 圖示名稱 */
  iconName: string
  /** 圖示顏色主題 */
  iconTheme: 'primary' | 'success' | 'danger' | 'warning' | 'info'
  /** 底部副標題 */
  subtitle?: string
  /** 底部副數值 */
  subtitleValue?: string | number | React.ReactNode
  /** 點擊事件 */
  onClick?: () => void
}

/**
 * 統計卡片元件
 * 用於顯示單一統計指標
 */
export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  iconName,
  iconTheme,
  subtitle,
  subtitleValue,
  onClick,
}) => {
  const cardClassName = onClick ? 'cursor-pointer' : ''
  const badgeClassName = `badge badge-light-${iconTheme} p-3`

  return (
    <div className={`col-12 col-sm-6 col-xl-3`}>
      <div className={`card h-100 ${cardClassName}`} onClick={onClick}>
        <div className='card-body d-flex flex-column justify-content-between'>
          <div className='d-flex align-items-center justify-content-between'>
            <div className='d-flex flex-column'>
              <span className='text-muted fw-semibold fs-7'>{title}</span>
              <span className='fw-bold fs-2 text-gray-900 mt-1'>{value}</span>
            </div>
            <span className={badgeClassName}>
              <KTIcon iconName={iconName} className='fs-2' />
            </span>
          </div>

          {subtitle && (
            <>
              <div className='separator my-4'></div>
              <div className='d-flex align-items-center justify-content-between'>
                <span className='text-muted fs-8'>{subtitle}</span>
                {subtitleValue !== undefined && (
                  <span className='fw-bold text-gray-800'>{subtitleValue}</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
