// src/app/pages/tom/task/Model.ts
export type TomTaskStatus =
  | 'UNASSIGNED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'DONE'
  | 'CANCELLED'

/**
 * 任務標的（Subject）
 * - CONTAINER：有貨櫃（櫃號 / containerId）
 * - TRAILER：拉板車（可指定板車或不指定）
 * - EMPTY_MOVE：空車/空板回位（通常不指定 subjectId）
 * - VEHICLE：調車（車頭移動）
 * - OTHER：保留
 */
export type TaskSubjectType =
  | 'CONTAINER'
  | 'TRAILER'
  | 'EMPTY_MOVE'
  | 'VEHICLE'
  | 'OTHER'

export type TomTaskListItem = {
  id: string
  taskNo: string

  subjectType: TaskSubjectType
  subjectId?: string
  subjectNo?: string

  fromLocation: string
  toLocation: string
  plannedStartAt?: string

  status: TomTaskStatus

  // optional links (when created from order/container)
  orderId?: string
  orderNo?: string
  containerId?: string
  containerNo?: string

  // assignment snapshot (由 FMS 指派後寫回/同步)
  driverName?: string
  vehicleNo?: string
  trailerNo?: string

  remark?: string
  createdTime: string
}

export type CreateTomTaskReq = {
  subjectType: TaskSubjectType

  subjectId?: string
  subjectNo?: string

  // links (optional)
  orderId?: string
  orderNo?: string
  containerId?: string
  containerNo?: string

  fromLocation: string
  toLocation: string
  plannedStartAt?: string

  status: TomTaskStatus

  remark?: string
}
