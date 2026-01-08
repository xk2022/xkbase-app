// src/app/pages/fms/vehicle/detail/Query.tsx
import { http } from '@/shared/api/http'
import { ApiResponse } from '../../../model/ApiResponse'
import { AlertFn } from '@/app/pages/common/AlertType'

import {
  VehicleDetail,
  VehicleDetailResp,
  mapVehicleDetailRespToDetail,
} from './Model'

/**
 * 取得單一車輛詳情
 * GET /api/fms/vehicles/{id}
 */
export async function fetchVehicleDetail(
  id: string,
  showAlert?: AlertFn,
): Promise<VehicleDetail | null> {
  try {
    const res = await http.get<ApiResponse<VehicleDetailResp>>(
      `/api/fms/vehicles/${id}`,
    )
    const dto = res.data.data
    if (!dto) return null
    return mapVehicleDetailRespToDetail(dto)
  } catch (e) {
    console.error(e)
    showAlert?.('取得車輛詳情失敗，請稍後再試', 'danger')
    return null
  }
}
