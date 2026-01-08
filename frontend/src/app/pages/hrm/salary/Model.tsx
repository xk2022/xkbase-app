/**
 * ===============================================================
 * HRM - Salary Models (Frontend)
 * ===============================================================
 * 薪資計算公式：趟次費、加班費、夜間補貼
 */

/* ===============================================================
 * 薪資計算公式
 * =============================================================== */

export interface SalaryFormulaListItem {
  id: string
  formulaName: string
  driverId?: string
  driverName?: string
  tripFee: number // 趟次費
  overtimeRate: number // 加班費率（每小時）
  nightShiftSubsidy: number // 夜間補貼（每小時）
  effectiveDate: string // 生效日期
  expiryDate?: string // 失效日期
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface SalaryCalculation {
  driverId: string
  driverName: string
  period: string // 計算期間 (YYYY-MM)
  totalTrips: number // 總趟次
  totalTripFee: number // 總趟次費
  totalOvertimeHours: number // 總加班時數
  totalOvertimeFee: number // 總加班費
  totalNightShiftHours: number // 總夜間時數
  totalNightShiftSubsidy: number // 總夜間補貼
  totalSalary: number // 總薪資
  calculatedAt: string
}

export interface SalaryDetail extends SalaryFormulaListItem {
  notes?: string
  calculations?: SalaryCalculation[]
}

/* ===============================================================
 * 建立/更新薪資計算公式
 * =============================================================== */

export interface CreateSalaryFormulaReq {
  formulaName: string
  driverId?: string
  tripFee: number
  overtimeRate: number
  nightShiftSubsidy: number
  effectiveDate: string
  expiryDate?: string
  notes?: string
}

export interface UpdateSalaryFormulaReq extends Partial<CreateSalaryFormulaReq> {
  id: string
  status?: 'active' | 'inactive'
}
