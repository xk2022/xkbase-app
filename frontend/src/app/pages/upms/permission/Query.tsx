import {http} from '@/shared/api/http'
import type {ApiResponse} from '../../model/ApiResponse'
import type {PageQuery} from '../../model/PageQuery'
import type {PageResult} from '../../model/PageResult'
import type {
  Permission,
  PermissionDetail,
  CreatePermissionReq,
  UpdatePermissionReq,
} from './Model'
import type {AlertFn} from '@/app/pages/common/AlertType'
import {shouldUseMockData} from '@/shared/utils/useMockData'
import {MOCK_PERMISSIONS, MOCK_PERMISSION_DETAILS, generateMockPermissionId} from './mockPermissions'

/**
 * ===============================================================
 * UPMS - Permission API
 * ===============================================================
 * 設計原則：
 * - 只回傳「UI 好用的資料型別」
 * - 失敗時：
 *   - list：回空 PageResult（畫面不炸）
 *   - detail：丟錯（交給頁面處理）
 *   - create/update/delete：回 boolean
 * - Alert 由呼叫者決定是否顯示
 * ===============================================================
 */

const API_PREFIX = '/api/upms/permissions'

// ------------------------------------------------------------
// Create
// ------------------------------------------------------------
export async function createPermission(
  payload: CreatePermissionReq,
  showAlert?: AlertFn,
): Promise<boolean> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬建立權限', payload)
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newPermission: Permission = {
      id: generateMockPermissionId(),
      code: payload.systemCode + '_' + payload.resourceCode + '_' + payload.actionCode,
      name: payload.name,
      systemCode: payload.systemCode,
      resourceCode: payload.resourceCode,
      actionCode: payload.actionCode,
      enabled: payload.enabled ?? true,
      sortOrder: payload.sortOrder,
      description: payload.description,
      groupKey: payload.resourceCode,
      createdTime: new Date().toISOString(),
      updatedTime: new Date().toISOString(),
    }
    MOCK_PERMISSIONS.push(newPermission)
    MOCK_PERMISSION_DETAILS[newPermission.id] = {
      ...newPermission,
    }
    showAlert?.('建立權限成功 (Mock)', 'success')
    return true
  }

  // 真實 API
  try {
    await http.post<ApiResponse<Permission>>(API_PREFIX, payload)
    showAlert?.('建立權限成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('建立權限失敗，請稍後再試', 'danger')
    return false
  }
}

// ------------------------------------------------------------
// Read - List
// ------------------------------------------------------------
/**
 * 權限列表查詢（分頁）
 * - query：PageQuery + UpmsPermissionQuery（keyword / systemCode / enabled）
 */
export async function fetchPermissions(
  query: PageQuery & {
    systemCode?: string
    enabled?: boolean
  },
  showAlert?: AlertFn,
): Promise<PageResult<Permission>> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 使用 Mock 權限列表', query)
    await new Promise((resolve) => setTimeout(resolve, 300))

    let filtered = [...MOCK_PERMISSIONS]

    // 關鍵字搜尋
    if (query.keyword) {
      const keyword = query.keyword.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.code.toLowerCase().includes(keyword) ||
          p.name.toLowerCase().includes(keyword) ||
          p.description?.toLowerCase().includes(keyword)
      )
    }

    // 系統代碼篩選
    if (query.systemCode) {
      filtered = filtered.filter((p) => p.systemCode === query.systemCode)
    }

    // 啟用狀態篩選
    if (query.enabled !== undefined) {
      filtered = filtered.filter((p) => p.enabled === query.enabled)
    }

    // 分頁
    const page = query.page || 0
    const size = query.size || 10
    const start = page * size
    const end = start + size
    const paginated = filtered.slice(start, end)
    const totalPages = Math.ceil(filtered.length / size)

    return {
      content: paginated,
      totalElements: filtered.length,
      totalPages,
      size,
      number: page,
      first: page === 0,
      last: page >= totalPages - 1,
      empty: paginated.length === 0,
    }
  }

  // 真實 API
  try {
    const res = await http.get<ApiResponse<PageResult<Permission>>>(
      API_PREFIX,
      {params: query},
    )

    const page = res.data.data

    return {
      ...page,
      content: page.content || [],
    }
  } catch (e) {
    console.error(e)
    showAlert?.('取得權限列表失敗，請稍後再試', 'danger')

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
// Read - Detail
// ------------------------------------------------------------
export async function fetchPermissionDetail(
  id: string,
  showAlert?: AlertFn,
): Promise<PermissionDetail> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 使用 Mock 權限詳情', id)
    await new Promise((resolve) => setTimeout(resolve, 300))

    const detail = MOCK_PERMISSION_DETAILS[id]
    if (detail) {
      return detail
    }

    // 如果沒有詳情，從列表中找到並轉換
    const permission = MOCK_PERMISSIONS.find((p) => p.id === id)
    if (permission) {
      return {
        id: permission.id,
        code: permission.code,
        name: permission.name,
        description: permission.description,
        systemCode: permission.systemCode,
        resourceCode: permission.resourceCode,
        actionCode: permission.actionCode,
        enabled: permission.enabled,
        sortOrder: permission.sortOrder,
        groupKey: permission.groupKey,
        createdTime: permission.createdTime,
        updatedTime: permission.updatedTime,
      }
    }

    showAlert?.('找不到權限詳情 (Mock)', 'warning')
    throw new Error('Permission not found')
  }

  // 真實 API
  try {
    const res = await http.get<ApiResponse<PermissionDetail>>(
      `${API_PREFIX}/${id}`,
    )
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('取得權限詳情失敗，請稍後再試', 'danger')
    throw e
  }
}

// ------------------------------------------------------------
// Update
// ------------------------------------------------------------
export async function updatePermission(
  id: string,
  payload: UpdatePermissionReq,
  showAlert?: AlertFn,
): Promise<PermissionDetail | null> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬更新權限', id, payload)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const permission = MOCK_PERMISSIONS.find((p) => p.id === id)
    const detail = MOCK_PERMISSION_DETAILS[id]

    if (permission) {
      if (payload.name !== undefined) permission.name = payload.name
      if (payload.description !== undefined) permission.description = payload.description
      if (payload.enabled !== undefined) permission.enabled = payload.enabled
      if (payload.sortOrder !== undefined) permission.sortOrder = payload.sortOrder
      permission.updatedTime = new Date().toISOString()
    }

    if (detail) {
      if (payload.name !== undefined) detail.name = payload.name
      if (payload.description !== undefined) detail.description = payload.description
      if (payload.enabled !== undefined) detail.enabled = payload.enabled
      if (payload.sortOrder !== undefined) detail.sortOrder = payload.sortOrder
      detail.updatedTime = new Date().toISOString()
      showAlert?.('更新權限成功 (Mock)', 'success')
      return {...detail}
    }

    showAlert?.('找不到權限 (Mock)', 'warning')
    return null
  }

  // 真實 API
  try {
    const res = await http.patch<ApiResponse<PermissionDetail>>(
      `${API_PREFIX}/${id}`,
      payload,
    )
    showAlert?.('更新權限成功', 'success')
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('更新權限失敗，請稍後再試', 'danger')
    throw e
  }
}

// ------------------------------------------------------------
// Delete (soft delete on backend)
// ------------------------------------------------------------
export async function deletePermission(
  id: string,
  showAlert?: AlertFn,
): Promise<boolean> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬刪除權限', id)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = MOCK_PERMISSIONS.findIndex((p) => p.id === id)
    if (index >= 0) {
      MOCK_PERMISSIONS.splice(index, 1)
    }
    delete MOCK_PERMISSION_DETAILS[id]

    showAlert?.('刪除權限成功 (Mock)', 'success')
    return true
  }

  // 真實 API
  try {
    await http.delete<ApiResponse<null>>(`${API_PREFIX}/${id}`)
    showAlert?.('刪除權限成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('刪除權限失敗，請稍後再試', 'danger')
    return false
  }
}
