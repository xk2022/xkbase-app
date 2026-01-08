
// 查詢參數（注意這裡假設後端 page 為 0-based）
export interface PageQuery {
  page: number
  size: number
  keyword?: string
}