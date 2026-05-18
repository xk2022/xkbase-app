// src/app/pages/upms/role/overview/components/PermissionDistributionTable.tsx
import React, {useMemo} from 'react'
import {Role} from '../../Model'

/**
 * 權限數量分布統計
 */
export interface PermissionDistributionStats {
  '0': number
  '1-5': number
  '6-10': number
  '11-20': number
  '21+': number
}

export interface PermissionDistributionTableProps {
  roles: Role[]
}

/**
 * 權限數量分布表格卡片元件
 */
export const PermissionDistributionTable: React.FC<PermissionDistributionTableProps> = ({
  roles,
}) => {
  // 計算權限數量分布統計
  const stats = useMemo<PermissionDistributionStats>(() => {
    const distribution: PermissionDistributionStats = {
      '0': 0,
      '1-5': 0,
      '6-10': 0,
      '11-20': 0,
      '21+': 0,
    }

    roles.forEach((role) => {
      const count = role.permissionCount ?? role.permissionCodes?.length ?? 0
      if (count === 0) {
        distribution['0']++
      } else if (count <= 5) {
        distribution['1-5']++
      } else if (count <= 10) {
        distribution['6-10']++
      } else if (count <= 20) {
        distribution['11-20']++
      } else {
        distribution['21+']++
      }
    })

    return distribution
  }, [roles])

  const totalRoles = roles.length

  const getRangeLabel = (range: string): string => {
    switch (range) {
      case '0':
        return '無權限'
      case '21+':
        return '21 個以上'
      default:
        return `${range} 個`
    }
  }

  return (
    <div className='card h-100'>
      <div className='card-header border-0 pt-6'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>權限數量分布</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            各角色擁有的權限數量統計
          </span>
        </h3>
      </div>

      <div className='card-body pt-0'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0'>
            <thead>
              <tr className='fw-bold text-muted'>
                <th className='min-w-150px'>權限數量範圍</th>
                <th className='min-w-100px text-end'>角色數量</th>
                <th className='min-w-150px'>比例</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats).map(([range, count]) => {
                const percentage =
                  totalRoles > 0 ? Math.round((count / totalRoles) * 100) : 0

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
