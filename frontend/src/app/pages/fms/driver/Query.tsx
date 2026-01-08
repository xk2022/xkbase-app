// src/app/pages/fms/driver/Query.ts
import { http } from '@/shared/api/http'
import { ApiResponse } from '../../model/ApiResponse'
import { PageQuery } from '../../model/PageQuery'
import { PageResult } from '../../model/PageResult'
import { AlertFn } from '@/app/pages/common/AlertType'
import {shouldUseMockDataWithTemp} from '@/shared/utils/useMockData'
import {
  CreateDriverReq,
  UpdateDriverReq,
  Driver,
  DriverListResp,
  DriverOptionResp,
  mapDriverListRespToDriver,
} from './Model'
import {MOCK_DRIVERS} from './mockDrivers'

// ========= Driver API 定義 =========
// Base URL: /api/fms/drivers

// ------------------------------------------------------------
// Create：建立司機
// ------------------------------------------------------------
export async function createDriver(
  payload: CreateDriverReq,
  showAlert?: AlertFn
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬建立司機', payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('新增司機成功 (Mock)', 'success')
    return true
  }

  try {
    const res = await http.post<ApiResponse<Driver>>(
      '/api/fms/drivers',
      payload
    )
    console.log('[createDriver] response:', res.data.data)

    showAlert?.('新增司機成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('新增司機失敗，請稍後再試', 'danger')
    return false
  }
}

// ------------------------------------------------------------
// Read
// ------------------------------------------------------------
// 司機分頁列表
export async function fetchDrivers(
  query: PageQuery,
  showAlert?: AlertFn
): Promise<PageResult<Driver>> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 司機列表', query)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 關鍵字篩選
    let filtered = [...MOCK_DRIVERS]
    if (query.keyword?.trim()) {
      const keyword = query.keyword.toLowerCase()
      filtered = filtered.filter(
        d =>
          d.name.toLowerCase().includes(keyword) ||
          d.phone.toLowerCase().includes(keyword) ||
          d.remark?.toLowerCase().includes(keyword)
      )
    }

    // 分頁處理
    const page = query.page || 0
    const size = query.size || 10
    const start = page * size
    const end = start + size
    const paginated = filtered.slice(start, end)

    return {
      content: paginated.map(mapDriverListRespToDriver),
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      size,
      number: page,
      first: page === 0,
      last: end >= filtered.length,
      empty: paginated.length === 0,
    }
  }

  try {
    const res = await http.get<ApiResponse<PageResult<DriverListResp>>>(
      '/api/fms/drivers',
      { params: query }
    )

    const page = res.data.data

    return {
      ...page,
      content: (page.content || []).map(mapDriverListRespToDriver),
    }
  } catch (e) {
    console.error(e)
    showAlert?.('取得司機列表失敗，請稍後再試', 'danger')

    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: query.size,
      number: query.page,
      first: true,
      last: true,
      empty: true,
    }
  }
}

// Read：司機下拉選項（如果你之後要提供）
export async function fetchDriverOptions(
  showAlert?: AlertFn
): Promise<DriverOptionResp[]> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 司機選項')
    await new Promise(resolve => setTimeout(resolve, 200))
    return MOCK_DRIVERS.map(d => ({
      id: d.id,
      name: d.name,
      phone: d.phone,
    }))
  }

  try {
    const res = await http.get<ApiResponse<DriverOptionResp[]>>(
      '/api/fms/drivers/options'
    )
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('取得司機選項失敗', 'danger')
    return []
  }
}


// ------------------------------------------------------------
// Update
// ------------------------------------------------------------
export async function updateDriver(
  id: string,
  payload: UpdateDriverReq,
  showAlert?: AlertFn
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬更新司機', id, payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('更新司機成功 (Mock)', 'success')
    return true
  }

  try {
    await http.put<ApiResponse<Driver>>(
      `/api/fms/drivers/${id}`,
      payload
    )
    showAlert?.('更新司機成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('更新司機失敗，請稍後再試', 'danger')
    return false
  }
}

// ------------------------------------------------------------
// Delete
// ------------------------------------------------------------
export async function deleteDriver(
  id: string,
  showAlert?: AlertFn
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬刪除司機', id)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('刪除司機成功 (Mock)', 'success')
    return true
  }

  try {
    await http.delete<ApiResponse<void>>(
      `/api/fms/drivers/${id}`
    )
    showAlert?.('刪除司機成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('刪除司機失敗，請稍後再試', 'danger')
    return false
  }
}
