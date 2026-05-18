// src/app/pages/upms/user/overview/components/RoleDistributionTable.tsx
import React, {useMemo} from 'react'
import {User} from '../../Model'

/**
 * 角色數量分布統計
 */
export interface RoleDistributionStats {
  '0': number
  '1': number
  '2': number
  '3': number
  '4+': number
}

export interface RoleDistributionTableProps {
  users: User[]
}

/**
 * 角色數量分布表格卡片元件
 */
export const RoleDistributionTable: React.FC<RoleDistributionTableProps> = ({
  users,
}) => {
  // 計算角色數量分布統計
  const stats = useMemo<RoleDistributionStats>(() => {
    const distribution: RoleDistributionStats = {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4+': 0,
    }

    users.forEach((user) => {
      const count = user.roleCodes?.length ?? 0
      if (count === 0) {
        distribution['0']++
      } else if (count === 1) {
        distribution['1']++
      } else if (count === 2) {
        distribution['2']++
      } else if (count === 3) {
        distribution['3']++
      } else {
        distribution['4+']++
      }
    })

    return distribution
  }, [users])

  const totalUsers = users.length

  const getRangeLabel = (range: string): string => {
    switch (range) {
      case '0':
        return '無角色'
      case '4+':
        return '4 個以上'
      default:
        return `${range} 個`
    }
  }

  return (
    <div className='card h-100'>
      <div className='card-header border-0 pt-6'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>角色數量分布</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            各使用者擁有的角色數量統計
          </span>
        </h3>
      </div>

      <div className='card-body pt-0'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0'>
            <thead>
              <tr className='fw-bold text-muted'>
                <th className='min-w-150px'>角色數量</th>
                <th className='min-w-100px text-end'>使用者數量</th>
                <th className='min-w-150px'>比例</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats).map(([range, count]) => {
                const percentage =
                  totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0

                return (
                  <tr key={range}>
                    <td>
                      <span className='text-gray-800 fw-bold'>{getRangeLabel(range)}</span>
                    </td>
                    <td className='text-end'>
                      <span className='fw-bold text-gray-900'>{count}</span>
                    </td>
                    <td>
                      <div className='d-flex align-items-center'>
                        <div className='progress w-100 me-3' style={{height: '8px'}}>
                          <div
                            className='progress-bar bg-primary'
                            role='progressbar'
                            style={{width: `${percentage}%`}}
                            aria-valuenow={percentage}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                        <span className='text-muted fs-7 fw-bold min-w-50px text-end'>
                          {percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
