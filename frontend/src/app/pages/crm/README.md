# CRM 客戶管理模組

## 📋 概述

CRM (Customer Relationship Management) 客戶管理模組提供完整的客戶關係管理功能，包括客戶清單、合約模板管理和客戶入口服務。

---

## 🚀 快速開始

### 使用 Mock 數據進行測試

#### 1. 使用 TEST 帳號登入

**登入資訊**：
- **帳號**: `test`
- **密碼**: `1234`

登入後，系統會自動檢測到這是 TEST 帳號，並切換到 Mock 數據模式。

#### 2. 驗證 Mock 模式

登入後，打開瀏覽器開發者工具（F12），在 Console 中應該會看到：
```
[Mock] 使用 Mock 數據（TEST 帳號）
```

當執行任何 API 操作時，也會看到相應的 Mock 日誌：
```
[Mock] 使用 Mock 客戶列表 {...}
[Mock] 模擬建立客戶 {...}
```

---

## 📁 模組結構

```
src/app/pages/crm/
├── Model.tsx                          # 數據模型定義
├── Query.tsx                          # API 調用封裝
├── index.tsx                          # 主路由文件
├── README.md                          # 本文件
│
├── dashboard/                         # 儀表板
│   ├── DashboardPage.tsx             # Dashboard 主頁面
│   └── index.tsx                     # Dashboard wrapper
│
├── customer/                         # 客戶管理
│   ├── list/
│   │   ├── List.tsx                  # 客戶列表組件
│   │   ├── ListPage.tsx              # 客戶列表頁面
│   │   ├── FormModal.tsx             # 客戶表單模態框
│   │   └── mockCustomers.tsx        # Mock 客戶數據
│   └── detail/
│       └── DetailPage.tsx           # 客戶詳情頁面
│
├── contract/                          # 合約模板
│   └── list/
│       ├── List.tsx                  # 合約列表組件
│       ├── ListPage.tsx              # 合約列表頁面
│       ├── FormModal.tsx              # 合約表單模態框
│       └── mockContracts.tsx        # Mock 合約數據
│
└── portal/                           # 客戶入口
    ├── PortalPage.tsx                # 客戶入口頁面
    └── mockContainerProgress.tsx    # Mock 貨櫃進度數據
```

---

## 🎯 功能模組

### 1. 客戶清單 (`/crm/customer/list`)

**功能**：
- ✅ 客戶列表展示（分頁）
- ✅ 客戶搜索（公司名稱、代碼、統一編號、聯絡人等）
- ✅ 新增客戶
- ✅ 編輯客戶
- ✅ 刪除客戶
- ✅ 查看客戶詳情

**Mock 數據**：
- 5 個示例客戶
- 支持搜索和分頁
- 每個客戶包含完整的聯絡人資訊

**測試數據**：
- `ABC 貿易有限公司` (ID: 1) - 啟用狀態
- `XYZ 物流股份有限公司` (ID: 2) - 啟用狀態
- `DEF 國際運輸公司` (ID: 3) - 停用狀態
- `GHI 海運股份有限公司` (ID: 4) - 啟用狀態
- `JKL 倉儲管理公司` (ID: 5) - 暫停狀態

### 2. 合約模板 (`/crm/contract/list`)

**功能**：
- ✅ 合約模板列表展示（分頁）
- ✅ 合約搜索（名稱、客戶名稱、計費模式）
- ✅ 新增合約模板
- ✅ 編輯合約模板
- ✅ 刪除合約模板
- ✅ 標準條款管理
- ✅ 計費規則管理

**計費模式**：
- `fixed` - 固定價格
- `volume` - 按量計費
- `distance` - 按距離計費
- `time` - 按時間計費
- `hybrid` - 混合模式

**Mock 數據**：
- 5 個示例合約模板
- 支持搜索和分頁
- 包含完整的標準條款和計費規則

**測試數據**：
- `標準物流合約` (ID: 1) - 按量計費，啟用
- `ABC 貿易專案合約` (ID: 2) - 混合模式，啟用
- `XYZ 物流長期合約` (ID: 3) - 按距離計費，啟用
- `固定價格合約模板` (ID: 4) - 固定價格，草稿
- `按時計費合約模板` (ID: 5) - 按時間計費，啟用

### 3. 客戶入口 (`/crm/portal`)

**功能**：
- ✅ 貨櫃進度查詢
- ✅ 線上提單建立

**貨櫃進度查詢**：
- 輸入貨櫃號查詢即時進度
- 顯示追蹤事件時間軸
- 顯示當前狀態和位置

**線上提單**：
- 填寫提單資訊建立新訂單
- 支持客戶 ID、貨櫃號、地址等資訊

**Mock 數據**：
- 4 個示例貨櫃進度記錄
- 支持部分匹配搜索

**測試貨櫃號**：
- `TGHU1234567` - 運送中
- `TGHU7654321` - 已到達
- `TGHU9876543` - 已交付
- `TGHU1111111` - 待處理

---

## 🔍 Mock 數據使用說明

### Mock 數據文件位置

1. **客戶數據**：
   - `customer/list/mockCustomers.tsx`
   - 包含 `MOCK_CUSTOMERS` 和 `MOCK_CUSTOMER_DETAIL_MAP`

2. **合約數據**：
   - `contract/list/mockContracts.tsx`
   - 包含 `MOCK_CONTRACTS` 和 `MOCK_CONTRACT_DETAIL_MAP`

3. **貨櫃進度數據**：
   - `portal/mockContainerProgress.tsx`
   - 包含 `MOCK_CONTAINER_PROGRESS_MAP` 和 `getMockContainerProgress()` 函數

### Mock 數據特性

1. **搜索支持**：
   - 客戶列表：支持按公司名稱、代碼、統一編號、聯絡人、電話、郵箱搜索
   - 合約列表：支持按名稱、客戶名稱、計費模式搜索

2. **分頁支持**：
   - 所有列表都支持分頁
   - 可通過 `query.page` 和 `query.size` 參數控制

3. **數據一致性**：
   - 列表和詳情數據保持一致
   - 使用 ID 映射確保數據關聯正確

---

## 🛠️ API 端點

### 客戶管理

- `GET /api/crm/customers` - 取得客戶列表
- `GET /api/crm/customers/:id` - 取得客戶詳情
- `POST /api/crm/customers` - 建立客戶
- `PUT /api/crm/customers/:id` - 更新客戶
- `DELETE /api/crm/customers/:id` - 刪除客戶

### 合約模板

- `GET /api/crm/contracts` - 取得合約模板列表
- `GET /api/crm/contracts/:id` - 取得合約模板詳情
- `POST /api/crm/contracts` - 建立合約模板
- `PUT /api/crm/contracts/:id` - 更新合約模板
- `DELETE /api/crm/contracts/:id` - 刪除合約模板

### 客戶入口

- `GET /api/crm/portal/containers/:containerNo/progress` - 查詢貨櫃進度
- `POST /api/crm/portal/bookings` - 建立線上提單

---

## 📝 注意事項

### 1. Mock 數據的局限性

- Mock 數據是**靜態的**，不會真正保存到資料庫
- 重新整理頁面後，之前創建的 Mock 數據不會保留
- Mock 數據主要用於**開發和測試 UI**

### 2. 生產環境

- Mock 功能**僅在開發環境生效**
- 使用 TEST 帳號或設置 `VITE_USE_MOCK=true` 才會啟用 Mock

### 3. 資料一致性

- 使用 Mock 時，不同頁面之間的資料可能不一致
- 建議在開發完 UI 後，盡快連接到真實 API 進行整合測試

---

## 🎨 UI 組件

### 客戶列表頁面

- 使用 `PagedTable` 組件顯示分頁表格
- 支持搜索、新增、編輯、刪除操作
- 顯示客戶狀態徽章（啟用/停用/暫停）

### 合約模板頁面

- 使用 `PagedTable` 組件顯示分頁表格
- 支持多種計費模式顯示
- 表單支持動態添加標準條款和計費規則

### 客戶入口頁面

- 左右分欄布局
- 左側：貨櫃進度查詢（帶時間軸）
- 右側：線上提單表單

---

## 🔧 開發指南

### 添加新的 Mock 數據

1. 在對應的 `mock*.tsx` 文件中添加數據
2. 確保數據結構符合 `Model.tsx` 中定義的類型
3. 更新 `Query.tsx` 中的 Mock 邏輯（如需要）

### 擴展功能

1. 在 `Model.tsx` 中添加新的類型定義
2. 在 `Query.tsx` 中添加新的 API 函數
3. 創建對應的頁面組件
4. 在 `index.tsx` 中添加路由配置
5. 在 `menuConfig.tsx` 中添加菜單項

---

## 📊 測試建議

### 功能測試

1. **客戶管理**：
   - ✅ 測試搜索功能（各種關鍵字）
   - ✅ 測試分頁功能
   - ✅ 測試新增/編輯/刪除操作
   - ✅ 測試客戶詳情頁面

2. **合約模板**：
   - ✅ 測試合約列表和搜索
   - ✅ 測試新增合約（各種計費模式）
   - ✅ 測試標準條款和計費規則的動態添加

3. **客戶入口**：
   - ✅ 測試貨櫃進度查詢（各種貨櫃號）
   - ✅ 測試線上提單建立

### Mock 數據測試

使用以下測試數據進行測試：

- **客戶 ID**: `1`, `2`, `3`, `4`, `5`
- **合約 ID**: `1`, `2`, `3`, `4`, `5`
- **貨櫃號**: `TGHU1234567`, `TGHU7654321`, `TGHU9876543`, `TGHU1111111`

---

## 📚 相關文檔

- [Mock 數據使用說明](../../../../MOCK_DATA_USAGE.md)
- [系統架構文檔](../../../../README.md)
