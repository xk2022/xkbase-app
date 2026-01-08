/**
 * ===============================================================
 * HRM - Driver Models (Frontend)
 * ===============================================================
 * 司機資料台帳：姓名、駕照、資格證
 */

/* ===============================================================
 * 司機資料台帳
 * =============================================================== */

export interface DriverListItem {
  id: string
  name: string
  licenseNumber: string
  licenseType: string
  licenseExpiryDate?: string
  qualificationCert?: string
  qualificationExpiryDate?: string
  phone?: string
  email?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface DriverDetail extends DriverListItem {
  address?: string
  emergencyContact?: string
  emergencyPhone?: string
  notes?: string
}

/* ===============================================================
 * 建立/更新司機資料
 * =============================================================== */

export interface CreateDriverReq {
  name: string
  licenseNumber: string
  licenseType: string
  licenseExpiryDate?: string
  qualificationCert?: string
  qualificationExpiryDate?: string
  phone?: string
  email?: string
  address?: string
  emergencyContact?: string
  emergencyPhone?: string
  notes?: string
}

export interface UpdateDriverReq extends Partial<CreateDriverReq> {
  id: string
  status?: 'active' | 'inactive'
}
