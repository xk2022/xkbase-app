// src/app/pages/upms/user/UserModel.tsx

export type UserStatus = 'ENABLED' | 'DISABLED'

/**
 * 後端 UserListResp 對應的 UI Model（列表一列的資料）
 */
export interface User {
  // 後端主鍵 & 基本資訊
  id: string            // 使用者唯一識別
  username: string        // 顯示名稱 / 帳號（依後端定義）
  enabled: boolean        // 是否啟用

  // 以下是前端畫面需要的欄位（for Metronic User list）
  name?: string
  avatar?: string
  email?: string
  position?: string
  role?: string
  last_login?: string
  two_steps?: boolean
  joined_day?: string
  online?: boolean
  initials?: {
    label: string
    state: string
  }
  roleCodes: string[]
}

// ➜ Login API 回傳的 User（含 token）
export interface LoginUser extends User {
  token: string        // 🔴 這個很重要，setupAxios 會用到
}

// 建立 / 更新用的 Profile payload
export interface UserProfileReq {
  name?: string
  nickName?: string
  email?: string
  phone?: string
  avatarUrl?: string
}


/** ===============================================================
 * Form Values (UI 專用)
 * =============================================================== */
export interface CreateUserFormValues {
  username: string
  password: string
  confirmPassword: string   // ❌ API 不需要
  roleCodes: string[]
  name?: string
  email?: string
  phone?: string
}

/** ===============================================================
 * API Request
 * =============================================================== */
export interface CreateUserReq {
  username: string
  password: string
  roleCodes: string[]
  name?: string
  email?: string
  phone?: string
}

export interface UpdateUserReq {
  username?: string
  enabled?: boolean
  roleCodes?: string[]
  profile?: UserProfileReq
}

// 跟後端 UserListResp 對應
export type UserListResp = {
  id: string
  username: string
  name: string | null
  avatarUrl?: string
  email?: string
  position?: string
  roleCodes: string[]
  enabled: boolean
  locked: boolean
  twoStepsEnabled?: boolean
  lastLoginAt?: string | null
  joinedAt?: string | null
}


// ------------------------------------------------------------
// Mapper
// ------------------------------------------------------------
// mapUserListRespToUser.tsx 還是在 UserModel.ts 也可以，之後想抽出 _mappers 再搬
export const mapUserListRespToUser = (dto: UserListResp): User => {
  const name = dto.name || dto.username

  const initialsLabel = name
    ? name
        .trim()
        .split(/\s+/)
        .map((p) => p[0]?.toUpperCase() ?? '')
        .join('')
        .slice(0, 2)
    : ''

  return {
    // 後端原始資訊
    id: dto.id,
    username: dto.username,
    enabled: dto.enabled,
    roleCodes: dto.roleCodes, // 之後若 API 回傳角色明細再補

    // UI 需要的欄位
    name,
    avatar: dto.avatarUrl,
    email: dto.email,
    position: dto.position,
    role: dto.roleCodes?.join(', ') ?? '',
    last_login: dto.lastLoginAt ?? '',
    joined_day: dto.joinedAt ?? '',
    two_steps: dto.twoStepsEnabled ?? false,
    online: false,
    initials: {
      label: initialsLabel,
      state: 'primary',
    },
  }
}

export interface UserProfile {
  id: string
  username: string
  enabled: boolean
  locked: boolean

  profile?: {
    name?: string
    nickName?: string
    email?: string
    phone?: string
    avatarUrl?: string
  }

  roles: {
    code: string
    name: string
  }[]

  permissions: string[]

  loginHistory?: {
    time: string
    ip: string
    device?: string
  }[]
}


export type UpdateUserStatusReq = {
  enabled?: boolean
  locked?: boolean
}

export type UserPermissionsResp = {
  permissions: string[]
}