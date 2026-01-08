import { OrderListItem } from "../Model";

export const MOCK_ORDERS: OrderListItem[] = [
  {
    "id": "1",
    "orderNo": "TOM-2026-0001",
    "customerName": "宏達國際物流股份有限公司",
    "pickupLocation": "桃園南崁倉",
    "destinationPort": "基隆港",
    "pickupDate": "2026-01-05",
    "containerCount": 2,
    "containers": [
      { "containerNo": "OOLU1234567" },
      { "containerNo": "OOLU1234568" }
    ],
    "orderStatus": "CREATED",
    "createdTime": "2026-01-03T09:20:00+08:00"
  },
  {
    "id": "2",
    "orderNo": "TOM-2026-0002",
    "customerName": "長榮供應鏈股份有限公司",
    "pickupLocation": "新竹物流園區",
    "destinationPort": "台中港",
    "pickupDate": "2026-01-06",
    "containerCount": 1,
    "containers": [
      { "containerNo": "MSCU7654321" }
    ],
    "orderStatus": "assigned",
    "createdTime": "2026-01-03T10:05:00+08:00"
  },
  {
    "id": "3",
    "orderNo": "TOM-2026-0003",
    "customerName": "聯合貿易有限公司",
    "pickupLocation": "高雄前鎮加工區",
    "destinationPort": "高雄港",
    "pickupDate": "2026-01-07",
    "containerCount": 3,
    "containers": [
      { "containerNo": "TGHU9988776" },
      { "containerNo": "TGHU9988777" },
      { "containerNo": "TGHU9988778" }
    ],
    "orderStatus": "in_transit",
    "createdTime": "2026-01-03T11:30:00+08:00"
  },
  {
    "id": "4",
    "orderNo": "TOM-2026-0004",
    "customerName": "亞洲冷鏈物流股份有限公司",
    "pickupLocation": "台北內湖冷鏈倉",
    "destinationPort": "基隆港",
    "pickupDate": "2026-01-08",
    "containerCount": 4,
    "containers": [
      { "containerNo": "CMAU4455661" },
      { "containerNo": "CMAU4455662" },
      { "containerNo": "CMAU4455663" },
      { "containerNo": "CMAU4455664" }
    ],
    "orderStatus": "completed",
    "createdTime": "2026-01-02T15:45:00+08:00"
  },
  {
    "id": "5",
    "orderNo": "TOM-2026-0005",
    "customerName": "鼎盛貿易股份有限公司",
    "pickupLocation": "台南永康工業區",
    "destinationPort": "安平港",
    "pickupDate": "2026-01-10",
    "containerCount": 1,
    "containers": [
      { "containerNo": "HLCU3344556" }
    ],
    "orderStatus": "cancelled",
    "createdTime": "2026-01-01T09:00:00+08:00"
  }
]
