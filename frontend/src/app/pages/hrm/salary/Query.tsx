// src/app/pages/hrm/salary/Query.tsx
import { http } from '@/shared/api/http'
import type { AlertFn } from '@/app/pages/common/AlertType'
import { shouldUseMockDataWithTemp } from '@/shared/utils/useMockData'
import { ApiError } from '@/app/pages/common/ApiError'

import { ApiResponse } from '../../model/ApiResponse'
import { PageResult } from '../../model/PageResult'

import type {
  CreateSalaryFormulaReq,
  SalaryDetail,
  SalaryFormulaListItem,
  UpdateSalaryFormulaReq,
} from './Model'
import { MOCK_SALARY_FORMULAS } from './list/mockSalaryFormulas'

const API_PREFIX = '/api/hrm/salary-formulas'

export async function createSalaryFormula(
  req: CreateSalaryFormulaReq,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬創建薪資計算公式', req)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('薪資計算公式建立成功 (Mock)', 'success')
    return true
  }

  try {
    await http.post(API_PREFIX, req)
    showAlert?.('薪資計算公式建立成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('建立薪資計算公式失敗，請稍後再試', 'danger')
    return false
  }
}

export async function fetchSalaryFormulas(
  query: any,
  showAlert?: (msg: string, type: any) => void,
): Promise<PageResult<SalaryFormulaListItem>> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 薪資計算公式列表', query)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return Promise.resolve({
      content: MOCK_SALARY_FORMULAS,
      totalElements: MOCK_SALARY_FORMULAS.length,
      totalPages: 1,
      size: query.size ?? 10,
      number: query.page ?? 0,
      first: (query.page ?? 0) === 0,
      last: true,
      empty: MOCK_SALARY_FORMULAS.length === 0,
    })
  }

  try {
    const res = await http.get<ApiResponse<PageResult<SalaryFormulaListItem>>>(
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
    
    const apiError = ApiError.fromAxiosError(e)
    if (apiError.isServerError) {
      throw apiError
    }

    showAlert?.('取得薪資計算公式列表失敗，請稍後再試', 'danger')
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

export async function fetchSalaryFormulaDetail(
  formulaId: string,
  showAlert?: AlertFn,
): Promise<SalaryDetail | null> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 薪資計算公式詳情', formulaId)
    await new Promise(resolve => setTimeout(resolve, 300))
    const formula = MOCK_SALARY_FORMULAS.find(f => f.id === formulaId)
    return formula ? { ...formula, notes: '', calculations: [] } : null
  }

  try {
    const res = await http.get<ApiResponse<SalaryDetail>>(
      `${API_PREFIX}/${formulaId}`,
    )
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('取得薪資計算公式詳情失敗，請稍後再試', 'danger')
    return null
  }
}

export async function updateSalaryFormula(
  id: string,
  payload: UpdateSalaryFormulaReq,
  showAlert?: AlertFn
): Promise<SalaryFormulaListItem | null> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬更新薪資計算公式', id, payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('更新薪資計算公式成功 (Mock)', 'success')
    const mockFormula = MOCK_SALARY_FORMULAS.find(f => f.id === id)
    return mockFormula as SalaryFormulaListItem | null
  }

  try {
    const res = await http.put<ApiResponse<SalaryFormulaListItem>>(
      `${API_PREFIX}/${id}`, 
      payload
    )
    showAlert?.('更新薪資計算公式成功', 'success')
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('更新薪資計算公式失敗，請稍後再試', 'danger')
    throw e
  }
}

export async function deleteSalaryFormula(
  id: string,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬刪除薪資計算公式', id)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('刪除薪資計算公式成功 (Mock)', 'success')
    return true
  }

  try {
    await http.delete<ApiResponse<null>>(
      `${API_PREFIX}/${id}`
    )
    showAlert?.('刪除薪資計算公式成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('刪除薪資計算公式失敗，請稍後再試', 'danger')
    return false
  }
}
