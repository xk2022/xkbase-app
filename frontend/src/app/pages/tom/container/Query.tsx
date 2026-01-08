// src/app/pages/tom/container/Query.ts
import { http } from '@/shared/api/http';
import { AlertFn } from '@/app/pages/common/AlertType';
import { shouldUseMockDataWithTemp } from '@/shared/utils/useMockData';
import { PageResult } from '../../model/PageResult';
import type { Container, CreateContainerReq } from './Model'
import { MOCK_CONTAINERS } from './__mock__/mockContainers'

const API_PREFIX = '/api/tom/container'
// ------------------------------------------------------------
// Create 新增（給 CreatePage 用）
// ------------------------------------------------------------
export async function createContainer(
  req: CreateContainerReq,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬建立貨櫃', req)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('貨櫃建立成功 (Mock)', 'success')
    return true
  }

  try {
    await http.post(API_PREFIX, req)
    showAlert?.('貨櫃建立成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('建立貨櫃失敗，請稍後再試', 'danger')
    return false
  }
}

export async function fetchContainers(
  query: { page: number; size: number },
): Promise<PageResult<Container>> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 貨櫃列表', query)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const start = query.page * query.size
    const end = start + query.size
    const sliced = MOCK_CONTAINERS.slice(start, end)

    return Promise.resolve({
      content: sliced,
      totalElements: MOCK_CONTAINERS.length,
      totalPages: Math.ceil(MOCK_CONTAINERS.length / query.size),
      size: query.size,
      number: query.page,
      first: query.page === 0,
      last: end >= MOCK_CONTAINERS.length,
      empty: sliced.length === 0,
    })
  }

  try {
    const res = await http.get<PageResult<Container>>(API_PREFIX, {
      params: query,
    })
    return res.data
  } catch (e) {
    console.error(e)
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
