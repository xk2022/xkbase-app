import { UserModel } from "./_models"

/**
 * 離線模式登入
 * 只允許 mock / 1234 登入
 * 移除開發環境限制，支持離線使用
 */
export const tryDevLogin = (
  account: string,
  password: string
): UserModel | null => {
  // 只允許 mock / 1234 登入
  if (account === 'mock' && password === '1234') {
    return {
      uuid: 'mock-uuid',
      account: 'mock', // ✅ 用於 Mock 數據判斷
      username: 'Mock 測試用戶',
      name: 'Mock 測試用戶',
      fullname: 'Mock 測試用戶',
      email: 'mock@example.com',
      cellPhone: '0912345678',
      roleUuid: 'role-mock',
      enabled: true,
      locked: false,
      token: 'mock-token-offline',
      systemDTOs: [
        {
          systemUuid: 'sys-1',
          name: 'TOM 運輸訂單管理',
          permissionDTOS: [
            {
              id: 1,
              name: 'VIEW_DASHBOARD',
              active: true,
              actions: [{ id: 101, name: 'read', active: true }]
            },
            {
              id: 2,
              name: 'VIEW_ORDER',
              active: true,
              actions: [{ id: 201, name: 'read', active: true }]
            },
            {
              id: 3,
              name: 'EDIT_ORDER',
              active: true,
              actions: [{ id: 301, name: 'write', active: true }]
            }
          ]
        },
        {
          systemUuid: 'sys-2',
          name: 'FMS 車隊管理',
          permissionDTOS: [
            {
              id: 4,
              name: 'VIEW_VEHICLE',
              active: true,
              actions: [{ id: 401, name: 'read', active: true }]
            },
            {
              id: 5,
              name: 'VIEW_DRIVER',
              active: true,
              actions: [{ id: 501, name: 'read', active: true }]
            }
          ]
        },
        {
          systemUuid: 'sys-3',
          name: 'UPMS 用戶權限管理',
          permissionDTOS: [
            {
              id: 6,
              name: 'VIEW_USER',
              active: true,
              actions: [{ id: 601, name: 'read', active: true }]
            },
            {
              id: 7,
              name: 'VIEW_ROLE',
              active: true,
              actions: [{ id: 701, name: 'read', active: true }]
            }
          ]
        },
        {
          systemUuid: 'sys-4',
          name: 'CRM 客戶關係管理',
          permissionDTOS: [
            {
              id: 8,
              name: 'VIEW_CUSTOMER',
              active: true,
              actions: [{ id: 801, name: 'read', active: true }]
            }
          ]
        },
        {
          systemUuid: 'sys-5',
          name: 'HRM 人力資源管理',
          permissionDTOS: [
            {
              id: 9,
              name: 'VIEW_SCHEDULE',
              active: true,
              actions: [{ id: 901, name: 'read', active: true }]
            },
            {
              id: 10,
              name: 'VIEW_SALARY',
              active: true,
              actions: [{ id: 1001, name: 'read', active: true }]
            }
          ]
        },
        {
          systemUuid: 'sys-6',
          name: 'ADM 系統管理',
          permissionDTOS: [
            {
              id: 11,
              name: 'VIEW_DICTIONARY',
              active: true,
              actions: [{ id: 1101, name: 'read', active: true }]
            }
          ]
        },
        {
          systemUuid: '7', // 對應 mockSystems.tsx 中 PORT 系統的 id
          name: 'PORT 港口管理',
          permissionDTOS: [
            {
              id: 12,
              name: 'port.read',
              active: true,
              actions: [{ id: 1201, name: 'read', active: true }]
            },
            {
              id: 13,
              name: 'port.create',
              active: true,
              actions: [{ id: 1301, name: 'write', active: true }]
            }
          ]
        }
      ]
    }
  }

  return null
}
