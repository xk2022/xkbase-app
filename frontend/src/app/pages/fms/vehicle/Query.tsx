// src/app/pages/fms/vehicle/Query.ts
import {http} from '@/shared/api/http'
import {ApiResponse} from '../../model/ApiResponse'
import {PageQuery} from '../../model/PageQuery'
import {PageResult} from '../../model/PageResult'
import {AlertFn} from '@/app/pages/common/AlertType'
import {shouldUseMockDataWithTemp} from '@/shared/utils/useMockData'
import {
  Vehicle,
  VehicleListResp,
  CreateVehicleReq,
  UpdateVehicleReq,
  mapVehicleListRespToVehicle,
} from './Model'
import {MOCK_VEHICLES} from './mockVehicles'

// ========= Vehicle API 定義 =========
// 後端預期路由：/api/fms/vehicles

// ------------------------------------------------------------
// Create
// ------------------------------------------------------------
// 建立車輛
export async function createVehicle(
  payload: CreateVehicleReq,
  showAlert?: AlertFn
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬建立車輛', payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('新增車輛成功 (Mock)', 'success')
    return true
  }

  try {
    const res = await http.post<ApiResponse<Vehicle>>(
      '/api/fms/vehicles',
      payload
    )
    console.log(res.data.data)

    showAlert?.('新增車輛成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('新增車輛失敗，請稍後再試', 'danger')
    return false
  }
}

// ------------------------------------------------------------
// Read
// ------------------------------------------------------------
// 取得車輛分頁列表
export async function fetchVehicles(
  query: PageQuery,
  showAlert?: AlertFn
): Promise<PageResult<Vehicle>> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 車輛列表', query)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 關鍵字篩選
    let filtered = [...MOCK_VEHICLES]
    if (query.keyword?.trim()) {
      const keyword = query.keyword.toLowerCase()
      filtered = filtered.filter(
        v =>
          v.plateNo.toLowerCase().includes(keyword) ||
          v.brand?.toLowerCase().includes(keyword) ||
          v.model?.toLowerCase().includes(keyword) ||
          v.remark?.toLowerCase().includes(keyword)
      )
    }

    // 分頁處理
    const page = query.page || 0
    const size = query.size || 10
    const start = page * size
    const end = start + size
    const paginated = filtered.slice(start, end)

    return {
      content: paginated.map(mapVehicleListRespToVehicle),
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
    const res = await http.get<ApiResponse<PageResult<VehicleListResp>>>(
      '/api/fms/vehicles',
      {params: query}
    )

    const page = res.data.data

    return {
      ...page,
      content: (page.content || []).map(mapVehicleListRespToVehicle),
    }
  } catch (e) {
    console.error(e)
    showAlert?.('取得車輛列表失敗，請稍後再試', 'danger')

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

// ------------------------------------------------------------
// Update
// ------------------------------------------------------------
export async function updateVehicle(
  id: string,
  payload: UpdateVehicleReq,
  showAlert?: AlertFn
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬更新車輛', id, payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('更新車輛成功 (Mock)', 'success')
    return true
  }

  try {
    await http.put<ApiResponse<Vehicle>>(
      `/api/fms/vehicles/${id}`,
      payload
    )
    showAlert?.('更新車輛成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('更新車輛失敗，請稍後再試', 'danger')
    return false
  }
}

// ------------------------------------------------------------
// Delete
// ------------------------------------------------------------
export async function deleteVehicle(
  id: string,
  showAlert?: AlertFn
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬刪除車輛', id)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('刪除車輛成功 (Mock)', 'success')
    return true
  }

  try {
    await http.delete<ApiResponse<void>>(
      `/api/fms/vehicles/${id}`
    )
    showAlert?.('刪除車輛成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('刪除車輛失敗，請稍後再試', 'danger')
    return false
  }
}
