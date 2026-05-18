// src/app/pages/upms/role/Query.ts
import { http } from '@/shared/api/http'
import { ApiResponse } from '../../model/ApiResponse'
import { PageQuery } from '../../model/PageQuery'
import { PageResult } from '../../model/PageResult'
import { AlertFn } from '@/app/pages/common/AlertType'
import { shouldUseMockData } from '@/shared/utils/useMockData'
import {
  CreateRoleReq,
  UpdateRoleReq,
  Role,
  RoleListResp,
  RoleDetailResp,
  RoleOptionResp,
  mapRoleListRespToRole,
} from './Model'
import { MOCK_ROLES, MOCK_ROLE_DETAILS } from '../__mock__/mockRoles'

// ========= Role API 定義 =========

// ------------------------------------------------------------
// Create
// ------------------------------------------------------------
// 建立角色
export async function createRole(
  payload: CreateRoleReq, 
  showAlert?: AlertFn
): Promise<boolean> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬創建角色', payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模擬創建成功
    showAlert?.('建立角色成功 (Mock)', 'success')
    return true
  }

  // 真實 API
  try {
    const res = await http.post<ApiResponse<Role>>(
      '/api/upms/roles', 
      payload
    )
    console.log(res.data.data);

    showAlert?.('建立角色成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('建立角色失敗，請稍後再試', 'danger')
    return false
  }
}

// ------------------------------------------------------------
// Read
// ------------------------------------------------------------
// 取得角色分頁列表
export async function fetchRoles(
  query: PageQuery,
  showAlert?: AlertFn
): Promise<PageResult<Role>> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 使用 Mock 角色列表', query)
    await new Promise(resolve => setTimeout(resolve, 300))

    // 關鍵字篩選
    let filtered = [...MOCK_ROLES]
    if (query.keyword?.trim()) {
      const keyword = query.keyword.toLowerCase()
      filtered = filtered.filter(
        r =>
          r.code.toLowerCase().includes(keyword) ||
          r.name?.toLowerCase().includes(keyword) ||
          r.description?.toLowerCase().includes(keyword)
      )
    }

    // 分頁處理
    const page = query.page || 0
    const size = query.size || 10
    const start = page * size
    const end = start + size
    const paginated = filtered.slice(start, end)

    const result: PageResult<Role> = {
      content: paginated.map(mapRoleListRespToRole).map(role => ({
        ...role,
        permissionCount: role.permissionCodes?.length ?? 0,
      })),
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
    const res = await http.get<ApiResponse<PageResult<RoleListResp>>>(
      '/api/upms/roles', 
      {params: query,}
    )
    const page = res.data.data
    return {
      ...page,
      content: (page.content || []).map(mapRoleListRespToRole),
    }
  } catch (e) {
    console.error(e)
    showAlert?.('取得角色列表失敗，請稍後再試', 'danger')

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

// 取得角色詳情
export async function fetchRoleDetail(
  id: string,
  showAlert?: AlertFn
): Promise<Role | null> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 使用 Mock 角色詳情', id)
    await new Promise(resolve => setTimeout(resolve, 200))

    const mockRole = MOCK_ROLE_DETAILS[id]
    if (mockRole) {
      return mapRoleListRespToRole(mockRole)
    }
    return null
  }

  // 真實 API
  try {
    const res = await http.get<ApiResponse<RoleDetailResp>>(
      `/api/upms/roles/${id}`
    )
    const data = res.data.data
    return mapRoleListRespToRole(data)
  } catch (e) {
    console.error(e)
    showAlert?.('取得角色詳情失敗，請稍後再試', 'danger')
    return null
  }
}

// 取得角色下拉選項（帶快取）
let roleOptionsCache: RoleOptionResp[] | null = null
let roleOptionsCacheTime: number = 0
const ROLE_OPTIONS_CACHE_TTL = 5 * 60 * 1000 // 5分鐘

export async function fetchOptions(
  showAlert?: AlertFn,
): Promise<RoleOptionResp[]> {
  // 檢查快取
  const now = Date.now()
  if (roleOptionsCache && (now - roleOptionsCacheTime) < ROLE_OPTIONS_CACHE_TTL) {
    console.log('[Cache] 使用快取的角色選項')
    return roleOptionsCache
  }

  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 使用 Mock 角色選項')
    await new Promise(resolve => setTimeout(resolve, 200))

    const result = MOCK_ROLES
      .filter(r => r.enabled)
      .map(r => ({
        id: r.id,
        code: r.code,
        name: r.name,
      }))
    
    // 更新快取
    roleOptionsCache = result
    roleOptionsCacheTime = now
    
    return result
  }

  // 真實 API
  try {
    const res = await http.get<ApiResponse<RoleOptionResp[]>>(
      '/api/upms/roles/options',
    )

    const data = res.data?.data
    const list = Array.isArray(data) ? data : []

    // 更新快取
    roleOptionsCache = list
    roleOptionsCacheTime = now

    return list
  } catch (e) {
    console.error(e)
    showAlert?.('取得角色選項失敗', 'danger')
    return []
  }
}

/**
 * 清除角色選項快取
 */
export function clearRoleOptionsCache() {
  roleOptionsCache = null
  roleOptionsCacheTime = 0
}


// ------------------------------------------------------------
// Update
// ------------------------------------------------------------
// 更新角色
export async function updateRole(
  id: string,
  payload: UpdateRoleReq,
  showAlert?: AlertFn
): Promise<boolean> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬更新角色', id, payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    showAlert?.('更新角色成功 (Mock)', 'success')
    return true
  }

  // 真實 API
  try {
    await http.put<ApiResponse<Role>>(
      `/api/upms/roles/${id}`, 
      payload
    )
    showAlert?.('更新角色成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('更新角色失敗，請稍後再試', 'danger')
    return false
  }
}

// ------------------------------------------------------------
// Delete
// ------------------------------------------------------------
// 刪除角色
export async function deleteRole(
  id: string, 
  showAlert?: AlertFn
): Promise<boolean> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬刪除角色', id)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    showAlert?.('刪除角色成功 (Mock)', 'success')
    return true
  }

  // 真實 API
  try {
    await http.delete<ApiResponse<void>>(
      `/api/upms/roles/${id}`
    )
    showAlert?.('刪除角色成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('刪除角色失敗，請稍後再試', 'danger')
    return false
  }
}

// ------------------------------------------------------------
// Helper Functions (for OverviewPage)
// ------------------------------------------------------------
/**
 * 取得角色的建立時間
 * @param role 角色物件
 * @returns 建立時間字串，如果不存在則返回 undefined
 */
export function getRoleCreatedTime(role: Role): string | undefined {
  if (shouldUseMockData()) {
    const mockRole = MOCK_ROLES.find((r) => r.id === role.id)
    return mockRole?.createdTime
  }
  // 真實 API 模式：Role 模型目前沒有 createdTime 欄位
  // 如果需要，應該從 RoleListResp 取得
  // 暫時返回 undefined，等待後端 API 支援
  return undefined
}

// ------------------------------------------------------------
// Get Users by Role
// ------------------------------------------------------------
/**
 * 取得擁有指定角色的使用者列表
 * @param roleId 角色 ID
 * @param showAlert 錯誤提示函數
 * @returns 使用者列表
 */
export async function fetchUsersByRole(
  roleId: string,
  showAlert?: AlertFn
): Promise<Array<{id: string; username: string; name?: string; enabled: boolean}>> {
  // Mock 模式：從 MOCK_USERS 中篩選
  if (shouldUseMockData()) {
    console.log('[Mock] 取得擁有角色的使用者', roleId)
    await new Promise(resolve => setTimeout(resolve, 200))
    
    try {
      // 動態導入 User 相關模組
      const {MOCK_USERS} = await import('../__mock__/mockUsers')
      
      // 先取得角色代碼
      const role = MOCK_ROLES.find(r => r.id === roleId)
      if (!role) {
        return []
      }
      
      return MOCK_USERS
        .filter(user => user.roleCodes?.includes(role.code))
        .map(user => ({
          id: user.id,
          username: user.username,
          name: user.name || undefined,
          enabled: user.enabled,
        }))
    } catch (e) {
      console.error('[Mock] 無法載入使用者資料', e)
      return []
    }
  }

  // 真實 API
  try {
    const res = await http.get<ApiResponse<Array<{id: string; username: string; name?: string; enabled: boolean}>>>(
      `/api/upms/roles/${roleId}/users`
    )
    return res.data?.data || []
  } catch (e) {
    console.error(e)
    showAlert?.('取得使用者列表失敗', 'danger')
    return []
  }
}
