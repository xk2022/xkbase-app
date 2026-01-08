/**
 * ===============================================================
 * TOM - Order Models (Frontend)
 * ===============================================================
 * 用途：
 * - 前端畫面使用的型別定義
 * - 對齊後端 Order API / DDD 結構
 * - v1：列表 / 建立 / 詳情
 * - v2：派單 / 進度
 * - v3：報表
 * ===============================================================
 */

/* ===============================================================
 * 基礎列舉（Enum）
 * =============================================================== */

/** 訂單類型 */
export type OrderType = 'import' | 'export'

/** 訂單狀態 */
export type OrderStatus =
  | 'pending'      // 待處理
  | 'assigned'     // 已指派
  | 'in_transit'   // 運送中
  | 'completed'    // 已完成
  | 'cancelled'    // 已取消'

/* ===============================================================
 * 共用：訂單核心欄位（所有訂單都有）
 * =============================================================== */

export interface OrderBase {
  /** 系統訂單編號 yyyyMMdd-xxxx */
  orderId: string

  /** 訂單類型 */
  orderType: OrderType

  /** 客戶 */
  customerId: number
  customerName?: string

  /** 狀態 */
  status: OrderStatus

  /** 建立 / 更新時間 */
  createdAt: string
  updatedAt: string
}

/* ===============================================================
 * 出口訂單（Export）
 * =============================================================== */

export interface ExportOrderFields {
  shipDate: string
  shippingCompany: string
  vesselVoyage: string
  clearanceDate: string
  pickupCode: string
  containerType: string
  pickupYard: string
  containerNumber: string
  deliveryYard: string
  loadingLocation: string
  loadingDate: string
  loadingTime: string
  note?: string
}

/* ===============================================================
 * 進口訂單（Import）
 * =============================================================== */

export interface ImportOrderFields {
  shipDate: string
  deliveryOrderLocation: string
  shippingCompany: string
  vesselVoyage: string
  containerNumber: string
  containerType: string
  containerYard: string
  lastPickupDate: string
  deliveryLocation: string
  deliveryDate: string
  deliveryTime: string
  returnYard: string
  returnDate: string
  returnTime: string
  note?: string
}

/* ===============================================================
 * 訂單完整型別（Discriminated Union）
 * =============================================================== */

// export type Order =
  // | (OrderBase & { orderType: 'export' } & ExportOrderFields)
  // | (OrderBase & { orderType: 'import' } & ImportOrderFields)

/* ===============================================================
 * 列表頁用（Order List）
 * =============================================================== */
export interface OrderContainerItem {
  containerNo: string
}

export interface OrderListItem {
  id: string
  orderNo: string
  customerName: string
  pickupLocation: string
  destinationPort: string

  orderStatus: string

  /** 若後端已算好，直接顯示 */
  containerCount: number

  /** 明細或未來派單用 */
  containers?: OrderContainerItem[]

  /** 主要顯示時間（提貨日） */
  pickupDate?: string

  createdTime: string
}

/* ===============================================================
 * 建立訂單（Create）
 * =============================================================== */

export interface CreateOrderBase {
  orderType: OrderType
  customerUuid: number
}

/** v1：最小可建立訂單 */
export interface CreateOrderBaseReq {
  orderType: 'export' | 'import'
  customerId: number
  containerNumber: string
  shipDate: string
  note?: string
}


export interface UpdateOrderReq {
  orderType?: string
  customerId?: string
  containerNumber?: string
  shipDate?: string
  note?: string
}

/** 建立出口訂單 */
export interface CreateExportOrderReq
  extends CreateOrderBase,
    ExportOrderFields {
  orderType: 'export'
}

/** 建立進口訂單 */
export type CreateImportOrderReq = {
  orderType: 'import'
  customerUuid: string
  pickupAddress: string
  deliveryAddress: string
  scheduledAt?: string

  shippingCompany: string
  vesselVoyage: string
  containerNo: string
  containerType: string
  packageQty?: number
  grossWeight?: number
  cbm?: number
  pol: string
  pod: string
  etd?: string
  eta?: string

  deliveryOrderLocation: string
  blNo?: string
  importDeclNo: string
  customsReleaseTime?: string
  warehouse?: string
  arrivalNotice?: string

  note?: string
}

export type CreateOrderReq =
  | CreateExportOrderReq
  | CreateImportOrderReq

/* ===============================================================
 * 指派資訊（v2 使用）
 * =============================================================== */

export interface OrderAssignment {
  vehicleId: number
  driverId: number
  assignedBy: number
  assignedAt: string
}

/* ===============================================================
 * 訂單狀態紀錄 / 歷程
 * =============================================================== */

export interface OrderLog {
  id: number
  orderId: string
  action: string
  operatorId: number
  operatorName?: string
  createdAt: string
}

/* ===============================================================
 * 詳情頁聚合模型（Detail）
 * =============================================================== */

export interface OrderDetail {
  order: Order
  assignment?: OrderAssignment
  logs: OrderLog[]
}

export interface OrderFormValues {
  orderType: 'import' | 'export'

  // import base
  customerUuid: string
  pickupAddress: string
  deliveryAddress: string
  scheduledAt?: string

  // shipping/container
  shippingCompany: string
  vesselVoyage: string
  containerNo: string
  containerType: string
  packageQty?: string
  grossWeight?: string
  cbm?: string
  pol: string
  pod: string
  etd?: string
  eta?: string

  // import detail
  deliveryOrderLocation: string
  importDeclNo: string
  blNo?: string
  customsReleaseTime?: string
  warehouse?: string
  arrivalNotice?: string

  note?: string

  // export（先保留你原本那套，之後再對齊後端）
  customerId?: string
  containerNumber: string
  shipDate: string
}



// ===============================================================
// Models & DTOs - TOM Order
// ===============================================================

export interface CreateTomOrderFormValues {
  orderType: 'IMPORT' | 'EXPORT' | 'LOCAL'

  customerUuid: string
  customerName: string // snapshot

  pickupAddress: string
  deliveryAddress: string

  scheduledAt?: string // ISO string
  customerRefNo?: string
  note?: string
}

export interface CreateTomOrderReq {
  orderType: 'IMPORT' | 'EXPORT' | 'LOCAL'

  customerUuid: string
  customerName: string // snapshot

  pickupAddress: string
  deliveryAddress: string

  scheduledAt?: string // ISO string
  customerRefNo?: string
  note?: string
}

export interface TomOrderResp {
  id: string
  orderNo: string

  orderType: string
  status: string

  customerUuid: string
  customerName: string

  pickupAddress: string
  deliveryAddress: string

  scheduledAt?: string
  note?: string

  availableActions: string[]
}
// src/app/pages/tom/order/detail/Model.ts

// ==============================
// Order（訂單主體）
// ==============================
export interface Order {
  id: string
  orderNo: string

  customerName: string

  pickupLocation: string
  destinationPort: string

  pickupDate?: string

  containerCount: number

  orderStatus: string

  createdTime: string
}

// ==============================
// Assignment（派單資訊）
// ==============================
export interface OrderAssignment {
  vehicleNo?: string
  driverName?: string

  assignedTime?: string
  status?: string
}

// ==============================
// Status Log（狀態歷程）
// ==============================
export interface OrderLog {
  time: string
  status: string
  remark?: string
  operator?: string
}

// ==============================
// Detail Aggregate
// ==============================
export interface OrderDetail {
  order: Order
  assignment?: OrderAssignment
  logs: OrderLog[]
}
