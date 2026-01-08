// src/app/config/rolePermissions.ts
/**
 * 角色權限配置
 * 定義每個角色擁有的權限列表
 * 基於 menuConfig.tsx 中的所有權限代碼
 */

export interface RolePermissions {
  role: string
  permissions: string[]
}

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  // 系統管理員 - 擁有所有權限
  系統管理員: [
    // UPMS
    'upms.user.read',
    'upms.user.create',
    'upms.user.update',
    'upms.role.read',
    'upms.role.create',
    'upms.permission.read',
    'upms.permission.create',
    'upms.system.read',
    'upms.system.create',
    // ADM
    'adm.dictionary.read',
    'adm.dictionary.create',
    'adm.param.read',
    'adm.param.create',
    'adm.notification.read',
    'adm.notification.create',
    'adm.audit.read',
    // TOM
    'tom.order.read',
    'tom.order.create',
    'tom.order.assign',
    'tom.order.report',
    'tom.container.read',
    'tom.container.create',
    'tom.task.read',
    'tom.task.create',
    // FMS
    'fms.vehicle.read',
    'fms.vehicle.create',
    'fms.driver.read',
    'fms.driver.create',
    'fms.dispatch.read',
    'fms.dispatch.create',
    'fms.dispatch.assign',
    'fms.dispatch.sign',
    'fms.dispatch.complete',
    'fms.dispatch.cancel',
    // HRM
    'hrm.driver.read',
    'hrm.schedule.read',
    'hrm.salary.read',
    // PORT
    'port.read',
    'port.create',
    // CRM
    'crm.customer.read',
    'crm.customer.create',
    'crm.customer.update',
    'crm.contract.read',
    'crm.contract.create',
    'crm.contract.update',
    'crm.portal.read',
  ],

  // 內勤人員 - 主要處理訂單相關操作
  內勤人員: [
    // UPMS - 只讀
    'upms.user.read',
    'upms.role.read',
    'upms.permission.read',
    'upms.system.read',
    // ADM - 只讀
    'adm.dictionary.read',
    'adm.param.read',
    'adm.notification.read',
    'adm.audit.read',
    // TOM - 完整權限
    'tom.order.read',
    'tom.order.create',
    'tom.order.assign',
    'tom.order.report',
    'tom.container.read',
    'tom.container.create',
    'tom.task.read',
    'tom.task.create',
    // FMS - 只讀
    'fms.vehicle.read',
    'fms.driver.read',
    'fms.dispatch.read',
    // HRM - 只讀
    'hrm.driver.read',
    'hrm.schedule.read',
    'hrm.salary.read',
    // PORT - 讀寫
    'port.read',
    'port.create',
  ],

  // 調度員 - 負責派遣和任務管理
  調度員: [
    // UPMS - 無權限
    // ADM - 只讀
    'adm.dictionary.read',
    'adm.param.read',
    // TOM - 任務相關
    'tom.order.read',
    'tom.order.assign',
    'tom.task.read',
    'tom.task.create',
    // FMS - 完整權限
    'fms.vehicle.read',
    'fms.vehicle.create',
    'fms.driver.read',
    'fms.driver.create',
    'fms.dispatch.read',
    'fms.dispatch.create',
    'fms.dispatch.assign',
    'fms.dispatch.sign',
    'fms.dispatch.complete',
    'fms.dispatch.cancel',
    // HRM - 只讀
    'hrm.driver.read',
    'hrm.schedule.read',
    // PORT - 只讀
    'port.read',
  ],

  // 司機 - 只能查看和簽收
  司機: [
    // TOM - 只能查看
    'tom.order.read',
    'tom.task.read',
    // FMS - 只能簽收
    'fms.dispatch.read',
    'fms.dispatch.sign',
    // HRM - 只能查看自己的資料
    'hrm.driver.read',
    'hrm.schedule.read',
    // PORT - 只讀
    'port.read',
  ],

  // 人資管理員 - 主要管理人資相關
  人資管理員: [
    // UPMS - 使用者管理
    'upms.user.read',
    'upms.user.create',
    'upms.user.update',
    'upms.role.read',
    // ADM - 只讀
    'adm.dictionary.read',
    'adm.param.read',
    // TOM - 無權限
    // FMS - 只讀
    'fms.driver.read',
    // HRM - 完整權限
    'hrm.driver.read',
    'hrm.schedule.read',
    'hrm.salary.read',
    // PORT - 無權限
  ],

  // 客戶 - 只能查看訂單相關
  客戶: [
    // TOM - 只能查看自己的訂單
    'tom.order.read',
    'tom.order.report',
    // PORT - 只讀
    'port.read',
  ],

  // 港口管理員 - 管理港口相關
  港口管理員: [
    // ADM - 只讀
    'adm.dictionary.read',
    'adm.param.read',
    // TOM - 查看訂單
    'tom.order.read',
    'tom.container.read',
    // PORT - 完整權限
    'port.read',
    'port.create',
  ],
}

/**
 * 獲取指定角色的權限列表
 */
export function getRolePermissions(role: string): string[] {
  return ROLE_PERMISSIONS[role] || []
}

/**
 * 檢查角色是否有指定權限
 */
export function hasRolePermission(role: string, permission: string): boolean {
  const permissions = getRolePermissions(role)
  return permissions.includes(permission)
}
