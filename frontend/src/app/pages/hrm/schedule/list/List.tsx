// src/app/pages/hrm/schedule/list/List.tsx
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { KTIcon } from '@/_metronic/helpers'

import type { AlertType } from '@/app/pages/common/AlertType'
import { ConfirmDeleteModal } from '@/app/pages/common/ConfirmDeleteModal'
import { Error500WithLayout } from '@/app/pages/common/Error500WithLayout'
import { MockDataDialog } from '@/app/pages/common/MockDataDialog'
import { ApiError } from '@/app/pages/common/ApiError'
import { enableTempMockData } from '@/shared/utils/useMockData'

import { Column, PagedTable } from '@/app/pages/common/PagedTable'
import type { ScheduleListItem } from '../Model'
import { deleteSchedule, fetchSchedules } from '../Query'

interface ScheduleListProps {
  searchKeyword: string
  showAlert: (message: string, type: AlertType) => void
  onEdit?: (schedule: ScheduleListItem) => void
}

const PAGE_SIZE = 10

const formatDate = (ts?: string) => {
  if (!ts) return '-'
  return new Date(ts).toLocaleDateString('zh-TW')
}

const statusLabel = (s?: string) => {
  if (!s) return '-'
  switch (s) {
    case 'draft':
      return '草稿'
    case 'confirmed':
      return '已確認'
    case 'completed':
      return '已完成'
    default:
      return s
  }
}

const statusBadge = (s?: string) => {
  if (!s) return { label: '-', className: 'badge-light-secondary' }
  switch (s) {
    case 'draft':
      return { label: '草稿', className: 'badge-light-warning' }
    case 'confirmed':
      return { label: '已確認', className: 'badge-light-success' }
    case 'completed':
      return { label: '已完成', className: 'badge-light-primary' }
    default:
      return { label: s, className: 'badge-light-secondary' }
  }
}

const ScheduleList: React.FC<ScheduleListProps> = ({
  searchKeyword,
  showAlert,
  onEdit,
}) => {
  const navigate = useNavigate()

  const [schedules, setSchedules] = useState<ScheduleListItem[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<ScheduleListItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [showError500, setShowError500] = useState(false)
  const [showMockDialog, setShowMockDialog] = useState(false)

  const loadSchedules = useCallback(async () => {
    setLoading(true)
    setShowError500(false)
    try {
      const query = {
        page: page - 1,
        size: PAGE_SIZE,
        keyword: searchKeyword?.trim() ? searchKeyword.trim() : undefined,
      }

      const data = await fetchSchedules(query, showAlert)

      setSchedules(data.content)
      setTotalElements(data.totalElements)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      const apiError = ApiError.fromAxiosError(error)
      if (apiError.isServerError) {
        setShowError500(true)
        setShowMockDialog(true)
      } else {
        showAlert('取得工時規劃列表失敗，請稍後再試', 'danger')
      }
    } finally {
      setLoading(false)
    }
  }, [page, searchKeyword, showAlert])

  const handleUseMockData = useCallback(() => {
    enableTempMockData()
    setShowMockDialog(false)
    setShowError500(false)
    loadSchedules()
  }, [loadSchedules])

  const handleRetry = useCallback(() => {
    setShowError500(false)
    loadSchedules()
  }, [loadSchedules])

  useEffect(() => {
    setPage(1)
  }, [searchKeyword])

  useEffect(() => {
    loadSchedules()
  }, [loadSchedules])

  const goDetail = useCallback(
    (s: ScheduleListItem) => {
      navigate(`/hrm/schedule/${s.id}/detail`)
    },
    [navigate],
  )

  const openDelete = (s: ScheduleListItem) => setDeleteTarget(s)

  const confirmDelete = async () => {
    if (!deleteTarget) return

    const id = deleteTarget.id
    if (!id) {
      showAlert('缺少工時規劃識別碼，無法刪除', 'danger')
      return
    }

    try {
      setDeleting(true)
      const ok = await deleteSchedule(String(id), showAlert)
      if (ok) {
        await loadSchedules()
        setDeleteTarget(null)
      }
    } finally {
      setDeleting(false)
    }
  }

  if (showError500) {
    return (
      <>
        <Error500WithLayout
          onRetry={handleRetry}
          showMockOption={true}
          onUseMock={handleUseMockData}
        />
        <MockDataDialog
          open={showMockDialog}
          onConfirm={handleUseMockData}
          onCancel={() => setShowMockDialog(false)}
        />
      </>
    )
  }

  const columns: Column[] = [
    { header: '司機姓名', className: 'min-w-100px' },
    { header: '週開始日期', className: 'min-w-120px' },
    { header: '週結束日期', className: 'min-w-120px' },
    { header: '週總工時', className: 'min-w-100px text-end' },
    { header: '狀態', className: 'min-w-100px' },
    { header: '操作', className: 'text-end min-w-200px' },
  ]

  return (
    <>
      <PagedTable<ScheduleListItem>
        columns={columns}
        rows={schedules}
        loading={loading}
        emptyText='沒有工時規劃資料'
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
        renderRow={(s) => {
          const status = statusBadge(s.status)

          return (
            <tr
              key={String(s.id ?? Math.random())}
              className='cursor-pointer table-row-hover'
              onClick={() => goDetail(s)}
            >
              <td className='fw-bold text-gray-900'>{s.driverName}</td>
              <td>{formatDate(s.weekStartDate)}</td>
              <td>{formatDate(s.weekEndDate)}</td>
              <td className='text-end'>{s.totalWeeklyHours} 小時</td>
              <td>
                <span className={`badge ${status.className} fw-bold`}>
                  {status.label}
                </span>
              </td>

              <td className='text-end' onClick={(e) => e.stopPropagation()}>
                <div className='d-flex justify-content-end gap-2'>
                  <button
                    className='btn btn-light-primary btn-sm'
                    onClick={(e) => {
                      e.preventDefault()
                      goDetail(s)
                    }}
                    title='查看詳情'
                  >
                    <KTIcon iconName='eye' className='fs-2' />
                  </button>

                  {onEdit && (
                    <button
                      className='btn btn-light-warning btn-sm'
                      onClick={(e) => {
                        e.preventDefault()
                        onEdit(s)
                      }}
                      title='編輯'
                    >
                      <KTIcon iconName='message-edit' className='fs-2' />
                    </button>
                  )}

                  <button
                    className='btn btn-light-danger btn-sm'
                    onClick={(e) => {
                      e.preventDefault()
                      openDelete(s)
                    }}
                    title='刪除'
                  >
                    <KTIcon iconName='trash' className='fs-2' />
                  </button>
                </div>
              </td>
            </tr>
          )
        }}
      />

      {deleteTarget && (
        <ConfirmDeleteModal
          open={!!deleteTarget}
          title='刪除工時規劃'
          deleting={deleting}
          message={
            <>
              <p>
                確定要刪除司機 <strong>{deleteTarget.driverName ?? '-'}</strong> 的工時規劃嗎？
              </p>
              <p className='text-muted mb-0'>此操作無法復原，請再次確認。</p>
            </>
          }
          onClose={() => (!deleting ? setDeleteTarget(null) : null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  )
}

export default ScheduleList
