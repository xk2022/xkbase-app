// src/app/pages/port/list/List.tsx
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
import type { PortListItem } from '../Model'
import { deletePort, fetchPorts } from '../Query'

interface PortListProps {
  searchKeyword: string
  showAlert: (message: string, type: AlertType) => void
  onEdit?: (port: PortListItem) => void
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
    case 'maintenance':
      return '維護中'
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
    case 'maintenance':
      return { label: '維護中', className: 'badge-light-warning' }
    default:
      return { label: s, className: 'badge-light-secondary' }
  }
}

// ===============================================================
// Component
// ===============================================================
const PortList: React.FC<PortListProps> = ({
  searchKeyword,
  showAlert,
  onEdit,
}) => {
  const navigate = useNavigate()

  const [ports, setPorts] = useState<PortListItem[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1) // UI 1-based
  const [loading, setLoading] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<PortListItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  // 錯誤處理狀態
  const [showError500, setShowError500] = useState(false)
  const [showMockDialog, setShowMockDialog] = useState(false)

  const loadPorts = useCallback(async () => {
    setLoading(true)
    setShowError500(false)
    try {
      const query = {
        page: page - 1,
        size: PAGE_SIZE,
        keyword: searchKeyword?.trim() ? searchKeyword.trim() : undefined,
      }

      const data = await fetchPorts(query, showAlert)

      setPorts(data.content)
      setTotalElements(data.totalElements)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      // 檢查是否為 API 500 錯誤
      const apiError = ApiError.fromAxiosError(error)
      if (apiError.isServerError) {
        setShowError500(true)
        setShowMockDialog(true)
      } else {
        // 其他錯誤，顯示提示
        showAlert('取得港口列表失敗，請稍後再試', 'danger')
      }
    } finally {
      setLoading(false)
    }
  }, [page, searchKeyword, showAlert])

  const handleUseMockData = useCallback(() => {
    enableTempMockData()
    setShowMockDialog(false)
    setShowError500(false)
    // 重新載入數據
    loadPorts()
  }, [loadPorts])

  const handleRetry = useCallback(() => {
    setShowError500(false)
    loadPorts()
  }, [loadPorts])

  useEffect(() => {
    setPage(1)
  }, [searchKeyword])

  useEffect(() => {
    loadPorts()
  }, [loadPorts])

  const goDetail = useCallback(
    (p: PortListItem) => {
      navigate(`/port/${p.id}/detail`)
    },
    [navigate],
  )

  const openDelete = (p: PortListItem) => setDeleteTarget(p)

  const confirmDelete = async () => {
    if (!deleteTarget) return

    const id = deleteTarget.id
    if (!id) {
      showAlert('缺少港口識別碼，無法刪除', 'danger')
      return
    }

    try {
      setDeleting(true)
      const ok = await deletePort(String(id), showAlert)
      if (ok) {
        await loadPorts()
        setDeleteTarget(null)
      }
    } finally {
      setDeleting(false)
    }
  }

  // =============================================================
  // Render
  // =============================================================
  
  // 如果顯示 500 錯誤頁面
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
    { header: '港口代碼', className: 'min-w-120px' },
    { header: '港口名稱', className: 'min-w-180px' },
    { header: '地址', className: 'min-w-300px' },
    { header: '狀態', className: 'min-w-110px' },
    { header: '建立時間', className: 'min-w-120px' },
    { header: '操作', className: 'text-end min-w-200px' },
  ]

  return (
    <>
      <PagedTable<PortListItem>
        columns={columns}
        rows={ports}
        loading={loading}
        emptyText='沒有港口資料'
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
        renderRow={(p) => {
          const statusInfo = statusBadge(p.status)
          
          return (
            <tr key={p.id}>
              <td>
                <div className='d-flex align-items-center'>
                  <div className='d-flex flex-column'>
                    <span className='text-gray-800 mb-1'>{p.code}</span>
                  </div>
                </div>
              </td>
              <td>
                <span className='text-gray-800 fw-bold'>{p.name}</span>
              </td>
              <td>
                <span className='text-gray-600'>{p.address}</span>
              </td>
              <td>
                <span className={`badge ${statusInfo.className} fs-7 fw-bold`}>
                  {statusInfo.label}
                </span>
              </td>
              <td>
                <span className='text-gray-600'>{formatDate(p.createdAt)}</span>
              </td>
              <td>
                <div className='d-flex justify-content-end flex-shrink-0'>
                  <button
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                    onClick={() => goDetail(p)}
                    title='查看詳情'
                  >
                    <KTIcon iconName='eye' className='fs-3' />
                  </button>
                  {onEdit && (
                    <button
                      className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      onClick={() => onEdit(p)}
                      title='編輯'
                    >
                      <KTIcon iconName='pencil' className='fs-3' />
                    </button>
                  )}
                  <button
                    className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm'
                    onClick={() => openDelete(p)}
                    title='刪除'
                  >
                    <KTIcon iconName='trash' className='fs-3' />
                  </button>
                </div>
              </td>
            </tr>
          )
        }}
      />

      {/* 刪除確認 Modal */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        deleting={deleting}
        title='確認刪除港口'
        message={`確定要刪除港口「${deleteTarget?.name}」嗎？此操作無法復原。`}
      />
    </>
  )
}

export default PortList
