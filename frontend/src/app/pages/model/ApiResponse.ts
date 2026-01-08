// src/shared/api/ApiResponse.ts

// 統一回傳包裝
export interface ApiResponse<T> {
  code: number
  message: string | null
  data: T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorDetails: any | null
  timestamp: string
}
