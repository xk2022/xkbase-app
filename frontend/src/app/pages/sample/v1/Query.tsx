// src/app/pages/sample/v1/Query.tsx
import { http } from '@/shared/api/http'
import { ApiResponse } from '../../model/ApiResponse'
import { PageQuery } from '../../model/PageQuery'
import { PageResult } from '../../model/PageResult'
import {
  CreateSampleReq,
  mapSampleListRespToSample,
  UpdateSampleReq,
  Sample,
  SampleListResp,
  SampleDetail,
} from './Model'
import { AlertFn } from '@/app/pages/common/AlertType'
import { shouldUseMockData } from '@/shared/utils/useMockData'

const API_PREFIX = '/api/sample/v1'

// ========= Sample API 定義 =========

// ------------------------------------------------------------
// Create 新增
// ------------------------------------------------------------
export async function createSample(
  payload: CreateSampleReq,
  showAlert?: AlertFn
): Promise<boolean> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬創建 Sample', payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('建立 Sample 成功 (Mock)', 'success')
    return true
  }

  // 真實 API
  try {
    await http.post<ApiResponse<Sample>>(API_PREFIX, payload)
    showAlert?.('建立 Sample 成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('建立 Sample 失敗，請稍後再試', 'danger')
    return false
  }
}

// ------------------------------------------------------------
// Read - 取得列表
// ------------------------------------------------------------
export async function fetchSamples(
  query: PageQuery,
  showAlert?: AlertFn
): Promise<PageResult<Sample>> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 使用 Mock Sample 列表', query)
    await new Promise(resolve => setTimeout(resolve, 300))

    // 模拟数据
    const mockSamples: SampleListResp[] = [
      {
        id: '1',
        title: 'Sample 1',
        description: 'This is sample 1',
        status: 'ACTIVE',
        enabled: true,
        createdAt: new Date().toISOString(),
        category: 'Type A',
        tags: ['tag1', 'tag2'],
      },
      {
        id: '2',
        title: 'Sample 2',
        description: 'This is sample 2',
        status: 'INACTIVE',
        enabled: false,
        createdAt: new Date().toISOString(),
        category: 'Type B',
        tags: ['tag2'],
      },
    ]

    // 關鍵字篩選
    let filtered = [...mockSamples]
    if (query.keyword?.trim()) {
      const keyword = query.keyword.toLowerCase()
      filtered = filtered.filter(
        s =>
          s.title.toLowerCase().includes(keyword) ||
          s.description?.toLowerCase().includes(keyword) ||
          s.category?.toLowerCase().includes(keyword)
      )
    }

    // 分頁處理
    const page = query.page || 0
    const size = query.size || 10
    const start = page * size
    const end = start + size
    const paginated = filtered.slice(start, end)

    const result: PageResult<Sample> = {
      content: paginated.map(mapSampleListRespToSample),
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
    const res = await http.get<ApiResponse<PageResult<SampleListResp>>>(
      API_PREFIX,
      { params: query }
    )

    const page = res.data.data

    return {
      ...page,
      content: (page.content || []).map(mapSampleListRespToSample),
    }
  } catch (e) {
    console.error(e)
    showAlert?.('取得 Sample 列表失敗，請稍後再試', 'danger')

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
// Update - 更新
// ------------------------------------------------------------
export async function updateSample(
  id: string,
  payload: UpdateSampleReq,
  showAlert?: AlertFn
): Promise<Sample | null> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬更新 Sample', id, payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('更新 Sample 成功 (Mock)', 'success')
    
    // 返回模拟数据
    return {
      id,
      title: payload.title || 'Updated Sample',
      description: payload.description,
      status: payload.status || 'ACTIVE',
      enabled: payload.enabled ?? true,
      category: payload.category,
      tags: payload.tags,
    }
  }

  // 真實 API
  try {
    const res = await http.put<ApiResponse<Sample>>(`${API_PREFIX}/${id}`, payload)
    showAlert?.('更新 Sample 成功', 'success')
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('更新 Sample 失敗，請稍後再試', 'danger')
    throw e
  }
}

// ------------------------------------------------------------
// Delete - 刪除
// ------------------------------------------------------------
export async function deleteSample(
  id: string,
  showAlert?: AlertFn
): Promise<boolean> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬刪除 Sample', id)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('刪除 Sample 成功 (Mock)', 'success')
    return true
  }

  // 真實 API
  try {
    await http.delete<ApiResponse<null>>(`${API_PREFIX}/${id}`)
    showAlert?.('刪除 Sample 成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('刪除 Sample 失敗，請稍後再試', 'danger')
    return false
  }
}

// ------------------------------------------------------------
// Read - 取得詳情
// ------------------------------------------------------------
export async function fetchSampleDetail(
  id: string,
  showAlert?: AlertFn
): Promise<SampleDetail | null> {
  // Mock 模式
  if (shouldUseMockData()) {
    console.log('[Mock] 使用 Mock Sample 詳情', id)
    await new Promise(resolve => setTimeout(resolve, 300))

    return {
      id,
      title: 'Sample Detail',
      description: 'This is sample detail',
      status: 'ACTIVE',
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'Type A',
      tags: ['tag1', 'tag2'],
    }
  }

  // 真實 API
  try {
    const res = await http.get<ApiResponse<SampleDetail>>(`${API_PREFIX}/${id}/detail`)
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('取得 Sample 詳情失敗，請稍後再試', 'danger')
    return null
  }
}
