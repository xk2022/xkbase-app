// src/app/pages/model/PageResult.ts

// ===============================
// Spring Page 結構
// 分頁 (如果後端為 PageResult<User>)
// ===============================
export interface PageResult<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface Pageable {
  pageNumber: number
  pageSize: number
  offset: number
  paged: boolean
  unpaged: boolean
}
