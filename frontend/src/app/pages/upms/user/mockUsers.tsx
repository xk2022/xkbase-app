// src/app/pages/upms/user/mockUsers.tsx
/**
 * UPMS User Mock 數據
 * 用於開發和測試環境
 */

import type { User, UserListResp, UserProfile } from './Model'

/**
 * Mock 使用者列表數據
 */
export const MOCK_USERS: UserListResp[] = [
  {
    id: '1',
    username: 'admin',
    name: '系統管理員',
    avatarUrl: 'media/avatars/300-1.jpg',
    email: 'admin@example.com',
    position: '系統管理員',
    roleCodes: ['ADMIN', 'UPMS_ADMIN'],
    enabled: true,
    locked: false,
    twoStepsEnabled: false,
    lastLoginAt: '2025-01-09T10:30:00+08:00',
    joinedAt: '2024-01-01T00:00:00+08:00',
  },
  {
    id: '2',
    username: 'manager',
    name: '王經理',
    avatarUrl: 'media/avatars/300-2.jpg',
    email: 'manager@example.com',
    position: '營運經理',
    roleCodes: ['MANAGER', 'TOM_ADMIN'],
    enabled: true,
    locked: false,
    twoStepsEnabled: false,
    lastLoginAt: '2025-01-09T09:15:00+08:00',
    joinedAt: '2024-03-15T00:00:00+08:00',
  },
  {
    id: '3',
    username: 'operator',
    name: '李操作員',
    avatarUrl: 'media/avatars/300-3.jpg',
    email: 'operator@example.com',
    position: '操作員',
    roleCodes: ['OPERATOR'],
    enabled: true,
    locked: false,
    twoStepsEnabled: false,
    lastLoginAt: '2025-01-08T16:45:00+08:00',
    joinedAt: '2024-06-01T00:00:00+08:00',
  },
  {
    id: '4',
    username: 'driver01',
    name: '張司機',
    avatarUrl: 'media/avatars/300-4.jpg',
    email: 'driver01@example.com',
    position: '司機',
    roleCodes: ['DRIVER'],
    enabled: true,
    locked: false,
    twoStepsEnabled: false,
    lastLoginAt: '2025-01-09T08:00:00+08:00',
    joinedAt: '2024-07-10T00:00:00+08:00',
  },
  {
    id: '5',
    username: 'viewer',
    name: '陳查看者',
    avatarUrl: 'media/avatars/300-5.jpg',
    email: 'viewer@example.com',
    position: '查看者',
    roleCodes: ['VIEWER'],
    enabled: true,
    locked: false,
    twoStepsEnabled: false,
    lastLoginAt: '2025-01-07T14:20:00+08:00',
    joinedAt: '2024-08-20T00:00:00+08:00',
  },
  {
    id: '6',
    username: 'disabled_user',
    name: '已停用使用者',
    avatarUrl: 'media/avatars/300-6.jpg',
    email: 'disabled@example.com',
    position: '前員工',
    roleCodes: ['OPERATOR'],
    enabled: false,
    locked: false,
    twoStepsEnabled: false,
    lastLoginAt: '2024-12-01T10:00:00+08:00',
    joinedAt: '2024-01-15T00:00:00+08:00',
  },
  {
    id: '7',
    username: 'locked_user',
    name: '已鎖定使用者',
    avatarUrl: 'media/avatars/300-7.jpg',
    email: 'locked@example.com',
    position: '測試帳號',
    roleCodes: ['OPERATOR'],
    enabled: true,
    locked: true,
    twoStepsEnabled: false,
    lastLoginAt: '2025-01-05T11:30:00+08:00',
    joinedAt: '2024-09-01T00:00:00+08:00',
  },
  {
    id: '8',
    username: 'test',
    name: '測試帳號',
    avatarUrl: 'media/avatars/300-8.jpg',
    email: 'test@example.com',
    position: '測試人員',
    roleCodes: ['ADMIN', 'UPMS_ADMIN', 'TOM_ADMIN'],
    enabled: true,
    locked: false,
    twoStepsEnabled: false,
    lastLoginAt: '2025-01-09T12:00:00+08:00',
    joinedAt: '2024-01-01T00:00:00+08:00',
  },
]

/**
 * Mock 使用者詳情數據 Map
 */
export const MOCK_USER_PROFILES: Record<string, UserProfile> = {
  '1': {
    id: '1',
    username: 'admin',
    enabled: true,
    locked: false,
    profile: {
      name: '系統管理員',
      nickName: 'Admin',
      email: 'admin@example.com',
      phone: '0912-345-678',
      avatarUrl: 'media/avatars/300-1.jpg',
    },
    roles: [
      { code: 'ADMIN', name: '系統管理員' },
      { code: 'UPMS_ADMIN', name: 'UPMS 管理員' },
    ],
    permissions: [
      'UPMS_USER_VIEW',
      'UPMS_USER_CREATE',
      'UPMS_USER_UPDATE',
      'UPMS_USER_DELETE',
      'UPMS_ROLE_VIEW',
      'UPMS_ROLE_CREATE',
      'UPMS_ROLE_UPDATE',
      'UPMS_ROLE_DELETE',
    ],
    loginHistory: [
      { time: '2025-01-09T10:30:00+08:00', ip: '192.168.1.100', device: 'Chrome on Windows' },
      { time: '2025-01-08T09:15:00+08:00', ip: '192.168.1.100', device: 'Chrome on Windows' },
      { time: '2025-01-07T14:20:00+08:00', ip: '192.168.1.101', device: 'Safari on macOS' },
    ],
  },
  '2': {
    id: '2',
    username: 'manager',
    enabled: true,
    locked: false,
    profile: {
      name: '王經理',
      nickName: 'Manager Wang',
      email: 'manager@example.com',
      phone: '0923-456-789',
      avatarUrl: 'media/avatars/300-2.jpg',
    },
    roles: [
      { code: 'MANAGER', name: '營運經理' },
      { code: 'TOM_ADMIN', name: 'TOM 管理員' },
    ],
    permissions: [
      'TOM_ORDER_VIEW',
      'TOM_ORDER_CREATE',
      'TOM_ORDER_UPDATE',
      'TOM_ORDER_ASSIGN',
    ],
    loginHistory: [
      { time: '2025-01-09T09:15:00+08:00', ip: '192.168.1.102', device: 'Firefox on Windows' },
      { time: '2025-01-08T08:30:00+08:00', ip: '192.168.1.102', device: 'Firefox on Windows' },
    ],
  },
  '3': {
    id: '3',
    username: 'operator',
    enabled: true,
    locked: false,
    profile: {
      name: '李操作員',
      nickName: 'Operator Li',
      email: 'operator@example.com',
      phone: '0934-567-890',
      avatarUrl: 'media/avatars/300-3.jpg',
    },
    roles: [{ code: 'OPERATOR', name: '操作員' }],
    permissions: ['TOM_ORDER_VIEW', 'TOM_ORDER_UPDATE'],
    loginHistory: [
      { time: '2025-01-08T16:45:00+08:00', ip: '192.168.1.103', device: 'Chrome on Android' },
    ],
  },
  '4': {
    id: '4',
    username: 'driver01',
    enabled: true,
    locked: false,
    profile: {
      name: '張司機',
      nickName: 'Driver Zhang',
      email: 'driver01@example.com',
      phone: '0945-678-901',
      avatarUrl: 'media/avatars/300-4.jpg',
    },
    roles: [{ code: 'DRIVER', name: '司機' }],
    permissions: ['TOM_ORDER_VIEW', 'FMS_VEHICLE_VIEW'],
    loginHistory: [
      { time: '2025-01-09T08:00:00+08:00', ip: '192.168.1.104', device: 'Mobile App' },
    ],
  },
  '5': {
    id: '5',
    username: 'viewer',
    enabled: true,
    locked: false,
    profile: {
      name: '陳查看者',
      nickName: 'Viewer Chen',
      email: 'viewer@example.com',
      phone: '0956-789-012',
      avatarUrl: 'media/avatars/300-5.jpg',
    },
    roles: [{ code: 'VIEWER', name: '查看者' }],
    permissions: ['TOM_ORDER_VIEW'],
    loginHistory: [
      { time: '2025-01-07T14:20:00+08:00', ip: '192.168.1.105', device: 'Edge on Windows' },
    ],
  },
  '6': {
    id: '6',
    username: 'disabled_user',
    enabled: false,
    locked: false,
    profile: {
      name: '已停用使用者',
      nickName: 'Disabled User',
      email: 'disabled@example.com',
      phone: '0967-890-123',
      avatarUrl: 'media/avatars/300-6.jpg',
    },
    roles: [{ code: 'OPERATOR', name: '操作員' }],
    permissions: [],
    loginHistory: [
      { time: '2024-12-01T10:00:00+08:00', ip: '192.168.1.106', device: 'Chrome on Windows' },
    ],
  },
  '7': {
    id: '7',
    username: 'locked_user',
    enabled: true,
    locked: true,
    profile: {
      name: '已鎖定使用者',
      nickName: 'Locked User',
      email: 'locked@example.com',
      phone: '0978-901-234',
      avatarUrl: 'media/avatars/300-7.jpg',
    },
    roles: [{ code: 'OPERATOR', name: '操作員' }],
    permissions: [],
    loginHistory: [
      { time: '2025-01-05T11:30:00+08:00', ip: '192.168.1.107', device: 'Safari on iOS' },
    ],
  },
  '8': {
    id: '8',
    username: 'test',
    enabled: true,
    locked: false,
    profile: {
      name: '測試帳號',
      nickName: 'Test Account',
      email: 'test@example.com',
      phone: '0989-012-345',
      avatarUrl: 'media/avatars/300-8.jpg',
    },
    roles: [
      { code: 'ADMIN', name: '系統管理員' },
      { code: 'UPMS_ADMIN', name: 'UPMS 管理員' },
      { code: 'TOM_ADMIN', name: 'TOM 管理員' },
    ],
    permissions: [
      'UPMS_USER_VIEW',
      'UPMS_USER_CREATE',
      'UPMS_USER_UPDATE',
      'UPMS_USER_DELETE',
      'TOM_ORDER_VIEW',
      'TOM_ORDER_CREATE',
      'TOM_ORDER_UPDATE',
      'TOM_ORDER_DELETE',
    ],
    loginHistory: [
      { time: '2025-01-09T12:00:00+08:00', ip: '192.168.1.108', device: 'Chrome on macOS' },
      { time: '2025-01-08T11:00:00+08:00', ip: '192.168.1.108', device: 'Chrome on macOS' },
      { time: '2025-01-07T10:00:00+08:00', ip: '192.168.1.108', device: 'Safari on macOS' },
    ],
  },
}

/**
 * 生成新的 Mock User ID（用於創建）
 */
let mockUserIdCounter = 100

export function generateMockUserId(): string {
  return String(mockUserIdCounter++)
}
