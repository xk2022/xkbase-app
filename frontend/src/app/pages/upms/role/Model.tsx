// src/app/pages/upms/role/RoleModel.ts

export type RoleStatus = 'ENABLED' | 'DISABLED'

/**
 * 前端畫面用的 Role Model
 *（列表 / 詳情共用）
 */
export interface Role {
  id: string
  code: string
  name: string
  description?: string
  enabled: boolean

  /** 原始權限（給 Detail / Edit 用） */
  permissionCodes?: string[]

  /** 衍生欄位（給 List 用） */
  permissionCount?: number
}

/**
 * 後端 /api/upms/roles 分頁列表回傳的 DTO
 * 對應 RoleResp（你後端的）
 */
export interface RoleListResp {
  id: string
  code: string
  name: string
  description?: string
  enabled: boolean
  permissionCodes: string[]
  createdTime?: string
  updatedTime?: string
}

/**
 * 角色詳情用（如果未來 /detail 回傳更多欄位）
 */
export interface RoleDetailResp extends RoleListResp {
  // 之後可以加：userCount, lastUsedAt, etc...
}

/**
 * 建立角色 Request
 */
export interface CreateRoleReq {
  code: string
  name: string
  description?: string
  enabled?: boolean
  permissionCodes?: string[]
}

/**
 * 更新角色 Request
 */
export interface UpdateRoleReq {
  name?: string
  description?: string
  enabled?: boolean
  permissionCodes?: string[]
}

/**
 * 下拉選單用 Option
 * 對應 /api/upms/roles/options
 */
export interface RoleOptionResp {
  id: string
  code: string
  name: string
}

export interface RoleOption {
  code: string
  name: string
}

// ------------------------------------------------------------
// Mapper
// ------------------------------------------------------------

export const mapRoleListRespToRole = (dto: RoleListResp): Role => {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    description: dto.description,
    enabled: dto.enabled,
    permissionCodes: dto.permissionCodes ?? [],
    permissionCount: dto.permissionCodes?.length ?? 0,
  }
}
