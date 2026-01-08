// src/app/pages/tom/container/Model.tsx
/**
 * ===============================================================
 * TOM - Container Model
 * Layer : Frontend Page Model
 * Purpose:
 * - 定義 System 管理頁使用的 DTO 型別
 * Notes:
 * - 對齊後端 ApiResult<Page<...>> / ApiResult<...>
 * ===============================================================
 */

/** ===============================================================
 * Query
 * - 對齊後端 @ModelAttribute OrderQuery 那種做法
 * =============================================================== */

/** ===============================================================
 * List Item (for table)
 * =============================================================== */
export type Container = {
  id: string              // uuid
  containerNo: string     // 貨櫃編號
  type: string            // 類型
  status: string          // 狀態
  weight: string          // 重量
  remark: string          // 特殊需求
}

/** ===============================================================
 * Create / Update
 * =============================================================== */

export type UpdateContainerReq = {
  code: string
  driverName: string
  eta: string
  status: string
}

// src/app/pages/tom/container/Model.ts
export type ContainerTaskStatus = 'UNASSIGNED' | 'ASSIGNED' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'

export interface ContainerListItem {
  id: string

  containerNo: string
  containerType?: string

  orderNo?: string
  customerName?: string

  pickupLocation?: string
  destinationPort?: string

  plannedStartAt?: string

  driverName?: string
  vehicleNo?: string

  taskStatus?: ContainerTaskStatus
}


export type ContainerStatus =
  | 'UNASSIGNED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'DONE'
  | 'CANCELLED'

export type ContainerType = '20GP' | '40GP' | '40HQ' | '45HQ' | '40RH' | 'OTHER'

/** 建立貨櫃請求 */
export type CreateContainerReq = {
  containerNo: string
  type: ContainerType | string
  status: ContainerStatus
  weight: string
  remark: string
}

/** 建立貨櫃回傳（可用你既有 Container） */
export type CreateContainerRes = Container
export type CreateContainerFormValues = {
  containerNo: string
  type: ContainerType | string
  status: ContainerStatus
  weight: string
  remark: string
}
