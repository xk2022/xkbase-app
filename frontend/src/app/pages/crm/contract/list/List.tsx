// src/app/pages/crm/contract/list/List.tsx
import React, { useCallback, useEffect, useState } from 'react'

import { KTIcon } from '@/_metronic/helpers'

import type { AlertType } from '@/app/pages/common/AlertType'
import { ConfirmDeleteModal } from '@/app/pages/common/ConfirmDeleteModal'
import { Error500WithLayout } from '@/app/pages/common/Error500WithLayout'
import { MockDataDialog } from '@/app/pages/common/MockDataDialog'
import { ApiError } from '@/app/pages/common/ApiError'
import { enableTempMockData } from '@/shared/utils/useMockData'

import { Column, PagedTable } from '@/app/pages/common/PagedTable'
import type { ContractTemplateListItem } from '../../Model'
import { deleteContractTemplate, fetchContractTemplates } from '../../Query'

interface ContractListProps {
  searchKeyword: string
  showAlert: (message: string, type: AlertType) => void
  onEdit?: (contract: ContractTemplateListItem) => void
}

const PAGE_SIZE = 10

// ===============================================================
// Utilities
// ===============================================================
const formatDate = (ts?: string) => {
  if (!ts) return '-'
  return new Date(ts).toLocaleDateString('zh-TW')
}

const billingModeLabel = (mode?: string) => {
  if (!mode) return '-'
  switch (mode) {
    case 'fixed':
      return '固定價格'
    case 'volume':
      return '按量計費'
    case 'distance':
      return '按距離計費'
    case 'time':
      return '按時間計費'
    case 'hybrid':
      return '混合模式'
    default:
      return mode
  }
}

const statusLabel = (s?: string) => {
  if (!s) return '-'
  switch (s) {
    case 'draft':
      return '草稿'
    case 'active':
      return '啟用'
    case 'expired':
      return '已過期'
    case 'archived':
      return '已歸檔'
    default:
      return s
  }
}

const statusBadge = (s?: string) => {
  if (!s) return { label: '-', className: 'badge-light-secondary' }
  switch (s) {
    case 'draft':
      return { label: '草稿', className: 'badge-light-secondary' }
    case 'active':
      return { label: '啟用', className: 'badge-light-success' }
    case 'expired':
      return { label: '已過期', className: 'badge-light-warning' }
    case 'archived':
      return { label: '已歸檔', className: 'badge-light-dark' }
    default:
      return { label: s, className: 'badge-light-secondary' }
  }
}

// ===============================================================
// Component
// ===============================================================
const ContractList: React.FC<ContractListProps> = ({
  searchKeyword,
  showAlert,
  onEdit,
}) => {
  const [contracts, setContracts] = useState<ContractTemplateListItem[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<ContractTemplateListItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [showError500, setShowError500] = useState(false)
  const [showMockDialog, setShowMockDialog] = useState(false)

  const loadContracts = useCallback(async () => {
    setLoading(true)
    setShowError500(false)
    try {
      const query = {
        page: page - 1,
        size: PAGE_SIZE,
        keyword: searchKeyword?.trim() ? searchKeyword.trim() : undefined,
      }

      const data = await fetchContractTemplates(query, showAlert)

      setContracts(data.content)
      setTotalElements(data.totalElements)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      const apiError = ApiError.fromAxiosError(error)
      if (apiError.isServerError) {
        setShowError500(true)
        setShowMockDialog(true)
      } else {
        showAlert('取得合約模板列表失敗，請稍後再試', 'danger')
      }
    } finally {
      setLoading(false)
    }
  }, [page, searchKeyword, showAlert])

  const handleUseMockData = useCallback(() => {
    enableTempMockData()
    setShowMockDialog(false)
    setShowError500(false)
    loadContracts()
  }, [loadContracts])

  const handleRetry = useCallback(() => {
    setShowError500(false)
    loadContracts()
  }, [loadContracts])

  useEffect(() => {
    setPage(1)
  }, [searchKeyword])

  useEffect(() => {
    loadContracts()
  }, [loadContracts])

  const openDelete = (c: ContractTemplateListItem) => setDeleteTarget(c)

  const confirmDelete = async () => {
    if (!deleteTarget) return

    const id = deleteTarget.id
    if (!id) {
      showAlert('缺少合約模板識別碼，無法刪除', 'danger')
      return
    }

    try {
      setDeleting(true)
      const ok = await deleteContractTemplate(String(id), showAlert)
      if (ok) {
        await loadContracts()
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
    { header: '合約名稱', className: 'min-w-200px' },
    { header: '關聯客戶', className: 'min-w-150px' },
    { header: '計費模式', className: 'min-w-120px' },
    { header: '生效日期', className: 'min-w-120px' },
    { header: '到期日期', className: 'min-w-120px' },
    { header: '狀態', className: 'min-w-100px' },
    { header: '操作', className: 'text-end min-w-200px' },
  ]

  return (
    <>
      <PagedTable<ContractTemplateListItem>
        columns={columns}
        rows={contracts}
        loading={loading}
        emptyText='沒有合約模板資料'
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
        renderRow={(c) => {
          const status = statusBadge(c.status)

          return (
            <tr key={String(c.id ?? Math.random())}>
              <td className='fw-bold text-gray-900'>{c.name}</td>
              <td>{c.customerName || <span className='text-muted'>通用模板</span>}</td>
              <td>{billingModeLabel(c.billingMode)}</td>
              <td>{formatDate(c.effectiveDate)}</td>
              <td>{formatDate(c.expiryDate)}</td>
              <td>
                <span className={`badge ${status.className} fw-bold`}>
                  {status.label}
                </span>
              </td>

              <td className='text-end' onClick={(e) => e.stopPropagation()}>
                <div className='d-flex justify-content-end gap-2'>
                  {onEdit && (
                    <button
                      className='btn btn-light-warning btn-sm'
                      onClick={(e) => {
                        e.preventDefault()
                        onEdit(c)
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
                      openDelete(c)
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
          title='刪除合約模板'
          deleting={deleting}
          message={
            <>
              <p>
                確定要刪除合約模板 <strong>{deleteTarget.name}</strong> 嗎？
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

export default ContractList
