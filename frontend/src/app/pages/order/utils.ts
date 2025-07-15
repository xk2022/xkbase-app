import { OrderStatus, OrderType } from './types'
import { ORDER_STATUS_LABELS, ORDER_TYPE_LABELS } from './constants'

// 取得訂單狀態的 Badge 樣式
export const getOrderStatusBadge = (status: OrderStatus) => {
  const statusConfig = {
    PENDING: { class: 'badge-light-warning', text: ORDER_STATUS_LABELS.PENDING },
    ASSIGNED: { class: 'badge-light-info', text: ORDER_STATUS_LABELS.ASSIGNED },
    IN_TRANSIT: { class: 'badge-light-primary', text: ORDER_STATUS_LABELS.IN_TRANSIT },
    COMPLETED: { class: 'badge-light-success', text: ORDER_STATUS_LABELS.COMPLETED },
    CANCELLED: { class: 'badge-light-danger', text: ORDER_STATUS_LABELS.CANCELLED }
  }
  return statusConfig[status]
}

// 取得訂單類型的 Badge 樣式
export const getOrderTypeBadge = (type: OrderType) => {
  const typeConfig = {
    EXPORT: { class: 'badge-light-success', text: ORDER_TYPE_LABELS.EXPORT },
    IMPORT: { class: 'badge-light-primary', text: ORDER_TYPE_LABELS.IMPORT }
  }
  return typeConfig[type]
}

// 格式化日期時間
export const formatDateTime = (dateString: string, includeTime: boolean = true) => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
  return date.toLocaleDateString('zh-TW', options)
}

// 格式化日期
export const formatDate = (dateString: string) => {
  return formatDateTime(dateString, false)
}

// 產生訂單號
export const generateOrderNumber = (type: OrderType, sequence: number) => {
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const typePrefix = type === 'EXPORT' ? 'EXP' : 'IMP'
  const seqNumber = String(sequence).padStart(4, '0')
  return `${typePrefix}-${year}${month}-${seqNumber}`
}

// 檢查訂單是否可以編輯
export const canEditOrder = (status: OrderStatus) => {
  return status === 'PENDING' || status === 'ASSIGNED'
}

// 檢查訂單是否可以刪除
export const canDeleteOrder = (status: OrderStatus) => {
  return status === 'PENDING'
}

// 檢查訂單是否可以指派
export const canAssignOrder = (status: OrderStatus) => {
  return status === 'PENDING'
}

// 檢查訂單是否可以更新狀態
export const canUpdateOrderStatus = (status: OrderStatus) => {
  return status !== 'COMPLETED' && status !== 'CANCELLED'
}

// 取得下一個可能的狀態
export const getNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
  switch (currentStatus) {
    case 'PENDING':
      return ['ASSIGNED', 'CANCELLED']
    case 'ASSIGNED':
      return ['IN_TRANSIT', 'CANCELLED']
    case 'IN_TRANSIT':
      return ['COMPLETED', 'CANCELLED']
    case 'COMPLETED':
      return []
    case 'CANCELLED':
      return []
    default:
      return []
  }
}

// 驗證訂單資料
export const validateOrderData = (data: Record<string, unknown>) => {
  const errors: string[] = []
  
  if (!data.customerName || typeof data.customerName !== 'string' || !data.customerName.trim()) {
    errors.push('客戶名稱為必填項目')
  }
  
  if (!data.type) {
    errors.push('訂單類型為必填項目')
  }
  
  if (data.type === 'EXPORT' && data.exportDetails) {
    const exportDetails = data.exportDetails as Record<string, unknown>
    if (!exportDetails.date) {
      errors.push('出口日期為必填項目')
    }
    if (!exportDetails.shippingCompany || typeof exportDetails.shippingCompany !== 'string' || !exportDetails.shippingCompany.trim()) {
      errors.push('船公司為必填項目')
    }
  }
  
  if (data.type === 'IMPORT' && data.importDetails) {
    const importDetails = data.importDetails as Record<string, unknown>
    if (!importDetails.date) {
      errors.push('進口日期為必填項目')
    }
    if (!importDetails.shippingCompany || typeof importDetails.shippingCompany !== 'string' || !importDetails.shippingCompany.trim()) {
      errors.push('船公司為必填項目')
    }
  }
  
  return errors
}

// 計算訂單統計
export const calculateOrderStats = (orders: Array<{ status: OrderStatus; createdAt: string }>) => {
  const stats = {
    total: orders.length,
    pending: 0,
    assigned: 0,
    inTransit: 0,
    completed: 0,
    cancelled: 0,
    today: 0,
    thisMonth: 0,
  }
  
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  
  orders.forEach(order => {
    // 統計狀態
    switch (order.status) {
      case 'PENDING':
        stats.pending++
        break
      case 'ASSIGNED':
        stats.assigned++
        break
      case 'IN_TRANSIT':
        stats.inTransit++
        break
      case 'COMPLETED':
        stats.completed++
        break
      case 'CANCELLED':
        stats.cancelled++
        break
    }
    
    // 統計今日和本月
    const orderDate = new Date(order.createdAt)
    if (orderDate >= startOfDay) {
      stats.today++
    }
    if (orderDate >= startOfMonth) {
      stats.thisMonth++
    }
  })
  
  return stats
}
