// src/app/pages/tom/order/detail/Model.tsx
export interface OrderContainerItem {
  containerNo: string
  containerType?: string
  weightKg?: number
  status?: string // 貨櫃狀態
  remark?: string // 特殊注記
}

export interface OrderBilling {
  pricingMode?: 'PER_ORDER' | 'PER_CONTAINER' | 'PER_TRIP' | 'PER_KM' | 'PACKAGE'
  paymentTerm?: 'PREPAID' | 'COD' | 'MONTHLY' | 'TRANSFER'
  currency?: string

  subtotal?: number
  tax?: number
  total?: number

  invoiceNeeded?: boolean
  invoiceTitle?: string
  taxId?: string

  paymentStatus?: 'UNBILLED' | 'BILLED' | 'PAID' | 'OVERDUE'
  remark?: string
}

export interface OrderDispatch {
  status?: 'UNASSIGNED' | 'ASSIGNED' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
  vehicleNo?: string // 車頭（車牌）
  trailerNo?: string // 板車（車牌）
  driverName?: string // 司機
  assignedAt?: string
  etaAt?: string
  remark?: string
}

export interface OrderLog {
  time: string
  action: string
  operator?: string
  remark?: string
}

export interface OrderDetail {
  // ===== 你現有 mock 會提供的欄位 =====
  id: string
  orderNo: string
  customerName: string
  pickupLocation: string
  destinationPort: string
  pickupDate?: string
  containerCount: number
  orderStatus: string
  createdTime: string
  orderType?: 'IMPORT' | 'EXPORT'

  // ===== 下面是為了 5 張卡預留（都 optional，不影響 mock）=====
  containers?: OrderContainerItem[]
  billing?: OrderBilling
  dispatch?: OrderDispatch
  logs?: OrderLog[]
  assignments?: Array<{
    uuid?: string
    vehicleUuid?: string
    driverUuid?: string
    assignedTime?: string
    note?: string
  }>
  statusLogs?: Array<{
    uuid?: string
    createdTime?: string
    fromStatus?: string
    toStatus?: string
    reason?: string
  }>
  importDetail?: {
    deliveryOrderLocation?: string
    importDeclNo?: string
    blNo?: string
    customsReleaseTime?: string
    warehouse?: string
    arrivalNotice?: string
  }
  exportDetail?: {
    bookingNo?: string
    stuffingDate?: string
    cutoffTime?: string
    exportDeclNo?: string
    stuffingLocation?: string
    soNo?: string
    customsBroker?: string
  }
}
