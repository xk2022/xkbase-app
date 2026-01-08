// src/app/pages/common/paging.ts
export interface PageQuery {
  page: number // API 0-based
  size: number
  keyword?: string
}

export interface PageResult<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first?: boolean
  last?: boolean
}
