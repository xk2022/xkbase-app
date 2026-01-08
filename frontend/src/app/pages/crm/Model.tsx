/**
 * ===============================================================
 * CRM - Customer Relationship Management Models
 * ===============================================================
 * 用途：
 * - 前端畫面使用的型別定義
 * - 客戶管理、合約模板、客戶入口相關型別
 * ===============================================================
 */

/* ===============================================================
 * 客戶相關型別
 * =============================================================== */

/** 客戶狀態 */
export type CustomerStatus = 'active' | 'inactive' | 'suspended'

/** 聯絡人 */
export interface ContactPerson {
  id?: string
  name: string
  title?: string // 職稱
  phone?: string
  mobile?: string
  email?: string
  isPrimary?: boolean // 是否為主要聯絡人
}

/** 客戶清單項目 */
export interface CustomerListItem {
  id: string
  companyName: string // 公司名稱
  companyCode?: string // 公司代碼
  taxId?: string // 統一編號
  status: CustomerStatus
  primaryContact?: ContactPerson // 主要聯絡人
  contactCount?: number // 聯絡人數量
  phone?: string // 公司電話
  email?: string // 公司郵箱
  address?: string // 公司地址
  createdAt: string
  updatedAt: string
}

/** 客戶詳情 */
export interface CustomerDetail {
  id: string
  companyName: string
  companyCode?: string
  taxId?: string
  status: CustomerStatus
  phone?: string
  email?: string
  address?: string
  website?: string
  contacts: ContactPerson[] // 所有聯絡人
  contracts?: ContractTemplate[] // 相關合約模板
  createdAt: string
  updatedAt: string
}

/** 建立客戶請求 */
export interface CreateCustomerReq {
  companyName: string
  companyCode?: string
  taxId?: string
  phone?: string
  email?: string
  address?: string
  website?: string
  contacts?: Omit<ContactPerson, 'id'>[]
}

/** 更新客戶請求 */
export interface UpdateCustomerReq {
  companyName?: string
  companyCode?: string
  taxId?: string
  phone?: string
  email?: string
  address?: string
  website?: string
  status?: CustomerStatus
}

/* ===============================================================
 * 合約模板相關型別
 * =============================================================== */

/** 計費模式 */
export type BillingMode = 
  | 'fixed' // 固定價格
  | 'volume' // 按量計費
  | 'distance' // 按距離計費
  | 'time' // 按時間計費
  | 'hybrid' // 混合模式

/** 合約模板狀態 */
export type ContractStatus = 'draft' | 'active' | 'expired' | 'archived'

/** 標準條款 */
export interface StandardClause {
  id?: string
  title: string // 條款標題
  content: string // 條款內容
  order?: number // 排序
}

/** 計費規則 */
export interface BillingRule {
  mode: BillingMode
  basePrice?: number // 基礎價格（固定模式）
  unitPrice?: number // 單價（按量/距離/時間）
  unit?: string // 計費單位（如：元/公里、元/小時）
  minCharge?: number // 最低收費
  maxCharge?: number // 最高收費
  discount?: number // 折扣（百分比）
}

/** 合約模板清單項目 */
export interface ContractTemplateListItem {
  id: string
  name: string // 合約名稱
  customerId?: string // 關聯客戶ID（可選，通用模板可不關聯）
  customerName?: string // 客戶名稱
  billingMode: BillingMode
  status: ContractStatus
  effectiveDate?: string // 生效日期
  expiryDate?: string // 到期日期
  createdAt: string
  updatedAt: string
}

/** 合約模板詳情 */
export interface ContractTemplateDetail {
  id: string
  name: string
  customerId?: string
  customerName?: string
  status: ContractStatus
  effectiveDate?: string
  expiryDate?: string
  clauses: StandardClause[] // 標準條款
  billingRules: BillingRule[] // 計費規則（可多個）
  note?: string
  createdAt: string
  updatedAt: string
}

/** 建立合約模板請求 */
export interface CreateContractTemplateReq {
  name: string
  customerId?: string
  effectiveDate?: string
  expiryDate?: string
  clauses?: Omit<StandardClause, 'id'>[]
  billingRules: Omit<BillingRule, 'id'>[]
  note?: string
}

/** 更新合約模板請求 */
export interface UpdateContractTemplateReq {
  name?: string
  customerId?: string
  status?: ContractStatus
  effectiveDate?: string
  expiryDate?: string
  clauses?: Omit<StandardClause, 'id'>[]
  billingRules?: Omit<BillingRule, 'id'>[]
  note?: string
}

/* ===============================================================
 * 客戶入口相關型別
 * =============================================================== */

/** 貨櫃進度狀態 */
export type ContainerStatus = 
  | 'pending' // 待處理
  | 'in_transit' // 運送中
  | 'arrived' // 已到達
  | 'delivered' // 已交付
  | 'returned' // 已歸還

/** 貨櫃進度查詢結果 */
export interface ContainerProgress {
  containerNo: string // 貨櫃號
  orderNo: string // 訂單編號
  status: ContainerStatus
  currentLocation?: string // 當前位置
  pickupDate?: string // 提貨日期
  estimatedDeliveryDate?: string // 預計交付日期
  actualDeliveryDate?: string // 實際交付日期
  trackingEvents: TrackingEvent[] // 追蹤事件
}

/** 追蹤事件 */
export interface TrackingEvent {
  id: string
  time: string
  location?: string
  status: ContainerStatus
  description: string
  operator?: string
}

/** 線上提單請求 */
export interface CreateBookingReq {
  customerId: string
  containerNo: string
  pickupAddress: string
  deliveryAddress: string
  pickupDate: string
  deliveryDate?: string
  containerType?: string
  note?: string
}

/** 線上提單結果 */
export interface BookingResult {
  bookingNo: string
  orderNo?: string
  status: string
  message: string
}
