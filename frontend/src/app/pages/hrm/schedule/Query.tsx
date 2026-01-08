// src/app/pages/hrm/schedule/Query.tsx
import { http } from '@/shared/api/http'
import type { AlertFn } from '@/app/pages/common/AlertType'
import { shouldUseMockDataWithTemp } from '@/shared/utils/useMockData'
import { ApiError } from '@/app/pages/common/ApiError'

import { ApiResponse } from '../../model/ApiResponse'
import { PageResult } from '../../model/PageResult'

import type {
  CreateScheduleReq,
  ScheduleDetail,
  ScheduleListItem,
  UpdateScheduleReq,
} from './Model'
import { MOCK_SCHEDULES } from './list/mockSchedules'

const API_PREFIX = '/api/hrm/schedules'

export async function createSchedule(
  req: CreateScheduleReq,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬創建工時規劃', req)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('工時規劃建立成功 (Mock)', 'success')
    return true
  }

  try {
    await http.post(API_PREFIX, req)
    showAlert?.('工時規劃建立成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('建立工時規劃失敗，請稍後再試', 'danger')
    return false
  }
}

export async function fetchSchedules(
  query: any,
  showAlert?: (msg: string, type: any) => void,
): Promise<PageResult<ScheduleListItem>> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 工時規劃列表', query)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return Promise.resolve({
      content: MOCK_SCHEDULES,
      totalElements: MOCK_SCHEDULES.length,
      totalPages: 1,
      size: query.size ?? 10,
      number: query.page ?? 0,
      first: (query.page ?? 0) === 0,
      last: true,
      empty: MOCK_SCHEDULES.length === 0,
    })
  }

  try {
    const res = await http.get<ApiResponse<PageResult<ScheduleListItem>>>(
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

    showAlert?.('取得工時規劃列表失敗，請稍後再試', 'danger')
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

export async function fetchScheduleDetail(
  scheduleId: string,
  showAlert?: AlertFn,
): Promise<ScheduleDetail | null> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 工時規劃詳情', scheduleId)
    await new Promise(resolve => setTimeout(resolve, 300))
    const schedule = MOCK_SCHEDULES.find(s => s.id === scheduleId)
    return schedule ? { ...schedule, dailySchedules: [], notes: '' } : null
  }

  try {
    const res = await http.get<ApiResponse<ScheduleDetail>>(
      `${API_PREFIX}/${scheduleId}`,
    )
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('取得工時規劃詳情失敗，請稍後再試', 'danger')
    return null
  }
}

export async function updateSchedule(
  id: string,
  payload: UpdateScheduleReq,
  showAlert?: AlertFn
): Promise<ScheduleListItem | null> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬更新工時規劃', id, payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('更新工時規劃成功 (Mock)', 'success')
    const mockSchedule = MOCK_SCHEDULES.find(s => s.id === id)
    return mockSchedule as ScheduleListItem | null
  }

  try {
    const res = await http.put<ApiResponse<ScheduleListItem>>(
      `${API_PREFIX}/${id}`, 
      payload
    )
    showAlert?.('更新工時規劃成功', 'success')
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('更新工時規劃失敗，請稍後再試', 'danger')
    throw e
  }
}

export async function deleteSchedule(
  id: string,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬刪除工時規劃', id)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('刪除工時規劃成功 (Mock)', 'success')
    return true
  }

  try {
    await http.delete<ApiResponse<null>>(
      `${API_PREFIX}/${id}`
    )
    showAlert?.('刪除工時規劃成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('刪除工時規劃失敗，請稍後再試', 'danger')
    return false
  }
}
