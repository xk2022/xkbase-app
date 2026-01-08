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
import { MOCK_ROLES, MOCK_ROLE_DETAILS, generateMockRoleId } from './mockRoles'

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

// 取得角色下拉選項
export async function fetchOptions(
  showAlert?: AlertFn,
): Promise<RoleOptionResp[]> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 使用 Mock 角色選項')
    await new Promise(resolve => setTimeout(resolve, 200))

    return MOCK_ROLES
      .filter(r => r.enabled)
      .map(r => ({
        id: r.id,
        code: r.code,
        name: r.name,
      }))
  }

  // 真實 API
  try {
    const res = await http.get<ApiResponse<RoleOptionResp[]>>(
      '/api/upms/roles/options',
    )

    const data = res.data?.data
    const list = Array.isArray(data) ? data : []

    return list
  } catch (e) {
    console.error(e)
    showAlert?.('取得角色選項失敗', 'danger')
    return []
  }
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
