/**
 * ===============================================================
 * PORT - Port Models (Frontend)
 * ===============================================================
 * 港口整合模組的型別定義
 * - 港口清單（代碼、名稱、地址）
 * - 進場時段規則（允許進場時間、容量限制）
 * - 港口作業規則（裝卸限制、特殊要求）
 * ===============================================================
 */

/* ===============================================================
 * 港口基礎資訊
 * =============================================================== */

/** 港口狀態 */
export type PortStatus = 'active' | 'inactive' | 'maintenance'

/** 港口列表項目 */
export interface PortListItem {
  id: string
  code: string // 港口代碼
  name: string // 港口名稱
  address: string // 地址
  status: PortStatus
  createdAt: string
  updatedAt: string
}

/** 港口完整資訊 */
export interface Port {
  id: string
  code: string // 港口代碼
  name: string // 港口名稱
  address: string // 地址
  status: PortStatus
  contactPhone?: string // 聯絡電話
  contactEmail?: string // 聯絡信箱
  description?: string // 描述
  createdAt: string
  updatedAt: string
}

/* ===============================================================
 * 進場時段規則
 * =============================================================== */

/** 星期幾 */
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

/** 進場時段規則 */
export interface EntryTimeRule {
  id: string
  portId: string
  dayOfWeek: DayOfWeek // 星期幾
  startTime: string // 開始時間 (HH:mm)
  endTime: string // 結束時間 (HH:mm)
  maxCapacity: number // 容量限制（最大進場數量）
  currentCapacity?: number // 當前已使用容量
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/** 建立進場時段規則請求 */
export interface CreateEntryTimeRuleReq {
  portId: string
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
  maxCapacity: number
  isActive?: boolean
}

/** 更新進場時段規則請求 */
export interface UpdateEntryTimeRuleReq {
  dayOfWeek?: DayOfWeek
  startTime?: string
  endTime?: string
  maxCapacity?: number
  isActive?: boolean
}

/* ===============================================================
 * 港口作業規則
 * =============================================================== */

/** 作業類型 */
export type OperationType = 'loading' | 'unloading' | 'both'

/** 貨櫃類型限制 */
export interface ContainerTypeLimit {
  containerType: string // 貨櫃類型（如：20GP, 40GP, 40HQ）
  maxWeight?: number // 最大重量（噸）
  maxHeight?: number // 最大高度（米）
  isAllowed: boolean // 是否允許
}

/** 港口作業規則 */
export interface PortOperationRule {
  id: string
  portId: string
  operationType: OperationType // 作業類型
  containerTypeLimits: ContainerTypeLimit[] // 貨櫃類型限制
  specialRequirements?: string // 特殊要求
  maxConcurrentOperations?: number // 最大同時作業數
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/** 建立港口作業規則請求 */
export interface CreatePortOperationRuleReq {
  portId: string
  operationType: OperationType
  containerTypeLimits: ContainerTypeLimit[]
  specialRequirements?: string
  maxConcurrentOperations?: number
  isActive?: boolean
}

/** 更新港口作業規則請求 */
export interface UpdatePortOperationRuleReq {
  operationType?: OperationType
  containerTypeLimits?: ContainerTypeLimit[]
  specialRequirements?: string
  maxConcurrentOperations?: number
  isActive?: boolean
}

/* ===============================================================
 * 港口詳情聚合模型
 * =============================================================== */

/** 港口詳情（包含規則） */
export interface PortDetail {
  port: Port
  entryTimeRules: EntryTimeRule[]
  operationRules: PortOperationRule[]
}

/* ===============================================================
 * 建立/更新港口請求
 * =============================================================== */

/** 建立港口請求 */
export interface CreatePortReq {
  code: string
  name: string
  address: string
  contactPhone?: string
  contactEmail?: string
  description?: string
  status?: PortStatus
}

/** 更新港口請求 */
export interface UpdatePortReq {
  code?: string
  name?: string
  address?: string
  contactPhone?: string
  contactEmail?: string
  description?: string
  status?: PortStatus
}
