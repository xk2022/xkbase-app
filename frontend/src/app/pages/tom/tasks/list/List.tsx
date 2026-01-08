// src/app/pages/tom/task/list/List.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { KTIcon } from '@/_metronic/helpers'

import type { AlertType } from '@/app/pages/common/AlertType'
import { ConfirmDeleteModal } from '@/app/pages/common/ConfirmDeleteModal'
import { Column, PagedTable } from '@/app/pages/common/PagedTable'

import type { TaskSubjectType, TomTaskListItem, TomTaskStatus } from '../Model'
import { cancelTomTask, fetchTomTasks } from '../Query'

type Props = {
  searchKeyword: string
  subjectType?: TaskSubjectType | ''
  status?: TomTaskStatus | ''
  showAlert: (message: string, type: AlertType) => void
  onAssign?: (task: TomTaskListItem) => void
}

const PAGE_SIZE = 10

const fmtDateTime = (ts?: string) => {
  if (!ts) return '-'
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ts
  return d.toLocaleString('zh-TW')
}

const statusLabel = (s?: TomTaskStatus) => {
  switch (s) {
    case 'UNASSIGNED':
      return '未指派'
    case 'ASSIGNED':
      return '已指派'
    case 'IN_PROGRESS':
      return '進行中'
    case 'DONE':
      return '已完成'
    case 'CANCELLED':
      return '已取消'
    default:
      return s ?? '-'
  }
}

const subjectLabel = (t: TomTaskListItem) => {
  switch (t.subjectType) {
    case 'CONTAINER':
      return `貨櫃｜${t.subjectNo ?? t.containerNo ?? '-'}`
    case 'TRAILER':
      return `板車｜${t.subjectNo ?? t.trailerNo ?? '-'}`
    case 'EMPTY_MOVE':
      return '空車/空板回位'
    case 'VEHICLE':
      return `車頭｜${t.subjectNo ?? t.vehicleNo ?? '-'}`
    default:
      return t.subjectNo ?? '其他'
  }
}

const joinRoute = (from?: string, to?: string) => {
  const a = from?.trim()
  const b = to?.trim()
  if (!a && !b) return '-'
  if (a && !b) return `${a} -> -`
  if (!a && b) return `- -> ${b}`
  return `${a} -> ${b}`
}

export const TaskList: React.FC<Props> = ({
  searchKeyword,
  subjectType,
  status,
  showAlert,
  onAssign,
}) => {
  const navigate = useNavigate()

  const [rows, setRows] = useState<TomTaskListItem[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1) // UI 1-based
  const [loading, setLoading] = useState(false)

  const [cancelTarget, setCancelTarget] = useState<TomTaskListItem | null>(null)
  const [cancelling, setCancelling] = useState(false)

  const queryObj = useMemo(() => {
    return {
      page: page - 1,
      size: PAGE_SIZE,
      keyword: searchKeyword?.trim() ? searchKeyword.trim() : undefined,
      subjectType: subjectType || undefined,
      status: status || undefined,
    }
  }, [page, searchKeyword, subjectType, status])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchTomTasks(queryObj, showAlert)
      setRows(data.content || [])
      setTotalElements(data.totalElements || 0)
      setTotalPages(data.totalPages || 1)
    } finally {
      setLoading(false)
    }
  }, [queryObj, showAlert])

  useEffect(() => setPage(1), [searchKeyword, subjectType, status])
  useEffect(() => {
    load()
  }, [load])

  const goDetail = useCallback(
    (t: TomTaskListItem) => {
      // MVP：優先導到 container detail（如果有），否則留在任務頁（之後可做 task detail）
      if (t.containerId) navigate(`/tom/container/${t.containerId}/detail`)
      else navigate(`/tom/task/list`) // 先不做 task detail
    },
    [navigate],
  )

  const openCancel = (t: TomTaskListItem) => setCancelTarget(t)

  const confirmCancel = async () => {
    if (!cancelTarget) return
    try {
      setCancelling(true)
      const ok = await cancelTomTask(cancelTarget.id, showAlert)
      if (ok) {
        await load()
        setCancelTarget(null)
      }
    } finally {
      setCancelling(false)
    }
  }

  const columns: Column[] = [
    { header: '任務編號', className: 'min-w-160px' },
    { header: '標的', className: 'min-w-170px' },
    { header: '訂單', className: 'min-w-150px' },
    { header: '起點 -> 終點', className: 'min-w-260px' },
    { header: '預計時間', className: 'min-w-180px' },
    { header: '指派', className: 'min-w-200px' },
    { header: '狀態', className: 'min-w-110px' },
    { header: '操作', className: 'min-w-260px' },
  ]

  return (
    <>
      <PagedTable<TomTaskListItem>
        columns={columns}
        rows={rows}
        loading={loading}
        emptyText='沒有任務資料'
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
        renderRow={(t) => {
          const assigned = [t.driverName, t.vehicleNo, t.trailerNo]
            .filter(Boolean)
            .join(' / ') || '-'

          return (
            <tr
              key={t.id}
              className='cursor-pointer table-row-hover'
              onClick={() => goDetail(t)}
            >
              <td className='fw-bold text-gray-900'>{t.taskNo}</td>
              <td>{subjectLabel(t)}</td>
              <td>{t.orderNo ?? '-'}</td>
              <td>{joinRoute(t.fromLocation, t.toLocation)}</td>
              <td>{fmtDateTime(t.plannedStartAt)}</td>
              <td>{assigned}</td>
              <td>{statusLabel(t.status)}</td>

              <td>
                <button
                  className='btn btn-sm btn-success ms-2'
                  onClick={(e) => {
                    e.stopPropagation()
                    goDetail(t)
                  }}
                >
                  <KTIcon iconName='eye' className='fs-2' />
                  查看
                </button>

                {onAssign && (
                  <button
                    className='btn btn-sm btn-light-primary ms-2'
                    onClick={(e) => {
                      e.stopPropagation()
                      onAssign(t)
                    }}
                  >
                    <KTIcon iconName='truck' className='fs-2' />
                    指派
                  </button>
                )}

                <button
                  className='btn btn-sm btn-danger ms-2'
                  onClick={(e) => {
                    e.stopPropagation()
                    openCancel(t)
                  }}
                >
                  <KTIcon iconName='cross' className='fs-2' />
                  取消
                </button>
              </td>
            </tr>
          )
        }}
      />

      {cancelTarget && (
        <ConfirmDeleteModal
          open={!!cancelTarget}
          title='取消任務'
          deleting={cancelling}
          message={
            <>
              <p>
                確定要取消任務 <strong>{cancelTarget.taskNo}</strong> 嗎？
              </p>
              <p className='text-muted mb-0'>MVP：取消後狀態改為 CANCELLED。</p>
            </>
          }
          onClose={() => (!cancelling ? setCancelTarget(null) : null)}
          onConfirm={confirmCancel}
        />
      )}
    </>
  )
}

export default TaskList
