// src/app/pages/fms/vehicle/Model.ts

// ===============================================================
// Vehicle Enums - 對應後端 VehicleType / VehicleStatus
// ===============================================================

export type VehicleType =
  | 'TRACTOR'              // 車頭
  | 'TRAILER_20'           // 20 尺板車
  | 'TRAILER_40'           // 40 尺板車
  | 'SMALL_TRUCK'          // 小貨車
  | 'REFRIGERATED_TRUCK'   // 冷凍車
  | 'VAN'                  // 廂型車
  | 'OTHER'                // 其他

export type VehicleStatus =
  | 'AVAILABLE'
  | 'IDLE'
  | 'IN_USE'
  | 'BUSY'
  | 'MAINTENANCE'
  | 'RESERVED'
  | 'INACTIVE'
  | 'SCRAPPED'

// ===============================================================
// Frontend Vehicle Model（前端統一使用）
// ===============================================================

export interface Vehicle {
  uuid: string
  plateNo: string
  type: VehicleType

  brand?: string
  model?: string
  capacityTon?: number

  status: VehicleStatus
  enabled: boolean

  currentDriverId?: string | null
  currentOdometer?: number | null

  remark?: string

  createdTime?: string
  updatedTime?: string
}

// ===============================================================
// List Response DTO（後端回傳的列表 DTO）
// ===============================================================

export interface VehicleListResp {
  id: string
  plateNo: string
  type: VehicleType

  brand?: string
  model?: string
  capacityTon?: number

  status: VehicleStatus
  enabled: boolean

  currentDriverId?: string | null
  currentOdometer?: number | null

  remark?: string

  createdTime?: string
  updatedTime?: string
}

// ===============================================================
// Detail Response DTO（如未來增加更多欄位，可擴充）
// ===============================================================

export interface VehicleDetailResp extends VehicleListResp {
  // 之後可加入：driverInfo, lastMaintenanceDate, mileageLogs ...
}

// ===============================================================
// Create / Update Request 型別 (前端送後端)
// ===============================================================

export interface CreateVehicleReq {
  plateNo: string
  type: VehicleType

  brand?: string
  model?: string
  capacityTon?: number

  status: VehicleStatus
  enabled: boolean

  currentOdometer?: number
  remark?: string
}

export interface UpdateVehicleReq {
  plateNo?: string
  type?: VehicleType

  brand?: string
  model?: string
  capacityTon?: number

  status?: VehicleStatus
  enabled?: boolean

  currentOdometer?: number
  remark?: string
}

// ===============================================================
// Mapper: 後端 DTO → 前端 Model
// ===============================================================

export const mapVehicleListRespToVehicle = (dto: VehicleListResp): Vehicle => ({
  uuid: dto.id,
  plateNo: dto.plateNo,
  type: dto.type,

  brand: dto.brand,
  model: dto.model,
  capacityTon: dto.capacityTon,

  status: dto.status,
  enabled: dto.enabled,

  currentDriverId: dto.currentDriverId ?? null,
  currentOdometer: dto.currentOdometer ?? null,

  remark: dto.remark,

  createdTime: dto.createdTime,
  updatedTime: dto.updatedTime,
})
