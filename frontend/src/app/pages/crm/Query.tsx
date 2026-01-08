// src/app/pages/crm/Query.tsx
import { http } from '@/shared/api/http'
import type { AlertFn } from '@/app/pages/common/AlertType'
import { shouldUseMockDataWithTemp } from '@/shared/utils/useMockData'
import { ApiError } from '@/app/pages/common/ApiError'

import { ApiResponse } from '@/app/pages/model/ApiResponse'
import { PageResult } from '@/app/pages/model/PageResult'

import type {
  CustomerListItem,
  CustomerDetail,
  CreateCustomerReq,
  UpdateCustomerReq,
  ContractTemplateListItem,
  ContractTemplateDetail,
  CreateContractTemplateReq,
  UpdateContractTemplateReq,
  ContainerProgress,
  CreateBookingReq,
  BookingResult,
} from './Model'
import { MOCK_CUSTOMERS, MOCK_CUSTOMER_DETAIL_MAP } from './customer/list/mockCustomers'
import { MOCK_CONTRACTS, MOCK_CONTRACT_DETAIL_MAP } from './contract/list/mockContracts'
import { getMockContainerProgress } from './portal/mockContainerProgress'

/**
 * ===============================================================
 * CRM - API Queries
 * ===============================================================
 */

// ===============================================================
// 客戶管理 API
// ===============================================================

const CUSTOMER_API_PREFIX = '/api/crm/customers'
const CONTRACT_API_PREFIX = '/api/crm/contracts'
const PORTAL_API_PREFIX = '/api/crm/portal'

/**
 * 取得客戶列表
 */
export async function fetchCustomers(
  query: any,
  showAlert?: AlertFn,
): Promise<PageResult<CustomerListItem>> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 客戶列表', query)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let filteredCustomers = [...MOCK_CUSTOMERS]
    
    // 搜索过滤
    const keyword = query.keyword?.trim().toLowerCase()
    if (keyword) {
      filteredCustomers = filteredCustomers.filter(customer => 
        customer.companyName.toLowerCase().includes(keyword) ||
        customer.companyCode?.toLowerCase().includes(keyword) ||
        customer.taxId?.toLowerCase().includes(keyword) ||
        customer.primaryContact?.name.toLowerCase().includes(keyword) ||
        customer.phone?.toLowerCase().includes(keyword) ||
        customer.email?.toLowerCase().includes(keyword)
      )
    }
    
    // 分页处理
    const page = query.page ?? 0
    const size = query.size ?? 10
    const startIndex = page * size
    const endIndex = startIndex + size
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex)
    const totalElements = filteredCustomers.length
    const totalPages = Math.ceil(totalElements / size)

    return Promise.resolve({
      content: paginatedCustomers,
      totalElements,
      totalPages,
      size,
      number: page,
      first: page === 0,
      last: page >= totalPages - 1,
      empty: paginatedCustomers.length === 0,
    })
  }

  try {
    const res = await http.get<ApiResponse<PageResult<CustomerListItem>>>(
      CUSTOMER_API_PREFIX,
      { params: query },
    )

    return {
      ...res.data.data,
      content: res.data.data.content || [],
    }
  } catch (e) {
    console.error(e)
    
    const apiError = ApiError.fromAxiosError(e)
    if (apiError.isServerError) {
      throw apiError
    }

    showAlert?.('取得客戶列表失敗，請稍後再試', 'danger')

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

/**
 * 取得客戶詳情
 */
export async function fetchCustomerDetail(
  customerId: string,
  showAlert?: AlertFn,
): Promise<CustomerDetail | null> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 客戶詳情', customerId)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const detail = MOCK_CUSTOMER_DETAIL_MAP[customerId]
    if (detail) {
      return detail
    }
    
    // 如果找不到，返回一個默認的詳情
    const listItem = MOCK_CUSTOMERS.find(c => c.id === customerId)
    if (listItem) {
      return {
        ...listItem,
        website: `https://www.${listItem.companyCode?.toLowerCase() || 'company'}.com`,
        contacts: listItem.primaryContact ? [listItem.primaryContact] : [],
      }
    }
    
    return null
  }

  try {
    const res = await http.get<ApiResponse<CustomerDetail>>(
      `${CUSTOMER_API_PREFIX}/${customerId}`,
    )
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('取得客戶詳情失敗，請稍後再試', 'danger')
    return null
  }
}

/**
 * 建立客戶
 */
export async function createCustomer(
  req: CreateCustomerReq,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬建立客戶', req)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('客戶建立成功 (Mock)', 'success')
    return true
  }

  try {
    await http.post<ApiResponse<CustomerDetail>>(CUSTOMER_API_PREFIX, req)
    showAlert?.('客戶建立成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('建立客戶失敗，請稍後再試', 'danger')
    return false
  }
}

/**
 * 更新客戶
 */
export async function updateCustomer(
  id: string,
  req: UpdateCustomerReq,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬更新客戶', id, req)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('客戶更新成功 (Mock)', 'success')
    return true
  }

  try {
    await http.put<ApiResponse<CustomerDetail>>(
      `${CUSTOMER_API_PREFIX}/${id}`,
      req,
    )
    showAlert?.('客戶更新成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('更新客戶失敗，請稍後再試', 'danger')
    return false
  }
}

/**
 * 刪除客戶
 */
export async function deleteCustomer(
  id: string,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬刪除客戶', id)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('客戶刪除成功 (Mock)', 'success')
    return true
  }

  try {
    await http.delete<ApiResponse<null>>(`${CUSTOMER_API_PREFIX}/${id}`)
    showAlert?.('客戶刪除成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('刪除客戶失敗，請稍後再試', 'danger')
    return false
  }
}

// ===============================================================
// 合約模板 API
// ===============================================================

/**
 * 取得合約模板列表
 */
export async function fetchContractTemplates(
  query: any,
  showAlert?: AlertFn,
): Promise<PageResult<ContractTemplateListItem>> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 合約模板列表', query)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let filteredContracts = [...MOCK_CONTRACTS]
    
    // 搜索过滤
    const keyword = query.keyword?.trim().toLowerCase()
    if (keyword) {
      filteredContracts = filteredContracts.filter(contract => 
        contract.name.toLowerCase().includes(keyword) ||
        contract.customerName?.toLowerCase().includes(keyword) ||
        contract.billingMode.toLowerCase().includes(keyword)
      )
    }
    
    // 分页处理
    const page = query.page ?? 0
    const size = query.size ?? 10
    const startIndex = page * size
    const endIndex = startIndex + size
    const paginatedContracts = filteredContracts.slice(startIndex, endIndex)
    const totalElements = filteredContracts.length
    const totalPages = Math.ceil(totalElements / size)

    return Promise.resolve({
      content: paginatedContracts,
      totalElements,
      totalPages,
      size,
      number: page,
      first: page === 0,
      last: page >= totalPages - 1,
      empty: paginatedContracts.length === 0,
    })
  }

  try {
    const res = await http.get<ApiResponse<PageResult<ContractTemplateListItem>>>(
      CONTRACT_API_PREFIX,
      { params: query },
    )

    return {
      ...res.data.data,
      content: res.data.data.content || [],
    }
  } catch (e) {
    console.error(e)
    
    const apiError = ApiError.fromAxiosError(e)
    if (apiError.isServerError) {
      throw apiError
    }

    showAlert?.('取得合約模板列表失敗，請稍後再試', 'danger')

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

/**
 * 取得合約模板詳情
 */
export async function fetchContractTemplateDetail(
  contractId: string,
  showAlert?: AlertFn,
): Promise<ContractTemplateDetail | null> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 合約模板詳情', contractId)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const detail = MOCK_CONTRACT_DETAIL_MAP[contractId]
    if (detail) {
      return detail
    }
    
    // 如果找不到，返回一個默認的詳情
    const listItem = MOCK_CONTRACTS.find(c => c.id === contractId)
    if (listItem) {
      return {
        ...listItem,
        clauses: [],
        billingRules: [
          {
            mode: listItem.billingMode,
            unitPrice: 1000,
            unit: '元/單位',
          },
        ],
      }
    }
    
    return null
  }

  try {
    const res = await http.get<ApiResponse<ContractTemplateDetail>>(
      `${CONTRACT_API_PREFIX}/${contractId}`,
    )
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('取得合約模板詳情失敗，請稍後再試', 'danger')
    return null
  }
}

/**
 * 建立合約模板
 */
export async function createContractTemplate(
  req: CreateContractTemplateReq,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬建立合約模板', req)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('合約模板建立成功 (Mock)', 'success')
    return true
  }

  try {
    await http.post<ApiResponse<ContractTemplateDetail>>(
      CONTRACT_API_PREFIX,
      req,
    )
    showAlert?.('合約模板建立成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('建立合約模板失敗，請稍後再試', 'danger')
    return false
  }
}

/**
 * 更新合約模板
 */
export async function updateContractTemplate(
  id: string,
  req: UpdateContractTemplateReq,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬更新合約模板', id, req)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('合約模板更新成功 (Mock)', 'success')
    return true
  }

  try {
    await http.put<ApiResponse<ContractTemplateDetail>>(
      `${CONTRACT_API_PREFIX}/${id}`,
      req,
    )
    showAlert?.('合約模板更新成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('更新合約模板失敗，請稍後再試', 'danger')
    return false
  }
}

/**
 * 刪除合約模板
 */
export async function deleteContractTemplate(
  id: string,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬刪除合約模板', id)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('合約模板刪除成功 (Mock)', 'success')
    return true
  }

  try {
    await http.delete<ApiResponse<null>>(`${CONTRACT_API_PREFIX}/${id}`)
    showAlert?.('合約模板刪除成功', 'success')
    return true
  } catch (e) {
    console.error(e)
    showAlert?.('刪除合約模板失敗，請稍後再試', 'danger')
    return false
  }
}

// ===============================================================
// 客戶入口 API
// ===============================================================

/**
 * 查詢貨櫃進度
 */
export async function fetchContainerProgress(
  containerNo: string,
  showAlert?: AlertFn,
): Promise<ContainerProgress | null> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 貨櫃進度', containerNo)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const progress = getMockContainerProgress(containerNo)
    return progress
  }

  try {
    const res = await http.get<ApiResponse<ContainerProgress>>(
      `${PORTAL_API_PREFIX}/containers/${containerNo}/progress`,
    )
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('查詢貨櫃進度失敗，請稍後再試', 'danger')
    return null
  }
}

/**
 * 建立線上提單
 */
export async function createBooking(
  req: CreateBookingReq,
  showAlert?: AlertFn,
): Promise<BookingResult | null> {
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 模擬建立線上提單', req)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('提單建立成功 (Mock)', 'success')
    return {
      bookingNo: `BK-${Date.now()}`,
      orderNo: `ORD-${Date.now()}`,
      status: 'pending',
      message: '提單已建立，等待處理',
    }
  }

  try {
    const res = await http.post<ApiResponse<BookingResult>>(
      `${PORTAL_API_PREFIX}/bookings`,
      req,
    )
    showAlert?.('提單建立成功', 'success')
    return res.data.data
  } catch (e) {
    console.error(e)
    showAlert?.('建立提單失敗，請稍後再試', 'danger')
    return null
  }
}
