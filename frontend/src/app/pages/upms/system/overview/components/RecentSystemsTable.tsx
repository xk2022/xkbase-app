// src/app/pages/upms/system/overview/components/RecentSystemsTable.tsx
import React, {useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import {KTIcon} from '@/_metronic/helpers'
import {System} from '../../Model'

export interface RecentSystemsTableProps {
  systems: System[]
  limit?: number
  getSystemCreatedTime: (system: System) => string | undefined
}

/**
 * 最近創建的系統表格卡片元件
 */
export const RecentSystemsTable: React.FC<RecentSystemsTableProps> = ({
  systems,
  limit = 5,
  getSystemCreatedTime,
}) => {
  const navigate = useNavigate()

  // 取得最近創建的系統（按創建時間排序，取前 N 個）
  const recentSystems = useMemo(() => {
    return [...systems]
      .sort((a, b) => {
        const aTime = getSystemCreatedTime(a)
        const bTime = getSystemCreatedTime(b)
        
        if (!aTime && !bTime) return 0
        if (!aTime) return 1
        if (!bTime) return -1
        
        return new Date(bTime).getTime() - new Date(aTime).getTime()
      })
      .slice(0, limit)
  }, [systems, limit, getSystemCreatedTime])

  const enabledBadge = (enabled: boolean) => {
    return enabled ? (
      <span className='badge badge-light-success'>啟用</span>
    ) : (
      <span className='badge badge-light-secondary'>停用</span>
    )
  }

  // 格式化日期時間
  const formatDateTime = (ts?: string) => {
    if (!ts) return '-'
    try {
      const d = new Date(ts)
      if (Number.isNaN(d.getTime())) return ts
      return d.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return ts
    }
  }

  return (
    <div className='card h-100'>
      <div className='card-header border-0 pt-6'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>最近創建的系統</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            最近創建的 {recentSystems.length} 個系統
          </span>
        </h3>
        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-light-primary'
            onClick={() => navigate('/upms/system/list')}
          >
            查看全部
            <KTIcon iconName='arrow-right' className='fs-4 ms-1' />
          </button>
        </div>
      </div>

      <div className='card-body pt-0'>
        {recentSystems.length === 0 ? (
          <div className='text-center py-10 text-muted'>
            <KTIcon iconName='information-5' className='fs-2x text-muted mb-3' />
            <p className='mb-0'>尚無系統資料</p>
          </div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0'>
              <thead>
                <tr className='fw-bold text-muted'>
                  <th className='min-w-150px'>系統代碼</th>
                  <th className='min-w-200px'>系統名稱</th>
                  <th className='min-w-100px'>狀態</th>
                  <th className='min-w-150px'>創建時間</th>
                  <th className='min-w-100px text-end'>操作</th>
                </tr>
              </thead>
              <tbody>
                {recentSystems.map((system) => (
                  <tr key={system.id}>
                    <td>
                      <span className='badge badge-light-info fs-7 fw-bold'>
                        {system.code}
                      </span>
                    </td>
                    <td>
                      <span className='text-gray-800 fw-bold'>{system.name}</span>
                    </td>
                    <td>{enabledBadge(system.enabled)}</td>
                    <td>
                      <span className='text-muted fs-7'>
                        {formatDateTime(getSystemCreatedTime(system))}
                      </span>
                    </td>
                    <td className='text-end'>
                      <button
                        type='button'
                        className='btn btn-sm btn-light-primary'
                        onClick={() => navigate(`/upms/system/${system.id}/detail`)}
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
