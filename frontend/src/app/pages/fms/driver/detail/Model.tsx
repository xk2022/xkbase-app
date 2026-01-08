// src/app/pages/fms/driver/detail/Model.tsx
import { DriverLicenseType, DriverStatus } from '../Model'

/**
 * 後端 /api/fms/drivers/{id} 回傳 DTO（建議這樣實作）
 */
export interface DriverDetailResp {
  id: string
  name: string
  phone: string
  licenseType: DriverLicenseType
  status: DriverStatus
  onDuty: boolean

  userId?: string | null
  username?: string | null

  currentVehicleId?: string | null
  currentVehiclePlateNo?: string | null
  currentVehicleType?: string | null

  createdTime?: string
  updatedTime?: string

  // 可選：歷史關聯資訊（MVP 可以先回 null / 空陣列）
  recentVehicles?: {
    id: string
    plateNo: string
    type?: string
    lastUsedAt?: string
  }[] | null

  recentOrders?: {
    id: string
    orderNo: string
    pickupTime?: string
    deliveryTime?: string
    status?: string
  }[] | null
}

/**
 * 前端用 DriverDetail（畫面 Model）
 * 基本上就是把後端 DTO 攤平、補預設值
 */
export interface DriverDetail {
  uuid: string
  name: string
  phone: string
  licenseType: DriverLicenseType
  status: DriverStatus
  onDuty: boolean

  userId?: string | null
  username?: string | null

  currentVehicleId?: string | null
  currentVehiclePlateNo?: string | null
  currentVehicleType?: string | null

  createdTime?: string
  updatedTime?: string

  recentVehicles: {
    id: string
    plateNo: string
    type?: string
    lastUsedAt?: string
  }[]

  recentOrders: {
    id: string
    orderNo: string
    pickupTime?: string
    deliveryTime?: string
    status?: string
  }[]
}

/**
 * Mapper：把後端 DriverDetailResp → 前端 DriverDetail
 */
export const mapDriverDetailRespToDetail = (
  dto: DriverDetailResp,
): DriverDetail => {
  return {
    uuid: dto.id,
    name: dto.name,
    phone: dto.phone,
    licenseType: dto.licenseType,
    status: dto.status,
    onDuty: dto.onDuty,

    userId: dto.userId ?? null,
    username: dto.username ?? null,

    currentVehicleId: dto.currentVehicleId ?? null,
    currentVehiclePlateNo: dto.currentVehiclePlateNo ?? null,
    currentVehicleType: dto.currentVehicleType ?? null,

    createdTime: dto.createdTime,
    updatedTime: dto.updatedTime,

    recentVehicles: dto.recentVehicles ?? [],
    recentOrders: dto.recentOrders ?? [],
  }
}
