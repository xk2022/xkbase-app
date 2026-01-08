// src/app/pages/adm/dictionary/Query.tsx
import { http } from '@/shared/api/http'
import { ApiResponse } from '../../model/ApiResponse'
import { AlertFn } from '@/app/pages/common/AlertType'
import {shouldUseMockDataWithTemp} from '@/shared/utils/useMockData'
import {
  CreateDictionaryItemReq,
  CreateDictionaryReq,
  Dictionary,
  DictionaryItem,
  DictionaryItemSortPatch,
  DictionaryQuery,
  UpdateDictionaryItemReq,
  UpdateDictionaryReq,
} from './Model'
import {MOCK_DICTIONARIES, MOCK_DICTIONARY_ITEMS, getDictionaryItemsByCategoryId} from './mockDictionaries'

/**
 * ===============================================================
 * ADM - Dictionary API（對齊後端 AdmDictController）
 * ===============================================================
 *
 * Base Path:
 * - /api/adm/dictionaries
 *
 * Category（Dictionary）：
 * - POST   /api/adm/dictionaries
 * - GET    /api/adm/dictionaries
 * - GET    /api/adm/dictionaries/category-code/{code}
 * - PATCH  /api/adm/dictionaries/{id}
 * - DELETE /api/adm/dictionaries/{id}
 *
 * Items：
 * - POST   /api/adm/dictionaries/{categoryId}/items
 * - GET    /api/adm/dictionaries/{categoryId}/items
 * - PATCH  /api/adm/dictionaries/items/{itemId}
 * - DELETE /api/adm/dictionaries/items/{itemId}
 * - PATCH  /api/adm/dictionaries/items/sort
 *
 * Notes:
 * - v1 MVP：分類列表採「一次取回全部 List」
 * - 失敗策略：
 *   - list：回空陣列，畫面不炸
 *   - create/update/delete：回 boolean 或 throw（依需求）
 * ===============================================================
 */

const API_PREFIX = '/api/adm/dictionaries'

// ------------------------------------------------------------
// Create - Dictionary(Category)
// POST /api/adm/dictionaries
// ------------------------------------------------------------
export async function createDictionary(
  payload: CreateDictionaryReq,
  showAlert?: AlertFn
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬建立字典分類', payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('新增字典分類成功 (Mock)', 'success')
    return true
  }

  try {
    await http.post<ApiResponse<Dictionary>>(API_PREFIX, payload)
    showAlert?.('新增字典分類成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('新增字典分類失敗，請稍後再試', 'danger')
    return false
  }
}

// ------------------------------------------------------------
// Read - Dictionary list (MVP: List)
// GET /api/adm/dictionaries
// ------------------------------------------------------------
export async function fetchDictionaries(
  query?: DictionaryQuery, // v1 可先忽略，預留 v2 keyword/enabled
  showAlert?: AlertFn
): Promise<Dictionary[]> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 字典分類列表', query)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let filtered = [...MOCK_DICTIONARIES]
    
    // 關鍵字篩選
    if (query?.keyword?.trim()) {
      const keyword = query.keyword.toLowerCase()
      filtered = filtered.filter(
        d =>
          d.code.toLowerCase().includes(keyword) ||
          d.name.toLowerCase().includes(keyword) ||
          d.remark?.toLowerCase().includes(keyword)
      )
    }
    
    // enabled 篩選
    if (query?.enabled !== undefined) {
      filtered = filtered.filter(d => d.enabled === query.enabled)
    }
    
    return filtered
  }

  try {
    // v1 後端是 List，不是 Page
    // 若你之後要支援 query，可在後端加參數，這裡直接 { params: query }
    const res = await http.get<ApiResponse<Dictionary[]>>(API_PREFIX, {
      params: query,
    })

    return res.data.data ?? []
  } catch (e) {
    console.error(e)
    showAlert?.('取得字典分類列表失敗，請稍後再試', 'danger')
    return []
  }
}

// ------------------------------------------------------------
// Read - Dictionary detail by code
// GET /api/adm/dictionaries/category-code/{code}
// ------------------------------------------------------------
export async function fetchDictionaryByCode(
  code: string,
  showAlert?: AlertFn
): Promise<Dictionary> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 字典分類（依代碼）', code)
    await new Promise(resolve => setTimeout(resolve, 300))
    const found = MOCK_DICTIONARIES.find(d => d.code === code)
    if (!found) {
      throw new Error(`字典分類不存在: ${code}`)
    }
    return found
  }

  try {
    const res = await http.get<ApiResponse<Dictionary>>(
      `${API_PREFIX}/category-code/${encodeURIComponent(code)}`
    )
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('取得字典分類失敗，請稍後再試', 'danger')
    throw e
  }
}

// ------------------------------------------------------------
// Update - Dictionary(Category)
// PATCH /api/adm/dictionaries/{id}
// ------------------------------------------------------------
export async function updateDictionary(
  id: string,
  payload: UpdateDictionaryReq,
  showAlert?: AlertFn
): Promise<Dictionary | null> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬更新字典分類', id, payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('更新字典分類成功 (Mock)', 'success')
    const found = MOCK_DICTIONARIES.find(d => d.id === id)
    return found || null
  }

  try {
    const res = await http.patch<ApiResponse<Dictionary>>(
      `${API_PREFIX}/${id}`,
      payload
    )
    showAlert?.('更新字典分類成功', 'success')
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('更新字典分類失敗，請稍後再試', 'danger')
    throw e
  }
}

// ------------------------------------------------------------
// Delete - Dictionary(Category)
// DELETE /api/adm/dictionaries/{id}
// ------------------------------------------------------------
export async function deleteDictionary(
  id: string,
  showAlert?: AlertFn
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬刪除字典分類', id)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('刪除字典分類成功 (Mock)', 'success')
    return true
  }

  try {
    await http.delete<ApiResponse<null>>(`${API_PREFIX}/${id}`)
    showAlert?.('刪除字典分類成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('刪除字典分類失敗，請稍後再試', 'danger')
    return false
  }
}

// ============================================================
// Dictionary Item APIs (對齊後端 /api/adm/dictionaries/...)
// ============================================================

// ------------------------------------------------------------
// Create - Dictionary Item
// POST /api/adm/dictionaries/{categoryId}/items
// ------------------------------------------------------------
export async function createDictionaryItem(
  categoryId: string,
  payload: CreateDictionaryItemReq,
  showAlert?: AlertFn
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬建立字典項目', categoryId, payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('新增字典項目成功 (Mock)', 'success')
    return true
  }

  try {
    await http.post<ApiResponse<DictionaryItem>>(
      `${API_PREFIX}/${categoryId}/items`,
      payload
    )
    showAlert?.('新增字典項目成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('新增字典項目失敗，請稍後再試', 'danger')
    return false
  }
}

// ------------------------------------------------------------
// Read - Dictionary Items by Category
// GET /api/adm/dictionaries/{categoryId}/items
// ------------------------------------------------------------
export async function fetchDictionaryItems(
  categoryId: string,
  showAlert?: AlertFn
): Promise<DictionaryItem[]> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 字典項目', categoryId)
    await new Promise(resolve => setTimeout(resolve, 300))
    return getDictionaryItemsByCategoryId(categoryId)
  }

  try {
    const res = await http.get<ApiResponse<DictionaryItem[]>>(
      `${API_PREFIX}/${categoryId}/items`
    )
    return res.data.data ?? []
  } catch (e) {
    console.error(e)
    showAlert?.('取得字典項目失敗，請稍後再試', 'danger')
    return []
  }
}

// ------------------------------------------------------------
// Update - Dictionary Item (Patch)
// PATCH /api/adm/dictionaries/items/{itemId}
// ------------------------------------------------------------
export async function updateDictionaryItem(
  itemId: string,
  payload: UpdateDictionaryItemReq,
  showAlert?: AlertFn
): Promise<DictionaryItem | null> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬更新字典項目', itemId, payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('更新字典項目成功 (Mock)', 'success')
    const found = MOCK_DICTIONARY_ITEMS.find(item => item.id === itemId)
    return found || null
  }

  try {
    const res = await http.patch<ApiResponse<DictionaryItem>>(
      `${API_PREFIX}/items/${itemId}`,
      payload
    )
    showAlert?.('更新字典項目成功', 'success')
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('更新字典項目失敗，請稍後再試', 'danger')
    throw e
  }
}

// ------------------------------------------------------------
// Delete - Dictionary Item
// DELETE /api/adm/dictionaries/items/{itemId}
// ------------------------------------------------------------
export async function deleteDictionaryItem(
  itemId: string,
  showAlert?: AlertFn
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬刪除字典項目', itemId)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('刪除字典項目成功 (Mock)', 'success')
    return true
  }

  try {
    await http.delete<ApiResponse<null>>(`${API_PREFIX}/items/${itemId}`)
    showAlert?.('刪除字典項目成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('刪除字典項目失敗，請稍後再試', 'danger')
    return false
  }
}

// ------------------------------------------------------------
// Batch Sort - Dictionary Items
// PATCH /api/adm/dictionaries/items/sort
//
// body:
// {
//   categoryId: "...",
//   orders: [{ id: "...", sortOrder: 1 }, ...]
// }
// ------------------------------------------------------------
export async function updateDictionaryItemSort(
  categoryId: string,
  orders: DictionaryItemSortPatch[],
  showAlert?: AlertFn
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬更新字典項目排序', categoryId, orders)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('更新排序成功 (Mock)', 'success')
    return true
  }

  try {
    await http.patch<ApiResponse<null>>(`${API_PREFIX}/items/sort`, {
      categoryId,
      orders,
    })
    showAlert?.('更新排序成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('更新排序失敗，請稍後再試', 'danger')
    return false
  }
}

/**
 * Copy Dictionary Category + Items
 * POST /api/adm/dictionaries/{oldCategoryId}/copy
 * body: { newCode }
 * return: Dictionary (new category)
 */
export async function copyDictionary(
  oldCategoryId: string,
  newCode: string,
  showAlert?: AlertFn
): Promise<Dictionary | null> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬複製字典分類', oldCategoryId, newCode)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('複製字典分類成功 (Mock)', 'success')
    const found = MOCK_DICTIONARIES.find(d => d.id === oldCategoryId)
    return found ? { ...found, id: `dict-${Date.now()}`, code: newCode } : null
  }

  try {
    const res = await http.post<ApiResponse<Dictionary>>(
      `${API_PREFIX}/${oldCategoryId}/copy`,
      {newCode}
    )
    showAlert?.('複製字典分類成功', 'success')
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('複製字典分類失敗，請稍後再試', 'danger')
    return null
  }
}