# 訂單管理模組 (Order Management Module)

## 📋 模組概述

訂單管理模組負責處理進出口貨運的訂單管理，包含訂單建立、編輯、派單、進度追蹤與狀態更新，以提升貨運管理的效率。

## 🎯 功能範圍

- ✅ 訂單建立 (出口/進口)
- ✅ 訂單狀態追蹤
- ✅ 訂單指派 (自動/手動)
- ✅ 訂單進度更新
- ✅ 訂單歷史查詢
- ✅ 匯出報表
- ✅ 客戶管理整合

## 🏗️ 架構設計

### 文件結構
```
src/app/pages/order/
├── index.tsx                 # 主路由組件
├── types.ts                  # TypeScript 類型定義
├── constants.ts              # 常數定義
├── utils.ts                  # 工具函數
├── api.ts                    # API 接口
├── hooks.ts                  # React Query hooks
├── Overview.tsx              # 訂單總覽
├── OrderList.tsx             # 訂單列表
├── OrderCreate.tsx           # 建立訂單
├── OrderEdit.tsx             # 編輯訂單
├── OrderDetail.tsx           # 訂單詳情
├── OrderAssign.tsx           # 訂單指派
├── OrderReport.tsx           # 訂單報表
└── components/
    ├── CustomerSelect.tsx    # 客戶選擇組件
    └── ToastNotification.tsx # 通知組件
```

### 路由配置
```typescript
/order/overview     - 訂單總覽
/order/list         - 訂單列表
/order/create       - 建立訂單
/order/edit/:id     - 編輯訂單
/order/detail/:id   - 訂單詳情
/order/assign       - 訂單指派
/order/report       - 訂單報表
```

## 📊 資料結構

### 訂單主體結構
```typescript
interface Order {
  id: string
  orderNumber: string        // 訂單編號 (自動生成)
  type: OrderType           // 'EXPORT' | 'IMPORT'
  status: OrderStatus       // 訂單狀態
  createdAt: string
  updatedAt: string
  customerId: string
  customerName: string
  assignedTo?: string       // 指派對象
  vehicleId?: string        // 車輛ID
  exportDetails?: ExportOrderDetails
  importDetails?: ImportOrderDetails
  notes?: string
  history: OrderHistory[]   // 操作歷史
}
```

### 訂單狀態
```typescript
type OrderStatus = 
  | 'PENDING'     // 待處理
  | 'ASSIGNED'    // 已指派
  | 'IN_TRANSIT'  // 運送中
  | 'COMPLETED'   // 完成
  | 'CANCELLED'   // 取消
```

### 出口訂單詳情
```typescript
interface ExportOrderDetails {
  date: string                    // 日期
  shippingCompany: string         // 船公司
  shipName: string                // 船名/航次
  voyage: string                  // 航次
  customsClearanceDate: string    // 結關日
  containerPickupCode: string     // 領櫃代號
  containerType: string           // 櫃型 (20GP/40GP/40HQ/45HQ)
  containerPickupLocation: string // 領櫃場
  containerNumber: string         // 櫃號
  containerDropoffLocation: string // 交櫃場
  loadingLocation: string         // 上貨地點
  loadingDate: string             // 上貨日期
  loadingTime: string             // 上貨時間
  notes?: string                  // 備註
}
```

### 進口訂單詳情
```typescript
interface ImportOrderDetails {
  date: string                      // 日期
  deliveryOrderLocation: string     // 提貨單位置(DO)
  shippingCompany: string           // 船公司
  shipName?: string                 // 船名/航次
  voyage?: string                   // 航次
  containerNumber: string           // 櫃號
  containerType: string             // 櫃型
  containerYard: string             // 櫃場
  containerPickupDeadline: string   // 領櫃期限
  deliveryLocation: string          // 送貨地點
  deliveryDate: string              // 送貨日期
  deliveryTime: string              // 送貨時間
  containerReturnLocation: string   // 還櫃地點
  containerReturnDate: string       // 還櫃日期
  containerReturnTime: string       // 還櫃時間
  notes?: string                    // 備註
}
```

## 🔧 功能詳細說明

### 1. 訂單總覽 (Overview)
- **統計卡片**: 總訂單數、待處理、運送中、今日訂單
- **快速操作**: 建立新訂單、查看所有訂單、訂單指派、匯出報表
- **狀態統計**: 各狀態訂單數量視覺化顯示

### 2. 訂單列表 (OrderList)
- **搜尋功能**: 支援訂單號、客戶名稱搜尋
- **篩選功能**: 依狀態、類型、日期範圍篩選
- **操作功能**: 查看詳情、編輯、刪除
- **分頁顯示**: 支援大量資料分頁載入

### 3. 建立訂單 (OrderCreate)
- **客戶選擇**: 支援現有客戶選擇或新增客戶
- **動態表單**: 根據出口/進口類型顯示不同欄位
- **資料驗證**: 前端即時驗證必填欄位
- **API 整合**: 使用 React Query 處理資料提交
- **錯誤處理**: 完整的錯誤訊息顯示
- **成功通知**: Toast 通知與頁面導航

### 4. 訂單編輯 (OrderEdit)
- **權限控制**: 只有特定狀態的訂單可編輯
- **修改記錄**: 記錄所有修改歷史
- **表單預填**: 載入現有資料進行編輯

### 5. 訂單詳情 (OrderDetail)
- **完整資訊**: 顯示訂單所有詳細資料
- **進度追蹤**: 時間軸方式顯示訂單進度
- **操作記錄**: 完整的操作歷史記錄
- **快速操作**: 編輯、指派、狀態更新

### 6. 訂單指派 (OrderAssign)
- **自動指派**: 根據車輛可用性、路線自動分配
- **手動指派**: 人工選擇可用車輛進行分配
- **車輛管理**: 顯示可用車輛狀態
- **指派記錄**: 記錄指派歷史

### 7. 訂單報表 (OrderReport)
- **報表類型**: 日報表、週報表、月報表、自訂區間
- **篩選條件**: 狀態、類型、客戶、日期範圍
- **匯出格式**: Excel、PDF、CSV
- **資料統計**: 訂單數量、完成率等統計資料

## 🔗 API 整合

### React Query Hooks
```typescript
// 資料查詢
useOrderStatistics()          // 訂單統計
useOrders(params)             // 訂單列表
useOrder(id)                  // 單一訂單
useOrderHistory(id)           // 訂單歷史

// 資料操作
useCreateOrder()              // 建立訂單
useUpdateOrder()              // 更新訂單
useDeleteOrder()              // 刪除訂單
useAssignOrder()              // 指派訂單
useUpdateOrderStatus()        // 更新狀態
useExportOrderReport()        // 匯出報表
```

### API 端點
```typescript
// 訂單管理
GET    /api/order/statistics   // 取得統計資料
GET    /api/order              // 取得訂單列表
GET    /api/order/:id          // 取得單一訂單
POST   /api/order              // 建立新訂單
PUT    /api/order/:id          // 更新訂單
DELETE /api/order/:id          // 刪除訂單

// 訂單操作
POST   /api/order/:id/assign   // 指派訂單
POST   /api/order/:id/status   // 更新狀態
GET    /api/order/:id/history  // 取得歷史記錄
GET    /api/order/export       // 匯出報表
```

## 🛡️ 權限控制

### 權限定義
```typescript
const ORDER_PERMISSIONS = {
  READ: 'order:read',       // 訂單查看
  CREATE: 'order:create',   // 訂單建立
  UPDATE: 'order:update',   // 訂單編輯
  DELETE: 'order:delete',   // 訂單刪除
  ASSIGN: 'order:assign',   // 訂單指派
  STATUS: 'order:status',   // 狀態更新
}
```

### 業務邏輯權限
```typescript
// 訂單狀態控制
canEditOrder(status)        // 只有 PENDING/ASSIGNED 可編輯
canDeleteOrder(status)      // 只有 PENDING 可刪除
canAssignOrder(status)      // 只有 PENDING 可指派
canUpdateOrderStatus(status) // 不是 COMPLETED/CANCELLED 可更新
```

## 📱 用戶體驗

### 互動設計
- **即時反饋**: 表單驗證、Loading 狀態、錯誤提示
- **視覺回饋**: 狀態顏色、進度條、圖示
- **操作確認**: 刪除確認、重要操作二次確認
- **快速操作**: 快捷鍵、批量操作

### 響應式設計
- **桌面端**: 完整功能、多欄位並排顯示
- **平板端**: 適應中等螢幕、保持核心功能
- **手機端**: 簡化介面、重要功能優先

## 🔍 搜尋與篩選

### 搜尋功能
- **模糊搜尋**: 訂單號、客戶名稱
- **即時搜尋**: 輸入即時顯示結果
- **搜尋歷史**: 記錄常用搜尋條件

### 篩選功能
- **狀態篩選**: 單選或多選狀態
- **類型篩選**: 出口/進口
- **日期篩選**: 建立日期、更新日期範圍
- **客戶篩選**: 依客戶分類

## 📊 資料統計

### 統計指標
- **訂單數量**: 總數、各狀態數量
- **完成率**: 完成訂單/總訂單
- **時間分析**: 日、週、月統計
- **客戶分析**: 各客戶訂單數量

### 視覺化
- **卡片顯示**: 重要指標卡片
- **圖表展示**: 趨勢圖、圓餅圖
- **進度條**: 完成進度視覺化

## 🚀 效能優化

### 前端優化
- **虛擬滾動**: 大量資料列表
- **懶載入**: 組件按需載入
- **快取機制**: React Query 自動快取
- **防抖搜尋**: 減少不必要的 API 呼叫

### 資料載入
- **分頁載入**: 避免一次載入大量資料
- **預載入**: 預載入相關資料
- **背景更新**: 自動更新快取資料

## 🧪 測試策略

### 單元測試
- **組件測試**: 每個組件的功能測試
- **Hook 測試**: React Query hooks 測試
- **工具函數**: 驗證、格式化函數測試

### 整合測試
- **API 整合**: 模擬 API 回應測試
- **表單流程**: 完整的表單提交流程
- **路由導航**: 頁面間導航測試

## 🔧 開發環境設定

### 技術棧
- **React 18**: 前端框架
- **TypeScript**: 類型安全
- **React Query v5**: 資料狀態管理
- **React Router**: 路由管理
- **Metronic**: UI 框架

### 開發工具
- **Vite**: 建置工具
- **ESLint**: 程式碼規範
- **Prettier**: 程式碼格式化
- **VS Code**: 開發編輯器

## 📋 部署清單

### 前端部署
- [ ] 建置生產版本
- [ ] 環境變數設定
- [ ] API 端點配置
- [ ] 靜態資源優化

### 後端準備
- [ ] 資料庫 Schema 建立
- [ ] API 端點實作
- [ ] 權限系統整合
- [ ] 資料遷移腳本

## 🔮 未來擴展

### 進階功能
- **GPS 追蹤**: 即時位置追蹤
- **自動化流程**: 工作流程自動化
- **行動應用**: 手機 APP 開發
- **整合物聯網**: 設備狀態監控

### 系統整合
- **ERP 系統**: 企業資源規劃整合
- **會計系統**: 財務資料同步
- **物流系統**: 第三方物流整合
- **客戶系統**: CRM 系統整合

## 📞 支援與維護

### 技術支援
- **錯誤監控**: 即時錯誤追蹤
- **效能監控**: 系統效能監控
- **使用者反饋**: 回饋收集機制
- **版本管理**: 功能版本控制

### 維護計劃
- **定期更新**: 安全更新、功能更新
- **資料備份**: 定期資料備份
- **系統監控**: 24/7 系統監控
- **使用者培訓**: 操作教學與訓練

---

*最後更新: 2025-01-15*
*版本: 1.0.0*
*維護者: 開發團隊*
