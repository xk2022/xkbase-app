// src/app/pages/tom/order/detail/__mock__/mockOrderDetail.ts
import type { OrderDetail } from './Model'

export const MOCK_ORDER_DETAIL_MAP: Record<string, OrderDetail> = {
  '1': {
    // ------------------------------
    // 基本訂單資料（Summary）
    // ------------------------------
    id: '1',
    orderNo: 'TOM-2026-0001',
    customerName: '宏達國際物流股份有限公司',
    pickupLocation: '桃園南崁倉',
    destinationPort: '基隆港',
    pickupDate: '2026-01-05',
    containerCount: 5,
    orderStatus: 'CREATED',
    createdTime: '2026-01-03T09:20:00+08:00',

    // ------------------------------
    // 貨櫃清單（Containers）
    // ------------------------------
    containers: [
      { containerNo: 'OOLU1234567', containerType: '20GP', weightKg: 12800, remark: '一般貨' },
      { containerNo: 'OOLU1234568', containerType: '20GP', weightKg: 13150, remark: '需注意破損' },
      { containerNo: 'MSCU7654321', containerType: '40HQ', weightKg: 17320, remark: '高價貨，勿碰撞' },
      { containerNo: 'TGHU9988776', containerType: '40HQ', weightKg: 18100, remark: '需等待裝櫃完成通知' },
      { containerNo: 'CMAU4455661', containerType: '45HQ', weightKg: 16580, remark: '裝卸需預留人力' },
    ],

    // ------------------------------
    // 計費與支付方式（Billing）
    // ------------------------------
    billing: {
      pricingMode: 'PER_CONTAINER',
      paymentTerm: 'MONTHLY',
      paymentStatus: 'UNBILLED',
      currency: 'TWD',

      subtotal: 42500,
      tax: 2125,
      total: 44625,

      invoiceNeeded: true,
      invoiceTitle: '宏達國際物流股份有限公司',
      taxId: '12345678',

      remark: '月結 30 天；吊櫃費用另計（如現場發生則加收）',
    },

    // ------------------------------
    // 派車與執行資訊（Dispatch）
    // ------------------------------
    dispatch: {
      status: 'UNASSIGNED',
      vehicleNo: undefined,
      driverName: undefined,
      assignedAt: undefined,
      etaAt: '2026-01-05T08:30:00+08:00',
      remark: '預計 08:30 到場，待指派車輛/司機',
    },

    // ------------------------------
    // 狀態歷程（Logs）
    // ------------------------------
    logs: [
      {
        time: '2026-01-03T09:20:00+08:00',
        action: 'CREATED',
        operator: '內勤-小林',
        remark: '建立訂單，已確認起訖與提貨日期',
      },
      {
        time: '2026-01-03T10:10:00+08:00',
        action: 'CONTAINERS_UPDATED',
        operator: '內勤-小林',
        remark: '更新貨櫃清單（共 5 櫃）',
      },
      {
        time: '2026-01-03T11:00:00+08:00',
        action: 'BILLING_DRAFTED',
        operator: '財務-雅婷',
        remark: '建立計費草稿：按櫃計費、月結',
      },
      {
        time: '2026-01-04T17:30:00+08:00',
        action: 'DISPATCH_PENDING',
        operator: '調度-阿宏',
        remark: '待確認車況與司機班表，隔日早上派車',
      },
    ],
  },

  '2': {
    id: '2',
    orderNo: 'TOM-2026-0002',
    customerName: '長榮供應鏈股份有限公司',
    pickupLocation: '新竹物流園區',
    destinationPort: '台中港',
    pickupDate: '2026-01-06',
    containerCount: 2,
    orderStatus: 'assigned',
    createdTime: '2026-01-03T10:05:00+08:00',

    containers: [
      { containerNo: 'HLCU3344556', containerType: '40HQ', weightKg: 19240, remark: '需冷鏈（溫控文件補上）' },
      { containerNo: 'HLCU3344557', containerType: '40HQ', weightKg: 18890, remark: '同車同趟' },
    ],

    billing: {
      pricingMode: 'PER_ORDER',
      paymentTerm: 'TRANSFER',
      paymentStatus: 'BILLED',
      currency: 'TWD',

      subtotal: 18000,
      tax: 900,
      total: 18900,

      invoiceNeeded: false,
      remark: '已請款，待入帳確認',
    },

    dispatch: {
      status: 'ASSIGNED',
      vehicleNo: 'KAA-7788',
      driverName: '陳大偉',
      assignedAt: '2026-01-05T15:00:00+08:00',
      etaAt: '2026-01-06T07:50:00+08:00',
      remark: '司機已確認；到場後先與倉管聯繫',
    },

    logs: [
      {
        time: '2026-01-03T10:05:00+08:00',
        action: 'CREATED',
        operator: '內勤-小張',
        remark: '建立訂單',
      },
      {
        time: '2026-01-05T15:00:00+08:00',
        action: 'ASSIGNED',
        operator: '調度-阿宏',
        remark: '指派車輛 KAA-7788、司機 陳大偉',
      },
      {
        time: '2026-01-05T16:20:00+08:00',
        action: 'BILLED',
        operator: '財務-雅婷',
        remark: '已開立請款資料（匯款）',
      },
    ],
  },

  '3': {
    id: '3',
    orderNo: 'TOM-2026-0003',
    customerName: '聯合貿易有限公司',
    pickupLocation: '高雄前鎮加工區',
    destinationPort: '高雄港',
    pickupDate: '2026-01-07',
    containerCount: 1,
    orderStatus: 'in_transit',
    createdTime: '2026-01-03T11:30:00+08:00',

    containers: [
      { containerNo: 'TGHU9988777', containerType: '20GP', weightKg: 11420, remark: '一般貨' },
    ],

    billing: {
      pricingMode: 'PER_TRIP',
      paymentTerm: 'COD',
      paymentStatus: 'BILLED',
      currency: 'TWD',

      subtotal: 8500,
      tax: 425,
      total: 8925,

      invoiceNeeded: true,
      invoiceTitle: '聯合貿易有限公司',
      taxId: '87654321',
      remark: '到付；現場簽收後收款',
    },

    dispatch: {
      status: 'IN_PROGRESS',
      vehicleNo: 'KBC-5566',
      driverName: '林志豪',
      assignedAt: '2026-01-06T18:10:00+08:00',
      etaAt: '2026-01-07T09:00:00+08:00',
      remark: '已進場；等待裝卸完成',
    },

    logs: [
      {
        time: '2026-01-03T11:30:00+08:00',
        action: 'CREATED',
        operator: '內勤-小林',
      },
      {
        time: '2026-01-06T18:10:00+08:00',
        action: 'ASSIGNED',
        operator: '調度-阿宏',
        remark: '指派車輛 KBC-5566、司機 林志豪',
      },
      {
        time: '2026-01-07T08:55:00+08:00',
        action: 'IN_PROGRESS',
        operator: '司機-林志豪',
        remark: '抵達取貨地點，等待進場',
      },
    ],
  },

  '4': {
    id: '4',
    orderNo: 'TOM-2026-0004',
    customerName: '亞洲冷鏈物流股份有限公司',
    pickupLocation: '台北內湖冷鏈倉',
    destinationPort: '基隆港',
    pickupDate: '2026-01-08',
    containerCount: 3,
    orderStatus: 'completed',
    createdTime: '2026-01-02T15:45:00+08:00',

    containers: [
      { containerNo: 'CMAU4455662', containerType: '40RH', weightKg: 16900, remark: '冷鏈 RH（需溫度紀錄）' },
      { containerNo: 'CMAU4455663', containerType: '40RH', weightKg: 17120, remark: '冷鏈 RH（同趟）' },
      { containerNo: 'CMAU4455664', containerType: '40RH', weightKg: 16850, remark: '冷鏈 RH（同趟）' },
    ],

    billing: {
      pricingMode: 'PACKAGE',
      paymentTerm: 'MONTHLY',
      paymentStatus: 'PAID',
      currency: 'TWD',

      subtotal: 52000,
      tax: 2600,
      total: 54600,

      invoiceNeeded: true,
      invoiceTitle: '亞洲冷鏈物流股份有限公司',
      taxId: '24682468',
      remark: '已收款；溫度紀錄檔已提供',
    },

    dispatch: {
      status: 'DONE',
      vehicleNo: 'KAD-9090',
      driverName: '張家豪',
      assignedAt: '2026-01-07T13:30:00+08:00',
      etaAt: '2026-01-08T07:30:00+08:00',
      remark: '已完成；回傳簽收與照片',
    },

    logs: [
      { time: '2026-01-02T15:45:00+08:00', action: 'CREATED', operator: '內勤-小張' },
      { time: '2026-01-07T13:30:00+08:00', action: 'ASSIGNED', operator: '調度-阿宏', remark: '已派車' },
      { time: '2026-01-08T07:35:00+08:00', action: 'IN_PROGRESS', operator: '司機-張家豪', remark: '到場取貨' },
      { time: '2026-01-08T11:20:00+08:00', action: 'COMPLETED', operator: '司機-張家豪', remark: '已送達並簽收' },
      { time: '2026-01-10T10:00:00+08:00', action: 'PAID', operator: '財務-雅婷', remark: '已入帳' },
    ],
  },

  '5': {
    id: '5',
    orderNo: 'TOM-2026-0005',
    customerName: '鼎盛貿易股份有限公司',
    pickupLocation: '台南永康工業區',
    destinationPort: '安平港',
    pickupDate: '2026-01-10',
    containerCount: 1,
    orderStatus: 'cancelled',
    createdTime: '2026-01-01T09:00:00+08:00',

    containers: [
      { containerNo: 'OOLU8888999', containerType: '20GP', weightKg: 9800, remark: '客戶取消' },
    ],

    billing: {
      pricingMode: 'PER_ORDER',
      paymentTerm: 'TRANSFER',
      paymentStatus: 'UNBILLED',
      currency: 'TWD',

      subtotal: 0,
      tax: 0,
      total: 0,

      invoiceNeeded: false,
      remark: '已取消，未產生費用',
    },

    dispatch: {
      status: 'CANCELLED',
      remark: '客戶於提貨前一天取消',
    },

    logs: [
      { time: '2026-01-01T09:00:00+08:00', action: 'CREATED', operator: '內勤-小林' },
      {
        time: '2026-01-09T16:10:00+08:00',
        action: 'CANCELLED',
        operator: '內勤-小林',
        remark: '客戶通知取消，未派車',
      },
    ],
  },
}
