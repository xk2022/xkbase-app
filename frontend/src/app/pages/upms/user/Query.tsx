// src/app/pages/upms/user/Query.tsx
import { http } from '@/shared/api/http'
import { ApiResponse } from '../../model/ApiResponse'
import { PageQuery } from '../../model/PageQuery'
import { PageResult } from '../../model/PageResult'
import { 
  CreateUserReq, 
  mapUserListRespToUser, 
  UpdateUserReq, 
  UpdateUserStatusReq, 
  User, 
  UserListResp, 
  UserPermissionsResp, 
  UserProfile
} from './Model'
import { AlertFn } from '@/app/pages/common/AlertType'
import { shouldUseMockData } from '@/shared/utils/useMockData'
import { MOCK_USERS, MOCK_USER_PROFILES } from '../__mock__/mockUsers'

const API_PREFIX = '/api/upms/users'

// ========= User API 定義 =========

// ------------------------------------------------------------
// Create 新增（給 CreateModal 用）
// ------------------------------------------------------------
export async function createUser(
  payload: CreateUserReq,
  showAlert?: AlertFn
): Promise<boolean> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬創建使用者', payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模擬創建成功
    showAlert?.('建立使用者成功 (Mock)', 'success')
    return true
  }

  // 真實 API
  try {
    // const res = 
    await http.post<ApiResponse<User>>(
      API_PREFIX,
      payload
    )
    // console.log(res.data.data);

    showAlert?.('建立使用者成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('建立使用者失敗，請稍後再試', 'danger')
    return false
  }
}

// ------------------------------------------------------------
// Read
// ------------------------------------------------------------
// 取得使用者分頁列表
export async function fetchUsers(
  query: PageQuery,
  showAlert?: AlertFn
): Promise<PageResult<User>> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 使用 Mock 使用者列表', query)
    await new Promise(resolve => setTimeout(resolve, 300))

    // 關鍵字篩選
    let filtered = [...MOCK_USERS]
    if (query.keyword?.trim()) {
      const keyword = query.keyword.toLowerCase()
      filtered = filtered.filter(
        u =>
          u.username.toLowerCase().includes(keyword) ||
          u.name?.toLowerCase().includes(keyword) ||
          u.email?.toLowerCase().includes(keyword)
      )
    }

    // 狀態篩選
    if (query.enabled !== undefined) {
      filtered = filtered.filter((u) => u.enabled === query.enabled)
    }
    if (query.locked !== undefined) {
      filtered = filtered.filter((u) => u.locked === query.locked)
    }

    // 分頁處理
    const page = query.page || 0
    const size = query.size || 10
    const start = page * size
    const end = start + size
    const paginated = filtered.slice(start, end)

    const result: PageResult<User> = {
      content: paginated.map(mapUserListRespToUser),
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
    const res = await http.get<ApiResponse<PageResult<UserListResp>>>(
      '/api/upms/users',
      {params: query}
    )

    const page = res.data.data

    return {
      ...page,
      content: (page.content || []).map(mapUserListRespToUser),
    }
  } catch (e) {
    console.error(e)
    showAlert?.('取得使用者列表失敗，請稍後再試', 'danger')

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
// 更新使用者（給 EditModal 用）
export async function updateUser(
  uuid: string,
  payload: UpdateUserReq,
  showAlert?: AlertFn
): Promise<User | null> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬更新使用者', uuid, payload)
    await new Promise(resolve => setTimeout(resolve, 500))

    // 找到對應的使用者並更新
    const mockUser = MOCK_USERS.find(u => u.id === uuid)
    if (mockUser) {
      if (payload.username) mockUser.username = payload.username
      if (payload.enabled !== undefined) mockUser.enabled = payload.enabled
      if (payload.roleCodes) mockUser.roleCodes = payload.roleCodes
    }

    showAlert?.('更新使用者成功 (Mock)', 'success')
    return mockUser ? mapUserListRespToUser(mockUser) : null
  }

  // 真實 API
  try {
    const res = await http.put<ApiResponse<User>>(`/api/upms/users/${uuid}`, payload)
    showAlert?.('更新使用者成功', 'success')
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('更新使用者失敗，請稍後再試', 'danger')
    throw e
  }
}

// ------------------------------------------------------------
// Delete
// ------------------------------------------------------------
// 刪除使用者（給 DeleteModal 用）
export async function deleteUser(
  uuid: string, 
  showAlert?: AlertFn
): Promise<boolean> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬刪除使用者', uuid)
    await new Promise(resolve => setTimeout(resolve, 500))

    // 從 Mock 數據中移除（實際上是從陣列中過濾）
    const index = MOCK_USERS.findIndex(u => u.id === uuid)
    if (index !== -1) {
      MOCK_USERS.splice(index, 1)
      delete MOCK_USER_PROFILES[uuid]
    }

    showAlert?.('刪除使用者成功 (Mock)', 'success')
    return true
  }

  // 真實 API
  try {
    await http.delete<ApiResponse<null>>(`/api/upms/users/${uuid}`)
    showAlert?.('刪除使用者成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('刪除使用者失敗，請稍後再試', 'danger')
    return false
  }
}




export async function updateUserProfile(
  id: string,
  payload: {name: string; email?: string | null; phone?: string | null}
) {
  await http.patch<ApiResponse<unknown>>(`/api/upms/users/${id}/profile`, payload)
}



/**
 * 取得單一使用者詳情
 * GET /api/upms/users/{id}/profile
 */
export async function fetchUserProfile(
  id: string,
  showAlert?: AlertFn
): Promise<UserProfile | null> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 使用 Mock 使用者詳情', id)
    await new Promise(resolve => setTimeout(resolve, 300))

    const profile = MOCK_USER_PROFILES[id]
    if (!profile) {
      showAlert?.('找不到使用者詳情 (Mock)', 'warning')
      return null
    }

    return {
      ...profile,
      loginHistory: profile.loginHistory ?? [],
    }
  }

  // 真實 API
  try {
    const res = await http.get<ApiResponse<UserProfile>>(
      `/api/upms/users/${id}/profile`
    )

    const data = res.data.data

    // 🔥 確保 loginHistory 永遠是 array
    return {
      ...data,
      loginHistory: data.loginHistory ?? [],
    }
  } catch (e) {
    console.error(e)
    showAlert?.('取得使用者詳情失敗，請稍後再試', 'danger')
    return null
  }
}

/**
 * 重設使用者密碼
 * PATCH /api/upms/users/{id}/password
 */
export async function resetUserPassword(
  id: string,
  password: string,
  showAlert?: AlertFn
): Promise<boolean> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬重設密碼', id)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('密碼已成功重設 (Mock)', 'success')
    return true
  }

  // 真實 API
  try {
    await http.patch(`/api/upms/users/${id}/password`, null, {
      params: { newPassword: password },
    })
    showAlert?.('密碼已成功重設', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('重設密碼失敗，請稍後再試', 'danger')
    return false
  }
}


/**
 * 更新使用者狀態（enabled/locked）
 * PATCH /api/upms/users/{id}/status
 */
export async function updateUserStatus(
  id: string,
  payload: UpdateUserStatusReq,
  showAlert?: AlertFn
): Promise<UserProfile | null> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬更新使用者狀態', id, payload)
    await new Promise(resolve => setTimeout(resolve, 500))

    // 更新 Mock 數據
    const mockUser = MOCK_USERS.find(u => u.id === id)
    const mockProfile = MOCK_USER_PROFILES[id]

    if (mockUser && mockProfile) {
      if (payload.enabled !== undefined) {
        mockUser.enabled = payload.enabled
        mockProfile.enabled = payload.enabled
      }
      if (payload.locked !== undefined) {
        mockUser.locked = payload.locked
        mockProfile.locked = payload.locked
      }
    }

    showAlert?.('更新使用者狀態成功 (Mock)', 'success')
    return mockProfile ? { ...mockProfile } : null
  }

  // 真實 API
  try {
    const res = await http.patch<ApiResponse<UserProfile>>(
      `${API_PREFIX}/${id}/status`,
      payload
    )
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('更新使用者狀態失敗，請稍後再試', 'danger')
    return null
  }
}

/**
 * 取得使用者有效權限（建議後端回「計算後結果」）
 * GET /api/upms/users/{id}/permissions
 */
export async function fetchUserPermissions(
  id: string,
  showAlert?: AlertFn
): Promise<string[]> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 使用 Mock 使用者權限', id)
    await new Promise(resolve => setTimeout(resolve, 200))

    const profile = MOCK_USER_PROFILES[id]
    return profile?.permissions ?? []
  }

  // 真實 API
  try {
    const res = await http.get<ApiResponse<UserPermissionsResp>>(
      `${API_PREFIX}/${id}/permissions`
    )
    return res.data.data?.permissions ?? []
  } catch (e) {
    console.error(e)
    // 不要太吵：這張卡片可用 detail.permissions fallback
    showAlert?.('取得權限摘要失敗（已改用快取資料）', 'warning')
    return []
  }
}

// ------------------------------------------------------------
// Overview Page 專用工具函數
// ------------------------------------------------------------

/**
 * 取得鎖定使用者的 ID 集合
 * @returns 鎖定使用者的 ID Set
 */
export function getLockedUserIds(): Set<string> {
  if (shouldUseMockData()) {
    // Mock 模式：從 MOCK_USERS 取得 locked 狀態
    return new Set(
      MOCK_USERS.filter((u) => u.locked).map((u) => u.id)
    )
  }
  // 真實 API 模式：目前 User 模型沒有 locked 欄位
  // 如果需要，應該從 UserListResp 或 UserProfile 取得
  // 暫時返回空集合，等待後端 API 支援
  return new Set<string>()
}

/**
 * 取得使用者的加入時間（處理 Mock 和真實 API 的差異）
 * @param user 使用者物件
 * @returns 加入時間字串（ISO 格式）或 undefined
 */
export function getUserJoinedAt(user: User): string | undefined {
  if (shouldUseMockData()) {
    const mockUser = MOCK_USERS.find((u) => u.id === user.id)
    return mockUser?.joinedAt
  }
  return user.joined_day
}