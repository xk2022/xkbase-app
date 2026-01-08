// src/app/pages/tom/order/List.tsx
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
import type { OrderListItem } from '../Model'
import { deleteOrder, fetchOrders } from '../Query'

interface OrderListProps {
  searchKeyword: string
  showAlert: (message: string, type: AlertType) => void
  onEdit?: (order: OrderListItem) => void
  onAssign?: (order: OrderListItem) => void
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
    case 'CREATED':
      return '新建立'
    case 'pending':
      return '待處理'
    case 'assigned':
      return '已指派'
    case 'in_transit':
      return '運送中'
    case 'completed':
      return '已完成'
    case 'cancelled':
      return '已取消'
    default:
      return s
  }
}

const statusBadge = (s?: string) => {
  if (!s) return { label: '-', className: 'badge-light-secondary' }
  switch (s) {
    case 'CREATED':
      return { label: '新建立', className: 'badge-light-info' }
    case 'pending':
      return { label: '待處理', className: 'badge-light-warning' }
    case 'assigned':
      return { label: '已指派', className: 'badge-light-primary' }
    case 'in_transit':
      return { label: '運送中', className: 'badge-light-primary' }
    case 'completed':
      return { label: '已完成', className: 'badge-light-success' }
    case 'cancelled':
      return { label: '已取消', className: 'badge-light-danger' }
    default:
      return { label: s, className: 'badge-light-secondary' }
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

const calcContainerCount = (o: any) => {
  // 1) explicit field
  if (typeof o?.containerCount === 'number') return o.containerCount

  // 2) list field
  if (Array.isArray(o?.containers)) return o.containers.length

  // 3) derive from containerNumber: "ABC,DEF" or "ABC|DEF"
  const s = String(o?.containerNumber ?? '').trim()
  if (!s) return 0
  const parts = s.split(/[,|]/).map((x) => x.trim()).filter(Boolean)
  return parts.length || 0
}

// ===============================================================
// Component
// ===============================================================
const OrderList: React.FC<OrderListProps> = ({
  searchKeyword,
  showAlert,
  onEdit,
  onAssign,
}) => {
  const navigate = useNavigate()

  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1) // UI 1-based
  const [loading, setLoading] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<OrderListItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  // 錯誤處理狀態
  const [showError500, setShowError500] = useState(false)
  const [showMockDialog, setShowMockDialog] = useState(false)

  const loadOrders = useCallback(async () => {
    setLoading(true)
    setShowError500(false)
    try {
      const query = {
        page: page - 1,
        size: PAGE_SIZE,
        keyword: searchKeyword?.trim() ? searchKeyword.trim() : undefined,
      }

      const data = await fetchOrders(query, showAlert)

      setOrders(data.content)
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
        showAlert('取得訂單列表失敗，請稍後再試', 'danger')
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
    loadOrders()
  }, [loadOrders])

  const handleRetry = useCallback(() => {
    setShowError500(false)
    loadOrders()
  }, [loadOrders])

  useEffect(() => {
    setPage(1)
  }, [searchKeyword])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const goDetail = useCallback(
    (o: OrderListItem) => {
      navigate(`/tom/order/${o.id}/detail`)
    },
    [navigate],
  )

  const openDelete = (o: OrderListItem) => setDeleteTarget(o)

  const confirmDelete = async () => {
    if (!deleteTarget) return

    const id = deleteTarget.id
    if (!id) {
      showAlert('缺少訂單識別碼，無法刪除', 'danger')
      return
    }

    try {
      setDeleting(true)
      const ok = await deleteOrder(String(id), showAlert)
      if (ok) {
        await loadOrders()
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
    { header: '訂單編號', className: 'min-w-150px' },
    { header: '客戶名稱', className: 'min-w-180px' },
    { header: '起始地點 -> 目的港口', className: 'min-w-260px' },
    { header: '提貨日期', className: 'min-w-120px' },
    { header: '貨櫃數量', className: 'min-w-110px text-end' },
    { header: '狀態', className: 'min-w-110px' },
    { header: '操作', className: 'text-end min-w-200px' },
  ]

  return (
    <>
      <PagedTable<OrderListItem>
        columns={columns}
        rows={orders}
        loading={loading}
        emptyText='沒有訂單資料'
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
        renderRow={(o) => {
          // ---- mapping (依你目前 API 欄位再微調) ----
          const customerName =
            (o as any).customerName ?? (o as any).customer?.name ?? (o as any).customerUuid ?? '-'

          const from = (o as any).pickupLocation ?? (o as any).originLocation ?? (o as any).startLocation
          const to = (o as any).destinationPort ?? (o as any).destPort ?? (o as any).endPort

          const pickupDate =
            (o as any).pickupDate ??
            (o as any).pickupTime ??
            (o as any).pickupAt ??
            (o as any).pickupPlanDate

          const containerCount = calcContainerCount(o)
          const status = statusBadge((o as any).orderStatus)

          return (
            <tr
              key={String(o.id ?? Math.random())}
              className='cursor-pointer table-row-hover'
              onClick={() => goDetail(o)}
            >
              <td className='fw-bold text-gray-900'>{(o as any).orderNo ?? '-'}</td>
              <td>{customerName}</td>
              <td>{joinRoute(from, to)}</td>
              <td>{formatDate(pickupDate)}</td>
              <td className='text-end'>{containerCount || 0}</td>
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
                      goDetail(o)
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
                        onEdit(o)
                      }}
                      title='編輯'
                    >
                      <KTIcon iconName='message-edit' className='fs-2' />
                    </button>
                  )}

                  {onAssign && (
                    <button
                      className='btn btn-light-info btn-sm'
                      onClick={(e) => {
                        e.preventDefault()
                        onAssign(o)
                      }}
                      title='派單'
                    >
                      <KTIcon iconName='truck' className='fs-2' />
                    </button>
                  )}

                  <button
                    className='btn btn-light-danger btn-sm'
                    onClick={(e) => {
                      e.preventDefault()
                      openDelete(o)
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
          title='刪除訂單'
          deleting={deleting}
          message={
            <>
              <p>
                確定要刪除訂單 <strong>{deleteTarget.id ?? '-'}</strong> 嗎？
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

export default OrderList
