// src/app/pages/upms/system/mockSystems.tsx
/**
 * UPMS System Mock 數據
 * 用於開發和測試環境
 */

import type { System } from './Model'

/**
 * Mock 系統列表數據
 */
export const MOCK_SYSTEMS: System[] = [
  {
    id: '1',
    code: 'UPMS',
    name: '統一權限管理系統',
    enabled: true,
    remark: '使用者、角色、權限、系統管理',
    createdTime: '2024-01-01T00:00:00+08:00',
    updatedTime: '2025-01-08T10:00:00+08:00',
  },
  {
    id: '2',
    code: 'TOM',
    name: '訂單管理系統',
    enabled: true,
    remark: '訂單、容器、運輸任務管理',
    createdTime: '2024-01-15T00:00:00+08:00',
    updatedTime: '2025-01-08T11:00:00+08:00',
  },
  {
    id: '3',
    code: 'FMS',
    name: '車隊管理系統',
    enabled: true,
    remark: '車輛、司機、維修保養管理',
    createdTime: '2024-02-01T00:00:00+08:00',
    updatedTime: '2025-01-08T12:00:00+08:00',
  },
  {
    id: '4',
    code: 'ADM',
    name: '系統設定',
    enabled: true,
    remark: '字典、系統配置管理',
    createdTime: '2024-01-01T00:00:00+08:00',
    updatedTime: '2025-01-08T13:00:00+08:00',
  },
  {
    id: '5',
    code: 'CRM',
    name: '客戶關係管理',
    enabled: true,
    remark: '客戶、聯絡人、商機管理',
    createdTime: '2024-03-01T00:00:00+08:00',
    updatedTime: '2025-01-08T14:00:00+08:00',
  },
  {
    id: '6',
    code: 'HRM',
    name: '人力資源管理',
    enabled: true,
    remark: '員工、薪資、排班管理',
    createdTime: '2024-04-01T00:00:00+08:00',
    updatedTime: '2025-01-08T15:00:00+08:00',
  },
  {
    id: '7',
    code: 'PORT',
    name: '港口管理系統',
    enabled: true,
    remark: '港口資訊、船期管理',
    createdTime: '2024-05-01T00:00:00+08:00',
    updatedTime: '2025-01-09T10:00:00+08:00',
  },
  {
    id: '8',
    code: 'LEGACY',
    name: '舊版系統',
    enabled: false,
    remark: '舊版系統（已停用，僅供參考）',
    createdTime: '2023-01-01T00:00:00+08:00',
    updatedTime: '2024-06-01T00:00:00+08:00',
  },
]

/**
 * 生成新的 Mock System ID（用於創建）
 */
let mockSystemIdCounter = 100

export function generateMockSystemId(): string {
  return String(mockSystemIdCounter++)
}
