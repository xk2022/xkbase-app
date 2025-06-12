import { UserModel } from "./_models"

export const tryDevLogin = (
  account: string,
  password: string
): UserModel | null => {
  const isDev = import.meta.env.MODE === 'development'
  if (!isDev) return null

  if (account === 'test' && password === '1234') {
    return {
      uuid: 'test-uuid',
      username: '測試用戶',
      email: 'test@example.com',
      cellPhone: '0912345678',
      roleUuid: 'role-dev',
      enabled: true,
      locked: false,
      token: 'mock-token-test',
      systemDTOs: [
        {
          systemUuid: 'sys-1',
          name: 'Mock 系統 A',
          permissionDTOS: [
            {
              id: 1,
              name: 'VIEW_DASHBOARD',
              active: true,
              actions: [{ id: 101, name: 'read', active: true }]
            },
            {
              id: 2,
              name: 'EDIT_USER',
              active: false,
              actions: []
            }
          ]
        }, 
        {
          systemUuid: 'sys-2',
          name: 'Mock 系統 B',
          permissionDTOS: [
            
          ]
        }
      ]
    }
  }

  return null
}
