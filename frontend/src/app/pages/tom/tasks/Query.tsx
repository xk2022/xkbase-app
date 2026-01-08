// src/app/pages/tom/task/Query.ts
import type { AlertType } from '@/app/pages/common/AlertType'
import { shouldUseMockDataWithTemp } from '@/shared/utils/useMockData'
import { http } from '@/shared/api/http'
import { ApiResponse } from '../../model/ApiResponse'

import type { CreateTomTaskReq, TomTaskListItem } from './Model'
import { MOCK_TASKS } from './__mock__/mockTasks'
import { PageQuery } from '../../model/PageQuery'
import { PageResult } from '../../model/PageResult'

type AlertFn = (message: string, type: AlertType) => void

const includesKeyword = (t: TomTaskListItem, keyword: string) => {
  const s = [
    t.taskNo,
    t.subjectType,
    t.subjectNo ?? '',
    t.orderNo ?? '',
    t.containerNo ?? '',
    t.fromLocation,
    t.toLocation,
    t.driverName ?? '',
    t.vehicleNo ?? '',
    t.trailerNo ?? '',
    t.remark ?? '',
  ]
    .join(' ')
    .toLowerCase()

  return s.includes(keyword.toLowerCase())
}

export async function fetchTomTasks(
  query: PageQuery & { keyword?: string; subjectType?: string; status?: string },
  showAlert?: AlertFn,
): Promise<PageResult<TomTaskListItem>> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 任務列表', query)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const page = query.page ?? 0
    const size = query.size ?? 10
    const keyword = query.keyword?.trim() ?? ''
    const subjectType = query.subjectType?.trim() ?? ''
    const status = query.status?.trim() ?? ''

    let rows = [...MOCK_TASKS]

    if (keyword) rows = rows.filter((t) => includesKeyword(t, keyword))
    if (subjectType) rows = rows.filter((t) => t.subjectType === subjectType)
    if (status) rows = rows.filter((t) => t.status === status)

    const totalElements = rows.length
    const totalPages = Math.max(1, Math.ceil(totalElements / size))
    const start = page * size
    const content = rows.slice(start, start + size)

    return {
      content,
      totalElements,
      totalPages,
      size,
      number: page,
      first: page === 0,
      last: page >= totalPages - 1,
      empty: content.length === 0,
    }
  }

  try {
    const res = await http.get<ApiResponse<PageResult<TomTaskListItem>>>(
      '/api/tom/tasks',
      { params: query }
    )
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('取得任務列表失敗，請稍後再試', 'danger')
    return {
      content: [],
      totalElements: 0,
      totalPages: 1,
      size: query.size ?? 10,
      number: query.page ?? 0,
      first: true,
      last: true,
      empty: true,
    }
  }
}

/** 建立任務 */
export async function createTomTask(
  req: CreateTomTaskReq,
  showAlert?: AlertFn,
): Promise<TomTaskListItem> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬建立任務', req)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const id = `t-${String(Math.floor(Math.random() * 900000) + 100000)}`
    const taskNo = `TASK-2026-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`

    const created: TomTaskListItem = {
      id,
      taskNo,
      subjectType: req.subjectType,
      subjectId: req.subjectId,
      subjectNo: req.subjectNo,

      orderId: req.orderId,
      orderNo: req.orderNo,
      containerId: req.containerId,
      containerNo: req.containerNo,

      fromLocation: req.fromLocation,
      toLocation: req.toLocation,
      plannedStartAt: req.plannedStartAt,

      status: req.status ?? 'UNASSIGNED',
      remark: req.remark,
      createdTime: new Date().toISOString(),
    }

    // mock push
    MOCK_TASKS.unshift(created)
    showAlert?.('任務建立成功 (Mock)', 'success')

    return created
  }

  try {
    const res = await http.post<ApiResponse<TomTaskListItem>>(
      '/api/tom/tasks',
      req
    )
    showAlert?.('任務建立成功', 'success')
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('建立任務失敗，請稍後再試', 'danger')
    throw e
  }
}

/** 取消任務 */
export async function cancelTomTask(id: string, showAlert?: AlertFn): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬取消任務', id)
    await new Promise(resolve => setTimeout(resolve, 500))
    const idx = MOCK_TASKS.findIndex((x) => x.id === id)
    if (idx >= 0) {
      MOCK_TASKS[idx] = { ...MOCK_TASKS[idx], status: 'CANCELLED' }
    }
    showAlert?.('任務取消成功 (Mock)', 'success')
    return true
  }

  try {
    await http.post<ApiResponse<void>>(`/api/tom/tasks/${id}/cancel`)
    showAlert?.('任務取消成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('取消任務失敗，請稍後再試', 'danger')
    return false
  }
}
