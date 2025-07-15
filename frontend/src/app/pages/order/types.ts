// 訂單類型定義
export interface Order {
  id: string
  orderNumber: string
  type: OrderType
  status: OrderStatus
  createdAt: string
  updatedAt: string
  customerId: string
  customerName: string
  assignedTo?: string
  vehicleId?: string
  exportDetails?: ExportOrderDetails
  importDetails?: ImportOrderDetails
  notes?: string
  history: OrderHistory[]
}

export type OrderType = 'EXPORT' | 'IMPORT'

export type OrderStatus = 'PENDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED'

export interface ExportOrderDetails {
  date: string
  shippingCompany: string
  shipName: string
  voyage: string
  customsClearanceDate: string
  containerPickupCode: string
  containerType: string
  containerPickupLocation: string
  containerNumber: string
  containerDropoffLocation: string
  loadingLocation: string
  loadingDate: string
  loadingTime: string
  notes?: string
}

export interface ImportOrderDetails {
  date: string
  deliveryOrderLocation: string
  shippingCompany: string
  shipName?: string
  voyage?: string
  containerNumber: string
  containerType: string
  containerYard: string
  containerPickupDeadline: string
  deliveryLocation: string
  deliveryDate: string
  deliveryTime: string
  containerReturnLocation: string
  containerReturnDate: string
  containerReturnTime: string
  notes?: string
}

export interface OrderHistory {
  id: string
  orderId: string
  action: string
  status: OrderStatus
  timestamp: string
  userId: string
  userName: string
  notes?: string
  pickupPerson?: string
  deliveryPerson?: string
  receivePerson?: string
  handoverPerson?: string
  vehicleNumber?: string
}

export interface Customer {
  id: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
}

export interface Vehicle {
  id: string
  number: string
  type: string
  driverId: string
  driverName: string
  status: 'AVAILABLE' | 'BUSY' | 'MAINTENANCE'
}

export interface OrderListQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: OrderStatus
  type?: OrderType
  customerId?: string
  startDate?: string
  endDate?: string
}

export interface OrderStatistics {
  totalOrders: number
  pendingOrders: number
  assignedOrders: number
  inTransitOrders: number
  completedOrders: number
  cancelledOrders: number
  todayOrders: number
  monthlyOrders: number
}
