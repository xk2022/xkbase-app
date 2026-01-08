/**
 * ===============================================================
 * UPMS - Permission Model
 * Layer : Frontend Page Model
 * Purpose:
 * - 定義 Permission 管理頁使用的 DTO 型別
 * Notes:
 * - 對齊後端 ApiResult<Page<...>> / ApiResult<...>
 * - 可支援 List / Create / Detail / Update（L3 → L4）
 * ===============================================================
 */

/** ===============================================================
 * Query
 * - 對齊後端 UpmsPermissionQuery
 * =============================================================== */
export type UpmsPermissionQuery = {
  keyword?: string
  systemCode?: string
  enabled?: boolean
}

/** ===============================================================
 * List Item (for table)
 * - 對齊 UpmsPermissionListResp
 * =============================================================== */
export type Permission = {
  id: string // UUID
  code: string
  name: string
  systemCode: string
  resourceCode: string
  actionCode: string
  enabled: boolean
  sortOrder?: number
  description?: string
  groupKey?: string
  createdTime?: string
  updatedTime?: string
}

/** ===============================================================
 * Detail (for DetailPage / Edit)
 * - 對齊 UpmsPermissionResp
 * =============================================================== */
export type PermissionDetail = {
  id: string // UUID
  code: string
  name: string
  description?: string
  systemCode: string
  resourceCode: string
  actionCode: string
  enabled: boolean
  sortOrder?: number
  groupKey?: string
  createdTime?: string
  updatedTime?: string
}

/** ===============================================================
 * Form Values
 * - Create / Edit 共用（前端用）
 * =============================================================== */
export type PermissionFormValues = {
  systemCode: string
  resourceCode: string
  actionCode: string
  name: string
  description?: string
  enabled: boolean
  sortOrder?: number
}

/** ===============================================================
 * Create
 * - 對齊 UpmsPermissionCreateReq
 * =============================================================== */
export type CreatePermissionReq = {
  systemCode: string
  resourceCode: string
  actionCode: string
  name: string
  description?: string
  enabled?: boolean
  sortOrder?: number
}

/** ===============================================================
 * Update
 * - 對齊 UpmsPermissionUpdateReq
 * - ⚠ 不允許修改 code / system / resource / action
 * =============================================================== */
export type UpdatePermissionReq = {
  name?: string
  description?: string
  enabled?: boolean
  sortOrder?: number
}
