// src/_metronic/layout/components/sidebar/sidebar-menu/menuConfig.tsx
/**
 * 菜單配置
 * 定義每個菜單項對應的系統代碼和權限
 * 
 * 系統代碼對應：
 * - UPMS: 權限管理系統
 * - TOM: 訂單管理系統
 * - FMS: 車隊管理系統
 * - ADM: 系統設定
 * - PORT: 港口整合系統
 */

export type MenuSectionConfig = {
  sectionTitle?: string
  sectionIcon?: string // sectionTitle 的圖標
  items: MenuItemConfig[]
  requiredSystem?: string // 系統代碼，如 'UPMS', 'TOM', 'FMS', 'ADM'
  requiredPermission?: string // 權限代碼，如果設置，需要此權限才能顯示整個區塊
}

export type MenuItemConfig = {
  type: 'item' | 'submenu'
  to: string
  title: string
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
  requiredSystem?: string // 系統代碼
  requiredPermission?: string // 權限代碼
  children?: MenuItemConfig[] // 子菜單項
}

/**
 * 菜單配置
 * 根據系統代碼和權限來決定是否顯示
 */
export const MENU_CONFIG: MenuSectionConfig[] = [
//   {
//     items: [
//       {
//         type: 'item',
//         to: '/dashboard',
//         title: '儀錶板',
//         icon: 'element-11',
//         fontIcon: 'bi-app-indicator',
//       },
//     ],
//   },

  // UPMS 權限管理 - 整體區塊
  {
    // sectionTitle: 'UPMS 權限管理',
    requiredSystem: 'UPMS',
    items: [
      {
        type: 'item',
        to: '/upms/dashboard',
        title: 'UPMS 儀表板',
        icon: 'element-11',
        fontIcon: 'bi-app-indicator',
        requiredSystem: 'UPMS',
      },
    ],
  },

  // 使用者管理區塊
  {
    sectionTitle: '使用者管理',
    sectionIcon: 'user',
    requiredSystem: 'UPMS',
    items: [
      {
        type: 'item',
        to: '/upms/user/overview',
        title: '總覽使用者',
        icon: 'chart-line',
        hasBullet: true,
        requiredPermission: 'upms.user.read',
      },
      {
        type: 'item',
        to: '/upms/user/list',
        title: '使用者列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'upms.user.read',
      },
      {
        type: 'item',
        to: '/upms/user/create',
        title: '新增使用者',
        icon: 'plus',
        hasBullet: true,
        requiredPermission: 'upms.user.create',
      },
      {
        type: 'item',
        to: '/upms/user/security',
        title: '使用者安全設定',
        icon: 'lock',
        hasBullet: true,
        requiredPermission: 'upms.user.update',
      },
    ],
  },

  // 角色區塊
  {
    sectionTitle: '角色管理',
    sectionIcon: 'badge',
    requiredSystem: 'UPMS',
    items: [
      {
        type: 'item',
        to: '/upms/role/overview',
        title: '總覽角色',
        icon: 'chart-line',
        hasBullet: true,
        requiredPermission: 'upms.role.read',
      },
      {
        type: 'item',
        to: '/upms/role/list',
        title: '角色列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'upms.role.read',
      },
      {
        type: 'item',
        to: '/upms/role/create',
        title: '新增角色',
        icon: 'plus',
        hasBullet: true,
        requiredPermission: 'upms.role.create',
      },
    ],
  },

  // 權限區塊
  {
    sectionTitle: '權限設定',
    sectionIcon: 'check-circle',
    requiredSystem: 'UPMS',
    items: [
      {
        type: 'item',
        to: '/upms/permission/overview',
        title: '總覽權限',
        icon: 'chart-line',
        hasBullet: true,
        requiredPermission: 'upms.permission.read',
      },
      {
        type: 'item',
        to: '/upms/permission/list',
        title: '權限列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'upms.permission.read',
      },
      {
        type: 'item',
        to: '/upms/permission/create',
        title: '新增權限',
        icon: 'plus',
        hasBullet: true,
        requiredPermission: 'upms.permission.create',
      },
    ],
  },

  // 系統區塊
  {
    sectionTitle: '系統管理',
    sectionIcon: 'element-7',
    requiredSystem: 'UPMS',
    items: [
      {
        type: 'item',
        to: '/upms/system/overview',
        title: '總覽系統',
        icon: 'chart-line',
        hasBullet: true,
        requiredPermission: 'upms.system.read',
      },
      {
        type: 'item',
        to: '/upms/system/list',
        title: '系統列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'upms.system.read',
      },
      {
        type: 'item',
        to: '/upms/system/create',
        title: '新增系統',
        icon: 'plus',
        hasBullet: true,
        requiredPermission: 'upms.system.create',
      },
    ],
  },

  // ADM 系統設定 - 整體區塊
  {
    // sectionTitle: 'ADM 系統設定',
    requiredSystem: 'ADM',
    items: [
      {
        type: 'item',
        to: '/adm/dashboard',
        title: 'ADM 儀表板',
        icon: 'element-11',
        fontIcon: 'bi-app-indicator',
        requiredSystem: 'ADM',
      },
    ],
  },

  // 字典檔管理區塊
  {
    sectionTitle: '字典檔管理',
    sectionIcon: 'book-open',
    requiredSystem: 'ADM',
    items: [
      {
        type: 'item',
        to: '/adm/dictionary/overview',
        title: '總覽字典檔',
        icon: 'chart-line',
        hasBullet: true,
        requiredPermission: 'adm.dictionary.read',
      },
      {
        type: 'item',
        to: '/adm/dictionary/list',
        title: '字典檔列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'adm.dictionary.read',
      },
      {
        type: 'item',
        to: '/adm/dictionary/create',
        title: '新增字典檔',
        icon: 'plus',
        hasBullet: true,
        requiredPermission: 'adm.dictionary.create',
      },
    ],
  },

  // 系統參數區塊
  {
    sectionTitle: '系統參數管理',
    sectionIcon: 'slider-horizontal',
    requiredSystem: 'ADM',
    items: [
      {
        type: 'item',
        to: '/adm/param/overview',
        title: '總覽系統參數',
        icon: 'chart-line',
        hasBullet: true,
        requiredPermission: 'adm.param.read',
      },
      {
        type: 'item',
        to: '/adm/param/list',
        title: '系統參數列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'adm.param.read',
      },
      {
        type: 'item',
        to: '/adm/param/create',
        title: '新增系統參數',
        icon: 'plus',
        hasBullet: true,
        requiredPermission: 'adm.param.create',
      },
    ],
  },

  // 通知模板區塊
  {
    sectionTitle: '通知模板',
    sectionIcon: 'notification',
    requiredSystem: 'ADM',
    items: [
      {
        type: 'item',
        to: '/adm/notification-template/overview',
        title: '總覽通知',
        icon: 'chart-line',
        hasBullet: true,
        requiredPermission: 'adm.notification.read',
      },
      {
        type: 'item',
        to: '/adm/notification-template/list',
        title: '通知列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'adm.notification.read',
      },
      {
        type: 'item',
        to: '/adm/notification-template/create',
        title: '新增通知',
        icon: 'plus',
        hasBullet: true,
        requiredPermission: 'adm.notification.create',
      },
    ],
  },

  // 操作日誌區塊
  {
    sectionTitle: '操作日誌',
    sectionIcon: 'clipboard',
    requiredSystem: 'ADM',
    items: [
      {
        type: 'item',
        to: '/adm/audit-log/overview',
        title: '總覽日誌',
        icon: 'chart-line',
        hasBullet: true,
        requiredPermission: 'adm.audit.read',
      },
      {
        type: 'item',
        to: '/adm/audit-log/list',
        title: '日誌列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'adm.audit.read',
      },
    ],
  },

  // TOM 訂單管理 - 整體區塊
  {
    // sectionTitle: 'TOM 訂單管理',
    requiredSystem: 'TOM',
    items: [
      {
        type: 'item',
        to: '/tom/dashboard',
        title: 'TOM 訂單管理 儀表板',
        icon: 'element-11',
        fontIcon: 'bi-app-indicator',
        requiredSystem: 'TOM',
      },
    ],
  },

  // 訂單管理區塊
  {
    sectionTitle: '訂單管理',
    sectionIcon: 'briefcase',
    requiredSystem: 'TOM',
    items: [
      {
        type: 'item',
        to: '/tom/order/overview',
        title: '總覽訂單',
        icon: 'chart-line',
        hasBullet: true,
        requiredPermission: 'tom.order.read',
      },
      {
        type: 'item',
        to: '/tom/order/list',
        title: '訂單列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'tom.order.read',
      },
      {
        type: 'item',
        to: '/tom/order/create',
        title: '新增訂單',
        icon: 'plus',
        hasBullet: true,
        requiredPermission: 'tom.order.create',
      },
      {
        type: 'item',
        to: '/tom/order/assign',
        title: '訂單指派',
        icon: 'arrow-right',
        hasBullet: true,
        requiredPermission: 'tom.order.assign',
      },
      {
        type: 'item',
        to: '/tom/order/report',
        title: '訂單報表',
        icon: 'graph-3',
        hasBullet: true,
        requiredPermission: 'tom.order.report',
      },
    ],
  },

  // 貨櫃管理區塊
  {
    sectionTitle: '貨櫃管理',
    sectionIcon: 'cube-3',
    requiredSystem: 'TOM',
    items: [
      {
        type: 'item',
        to: '/tom/container/overview',
        title: '總覽貨櫃',
        icon: 'chart-line',
        hasBullet: true,
        requiredPermission: 'tom.container.read',
      },
      {
        type: 'item',
        to: '/tom/container/list',
        title: '貨櫃列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'tom.container.read',
      },
      {
        type: 'item',
        to: '/tom/container/create',
        title: '新增貨櫃',
        icon: 'plus',
        hasBullet: true,
        requiredPermission: 'tom.container.create',
      },
    ],
  },

  // 任務管理區塊
  {
    sectionTitle: '任務管理',
    sectionIcon: 'calendar-tick',
    requiredSystem: 'TOM',
    items: [
      {
        type: 'item',
        to: '/tom/tasks/overview',
        title: '總覽任務',
        icon: 'chart-line',
        hasBullet: true,
        requiredPermission: 'tom.task.read',
      },
      {
        type: 'item',
        to: '/tom/tasks/list',
        title: '任務列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'tom.task.read',
      },
      {
        type: 'item',
        to: '/tom/tasks/create',
        title: '新增任務',
        icon: 'plus',
        hasBullet: true,
        requiredPermission: 'tom.task.create',
      },
    ],
  },

  // FMS 車輛運輸 - 整體區塊
  {
    // sectionTitle: 'FMS 車輛運輸',
    requiredSystem: 'FMS',
    items: [
      {
        type: 'item',
        to: '/fms/dashboard',
        title: 'FMS 車輛運輸 儀表板',
        icon: 'element-11',
        fontIcon: 'bi-app-indicator',
        requiredSystem: 'FMS',
      },
    ],
  },

  // 車頭管理區塊
  {
    sectionTitle: '車頭管理',
    sectionIcon: 'truck',
    requiredSystem: 'FMS',
    items: [
      {
        type: 'item',
        to: '/fms/vehicle/overview',
        title: '總覽車頭',
        icon: 'chart-line',
        hasBullet: true,
        requiredPermission: 'fms.vehicle.read',
      },
      {
        type: 'item',
        to: '/fms/vehicle/list',
        title: '車頭列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'fms.vehicle.read',
      },
      {
        type: 'item',
        to: '/fms/vehicle/create',
        title: '新增車頭',
        icon: 'plus',
        hasBullet: true,
        requiredPermission: 'fms.vehicle.create',
      },
    ],
  },

  // 板車管理區塊
  {
    sectionTitle: '板車管理',
    sectionIcon: 'trailer',
    requiredSystem: 'FMS',
    items: [
      {
        type: 'item',
        to: '/fms/vehicle/overview',
        title: '總覽板車',
        icon: 'chart-line',
        hasBullet: true,
        requiredPermission: 'fms.vehicle.read',
      },
      {
        type: 'item',
        to: '/fms/vehicle/list',
        title: '板車列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'fms.vehicle.read',
      },
      {
        type: 'item',
        to: '/fms/vehicle/create',
        title: '新增板車',
        icon: 'plus',
        hasBullet: true,
        requiredPermission: 'fms.vehicle.create',
      },
    ],
  },

  // 司機管理區塊
  {
    sectionTitle: '司機管理',
    sectionIcon: 'user-tick',
    requiredSystem: 'FMS',
    items: [
      {
        type: 'item',
        to: '/fms/driver/overview',
        title: '總覽司機',
        icon: 'chart-line',
        hasBullet: true,
        requiredPermission: 'fms.driver.read',
      },
      {
        type: 'item',
        to: '/fms/driver/list',
        title: '司機列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'fms.driver.read',
      },
      {
        type: 'item',
        to: '/fms/driver/create',
        title: '新增司機',
        icon: 'plus',
        hasBullet: true,
        requiredPermission: 'fms.driver.create',
      },
    ],
  },

  // 派遣流程區塊
  {
    sectionTitle: '派遣流程',
    sectionIcon: 'logistic',
    requiredSystem: 'FMS',
    items: [
      {
        type: 'item',
        to: '/fms/dispatch/list',
        title: '派遣流程列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'fms.dispatch.read',
      },
      {
        type: 'item',
        to: '/fms/dispatch/start',
        title: '開始派遣',
        icon: 'arrow-right',
        hasBullet: true,
        requiredPermission: 'fms.dispatch.create',
      },
      {
        type: 'item',
        to: '/fms/dispatch/assign',
        title: '指派訂單',
        icon: 'arrow-right',
        hasBullet: true,
        requiredPermission: 'fms.dispatch.assign',
      },
      {
        type: 'item',
        to: '/fms/dispatch/sign',
        title: '簽收',
        icon: 'check-circle',
        hasBullet: true,
        requiredPermission: 'fms.dispatch.sign',
      },
      {
        type: 'item',
        to: '/fms/dispatch/complete',
        title: '完成派遣',
        icon: 'check-circle',
        hasBullet: true,
        requiredPermission: 'fms.dispatch.complete',
      },
      {
        type: 'item',
        to: '/fms/dispatch/cancel',
        title: '取消派遣',
        icon: 'cross-circle',
        hasBullet: true,
        requiredPermission: 'fms.dispatch.cancel',
      },
    ],
  },

  // HRM 人資管理 - 整體區塊
  {
    // sectionTitle: 'HRM 人資管理',
    requiredSystem: 'HRM',
    items: [
      {
        type: 'item',
        to: '/hrm/dashboard',
        title: 'HRM 人資管理 儀表板',
        icon: 'element-11',
        fontIcon: 'bi-app-indicator',
        requiredSystem: 'HRM',
      },
    ],
  },

  // 司機資料台帳區塊
  {
    sectionTitle: '司機資料台帳',
    sectionIcon: 'profile-user',
    requiredSystem: 'HRM',
    items: [
      {
        type: 'item',
        to: '/hrm/driver/list',
        title: '司機資料列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'hrm.driver.read',
      },
    ],
  },

  // 工時規劃區塊
  {
    sectionTitle: '工時規劃',
    sectionIcon: 'calendar',
    requiredSystem: 'HRM',
    items: [
      {
        type: 'item',
        to: '/hrm/schedule/list',
        title: '工時規劃列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'hrm.schedule.read',
      },
    ],
  },

  // 薪資計算區塊
  {
    sectionTitle: '薪資計算',
    sectionIcon: 'finance-calculator',
    requiredSystem: 'HRM',
    items: [
      {
        type: 'item',
        to: '/hrm/salary/list',
        title: '薪資計算公式列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'hrm.salary.read',
      },
    ],
  },

  // PORT 港口整合 - 整體區塊
  {
    // sectionTitle: 'PORT 港口整合',
    requiredSystem: 'PORT',
    items: [
      {
        type: 'item',
        to: '/port/dashboard',
        title: 'PORT 港口整合 儀表板',
        icon: 'ship',
        fontIcon: 'bi-app-indicator',
        requiredSystem: 'PORT',
      },
    ],
  },

  // 港口管理區塊
  {
    sectionTitle: '港口管理',
    sectionIcon: 'ship',
    requiredSystem: 'PORT',
    items: [
      {
        type: 'item',
        to: '/port/list',
        title: '港口列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'port.read',
      },
      {
        type: 'item',
        to: '/port/create',
        title: '新增港口',
        icon: 'plus',
        hasBullet: true,
        requiredPermission: 'port.create',
      },
    ],
  },

  // CRM 客戶管理 - 整體區塊
  {
    // sectionTitle: 'CRM 客戶管理',
    requiredSystem: 'CRM',
    items: [
      {
        type: 'item',
        to: '/crm/dashboard',
        title: 'CRM 客戶管理 儀表板',
        icon: 'people',
        fontIcon: 'bi-app-indicator',
        requiredSystem: 'CRM',
      },
    ],
  },

  // 客戶管理區塊
  {
    sectionTitle: '客戶管理',
    sectionIcon: 'people',
    requiredSystem: 'CRM',
    items: [
      {
        type: 'item',
        to: '/crm/customer/list',
        title: '客戶清單',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'crm.customer.read',
      },
    ],
  },

  // 合約模板區塊
  {
    sectionTitle: '合約模板',
    sectionIcon: 'document',
    requiredSystem: 'CRM',
    items: [
      {
        type: 'item',
        to: '/crm/contract/list',
        title: '合約模板列表',
        icon: 'row-vertical',
        hasBullet: true,
        requiredPermission: 'crm.contract.read',
      },
    ],
  },

  // 客戶入口區塊
  {
    sectionTitle: '客戶入口',
    sectionIcon: 'login',
    requiredSystem: 'CRM',
    items: [
      {
        type: 'item',
        to: '/crm/portal',
        title: '線上提單與進度查詢',
        icon: 'search-list',
        hasBullet: true,
        requiredPermission: 'crm.portal.read',
      },
    ],
  },
]