// src/app/pages/tom/container/detail/__mock__/mockContainerDetail.ts
import { ContainerDetail } from "../detail/Model";

export const MOCK_CONTAINER_DETAIL_MAP: Record<string, ContainerDetail> = {
  'c-001': {
    id: '1',
    containerNo: 'OOLU1234567',
    type: '20GP',
    status: 'UNASSIGNED',
    weight: '12800 kg',
    remark: '一般貨',

    orderId: 'o-001',
    orderNo: 'TOM-2026-0001',
    customerName: '宏達國際物流股份有限公司',

    tasks: [
      {
        taskId: 't-001-1',
        seq: 1,
        fromLocation: '桃園南崁倉',
        toLocation: '基隆港',
        plannedStartAt: '2026-01-05T08:30:00+08:00',
        plannedEndAt: '2026-01-05T12:00:00+08:00',
        status: 'UNASSIGNED',
        remark: '待指派',
      },
    ],

    billing: {
      pricingMode: 'PER_CONTAINER',
      paymentTerm: 'MONTHLY',
      paymentStatus: 'UNBILLED',
      currency: 'TWD',
      subtotal: 8500,
      tax: 425,
      total: 8925,
      invoiceNeeded: true,
      invoiceTitle: '宏達國際物流股份有限公司',
      taxId: '12345678',
      remark: '月結 30 天',
    },

    dispatch: {
      status: 'UNASSIGNED',
      etaAt: '2026-01-05T08:30:00+08:00',
      remark: '尚未派車',
    },

    logs: [
      {
        time: '2026-01-03T09:20:00+08:00',
        action: 'CREATED',
        operator: '內勤-小林',
        remark: '建立貨櫃資料',
      },
      {
        time: '2026-01-03T10:10:00+08:00',
        action: 'TASK_CREATED',
        operator: '內勤-小林',
        remark: '建立任務 seq=1',
      },
    ],
  },

  'c-002': {
    id: '2',
    containerNo: 'HLCU3344556',
    type: '40RH',
    status: 'IN_PROGRESS',
    weight: '19240 kg',
    remark: '冷鏈貨物（需溫控）',

    orderId: 'o-002',
    orderNo: 'TOM-2026-0002',
    customerName: '長榮供應鏈股份有限公司',

    tasks: [
      {
        taskId: 't-002-1',
        seq: 1,
        fromLocation: '新竹物流園區',
        toLocation: '台中港',
        plannedStartAt: '2026-01-06T07:50:00+08:00',
        plannedEndAt: '2026-01-06T12:30:00+08:00',
        driverName: '陳大偉',
        vehicleNo: 'KAA-7788',
        status: 'IN_PROGRESS',
        remark: '冷鏈文件隨車',
      },
    ],

    billing: {
      pricingMode: 'PER_CONTAINER',
      paymentTerm: 'TRANSFER',
      paymentStatus: 'BILLED',
      currency: 'TWD',
      subtotal: 12000,
      tax: 600,
      total: 12600,
      invoiceNeeded: false,
      remark: '已請款待入帳',
    },

    dispatch: {
      status: 'IN_PROGRESS',
      driverName: '陳大偉',
      vehicleNo: 'KAA-7788',
      assignedAt: '2026-01-05T15:00:00+08:00',
      etaAt: '2026-01-06T07:50:00+08:00',
      remark: '已發車',
    },

    logs: [
      { time: '2026-01-03T10:05:00+08:00', action: 'CREATED', operator: '內勤-小張' },
      { time: '2026-01-05T15:00:00+08:00', action: 'ASSIGNED', operator: '調度-阿宏', remark: '指派 KAA-7788 / 陳大偉' },
      { time: '2026-01-06T08:05:00+08:00', action: 'IN_PROGRESS', operator: '司機-陳大偉', remark: '抵達取貨點' },
    ],
  },

  'c-003': {
    id: '3',
    containerNo: 'OOLU8888999',
    type: '20GP',
    status: 'CANCELLED',
    weight: '9800 kg',
    remark: '客戶取消',

    orderId: 'o-005',
    orderNo: 'TOM-2026-0005',
    customerName: '鼎盛貿易股份有限公司',

    tasks: [
      {
        taskId: 't-005-1',
        seq: 1,
        fromLocation: '台南永康工業區',
        toLocation: '安平港',
        plannedStartAt: '2026-01-10T09:00:00+08:00',
        plannedEndAt: '2026-01-10T12:00:00+08:00',
        status: 'CANCELLED',
        remark: '提貨前取消',
      },
    ],

    billing: {
      pricingMode: 'PER_CONTAINER',
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
      remark: '未派車',
    },

    logs: [
      { time: '2026-01-01T09:00:00+08:00', action: 'CREATED', operator: '內勤-小林' },
      { time: '2026-01-09T16:10:00+08:00', action: 'CANCELLED', operator: '內勤-小林', remark: '客戶通知取消' },
    ],
  },
}
