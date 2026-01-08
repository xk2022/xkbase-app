// src/app/pages/crm/customer/list/List.tsx
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
import type { CustomerListItem } from '../../Model'
import { deleteCustomer, fetchCustomers } from '../../Query'

interface CustomerListProps {
  searchKeyword: string
  showAlert: (message: string, type: AlertType) => void
  onEdit?: (customer: CustomerListItem) => void
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
    case 'suspended':
      return '暫停'
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
      return { label: '停用', className: 'badge-light-secondary' }
    case 'suspended':
      return { label: '暫停', className: 'badge-light-warning' }
    default:
      return { label: s, className: 'badge-light-secondary' }
  }
}

// ===============================================================
// Component
// ===============================================================
const CustomerList: React.FC<CustomerListProps> = ({
  searchKeyword,
  showAlert,
  onEdit,
}) => {
  const navigate = useNavigate()

  const [customers, setCustomers] = useState<CustomerListItem[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1) // UI 1-based
  const [loading, setLoading] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<CustomerListItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  // 錯誤處理狀態
  const [showError500, setShowError500] = useState(false)
  const [showMockDialog, setShowMockDialog] = useState(false)

  const loadCustomers = useCallback(async () => {
    setLoading(true)
    setShowError500(false)
    try {
      const query = {
        page: page - 1,
        size: PAGE_SIZE,
        keyword: searchKeyword?.trim() ? searchKeyword.trim() : undefined,
      }

      const data = await fetchCustomers(query, showAlert)

      setCustomers(data.content)
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
        showAlert('取得客戶列表失敗，請稍後再試', 'danger')
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
    loadCustomers()
  }, [loadCustomers])

  const handleRetry = useCallback(() => {
    setShowError500(false)
    loadCustomers()
  }, [loadCustomers])

  useEffect(() => {
    setPage(1)
  }, [searchKeyword])

  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  const goDetail = useCallback(
    (c: CustomerListItem) => {
      navigate(`/crm/customer/${c.id}/detail`)
    },
    [navigate],
  )

  const openDelete = (c: CustomerListItem) => setDeleteTarget(c)

  const confirmDelete = async () => {
    if (!deleteTarget) return

    const id = deleteTarget.id
    if (!id) {
      showAlert('缺少客戶識別碼，無法刪除', 'danger')
      return
    }

    try {
      setDeleting(true)
      const ok = await deleteCustomer(String(id), showAlert)
      if (ok) {
        await loadCustomers()
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
    { header: '公司名稱', className: 'min-w-200px' },
    { header: '公司代碼', className: 'min-w-120px' },
    { header: '統一編號', className: 'min-w-120px' },
    { header: '主要聯絡人', className: 'min-w-150px' },
    { header: '聯絡方式', className: 'min-w-180px' },
    { header: '狀態', className: 'min-w-100px' },
    { header: '操作', className: 'text-end min-w-200px' },
  ]

  return (
    <>
      <PagedTable<CustomerListItem>
        columns={columns}
        rows={customers}
        loading={loading}
        emptyText='沒有客戶資料'
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
        renderRow={(c) => {
          const status = statusBadge(c.status)
          const primaryContact = c.primaryContact

          return (
            <tr
              key={String(c.id ?? Math.random())}
              className='cursor-pointer table-row-hover'
              onClick={() => goDetail(c)}
            >
              <td className='fw-bold text-gray-900'>{c.companyName}</td>
              <td>{c.companyCode || '-'}</td>
              <td>{c.taxId || '-'}</td>
              <td>
                {primaryContact ? (
                  <div>
                    <div className='fw-bold'>{primaryContact.name}</div>
                    {primaryContact.title && (
                      <div className='text-muted fs-7'>{primaryContact.title}</div>
                    )}
                  </div>
                ) : (
                  '-'
                )}
              </td>
              <td>
                <div className='d-flex flex-column'>
                  {primaryContact?.phone && (
                    <span className='text-gray-600 fs-7'>
                      <KTIcon iconName='phone' className='fs-7 me-1' />
                      {primaryContact.phone}
                    </span>
                  )}
                  {primaryContact?.email && (
                    <span className='text-gray-600 fs-7'>
                      <KTIcon iconName='sms' className='fs-7 me-1' />
                      {primaryContact.email}
                    </span>
                  )}
                  {!primaryContact?.phone && !primaryContact?.email && (
                    <span className='text-muted'>-</span>
                  )}
                </div>
              </td>
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
                      goDetail(c)
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
          title='刪除客戶'
          deleting={deleting}
          message={
            <>
              <p>
                確定要刪除客戶 <strong>{deleteTarget.companyName}</strong> 嗎？
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

export default CustomerList
