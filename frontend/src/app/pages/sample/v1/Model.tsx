// src/app/pages/sample/v1/Model.tsx

/**
 * Sample 数据模型
 */

/**
 * Sample 状态枚举
 */
export type SampleStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING'

/**
 * Sample 列表项模型（列表一列的資料）
 */
export interface Sample {
  id: string
  title: string
  description?: string
  status: SampleStatus
  enabled: boolean
  created_at?: string
  updated_at?: string
  category?: string
  tags?: string[]
}

/**
 * Sample 列表响应（后端返回）
 */
export type SampleListResp = {
  id: string
  title: string
  description?: string | null
  status: SampleStatus
  enabled: boolean
  createdAt?: string | null
  updatedAt?: string | null
  category?: string | null
  tags?: string[]
}

/**
 * Mapper: 后端响应 -> UI Model
 */
export const mapSampleListRespToSample = (dto: SampleListResp): Sample => {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? undefined,
    status: dto.status,
    enabled: dto.enabled,
    created_at: dto.createdAt ?? undefined,
    updated_at: dto.updatedAt ?? undefined,
    category: dto.category ?? undefined,
    tags: dto.tags ?? [],
  }
}

/**
 * 创建 Sample 表单值（UI 專用）
 */
export interface CreateSampleFormValues {
  title: string
  description?: string
  status: SampleStatus
  enabled: boolean
  category?: string
  tags?: string[]
}

/**
 * 更新 Sample 表单值（UI 專用）
 */
export interface UpdateSampleFormValues {
  title?: string
  description?: string
  status?: SampleStatus
  enabled?: boolean
  category?: string
  tags?: string[]
}

/**
 * API Request - 创建
 */
export interface CreateSampleReq {
  title: string
  description?: string
  status: SampleStatus
  enabled: boolean
  category?: string
  tags?: string[]
}

/**
 * API Request - 更新
 */
export interface UpdateSampleReq {
  title?: string
  description?: string
  status?: SampleStatus
  enabled?: boolean
  category?: string
  tags?: string[]
}

/**
 * Sample 详情模型
 */
export interface SampleDetail {
  id: string
  title: string
  description?: string
  status: SampleStatus
  enabled: boolean
  locked?: boolean
  createdAt?: string
  updatedAt?: string
  category?: string
  tags?: string[]
}
