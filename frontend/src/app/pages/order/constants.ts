// 訂單狀態常數
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  IN_TRANSIT: 'IN_TRANSIT',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const

// 訂單狀態中文對照
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: '待處理',
  [ORDER_STATUS.ASSIGNED]: '已指派',
  [ORDER_STATUS.IN_TRANSIT]: '運送中',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消',
} as const

// 訂單類型常數
export const ORDER_TYPE = {
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
} as const

// 訂單類型中文對照
export const ORDER_TYPE_LABELS = {
  [ORDER_TYPE.EXPORT]: '出口',
  [ORDER_TYPE.IMPORT]: '進口',
} as const

// 櫃型選項
export const CONTAINER_TYPES = [
  { value: '20GP', label: '20GP' },
  { value: '40GP', label: '40GP' },
  { value: '40HQ', label: '40HQ' },
  { value: '45HQ', label: '45HQ' },
]

// 訂單權限常數
export const ORDER_PERMISSIONS = {
  READ: 'order:read',
  CREATE: 'order:create',
  UPDATE: 'order:update',
  DELETE: 'order:delete',
  ASSIGN: 'order:assign',
  STATUS: 'order:status',
} as const

// 報表格式選項
export const REPORT_FORMATS = [
  { value: 'excel', label: 'Excel' },
  { value: 'pdf', label: 'PDF' },
  { value: 'csv', label: 'CSV' },
]

// 報表類型選項
export const REPORT_TYPES = [
  { value: 'daily', label: '日報表' },
  { value: 'weekly', label: '週報表' },
  { value: 'monthly', label: '月報表' },
  { value: 'custom', label: '自訂區間' },
]
