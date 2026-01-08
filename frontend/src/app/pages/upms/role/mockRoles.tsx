// src/app/pages/upms/role/mockRoles.tsx
/**
 * UPMS Role Mock 數據
 * 用於開發和測試環境
 */

import type { Role, RoleListResp } from './Model'

/**
 * Mock 角色列表數據
 */
export const MOCK_ROLES: RoleListResp[] = [
  {
    id: '1',
    code: 'ADMIN',
    name: '系統管理員',
    description: '擁有系統所有權限的管理員角色',
    enabled: true,
    permissionCodes: [
      'UPMS_USER_VIEW',
      'UPMS_USER_CREATE',
      'UPMS_USER_UPDATE',
      'UPMS_USER_DELETE',
      'UPMS_ROLE_VIEW',
      'UPMS_ROLE_CREATE',
      'UPMS_ROLE_UPDATE',
      'UPMS_ROLE_DELETE',
      'UPMS_PERMISSION_VIEW',
      'UPMS_PERMISSION_CREATE',
      'UPMS_PERMISSION_UPDATE',
      'UPMS_PERMISSION_DELETE',
      'TOM_ORDER_VIEW',
      'TOM_ORDER_CREATE',
      'TOM_ORDER_UPDATE',
      'TOM_ORDER_DELETE',
      'FMS_VEHICLE_VIEW',
      'FMS_VEHICLE_CREATE',
      'FMS_VEHICLE_UPDATE',
      'FMS_VEHICLE_DELETE',
    ],
    createdTime: '2024-01-01T00:00:00+08:00',
    updatedTime: '2024-01-01T00:00:00+08:00',
  },
  {
    id: '2',
    code: 'UPMS_ADMIN',
    name: 'UPMS 管理員',
    description: 'UPMS 模組的管理員，可管理使用者、角色和權限',
    enabled: true,
    permissionCodes: [
      'UPMS_USER_VIEW',
      'UPMS_USER_CREATE',
      'UPMS_USER_UPDATE',
      'UPMS_USER_DELETE',
      'UPMS_ROLE_VIEW',
      'UPMS_ROLE_CREATE',
      'UPMS_ROLE_UPDATE',
      'UPMS_ROLE_DELETE',
      'UPMS_PERMISSION_VIEW',
      'UPMS_PERMISSION_CREATE',
      'UPMS_PERMISSION_UPDATE',
      'UPMS_PERMISSION_DELETE',
    ],
    createdTime: '2024-01-15T10:00:00+08:00',
    updatedTime: '2024-01-15T10:00:00+08:00',
  },
  {
    id: '3',
    code: 'MANAGER',
    name: '營運經理',
    description: '負責日常營運管理的經理角色',
    enabled: true,
    permissionCodes: [
      'TOM_ORDER_VIEW',
      'TOM_ORDER_CREATE',
      'TOM_ORDER_UPDATE',
      'TOM_ORDER_ASSIGN',
      'FMS_VEHICLE_VIEW',
      'FMS_VEHICLE_UPDATE',
    ],
    createdTime: '2024-02-01T09:00:00+08:00',
    updatedTime: '2024-02-01T09:00:00+08:00',
  },
  {
    id: '4',
    code: 'OPERATOR',
    name: '操作員',
    description: '一般操作人員，可查看和更新訂單',
    enabled: true,
    permissionCodes: [
      'TOM_ORDER_VIEW',
      'TOM_ORDER_UPDATE',
      'FMS_VEHICLE_VIEW',
    ],
    createdTime: '2024-03-01T08:00:00+08:00',
    updatedTime: '2024-03-01T08:00:00+08:00',
  },
  {
    id: '5',
    code: 'DRIVER',
    name: '司機',
    description: '司機角色，可查看分配的訂單和車輛資訊',
    enabled: true,
    permissionCodes: [
      'TOM_ORDER_VIEW',
      'FMS_VEHICLE_VIEW',
    ],
    createdTime: '2024-04-01T07:00:00+08:00',
    updatedTime: '2024-04-01T07:00:00+08:00',
  },
  {
    id: '6',
    code: 'VIEWER',
    name: '查看者',
    description: '僅可查看資料的唯讀角色',
    enabled: true,
    permissionCodes: [
      'TOM_ORDER_VIEW',
      'FMS_VEHICLE_VIEW',
      'UPMS_USER_VIEW',
      'UPMS_ROLE_VIEW',
    ],
    createdTime: '2024-05-01T06:00:00+08:00',
    updatedTime: '2024-05-01T06:00:00+08:00',
  },
  {
    id: '7',
    code: 'TOM_ADMIN',
    name: 'TOM 管理員',
    description: 'TOM 模組的管理員，可管理訂單相關功能',
    enabled: true,
    permissionCodes: [
      'TOM_ORDER_VIEW',
      'TOM_ORDER_CREATE',
      'TOM_ORDER_UPDATE',
      'TOM_ORDER_DELETE',
      'TOM_ORDER_ASSIGN',
      'TOM_ORDER_REPORT',
    ],
    createdTime: '2024-06-01T05:00:00+08:00',
    updatedTime: '2024-06-01T05:00:00+08:00',
  },
  {
    id: '8',
    code: 'DISABLED_ROLE',
    name: '已停用角色',
    description: '已停用的測試角色',
    enabled: false,
    permissionCodes: [],
    createdTime: '2024-07-01T04:00:00+08:00',
    updatedTime: '2024-12-01T04:00:00+08:00',
  },
]

/**
 * Mock 角色詳情數據 Map
 */
export const MOCK_ROLE_DETAILS: Record<string, RoleListResp> = {
  '1': MOCK_ROLES[0],
  '2': MOCK_ROLES[1],
  '3': MOCK_ROLES[2],
  '4': MOCK_ROLES[3],
  '5': MOCK_ROLES[4],
  '6': MOCK_ROLES[5],
  '7': MOCK_ROLES[6],
  '8': MOCK_ROLES[7],
}

/**
 * 生成新的 Mock Role ID（用於創建）
 */
let mockRoleIdCounter = 100

export function generateMockRoleId(): string {
  return String(mockRoleIdCounter++)
}
