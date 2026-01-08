// src/app/pages/tom/container/detail/Model.ts
export type ContainerTaskStatus =
  | 'UNASSIGNED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'DONE'
  | 'CANCELLED'

export type BillingPricingMode =
  | 'PER_CONTAINER'
  | 'PER_TASK'
  | 'PER_TRIP'
  | 'PER_KM'
  | 'PACKAGE'

export type BillingPaymentTerm = 'PREPAID' | 'COD' | 'MONTHLY' | 'TRANSFER'

export type BillingPaymentStatus = 'UNBILLED' | 'BILLED' | 'PAID' | 'OVERDUE'

export type ContainerDispatchStatus =
  | 'UNASSIGNED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'DONE'
  | 'CANCELLED'

export interface ContainerTaskItem {
  taskId: string
  seq: number
  fromLocation?: string
  toLocation?: string
  plannedStartAt?: string
  plannedEndAt?: string

  driverName?: string
  vehicleNo?: string

  status: ContainerTaskStatus
  remark?: string
}

export interface ContainerBilling {
  pricingMode?: BillingPricingMode
  paymentTerm?: BillingPaymentTerm
  paymentStatus?: BillingPaymentStatus
  currency?: string

  subtotal?: number
  tax?: number
  total?: number

  invoiceNeeded?: boolean
  invoiceTitle?: string
  taxId?: string

  remark?: string
}

export interface ContainerDispatch {
  status?: ContainerDispatchStatus
  driverName?: string
  vehicleNo?: string
  assignedAt?: string
  etaAt?: string
  remark?: string
}

export interface ContainerLog {
  time: string
  action: string
  operator?: string
  remark?: string
}

export interface ContainerDetail {
  // ===== 基本（對齊你 Container model）=====
  id: string
  containerNo: string
  type: string
  status: string
  weight: string
  remark: string

  // ===== 參考資訊（常見需要，但不強制）=====
  orderId?: string
  orderNo?: string
  customerName?: string
  containerStatus?: string

  // ===== 詳情區塊 =====
  tasks: ContainerTaskItem[]
  billing?: ContainerBilling
  dispatch?: ContainerDispatch
  logs: ContainerLog[]
}
