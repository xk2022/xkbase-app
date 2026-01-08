// src/app/pages/common/ApiError.ts
import { AxiosError } from 'axios'

/**
 * API 錯誤類別
 * 用於區分不同類型的 API 錯誤
 */
export class ApiError extends Error {
  status?: number
  isServerError: boolean

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.isServerError = status !== undefined && status >= 500
  }

  static fromAxiosError(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error
    }

    if (error instanceof Error) {
      const axiosError = error as AxiosError
      const status = axiosError.response?.status
      const message = axiosError.message || 'API 請求失敗'
      return new ApiError(message, status)
    }

    return new ApiError('未知錯誤')
  }
}
