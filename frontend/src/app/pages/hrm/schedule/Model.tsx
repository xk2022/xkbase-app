/**
 * ===============================================================
 * HRM - Schedule Models (Frontend)
 * ===============================================================
 * 工時規劃：每日、每週上線
 */

/* ===============================================================
 * 工時規劃
 * =============================================================== */

export interface ScheduleListItem {
  id: string
  driverId: string
  driverName: string
  weekStartDate: string // 週開始日期 (YYYY-MM-DD)
  weekEndDate: string // 週結束日期 (YYYY-MM-DD)
  mondayHours?: number
  tuesdayHours?: number
  wednesdayHours?: number
  thursdayHours?: number
  fridayHours?: number
  saturdayHours?: number
  sundayHours?: number
  totalWeeklyHours: number
  status: 'draft' | 'confirmed' | 'completed'
  createdAt: string
  updatedAt: string
}

export interface DailySchedule {
  date: string // YYYY-MM-DD
  hours: number
  isOnline: boolean
}

export interface ScheduleDetail extends ScheduleListItem {
  dailySchedules: DailySchedule[]
  notes?: string
}

/* ===============================================================
 * 建立/更新工時規劃
 * =============================================================== */

export interface CreateScheduleReq {
  driverId: string
  weekStartDate: string
  weekEndDate: string
  mondayHours?: number
  tuesdayHours?: number
  wednesdayHours?: number
  thursdayHours?: number
  fridayHours?: number
  saturdayHours?: number
  sundayHours?: number
  notes?: string
}

export interface UpdateScheduleReq extends Partial<CreateScheduleReq> {
  id: string
  status?: 'draft' | 'confirmed' | 'completed'
}
