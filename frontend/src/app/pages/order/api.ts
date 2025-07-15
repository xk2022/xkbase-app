import axios from 'axios'
import { Order, OrderListQueryParams, OrderStatistics } from './types'

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8081/api'

// 取得訂單統計資料
export const getOrderStatistics = async (): Promise<OrderStatistics> => {
  const response = await axios.get(`${API_URL}/order/statistics`)
  return response.data
}

// 取得訂單列表
export const getOrders = async (params: OrderListQueryParams): Promise<{
  data: Order[]
  total: number
  page: number
  limit: number
}> => {
  const response = await axios.get(`${API_URL}/order`, { params })
  return response.data
}

// 取得單一訂單
export const getOrder = async (id: string): Promise<Order> => {
  const response = await axios.get(`${API_URL}/order/${id}`)
  return response.data
}

// 建立新訂單
export const createOrder = async (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'history'>): Promise<Order> => {
  const response = await axios.post(`${API_URL}/order`, order)
  return response.data
}

// 更新訂單
export const updateOrder = async (id: string, order: Partial<Order>): Promise<Order> => {
  const response = await axios.put(`${API_URL}/order/${id}`, order)
  return response.data
}

// 刪除訂單
export const deleteOrder = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/order/${id}`)
}

// 指派訂單
export const assignOrder = async (orderId: string, assignData: {
  assignedTo: string
  vehicleId: string
}): Promise<Order> => {
  const response = await axios.post(`${API_URL}/order/${orderId}/assign`, assignData)
  return response.data
}

// 更新訂單狀態
export const updateOrderStatus = async (orderId: string, statusData: {
  status: string
  notes?: string
  pickupPerson?: string
  deliveryPerson?: string
  receivePerson?: string
  handoverPerson?: string
  vehicleNumber?: string
}): Promise<Order> => {
  const response = await axios.post(`${API_URL}/order/${orderId}/status`, statusData)
  return response.data
}

// 取得訂單歷史記錄
export const getOrderHistory = async (orderId: string) => {
  const response = await axios.get(`${API_URL}/order/${orderId}/history`)
  return response.data
}

// 匯出訂單報表
export const exportOrderReport = async (params: {
  startDate?: string
  endDate?: string
  status?: string
  type?: string
  format: 'excel' | 'pdf' | 'csv'
}): Promise<Blob> => {
  const response = await axios.get(`${API_URL}/order/export`, {
    params,
    responseType: 'blob'
  })
  return response.data
}
