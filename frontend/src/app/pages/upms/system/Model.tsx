// src/app/pages/upms/system/Model.tsx
/**
 * ===============================================================
 * UPMS - System Model
 * Layer : Frontend Page Model
 * Purpose:
 * - 定義 System 管理頁使用的 DTO 型別
 * Notes:
 * - 對齊後端 ApiResult<Page<...>> / ApiResult<...>
 * ===============================================================
 */

/** ===============================================================
 * Query
 * - 對齊後端 @ModelAttribute OrderQuery 那種做法
 * =============================================================== */
export type UpmsSystemQuery = {
  keyword?: string
  enabled?: boolean
}

/** ===============================================================
 * List Item (for table)
 * =============================================================== */
export type System = {
  id: string // UUID
  code: string
  name: string
  enabled: boolean
  remark?: string
  createdTime?: string
  updatedTime?: string
}

export type SystemFormValues = {
  id: string // UUID
  code: string
  name: string
  enabled: boolean
  remark?: string
  createdTime?: string
  updatedTime?: string
}

/** ===============================================================
 * Create / Update
 * =============================================================== */
export type CreateSystemReq = {
  code: string
  name: string
  enabled?: boolean
  remark?: string
}

export type UpdateSystemReq = {
  code?: string
  name?: string
  enabled?: boolean
  remark?: string
}
