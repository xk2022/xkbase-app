// src/app/pages/fms/vehicle/detail/Model.tsx
import { VehicleStatus, VehicleType } from '../Model'

/**
 * 後端 /api/fms/vehicles/{id} 回傳 DTO（建議這樣實作）
 */
export interface VehicleDetailResp {
  id: string
  plateNo: string
  type: VehicleType
  brand?: string
  model?: string
  capacityTon?: number | null

  status: VehicleStatus
  enabled: boolean

  currentDriverId?: string | null
  currentDriverName?: string | null
  currentOdometer?: number | null
  remark?: string | null

  createdTime?: string
  updatedTime?: string

  // 加上關聯資訊（MVP 可以先回 null / 空陣列）
  driver?: {
    id: string
    name: string
    phone?: string
    licenseType?: string
    onDuty?: boolean
  } | null

  recentMaintenances?: {
    id: string
    date: string
    type: string
    description?: string
    mileage?: number
  }[]
}

/**
 * 前端用 VehicleDetail（畫面 Model）
 * 基本上就是把後端 DTO 攤平、補預設值
 */
export interface VehicleDetail {
  uuid: string
  plateNo: string
  type: VehicleType
  brand?: string
  model?: string
  capacityTon?: number | null

  status: VehicleStatus
  enabled: boolean

  currentDriverId?: string | null
  currentDriverName?: string | null
  currentOdometer?: number | null
  remark?: string | null

  createdTime?: string
  updatedTime?: string

  driver: {
    id: string
    name: string
    phone?: string
    licenseType?: string
    onDuty?: boolean
  } | null

  recentMaintenances: {
    id: string
    date: string
    type: string
    description?: string
    mileage?: number
  }[]
}

/**
 * Mapper：把後端 VehicleDetailResp → 前端 VehicleDetail
 */
export const mapVehicleDetailRespToDetail = (
  dto: VehicleDetailResp,
): VehicleDetail => {
  return {
    uuid: dto.id,
    plateNo: dto.plateNo,
    type: dto.type,
    brand: dto.brand ?? undefined,
    model: dto.model ?? undefined,
    capacityTon: dto.capacityTon ?? null,

    status: dto.status,
    enabled: dto.enabled,

    currentDriverId: dto.currentDriverId ?? null,
    currentDriverName: dto.currentDriverName ?? null,
    currentOdometer: dto.currentOdometer ?? null,
    remark: dto.remark ?? null,

    createdTime: dto.createdTime,
    updatedTime: dto.updatedTime,

    driver: dto.driver ?? null,
    recentMaintenances: dto.recentMaintenances ?? [],
  }
}
