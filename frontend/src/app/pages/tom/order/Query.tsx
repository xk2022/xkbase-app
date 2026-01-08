// src/app/pages/tom/order/Query.tsx
import { http } from '@/shared/api/http'
import type { AlertFn } from '@/app/pages/common/AlertType'
import { shouldUseMockDataWithTemp } from '@/shared/utils/useMockData'
import { ApiError } from '@/app/pages/common/ApiError'

import { ApiResponse } from '../../model/ApiResponse'
import { PageResult } from '../../model/PageResult'

import type {
  CreateTomOrderReq,
  Order,
  OrderDetail,
  OrderListItem,
  TomOrderResp,
  UpdateOrderReq,
} from './Model'
import { MOCK_ORDERS } from './list/mockOrders'

/**
 * ===============================================================
 * TOM - Order API Queries（對齊 UPMS User Query 風格）
 * ===============================================================
 * - 只回傳「UI 好用的資料型別」
 * - 失敗時：
 *   - list：回空 PageResult，讓畫面不炸
 *   - detail：回 null
 *   - create/delete：回 false
 * - Alert 交由呼叫者傳入 showAlert（可選）
 * ===============================================================
 */

const API_PREFIX = '/api/tom/orders'

// ------------------------------------------------------------
// Create 新增（給 CreatePage 用）
// ------------------------------------------------------------
export async function createTomOrder(
  req: CreateTomOrderReq,
  showAlert?: AlertFn,
): Promise<boolean> {
  // 如果使用 Mock 數據，直接返回成功
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬創建訂單', req)
    // 模擬延遲
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('訂單建立成功 (Mock)', 'success')
    return true
  }

  // 真實 API 調用
  try {
    await http.post<TomOrderResp>(API_PREFIX, req)
    showAlert?.('訂單建立成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('建立訂單失敗，請稍後再試', 'danger')
    return false
  }
}

// ------------------------------------------------------------
// Read
// ------------------------------------------------------------
/**
 * 訂單列表查詢
 * - 後端建議回傳：ApiResponse<PageResult<OrderListItem>>
 * - query 參數：沿用你既有 PageQuery（page/size/keyword）+ OrderSearchQuery 欄位
 */
// export async function fetchOrders(
//   query: PageQuery,
//   showAlert?: AlertFn,
// ): Promise<PageResult<OrderListItem>> {
//   try {
//     const res = await http.get<ApiResponse<PageResult<OrderListItem>>>(
//       API_PREFIX,
//       { params: query },
//     )

//     const page = res.data.data

//     // 若你之後需要 map（例如 status/日期格式），可在這裡統一轉換
//     return {
//       ...page,
//       content: page.content || [],
//     }
//   } catch (e) {
//     console.error(e)
//     showAlert?.('取得訂單列表失敗，請稍後再試', 'danger')

//     // 對齊 UPMS：回空 PageResult，避免 UI 不斷重打/爆炸
//     return {
//       content: [],
//       totalElements: 0,
//       totalPages: 0,
//       size: query.size,
//       number: query.page,
//       first: true,
//       last: true,
//       empty: true,
//     }
//   }
// }

export async function fetchOrders(
  query: any,
  showAlert?: (msg: string, type: any) => void,
): Promise<PageResult<OrderListItem>> {
  // 如果使用 Mock 數據（包含臨時啟用），返回假資料
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 訂單列表', query)
    // 模擬 API 延遲
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return Promise.resolve({
      content: MOCK_ORDERS,
      totalElements: MOCK_ORDERS.length,
      totalPages: 1,
      size: query.size ?? 10,
      number: query.page ?? 0, // 0-based
      first: (query.page ?? 0) === 0,
      last: true,
      empty: MOCK_ORDERS.length === 0,
    })
  }

  // 真實 API 調用
  try {
    const res = await http.get<ApiResponse<PageResult<OrderListItem>>>(
      API_PREFIX,
      { params: query },
    )

    const page = res.data.data

    // 若你之後需要 map（例如 status/日期格式），可在這裡統一轉換
    return {
      ...page,
      content: page.content || [],
    }
  } catch (e) {
    console.error(e)
    
    // 如果是 500 錯誤，拋出特殊錯誤讓 UI 層處理
    const apiError = ApiError.fromAxiosError(e)
    if (apiError.isServerError) {
      throw apiError
    }

    // 其他錯誤：顯示提示並返回空結果
    showAlert?.('取得訂單列表失敗，請稍後再試', 'danger')

    // 對齊 UPMS：回空 PageResult，避免 UI 不斷重打/爆炸
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: query.size ?? 10,
      number: query.page ?? 0,
      first: true,
      last: true,
      empty: true,
    }
  }
}


/**
 * 訂單詳情
 * - 後端建議回傳：ApiResponse<OrderDetailResp>
 * - route 建議：GET /api/tom/orders/{orderId}
 * 
 * 注意：實際實現請使用 detail/Query.ts 中的 fetchOrderDetail
 * 此處保留作為備用或統一路徑
 */
export async function fetchOrderDetail(
  orderId: string,
  showAlert?: AlertFn,
): Promise<OrderDetail | null> {
  // 轉發到 detail/Query.ts 中的實現
  const { fetchOrderDetail: fetchDetail } = await import('./detail/Query')
  return fetchDetail(orderId, showAlert)
}

// ------------------------------------------------------------
// Update 更新（給 EditModal 用）
// ------------------------------------------------------------
export async function updateOrder(
  id: string,
  payload: UpdateOrderReq,
  showAlert?: AlertFn
): Promise<Order | null> {
  // 如果使用 Mock 數據，模擬更新
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬更新訂單', id, payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('更新訂單成功 (Mock)', 'success')
    // 返回模擬數據（這裡可以從 MOCK_ORDERS 中找到對應的訂單）
    const mockOrder = MOCK_ORDERS.find(o => o.id === id)
    return mockOrder as Order | null
  }

  // 真實 API 調用
  try {
    const res = await http.put<ApiResponse<Order>>(
      `${API_PREFIX}/${id}`, 
      payload
    )
    showAlert?.('更新訂單成功', 'success')
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('更新訂單失敗，請稍後再試', 'danger')
    throw e
  }
}

// ------------------------------------------------------------
// Delete
// ------------------------------------------------------------
export async function deleteOrder(
  id: string,
  showAlert?: AlertFn,
): Promise<boolean> {
  // 如果使用 Mock 數據，模擬刪除
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬刪除訂單', id)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('刪除訂單成功 (Mock)', 'success')
    return true
  }

  // 真實 API 調用
  try {
    await http.delete<ApiResponse<null>>(
      `${API_PREFIX}/${id}`
    )
    showAlert?.('刪除訂單成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('刪除訂單失敗，請稍後再試', 'danger')
    return false
  }
}

// ------------------------------------------------------------
// v2 預留：派單 / 狀態更新（之後頁面有做再接）
// ------------------------------------------------------------
export type AssignOrderReq = {
  vehicleId: number | string  // 支援 number 或 string (UUID)
  driverId: number | string   // 支援 number 或 string (UUID)
}

export async function assignOrder(
  orderId: string,
  payload: AssignOrderReq,
  showAlert?: AlertFn,
): Promise<boolean> {
  // 如果使用 Mock 數據，模擬指派
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬指派訂單', orderId, payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('派單成功 (Mock)', 'success')
    return true
  }

  // 真實 API 調用
  try {
    await http.post<ApiResponse<unknown>>(`${API_PREFIX}/${orderId}/assign`, payload)
    showAlert?.('派單成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('派單失敗，請稍後再試', 'danger')
    return false
  }
}

export type UpdateOrderStatusReq = {
  status: 'pending' | 'assigned' | 'in_transit' | 'completed' | 'cancelled'
  note?: string
}

export async function updateOrderStatus(
  orderId: string,
  payload: UpdateOrderStatusReq,
  showAlert?: AlertFn,
): Promise<boolean> {
  // 如果使用 Mock 數據，模擬狀態更新
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬更新訂單狀態', orderId, payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('狀態更新成功 (Mock)', 'success')
    return true
  }

  // 真實 API 調用
  try {
    await http.post<ApiResponse<unknown>>(
      `${API_PREFIX}/${orderId}/update_status`,
      payload,
    )
    showAlert?.('狀態更新成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('狀態更新失敗，請稍後再試', 'danger')
    return false
  }
}
