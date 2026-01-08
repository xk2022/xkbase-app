// src/app/pages/adm/dictionary/Model.ts
/**
 * ===============================================================
 * ADM - Dictionary Model
 * Layer : Frontend Page Model
 * Purpose:
 * - 定義 Dictionary 管理頁使用的 DTO 型別
 * Notes:
 * - 對齊後端 ApiResult<Page<...>> / ApiResult<...>
 * - 支援 Dictionary（分類）＋ DictionaryItem（項目）兩層結構
 * ===============================================================
 */

/** ===============================================================
 * Query
 * - 對齊後端 @ModelAttribute DictionaryQuery
 * =============================================================== */
export type DictionaryQuery = {
  keyword?: string
  enabled?: boolean
  typeCode?: string
}

export type DictionaryItemSortPatch = {
  id: string
  sortOrder: number
}

/** ===============================================================
 * Dictionary（主檔 / 分類）
 * - 用於列表、詳情
 * =============================================================== */
export type Dictionary = {
  id: string // UUID
  code: string
  name: string
  enabled: boolean
  remark?: string
  createdTime?: string
  updatedTime?: string
}

/** ===============================================================
 * Dictionary Form Values
 * - Create / Edit 表單共用
 * =============================================================== */
export type DictionaryFormValues = {
  id?: string // UUID（create 時可無）
  code: string
  name: string
  enabled: boolean
  remark?: string
}

/** ===============================================================
 * Dictionary Item（字典項目）
 * - 對應實際下拉選單的值
 * =============================================================== */
export type DictionaryItem = {
  id: string // UUID
  dictionaryId: string // FK -> Dictionary.id
  itemCode: string
  itemLabel: string
  sortOrder?: number
  enabled: boolean
  remark?: string
  createdTime?: string
  updatedTime?: string
}

/** ===============================================================
 * Create / Update - Dictionary
 * =============================================================== */
export type CreateDictionaryReq = {
  code: string
  name: string
  enabled?: boolean
  remark?: string
}

export type UpdateDictionaryReq = {
  code?: string
  name?: string
  enabled?: boolean
  remark?: string
}

/** ===============================================================
 * Create / Update - Dictionary Item
 * =============================================================== */
export type CreateDictionaryItemReq = {
  dictionaryId: string
  itemCode: string
  itemLabel: string
  sortOrder?: number
  enabled?: boolean
  remark?: string
}

export type UpdateDictionaryItemReq = {
  itemCode?: string
  itemLabel?: string
  sortOrder?: number
  enabled?: boolean
  remark?: string
}
