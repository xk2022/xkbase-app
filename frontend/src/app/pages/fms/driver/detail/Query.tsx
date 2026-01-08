// src/app/pages/fms/driver/detail/Query.tsx
import { http } from '@/shared/api/http'
import { ApiResponse } from '../../../model/ApiResponse'
import { AlertFn } from '@/app/pages/common/AlertType'

import {
  DriverDetail,
  DriverDetailResp,
  mapDriverDetailRespToDetail,
} from './Model'

/**
 * 取得單一司機詳情
 * GET /api/fms/drivers/{id}
 */
export async function fetchDriverDetail(
  id: string,
  showAlert?: AlertFn,
): Promise<DriverDetail | null> {
  try {
    const res = await http.get<ApiResponse<DriverDetailResp>>(
      `/api/fms/drivers/${id}`,
    )

    const dto = res.data.data
    if (!dto) return null

    return mapDriverDetailRespToDetail(dto)
  } catch (e) {
    console.error(e)
    showAlert?.('取得司機詳情失敗，請稍後再試', 'danger')
    return null
  }
}
