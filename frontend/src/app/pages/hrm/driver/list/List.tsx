// src/app/pages/hrm/driver/list/List.tsx
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
import type { DriverListItem } from '../Model'
import { deleteDriver, fetchDrivers } from '../Query'

interface DriverListProps {
  searchKeyword: string
  showAlert: (message: string, type: AlertType) => void
  onEdit?: (driver: DriverListItem) => void
}

const PAGE_SIZE = 10

// ===============================================================
// Utilities
// ===============================================================
const formatDate = (ts?: string) => {
  if (!ts) return '-'
  return new Date(ts).toLocaleDateString('zh-TW')
}

const statusLabel = (s?: string) => {
  if (!s) return '-'
  switch (s) {
    case 'active':
      return '啟用'
    case 'inactive':
      return '停用'
    default:
      return s
  }
}

const statusBadge = (s?: string) => {
  if (!s) return { label: '-', className: 'badge-light-secondary' }
  switch (s) {
    case 'active':
      return { label: '啟用', className: 'badge-light-success' }
    case 'inactive':
      return { label: '停用', className: 'badge-light-danger' }
    default:
      return { label: s, className: 'badge-light-secondary' }
  }
}

// ===============================================================
// Component
// ===============================================================
const DriverList: React.FC<DriverListProps> = ({
  searchKeyword,
  showAlert,
  onEdit,
}) => {
  const navigate = useNavigate()

  const [drivers, setDrivers] = useState<DriverListItem[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<DriverListItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [showError500, setShowError500] = useState(false)
  const [showMockDialog, setShowMockDialog] = useState(false)

  const loadDrivers = useCallback(async () => {
    setLoading(true)
    setShowError500(false)
    try {
      const query = {
        page: page - 1,
        size: PAGE_SIZE,
        keyword: searchKeyword?.trim() ? searchKeyword.trim() : undefined,
      }

      const data = await fetchDrivers(query, showAlert)

      setDrivers(data.content)
      setTotalElements(data.totalElements)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      const apiError = ApiError.fromAxiosError(error)
      if (apiError.isServerError) {
        setShowError500(true)
        setShowMockDialog(true)
      } else {
        showAlert('取得司機列表失敗，請稍後再試', 'danger')
      }
    } finally {
      setLoading(false)
    }
  }, [page, searchKeyword, showAlert])

  const handleUseMockData = useCallback(() => {
    enableTempMockData()
    setShowMockDialog(false)
    setShowError500(false)
    loadDrivers()
  }, [loadDrivers])

  const handleRetry = useCallback(() => {
    setShowError500(false)
    loadDrivers()
  }, [loadDrivers])

  useEffect(() => {
    setPage(1)
  }, [searchKeyword])

  useEffect(() => {
    loadDrivers()
  }, [loadDrivers])

  const goDetail = useCallback(
    (d: DriverListItem) => {
      navigate(`/hrm/driver/${d.id}/detail`)
    },
    [navigate],
  )

  const openDelete = (d: DriverListItem) => setDeleteTarget(d)

  const confirmDelete = async () => {
    if (!deleteTarget) return

    const id = deleteTarget.id
    if (!id) {
      showAlert('缺少司機識別碼，無法刪除', 'danger')
      return
    }

    try {
      setDeleting(true)
      const ok = await deleteDriver(String(id), showAlert)
      if (ok) {
        await loadDrivers()
        setDeleteTarget(null)
      }
    } finally {
      setDeleting(false)
    }
  }

  // =============================================================
  // Render
  // =============================================================
  
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
    { header: '姓名', className: 'min-w-100px' },
    { header: '駕照號碼', className: 'min-w-150px' },
    { header: '駕照類型', className: 'min-w-120px' },
    { header: '駕照到期日', className: 'min-w-120px' },
    { header: '資格證', className: 'min-w-120px' },
    { header: '資格證到期日', className: 'min-w-120px' },
    { header: '聯絡電話', className: 'min-w-120px' },
    { header: '狀態', className: 'min-w-100px' },
    { header: '操作', className: 'text-end min-w-200px' },
  ]

  return (
    <>
      <PagedTable<DriverListItem>
        columns={columns}
        rows={drivers}
        loading={loading}
        emptyText='沒有司機資料'
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
        renderRow={(d) => {
          const status = statusBadge(d.status)

          return (
            <tr
              key={String(d.id ?? Math.random())}
              className='cursor-pointer table-row-hover'
              onClick={() => goDetail(d)}
            >
              <td className='fw-bold text-gray-900'>{d.name}</td>
              <td>{d.licenseNumber}</td>
              <td>{d.licenseType}</td>
              <td>{formatDate(d.licenseExpiryDate)}</td>
              <td>{d.qualificationCert || '-'}</td>
              <td>{formatDate(d.qualificationExpiryDate)}</td>
              <td>{d.phone || '-'}</td>
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
                      goDetail(d)
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
                        onEdit(d)
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
                      openDelete(d)
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
          title='刪除司機資料'
          deleting={deleting}
          message={
            <>
              <p>
                確定要刪除司機 <strong>{deleteTarget.name ?? '-'}</strong> 的資料嗎？
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

export default DriverList
