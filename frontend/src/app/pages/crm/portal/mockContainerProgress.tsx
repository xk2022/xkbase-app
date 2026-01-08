// src/app/pages/crm/portal/mockContainerProgress.tsx
import type { ContainerProgress } from '../Model'

// Mock 貨櫃進度數據映射
export const MOCK_CONTAINER_PROGRESS_MAP: Record<string, ContainerProgress> = {
  'TGHU1234567': {
    containerNo: 'TGHU1234567',
    orderNo: 'ORD-2024-001',
    status: 'in_transit',
    currentLocation: '桃園物流中心',
    pickupDate: '2024-03-01',
    estimatedDeliveryDate: '2024-03-05',
    actualDeliveryDate: undefined,
    trackingEvents: [
      {
        id: '1',
        time: '2024-03-01T08:00:00Z',
        location: '台北港',
        status: 'pending',
        description: '貨櫃已提領',
        operator: '司機 張三',
      },
      {
        id: '2',
        time: '2024-03-01T10:30:00Z',
        location: '台北港',
        status: 'pending',
        description: '貨物裝載完成',
        operator: '倉管 李四',
      },
      {
        id: '3',
        time: '2024-03-02T10:30:00Z',
        location: '桃園物流中心',
        status: 'in_transit',
        description: '貨物已裝載，運送中',
        operator: '系統',
      },
    ],
  },
  'TGHU7654321': {
    containerNo: 'TGHU7654321',
    orderNo: 'ORD-2024-002',
    status: 'arrived',
    currentLocation: '台中倉庫',
    pickupDate: '2024-03-10',
    estimatedDeliveryDate: '2024-03-12',
    actualDeliveryDate: undefined,
    trackingEvents: [
      {
        id: '1',
        time: '2024-03-10T09:00:00Z',
        location: '高雄港',
        status: 'pending',
        description: '貨櫃已提領',
        operator: '司機 王五',
      },
      {
        id: '2',
        time: '2024-03-10T11:00:00Z',
        location: '高雄港',
        status: 'pending',
        description: '貨物裝載完成',
        operator: '倉管 趙六',
      },
      {
        id: '3',
        time: '2024-03-11T14:00:00Z',
        location: '台中倉庫',
        status: 'in_transit',
        description: '運送中，預計今日抵達',
        operator: '系統',
      },
      {
        id: '4',
        time: '2024-03-12T10:00:00Z',
        location: '台中倉庫',
        status: 'arrived',
        description: '貨櫃已抵達目的地',
        operator: '系統',
      },
    ],
  },
  'TGHU9876543': {
    containerNo: 'TGHU9876543',
    orderNo: 'ORD-2024-003',
    status: 'delivered',
    currentLocation: '客戶倉庫',
    pickupDate: '2024-02-20',
    estimatedDeliveryDate: '2024-02-25',
    actualDeliveryDate: '2024-02-24',
    trackingEvents: [
      {
        id: '1',
        time: '2024-02-20T08:00:00Z',
        location: '基隆港',
        status: 'pending',
        description: '貨櫃已提領',
        operator: '司機 陳七',
      },
      {
        id: '2',
        time: '2024-02-20T10:00:00Z',
        location: '基隆港',
        status: 'pending',
        description: '貨物裝載完成',
        operator: '倉管 林八',
      },
      {
        id: '3',
        time: '2024-02-21T12:00:00Z',
        location: '新竹物流中心',
        status: 'in_transit',
        description: '運送中',
        operator: '系統',
      },
      {
        id: '4',
        time: '2024-02-23T15:00:00Z',
        location: '客戶倉庫',
        status: 'arrived',
        description: '貨櫃已抵達目的地',
        operator: '系統',
      },
      {
        id: '5',
        time: '2024-02-24T09:00:00Z',
        location: '客戶倉庫',
        status: 'delivered',
        description: '貨物已交付客戶',
        operator: '司機 陳七',
      },
    ],
  },
  'TGHU1111111': {
    containerNo: 'TGHU1111111',
    orderNo: 'ORD-2024-004',
    status: 'pending',
    currentLocation: '台北港',
    pickupDate: '2024-03-15',
    estimatedDeliveryDate: '2024-03-18',
    actualDeliveryDate: undefined,
    trackingEvents: [
      {
        id: '1',
        time: '2024-03-15T08:00:00Z',
        location: '台北港',
        status: 'pending',
        description: '貨櫃已提領，等待裝載',
        operator: '司機 周九',
      },
    ],
  },
}

// 根據貨櫃號獲取 Mock 數據（支持部分匹配）
export function getMockContainerProgress(containerNo: string): ContainerProgress | null {
  // 精確匹配
  if (MOCK_CONTAINER_PROGRESS_MAP[containerNo]) {
    return MOCK_CONTAINER_PROGRESS_MAP[containerNo]
  }

  // 部分匹配（用於測試）
  const matchedKey = Object.keys(MOCK_CONTAINER_PROGRESS_MAP).find(key =>
    key.includes(containerNo) || containerNo.includes(key)
  )

  if (matchedKey) {
    return MOCK_CONTAINER_PROGRESS_MAP[matchedKey]
  }

  // 如果找不到，返回一個默認的 Mock 數據
  return {
    containerNo,
    orderNo: `ORD-${Date.now()}`,
    status: 'pending',
    currentLocation: '台北港',
    pickupDate: new Date().toISOString().split('T')[0],
    estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    trackingEvents: [
      {
        id: '1',
        time: new Date().toISOString(),
        location: '台北港',
        status: 'pending',
        description: '貨櫃已提領，等待處理',
        operator: '系統',
      },
    ],
  }
}
