// src/app/pages/hrm/driver/Query.tsx
import { http } from '@/shared/api/http'
import type { AlertFn } from '@/app/pages/common/AlertType'
import { shouldUseMockDataWithTemp } from '@/shared/utils/useMockData'
import { ApiError } from '@/app/pages/common/ApiError'

import { ApiResponse } from '../../model/ApiResponse'
import { PageResult } from '../../model/PageResult'

import type {
  CreateDriverReq,
  DriverDetail,
  DriverListItem,
  UpdateDriverReq,
} from './Model'
import { MOCK_DRIVERS } from './list/mockDrivers'

/**
 * ===============================================================
 * HRM - Driver API Queries
 * ===============================================================
 */

const API_PREFIX = '/api/hrm/drivers'

// ------------------------------------------------------------
// Create 新增
// ------------------------------------------------------------
export async function createDriver(
  req: CreateDriverReq,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬創建司機', req)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('司機資料建立成功 (Mock)', 'success')
    return true
  }

  try {
    await http.post(API_PREFIX, req)
    showAlert?.('司機資料建立成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('建立司機資料失敗，請稍後再試', 'danger')
    return false
  }
}

// ------------------------------------------------------------
// Read
// ------------------------------------------------------------
export async function fetchDrivers(
  query: any,
  showAlert?: (msg: string, type: any) => void,
): Promise<PageResult<DriverListItem>> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 司機列表', query)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return Promise.resolve({
      content: MOCK_DRIVERS,
      totalElements: MOCK_DRIVERS.length,
      totalPages: 1,
      size: query.size ?? 10,
      number: query.page ?? 0,
      first: (query.page ?? 0) === 0,
      last: true,
      empty: MOCK_DRIVERS.length === 0,
    })
  }

  try {
    const res = await http.get<ApiResponse<PageResult<DriverListItem>>>(
      API_PREFIX,
      { params: query },
    )

    const page = res.data.data
    return {
      ...page,
      content: page.content || [],
    }
  } catch (e) {
    console.error(e)
    
    const apiError = ApiError.fromAxiosError(e)
    if (apiError.isServerError) {
      throw apiError
    }

    showAlert?.('取得司機列表失敗，請稍後再試', 'danger')
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

export async function fetchDriverDetail(
  driverId: string,
  showAlert?: AlertFn,
): Promise<DriverDetail | null> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 司機詳情', driverId)
    await new Promise(resolve => setTimeout(resolve, 300))
    const driver = MOCK_DRIVERS.find(d => d.id === driverId)
    return driver ? { ...driver, address: '', emergencyContact: '', emergencyPhone: '', notes: '' } : null
  }

  try {
    const res = await http.get<ApiResponse<DriverDetail>>(
      `${API_PREFIX}/${driverId}`,
    )
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('取得司機詳情失敗，請稍後再試', 'danger')
    return null
  }
}

// ------------------------------------------------------------
// Update 更新
// ------------------------------------------------------------
export async function updateDriver(
  id: string,
  payload: UpdateDriverReq,
  showAlert?: AlertFn
): Promise<DriverListItem | null> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬更新司機', id, payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('更新司機資料成功 (Mock)', 'success')
    const mockDriver = MOCK_DRIVERS.find(d => d.id === id)
    return mockDriver as DriverListItem | null
  }

  try {
    const res = await http.put<ApiResponse<DriverListItem>>(
      `${API_PREFIX}/${id}`, 
      payload
    )
    showAlert?.('更新司機資料成功', 'success')
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('更新司機資料失敗，請稍後再試', 'danger')
    throw e
  }
}

// ------------------------------------------------------------
// Delete
// ------------------------------------------------------------
export async function deleteDriver(
  id: string,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬刪除司機', id)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('刪除司機資料成功 (Mock)', 'success')
    return true
  }

  try {
    await http.delete<ApiResponse<null>>(
      `${API_PREFIX}/${id}`
    )
    showAlert?.('刪除司機資料成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('刪除司機資料失敗，請稍後再試', 'danger')
    return false
  }
}
