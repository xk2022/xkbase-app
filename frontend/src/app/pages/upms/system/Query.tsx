// src/app/pages/upms/system/Query.tsx
import {http} from '@/shared/api/http'
import {ApiResponse} from '../../model/ApiResponse'
import {PageQuery} from '../../model/PageQuery'
import { PageResult } from '../../model/PageResult'
import { CreateSystemReq, System, UpdateSystemReq } from './Model'
import { AlertFn } from '@/app/pages/common/AlertType'
import { shouldUseMockData } from '@/shared/utils/useMockData'
import { MOCK_SYSTEMS, generateMockSystemId } from './mockSystems'

/**
 * ===============================================================
 * UPMS - System API
 * ===============================================================
 * - 只回傳「UI 好用的資料型別」
 * - 失敗時：
 *   - list：回空 PageResult，讓畫面不炸
 *   - detail：回 null
 *   - create/delete：回 false
 * - Alert 交由呼叫者傳入 showAlert（可選）
 * ===============================================================
 */

const API_PREFIX = '/api/upms/systems'

// ------------------------------------------------------------
// Create 新增（給 CreatePage 用）
// ------------------------------------------------------------
export async function createSystem(
  payload: CreateSystemReq,
  showAlert?: AlertFn
): Promise<boolean> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬創建系統', payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模擬創建成功
    showAlert?.('建立系統成功 (Mock)', 'success')
    return true
  }

  // 真實 API
  try {
    await http.post<ApiResponse<System>>(API_PREFIX, payload)
    showAlert?.('建立系統成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('建立系統失敗，請稍後再試', 'danger')
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
export async function fetchSystems(
  query: PageQuery,
  showAlert?: AlertFn
): Promise<PageResult<System>> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 使用 Mock 系統列表', query)
    await new Promise(resolve => setTimeout(resolve, 300))

    // 關鍵字篩選
    let filtered = [...MOCK_SYSTEMS]
    if (query.keyword?.trim()) {
      const keyword = query.keyword.toLowerCase()
      filtered = filtered.filter(
        s =>
          s.code.toLowerCase().includes(keyword) ||
          s.name.toLowerCase().includes(keyword) ||
          s.remark?.toLowerCase().includes(keyword)
      )
    }

    // enabled 篩選（如果 query 有 enabled 參數）
    // 注意：PageQuery 可能沒有 enabled，這裡假設可以通過其他方式傳遞
    // 如果需要，可以在 UpmsSystemQuery 中定義

    // 分頁處理
    const page = query.page || 0
    const size = query.size || 10
    const start = page * size
    const end = start + size
    const paginated = filtered.slice(start, end)

    const result: PageResult<System> = {
      content: paginated,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      size,
      number: page,
      first: page === 0,
      last: end >= filtered.length,
      empty: paginated.length === 0,
    }

    return result
  }

  // 真實 API
  try {
    const res = await http.get<ApiResponse<PageResult<System>>>(
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
    showAlert?.('取得系統列表失敗，請稍後再試', 'danger')

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

export async function fetchSystemDetail(
  id: string,
  showAlert?: AlertFn
): Promise<System | null> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 使用 Mock 系統詳情', id)
    await new Promise(resolve => setTimeout(resolve, 300))

    const system = MOCK_SYSTEMS.find(s => s.id === id)
    if (system) {
      return system
    }

    showAlert?.('找不到系統資料 (Mock)', 'warning')
    return null
  }

  // 真實 API
  try {
    const res = await http.get<ApiResponse<System>>(`${API_PREFIX}/${id}`)
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('取得系統詳情失敗，請稍後再試', 'danger')
    return null
  }
}

/**
 * 取得 enabled 系統清單
 * - 後端若支援：?enabled=true 直接篩好（推薦）
 * - 回傳：System[]
 */
export async function fetchEnabledSystems(
  showAlert?: AlertFn
): Promise<System[]> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 使用 Mock 啟用系統列表')
    await new Promise(resolve => setTimeout(resolve, 200))

    return MOCK_SYSTEMS.filter(s => s.enabled === true)
  }

  // 真實 API
  try {
    const res = await http.get<ApiResponse<PageResult<System>>>(
      API_PREFIX,
      { params: { enabled: true } }
    )

    const page = res.data.data

    return (page?.content ?? []).filter((s) => s.enabled === true)
  } catch (e) {
    console.error(e)
    showAlert?.('取得啟用系統失敗，請稍後再試', 'danger')
    return []
  }
}

// ------------------------------------------------------------
// Update 更新（給 EditModal 用）
// ------------------------------------------------------------
export async function updateSystem(
  id: string,
  payload: UpdateSystemReq,
  showAlert?: AlertFn
): Promise<System | null> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬更新系統', id, payload)
    await new Promise(resolve => setTimeout(resolve, 500))

    // 找到對應的系統並更新
    const mockSystem = MOCK_SYSTEMS.find(s => s.id === id)
    if (mockSystem) {
      if (payload.code) mockSystem.code = payload.code
      if (payload.name) mockSystem.name = payload.name
      if (payload.enabled !== undefined) mockSystem.enabled = payload.enabled
      if (payload.remark !== undefined) mockSystem.remark = payload.remark
      mockSystem.updatedTime = new Date().toISOString()
    }

    showAlert?.('更新系統成功 (Mock)', 'success')
    return mockSystem || null
  }

  // 真實 API
  try {
    const res = await http.patch<ApiResponse<System>>(
      `${API_PREFIX}/${id}`, 
      payload
    )
    showAlert?.('更新系統成功', 'success')
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('更新系統失敗，請稍後再試', 'danger')
    return null
  }
}

// ------------------------------------------------------------
// Delete
// ------------------------------------------------------------
export async function deleteSystem(
  id: string,
  showAlert?: AlertFn,
): Promise<boolean> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬刪除系統', id)
    await new Promise(resolve => setTimeout(resolve, 500))

    // 在 Mock 模式下，我們不真正刪除數據，只是模擬成功
    showAlert?.('刪除系統成功 (Mock)', 'success')
    return true
  }

  // 真實 API
  try {
    await http.delete<ApiResponse<null>>(
      `${API_PREFIX}/${id}`
    )
    showAlert?.('刪除系統成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('刪除系統失敗，請稍後再試', 'danger')
    return false
  }
}
