// src/app/pages/fms/driver/Model.tsx

// ===============================
// Driver Model
//（列表 / 詳情共用的前端 Model）
// ===============================

/**
 * 司機狀態
 * - 對應後端 DriverStatus enum
 */
export type DriverStatus = 'ACTIVE' | 'INACTIVE' | 'LEAVE'

/**
 * 駕照類型
 * - 建議和後端 DriverLicenseType enum 對齊
 *   例如：SMALL / LARGE / TRAILER / OTHER ...
 */
export type DriverLicenseType = 'SMALL' | 'LARGE' | 'TRAILER' | 'MEDIUM' | 'OTHER'

/**
 * 前端畫面用的 Driver Model
 *（列表 / 詳情共用）
 */
export interface Driver {
  uuid: string

  // 基本資訊
  name: string
  phone: string

  // 駕照 & 狀態
  licenseType: DriverLicenseType
  status: DriverStatus
  onDuty: boolean

  // 關聯資訊
  userId?: string | null
  currentVehicleId?: string | null
  currentVehiclePlateNo?: string | null

  // 其他
  remark?: string
  createdTime?: string
  updatedTime?: string
}

/**
 * 後端 /api/fms/drivers 分頁列表回傳的 DTO
 * - 建議對應 DriverListResp / DriverResp（後端）
 */
export interface DriverListResp {
  id: string

  name: string
  phone: string

  licenseType: DriverLicenseType
  status: DriverStatus
  onDuty: boolean

  userId?: string | null
  currentVehicleId?: string | null
  currentVehiclePlateNo?: string | null

  remark?: string
  createdTime?: string
  updatedTime?: string
}

/**
 * 建立司機 Request
 */
export interface CreateDriverReq {
  name: string
  phone: string
  licenseType: DriverLicenseType

  status?: DriverStatus
  onDuty?: boolean

  userId?: string | null
  currentVehicleId?: string | null
  remark?: string
}

/**
 * 更新司機 Request
 */
export interface UpdateDriverReq {
  name?: string
  phone?: string
  licenseType?: DriverLicenseType

  status?: DriverStatus
  onDuty?: boolean

  userId?: string | null
  currentVehicleId?: string | null
  remark?: string
}

/**
 * 下拉選單用 Option
 * 如果之後要在別的畫面選司機，可用這個型別
 */
export interface DriverOptionResp {
  id: string
  name: string
  phone: string
}

// ------------------------------------------------------------
// Mapper
// ------------------------------------------------------------

export const mapDriverListRespToDriver = (dto: DriverListResp): Driver => {
  return {
    uuid: dto.id,
    name: dto.name,
    phone: dto.phone,
    licenseType: dto.licenseType,
    status: dto.status,
    onDuty: dto.onDuty,
    userId: dto.userId ?? null,
    currentVehicleId: dto.currentVehicleId ?? null,
    currentVehiclePlateNo: dto.currentVehiclePlateNo ?? null,
    remark: dto.remark,
    createdTime: dto.createdTime,
    updatedTime: dto.updatedTime,
  }
}
