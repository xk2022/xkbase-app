// src/app/pages/port/Query.tsx
import { http } from '@/shared/api/http'
import type { AlertFn } from '@/app/pages/common/AlertType'
import { shouldUseMockDataWithTemp } from '@/shared/utils/useMockData'
import { ApiError } from '@/app/pages/common/ApiError'

import { ApiResponse } from '@/app/pages/model/ApiResponse'
import { PageResult } from '@/app/pages/model/PageResult'

import type {
  Port,
  PortDetail,
  PortListItem,
  CreatePortReq,
  UpdatePortReq,
  EntryTimeRule,
  CreateEntryTimeRuleReq,
  UpdateEntryTimeRuleReq,
  PortOperationRule,
  CreatePortOperationRuleReq,
  UpdatePortOperationRuleReq,
} from './Model'

/**
 * ===============================================================
 * PORT - Port API Queries
 * ===============================================================
 */

const API_PREFIX = '/api/port'

// ------------------------------------------------------------
// 港口 CRUD
// ------------------------------------------------------------

/** 取得港口列表 */
export async function fetchPorts(
  query: any,
  showAlert?: AlertFn,
): Promise<PageResult<PortListItem>> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 港口列表', query)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const mockPorts: PortListItem[] = [
      {
        id: '1',
        code: 'TPE',
        name: '台北港',
        address: '新北市八里區商港路123號',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        code: 'KHH',
        name: '高雄港',
        address: '高雄市鼓山區臨海二路62號',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '3',
        code: 'TWN',
        name: '台中港',
        address: '台中市梧棲區中橫十路2號',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ]
    
    return Promise.resolve({
      content: mockPorts,
      totalElements: mockPorts.length,
      totalPages: 1,
      size: query.size ?? 10,
      number: query.page ?? 0,
      first: (query.page ?? 0) === 0,
      last: true,
      empty: mockPorts.length === 0,
    })
  }

  try {
    const res = await http.get<ApiResponse<PageResult<PortListItem>>>(
      `${API_PREFIX}/ports`,
      { params: query },
    )
    return {
      ...res.data.data,
      content: res.data.data.content || [],
    }
  } catch (e) {
    console.error(e)
    const apiError = ApiError.fromAxiosError(e)
    if (apiError.isServerError) {
      throw apiError
    }
    showAlert?.('取得港口列表失敗，請稍後再試', 'danger')
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

/** 取得港口詳情 */
export async function fetchPortDetail(
  portId: string,
  showAlert?: AlertFn,
): Promise<PortDetail | null> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 港口詳情', portId)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const mockPort: Port = {
      id: portId,
      code: 'TPE',
      name: '台北港',
      address: '新北市八里區商港路123號',
      status: 'active',
      contactPhone: '02-1234-5678',
      contactEmail: 'contact@tpeport.gov.tw',
      description: '台灣主要國際商港之一',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }
    
    const mockEntryRules: EntryTimeRule[] = [
      {
        id: '1',
        portId: portId,
        dayOfWeek: 'monday',
        startTime: '08:00',
        endTime: '17:00',
        maxCapacity: 100,
        currentCapacity: 45,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        portId: portId,
        dayOfWeek: 'tuesday',
        startTime: '08:00',
        endTime: '17:00',
        maxCapacity: 100,
        currentCapacity: 60,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ]
    
    const mockOperationRules: PortOperationRule[] = [
      {
        id: '1',
        portId: portId,
        operationType: 'both',
        containerTypeLimits: [
          { containerType: '20GP', maxWeight: 30, isAllowed: true },
          { containerType: '40GP', maxWeight: 30, isAllowed: true },
          { containerType: '40HQ', maxWeight: 30, maxHeight: 2.9, isAllowed: true },
        ],
        specialRequirements: '需提前24小時預約',
        maxConcurrentOperations: 10,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ]
    
    return {
      port: mockPort,
      entryTimeRules: mockEntryRules,
      operationRules: mockOperationRules,
    }
  }

  try {
    const res = await http.get<ApiResponse<PortDetail>>(
      `${API_PREFIX}/ports/${portId}`,
    )
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('取得港口詳情失敗，請稍後再試', 'danger')
    return null
  }
}

/** 建立港口 */
export async function createPort(
  req: CreatePortReq,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬建立港口', req)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('港口建立成功 (Mock)', 'success')
    return true
  }

  try {
    await http.post<ApiResponse<Port>>(`${API_PREFIX}/ports`, req)
    showAlert?.('港口建立成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('建立港口失敗，請稍後再試', 'danger')
    return false
  }
}

/** 更新港口 */
export async function updatePort(
  portId: string,
  req: UpdatePortReq,
  showAlert?: AlertFn,
): Promise<Port | null> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬更新港口', portId, req)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('港口更新成功 (Mock)', 'success')
    return null
  }

  try {
    const res = await http.put<ApiResponse<Port>>(
      `${API_PREFIX}/ports/${portId}`,
      req,
    )
    showAlert?.('港口更新成功', 'success')
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('更新港口失敗，請稍後再試', 'danger')
    return null
  }
}

/** 刪除港口 */
export async function deletePort(
  portId: string,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬刪除港口', portId)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('港口刪除成功 (Mock)', 'success')
    return true
  }

  try {
    await http.delete<ApiResponse<null>>(`${API_PREFIX}/ports/${portId}`)
    showAlert?.('港口刪除成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('刪除港口失敗，請稍後再試', 'danger')
    return false
  }
}

// ------------------------------------------------------------
// 進場時段規則 CRUD
// ------------------------------------------------------------

/** 取得進場時段規則列表 */
export async function fetchEntryTimeRules(
  portId: string,
  showAlert?: AlertFn,
): Promise<EntryTimeRule[]> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 進場時段規則', portId)
    await new Promise(resolve => setTimeout(resolve, 300))
    return []
  }

  try {
    const res = await http.get<ApiResponse<EntryTimeRule[]>>(
      `${API_PREFIX}/ports/${portId}/entry-time-rules`,
    )
    return res.data.data || []
  } catch (e) {
    console.error(e)
    showAlert?.('取得進場時段規則失敗，請稍後再試', 'danger')
    return []
  }
}

/** 建立進場時段規則 */
export async function createEntryTimeRule(
  portId: string,
  req: CreateEntryTimeRuleReq,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬建立進場時段規則', portId, req)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('進場時段規則建立成功 (Mock)', 'success')
    return true
  }

  try {
    await http.post<ApiResponse<EntryTimeRule>>(
      `${API_PREFIX}/ports/${portId}/entry-time-rules`,
      req,
    )
    showAlert?.('進場時段規則建立成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('建立進場時段規則失敗，請稍後再試', 'danger')
    return false
  }
}

/** 更新進場時段規則 */
export async function updateEntryTimeRule(
  portId: string,
  ruleId: string,
  req: UpdateEntryTimeRuleReq,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬更新進場時段規則', portId, ruleId, req)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('進場時段規則更新成功 (Mock)', 'success')
    return true
  }

  try {
    await http.put<ApiResponse<EntryTimeRule>>(
      `${API_PREFIX}/ports/${portId}/entry-time-rules/${ruleId}`,
      req,
    )
    showAlert?.('進場時段規則更新成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('更新進場時段規則失敗，請稍後再試', 'danger')
    return false
  }
}

/** 刪除進場時段規則 */
export async function deleteEntryTimeRule(
  portId: string,
  ruleId: string,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬刪除進場時段規則', portId, ruleId)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('進場時段規則刪除成功 (Mock)', 'success')
    return true
  }

  try {
    await http.delete<ApiResponse<null>>(
      `${API_PREFIX}/ports/${portId}/entry-time-rules/${ruleId}`,
    )
    showAlert?.('進場時段規則刪除成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('刪除進場時段規則失敗，請稍後再試', 'danger')
    return false
  }
}

// ------------------------------------------------------------
// 港口作業規則 CRUD
// ------------------------------------------------------------

/** 取得港口作業規則列表 */
export async function fetchPortOperationRules(
  portId: string,
  showAlert?: AlertFn,
): Promise<PortOperationRule[]> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 港口作業規則', portId)
    await new Promise(resolve => setTimeout(resolve, 300))
    return []
  }

  try {
    const res = await http.get<ApiResponse<PortOperationRule[]>>(
      `${API_PREFIX}/ports/${portId}/operation-rules`,
    )
    return res.data.data || []
  } catch (e) {
    console.error(e)
    showAlert?.('取得港口作業規則失敗，請稍後再試', 'danger')
    return []
  }
}

/** 建立港口作業規則 */
export async function createPortOperationRule(
  portId: string,
  req: CreatePortOperationRuleReq,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬建立港口作業規則', portId, req)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('港口作業規則建立成功 (Mock)', 'success')
    return true
  }

  try {
    await http.post<ApiResponse<PortOperationRule>>(
      `${API_PREFIX}/ports/${portId}/operation-rules`,
      req,
    )
    showAlert?.('港口作業規則建立成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('建立港口作業規則失敗，請稍後再試', 'danger')
    return false
  }
}

/** 更新港口作業規則 */
export async function updatePortOperationRule(
  portId: string,
  ruleId: string,
  req: UpdatePortOperationRuleReq,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬更新港口作業規則', portId, ruleId, req)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('港口作業規則更新成功 (Mock)', 'success')
    return true
  }

  try {
    await http.put<ApiResponse<PortOperationRule>>(
      `${API_PREFIX}/ports/${portId}/operation-rules/${ruleId}`,
      req,
    )
    showAlert?.('港口作業規則更新成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('更新港口作業規則失敗，請稍後再試', 'danger')
    return false
  }
}

/** 刪除港口作業規則 */
export async function deletePortOperationRule(
  portId: string,
  ruleId: string,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬刪除港口作業規則', portId, ruleId)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('港口作業規則刪除成功 (Mock)', 'success')
    return true
  }

  try {
    await http.delete<ApiResponse<null>>(
      `${API_PREFIX}/ports/${portId}/operation-rules/${ruleId}`,
    )
    showAlert?.('港口作業規則刪除成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('刪除港口作業規則失敗，請稍後再試', 'danger')
    return false
  }
}
