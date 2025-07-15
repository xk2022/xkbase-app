import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOrderStatistics,
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  assignOrder,
  updateOrderStatus,
  getOrderHistory,
  exportOrderReport
} from './api'
import { OrderListQueryParams } from './types'

// 查詢 keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params: OrderListQueryParams) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  statistics: () => [...orderKeys.all, 'statistics'] as const,
  history: (id: string) => [...orderKeys.all, 'history', id] as const,
}

// 取得訂單統計資料
export const useOrderStatistics = () => {
  return useQuery({
    queryKey: orderKeys.statistics(),
    queryFn: getOrderStatistics,
    refetchOnWindowFocus: false,
  })
}

// 取得訂單列表
export const useOrders = (params: OrderListQueryParams) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => getOrders(params),
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  })
}

// 取得單一訂單
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrder(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  })
}

// 取得訂單歷史記錄
export const useOrderHistory = (id: string) => {
  return useQuery({
    queryKey: orderKeys.history(id),
    queryFn: () => getOrderHistory(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  })
}

// 建立新訂單
export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orderKeys.statistics() })
    },
  })
}

// 更新訂單
export const useUpdateOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...order }: { id: string } & Parameters<typeof updateOrder>[1]) =>
      updateOrder(id, order),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: orderKeys.statistics() })
    },
  })
}

// 刪除訂單
export const useDeleteOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orderKeys.statistics() })
    },
  })
}

// 指派訂單
export const useAssignOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, ...assignData }: { orderId: string } & Parameters<typeof assignOrder>[1]) =>
      assignOrder(orderId, assignData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: orderKeys.statistics() })
    },
  })
}

// 更新訂單狀態
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, ...statusData }: { orderId: string } & Parameters<typeof updateOrderStatus>[1]) =>
      updateOrderStatus(orderId, statusData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: orderKeys.history(data.id) })
      queryClient.invalidateQueries({ queryKey: orderKeys.statistics() })
    },
  })
}

// 匯出訂單報表
export const useExportOrderReport = () => {
  return useMutation({
    mutationFn: exportOrderReport,
    onSuccess: (blob, variables) => {
      // 自動下載檔案
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `order_report_${new Date().toISOString().split('T')[0]}.${variables.format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    },
  })
}
