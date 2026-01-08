// src/app/pages/tom/order/assign/AssignList.tsx
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { KTIcon } from '@/_metronic/helpers'
import { Spinner } from 'react-bootstrap'

import type { AlertType } from '@/app/pages/common/AlertType'
import { Column, PagedTable } from '@/app/pages/common/PagedTable'

import type { OrderListItem } from '../Model'
import { fetchOrders } from '../Query'

interface AssignListProps {
  showAlert: (message: string, type: AlertType) => void
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

const joinRoute = (from?: string, to?: string) => {
  const a = from?.trim()
  const b = to?.trim()
  if (!a && !b) return '-'
  if (a && !b) return `${a} -> -`
  if (!a && b) return `- -> ${b}`
  return `${a} -> ${b}`
}

const calcContainerCount = (o: any) => {
  if (typeof o?.containerCount === 'number') return o.containerCount
  if (Array.isArray(o?.containers)) return o.containers.length
  const s = String(o?.containerNumber ?? '').trim()
  if (!s) return 0
  const parts = s.split(/[,|]/).map((x) => x.trim()).filter(Boolean)
  return parts.length || 0
}

// ===============================================================
// Component
// ===============================================================
const AssignList: React.FC<AssignListProps> = ({
  showAlert,
  onAssign,
}) => {
  const navigate = useNavigate()

  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const loadOrders = useCallback(async () => {
    setLoading(true)
    try {
      // 只查詢待指派的訂單（pending 或 CREATED）
      const query = {
        page: page - 1,
        size: PAGE_SIZE,
        status: 'pending', // 可以改為 'CREATED' 或兩個都查
      }

      const data = await fetchOrders(query, showAlert)

      // 過濾出待指派的訂單
      const pendingOrders = data.content.filter(
        (o) => o.orderStatus === 'pending' || o.orderStatus === 'CREATED'
      )

      setOrders(pendingOrders)
      setTotalElements(pendingOrders.length)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('載入待指派訂單失敗:', error)
      showAlert('載入待指派訂單失敗', 'danger')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [page, showAlert])

  useEffect(() => {
    setPage(1)
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const goDetail = useCallback(
    (o: OrderListItem) => {
      navigate(`/tom/order/${o.id}/detail`)
    },
    [navigate],
  )

  // =============================================================
  // Render
  // =============================================================
  const columns: Column[] = [
    { header: '訂單編號', className: 'min-w-150px' },
    { header: '客戶名稱', className: 'min-w-180px' },
    { header: '起始地點 -> 目的港口', className: 'min-w-260px' },
    { header: '提貨日期', className: 'min-w-120px' },
    { header: '貨櫃數量', className: 'min-w-110px text-end' },
    { header: '狀態', className: 'min-w-110px' },
    { header: '操作', className: 'min-w-200px' },
  ]

  if (loading && orders.length === 0) {
    return (
      <div className='d-flex justify-content-center py-10'>
        <Spinner animation='border' />
      </div>
    )
  }

  return (
    <>
      {orders.length === 0 ? (
        <div className='text-center py-10 text-muted'>
          <KTIcon iconName='information-5' className='fs-3x mb-3 text-muted' />
          <p>目前沒有待指派的訂單</p>
        </div>
      ) : (
        <PagedTable<OrderListItem>
          columns={columns}
          rows={orders}
          loading={loading}
          emptyText='沒有待指派訂單'
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
          renderRow={(o) => {
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

            return (
              <tr
                key={String(o.id ?? Math.random())}
                className='cursor-pointer table-row-hover'
                onClick={() => goDetail(o)}
              >
                <td className='fw-bold text-gray-900'>{(o as any).orderNo ?? o.id ?? '-'}</td>
                <td>{customerName}</td>
                <td>{joinRoute(from, to)}</td>
                <td>{formatDate(pickupDate)}</td>
                <td className='text-end'>{containerCount || 0}</td>
                <td>
                  <span className='badge badge-warning'>
                    {statusLabel((o as any).orderStatus)}
                  </span>
                </td>

                <td>
                  <button
                    className='btn btn-sm btn-success me-2'
                    onClick={(e) => {
                      e.stopPropagation()
                      goDetail(o)
                    }}
                  >
                    <KTIcon iconName='eye' className='fs-2' />
                    詳情
                  </button>

                  {onAssign && (
                    <button
                      className='btn btn-sm btn-primary'
                      onClick={(e) => {
                        e.stopPropagation()
                        onAssign(o)
                      }}
                    >
                      <KTIcon iconName='truck' className='fs-2' />
                      指派
                    </button>
                  )}
                </td>
              </tr>
            )
          }}
        />
      )}
    </>
  )
}

export default AssignList
