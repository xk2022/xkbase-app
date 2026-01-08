// src/app/pages/tom/order/detail/Query.ts
import { http } from '@/shared/api/http'
import { shouldUseMockDataWithTemp } from '@/shared/utils/useMockData'
import { ApiError } from '@/app/pages/common/ApiError'
import type { OrderDetail } from './Model'
import { MOCK_ORDER_DETAIL_MAP } from './mockOrderDetail'
import { ApiResponse } from '@/app/pages/model/ApiResponse'

const API_PREFIX = '/api/tom/orders'

export async function fetchOrderDetail(
  id: string,
  showAlert?: (msg: string, type: any) => void,
): Promise<OrderDetail | null> {
  // 如果使用 Mock 數據（包含臨時啟用），返回假資料
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 訂單詳情', id)
    // 模擬 API 延遲
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const found = MOCK_ORDER_DETAIL_MAP[id]
    if (!found) {
      showAlert?.('訂單不存在 (Mock)', 'warning')
      return null
    }
    return Promise.resolve(found)
  }

  // 真實 API 調用
  try {
    const res = await http.get<ApiResponse<OrderDetail>>(
      `${API_PREFIX}/${id}`,
    )
    return res.data.data ?? null
  } catch (e) {
    console.error(e)
    
    // 如果是 500 錯誤，拋出特殊錯誤讓 UI 層處理
    const apiError = ApiError.fromAxiosError(e)
    if (apiError.isServerError) {
      throw apiError
    }

    // 其他錯誤：顯示提示並返回 null
    showAlert?.('取得訂單詳情失敗，請稍後再試', 'danger')
    return null
  }
}
