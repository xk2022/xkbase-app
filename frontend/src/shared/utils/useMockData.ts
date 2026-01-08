// src/shared/utils/useMockData.ts
/**
 * Mock 數據控制工具
 * 
 * 功能：
 * 1. 判斷當前用戶是否為 TEST 帳號
 * 2. 統一管理是否使用 Mock 數據的邏輯
 * 
 * 使用方式：
 * - 在各個 Query.ts 中，判斷 isMockMode() 來決定使用 Mock 或真實 API
 */

import { getAuth } from '@/app/modules/auth/core/AuthHelpers'

/**
 * TEST 帳號的帳號名稱列表（可擴展）
 * 當用戶的 account 或 username 匹配這些值時，將使用 Mock 數據
 * 離線模式：只允許 mock 帳號
 */
const TEST_ACCOUNTS = ['mock']

/**
 * 判斷當前登入用戶是否為 TEST 帳號
 * 
 * @returns {boolean} 如果是 TEST 帳號返回 true，否則返回 false
 */
export function isTestAccount(): boolean {
  const auth = getAuth()
  
  if (!auth) {
    return false
  }

  // 檢查 account 或 username 是否為 TEST 帳號
  const account = (auth.account || auth.username || '').toLowerCase()
  
  return TEST_ACCOUNTS.some(testAccount => account === testAccount.toLowerCase())
}

/**
 * 判斷是否應該使用 Mock 數據
 * 
 * 判斷邏輯：
 * 1. 如果當前用戶是 TEST 帳號，使用 Mock
 * 2. 如果環境變數 VITE_USE_MOCK 為 'true'，強制使用 Mock（開發用）
 * 3. 否則使用真實 API
 * 
 * @returns {boolean} 如果應該使用 Mock 數據返回 true，否則返回 false
 */
export function shouldUseMockData(): boolean {
  // 優先檢查環境變數（開發環境強制 Mock）
  const envMock = import.meta.env.VITE_USE_MOCK === 'true'
  if (envMock) {
    console.log('[Mock] 使用 Mock 數據（環境變數強制）')
    return true
  }

  // 檢查是否為 TEST 帳號
  const isTest = isTestAccount()
  if (isTest) {
    console.log('[Mock] 使用 Mock 數據（TEST 帳號）')
    return true
  }

  return false
}

/**
 * 獲取當前 Mock 模式狀態（用於調試）
 * 
 * @returns {object} Mock 模式資訊
 */
export function getMockModeInfo() {
  const auth = getAuth()
  const account = auth?.account || auth?.username || '未登入'
  const isTest = isTestAccount()
  const shouldMock = shouldUseMockData()

  return {
    account,
    isTestAccount: isTest,
    shouldUseMock: shouldMock,
    envMock: import.meta.env.VITE_USE_MOCK === 'true',
  }
}

/**
 * 臨時啟用 Mock 數據的標誌（用於 API 錯誤時用戶選擇使用 Mock）
 * 這個標誌存儲在 sessionStorage 中，只在當前會話有效
 */
const TEMP_MOCK_FLAG = 'TEMP_USE_MOCK_DATA'

/**
 * 臨時啟用 Mock 數據
 * 當 API 發生錯誤時，用戶可以選擇使用 Mock 數據來查看頁面
 */
export function enableTempMockData() {
  sessionStorage.setItem(TEMP_MOCK_FLAG, 'true')
  console.log('[Mock] 臨時啟用 Mock 數據（用戶選擇）')
}

/**
 * 清除臨時 Mock 數據標誌
 */
export function clearTempMockData() {
  sessionStorage.removeItem(TEMP_MOCK_FLAG)
}

/**
 * 檢查是否應該使用 Mock 數據（包含臨時啟用）
 * 
 * @returns {boolean} 如果應該使用 Mock 數據返回 true
 */
export function shouldUseMockDataWithTemp(): boolean {
  // 檢查臨時啟用標誌
  const tempMock = sessionStorage.getItem(TEMP_MOCK_FLAG) === 'true'
  if (tempMock) {
    return true
  }

  // 否則使用原有邏輯
  return shouldUseMockData()
}
