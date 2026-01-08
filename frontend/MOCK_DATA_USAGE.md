# Mock 數據使用說明

## 📋 概述

當使用 **TEST 帳號**登入時，系統會自動使用 Mock 數據，無需連接後端 API。這使得開發和測試更加便利。

---

## 🚀 快速開始

### 1. 使用 TEST 帳號登入

**登入資訊**：
- **帳號**: `test`
- **密碼**: `1234`

登入後，系統會自動檢測到這是 TEST 帳號，並切換到 Mock 數據模式。

### 2. 驗證 Mock 模式

登入後，打開瀏覽器開發者工具（F12），在 Console 中應該會看到：
```
[Mock] 使用 Mock 數據（TEST 帳號）
```

當執行任何 API 操作時，也會看到相應的 Mock 日誌：
```
[Mock] 使用 Mock 訂單列表 {...}
[Mock] 模擬創建訂單 {...}
```

---

## ⚙️ 配置說明

### TEST 帳號列表

系統會自動將以下帳號識別為 TEST 帳號：
- `test`
- `demo`
- `mock`

如需新增更多 TEST 帳號，請編輯：
```typescript
// src/shared/utils/useMockData.ts
const TEST_ACCOUNTS = ['test', 'demo', 'mock', '你的新帳號']
```

### 環境變數強制 Mock

如果需要在開發環境中強制使用 Mock 數據（不依賴帳號），可以在 `.env` 文件中設置：

```env
VITE_USE_MOCK=true
```

這樣無論使用什麼帳號登入，都會使用 Mock 數據。

---

## 📁 已實現 Mock 的模組

### ✅ TOM 訂單管理模組

| 功能 | Mock 狀態 | 說明 |
|------|----------|------|
| 訂單列表 | ✅ 已實現 | 使用 `MOCK_ORDERS` |
| 訂單詳情 | ✅ 已實現 | 使用 `MOCK_ORDER_DETAIL_MAP` |
| 創建訂單 | ✅ 已實現 | 模擬成功回應 |
| 更新訂單 | ✅ 已實現 | 模擬成功回應 |
| 刪除訂單 | ✅ 已實現 | 模擬成功回應 |
| 指派訂單 | ✅ 已實現 | 模擬成功回應 |
| 更新狀態 | ✅ 已實現 | 模擬成功回應 |

### 📝 Mock 數據位置

```
src/app/pages/tom/order/
├── list/
│   └── mockOrders.tsx          # 訂單列表 Mock 數據
└── detail/
    └── mockOrderDetail.tsx     # 訂單詳情 Mock 數據
```

---

## 🔧 如何為其他模組添加 Mock 支持

### 步驟 1: 導入工具函數

在您的 `Query.ts` 文件中：

```typescript
import { shouldUseMockData } from '@/shared/utils/useMockData'
```

### 步驟 2: 在 API 函數中添加條件判斷

```typescript
export async function fetchData(
  query: any,
  showAlert?: AlertFn,
): Promise<Data[]> {
  // 如果使用 Mock 數據，返回假資料
  if (shouldUseMockData()) {
    console.log('[Mock] 使用 Mock 數據', query)
    // 模擬 API 延遲
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return Promise.resolve(MOCK_DATA)
  }

  // 真實 API 調用
  try {
    const res = await http.get<ApiResponse<Data[]>>('/api/your-endpoint', { params: query })
    return res.data.data || []
  } catch (e) {
    console.error(e)
    showAlert?.('取得數據失敗，請稍後再試', 'danger')
    return []
  }
}
```

### 步驟 3: 為 CRUD 操作添加 Mock

```typescript
// 創建
export async function createData(
  payload: CreateDataReq,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬創建', payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('創建成功 (Mock)', 'success')
    return true
  }
  // ... 真實 API 調用
}

// 更新
export async function updateData(
  id: string,
  payload: UpdateDataReq,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬更新', id, payload)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('更新成功 (Mock)', 'success')
    return true
  }
  // ... 真實 API 調用
}

// 刪除
export async function deleteData(
  id: string,
  showAlert?: AlertFn,
): Promise<boolean> {
  if (shouldUseMockData()) {
    console.log('[Mock] 模擬刪除', id)
    await new Promise(resolve => setTimeout(resolve, 500))
    showAlert?.('刪除成功 (Mock)', 'success')
    return true
  }
  // ... 真實 API 調用
}
```

---

## 🎯 Mock 模式判斷邏輯

系統按以下優先順序判斷是否使用 Mock：

1. **環境變數**（最高優先級）
   - 如果 `VITE_USE_MOCK === 'true'`，強制使用 Mock

2. **帳號檢查**
   - 檢查當前登入用戶的 `account` 或 `username`
   - 如果匹配 TEST 帳號列表，使用 Mock

3. **真實 API**（預設）
   - 其他情況使用真實 API

---

## 🔍 調試工具

### 查看當前 Mock 狀態

在瀏覽器 Console 中執行：

```javascript
// 導入工具函數（需要在代碼中執行）
import { getMockModeInfo } from '@/shared/utils/useMockData'
console.log(getMockModeInfo())
```

輸出範例：
```javascript
{
  account: "test",
  isTestAccount: true,
  shouldUseMock: true,
  envMock: false
}
```

---

## 📝 注意事項

### 1. Mock 數據的局限性

- Mock 數據是**靜態的**，不會真正保存到資料庫
- 重新整理頁面後，之前創建的 Mock 數據不會保留
- Mock 數據主要用於**開發和測試 UI**

### 2. 生產環境

- Mock 功能**僅在開發環境生效**
- `tryDevLogin` 函數已包含環境檢查：
  ```typescript
  const isDev = import.meta.env.MODE === 'development'
  if (!isDev) return null
  ```

### 3. 資料一致性

- 使用 Mock 時，不同頁面之間的資料可能不一致
- 建議在開發完 UI 後，盡快連接到真實 API 進行整合測試

---

## 🛠️ 擴展其他模組

### 需要添加 Mock 的模組清單

- [ ] FMS 車輛管理
- [ ] FMS 司機管理
- [ ] UPMS 用戶管理
- [ ] UPMS 角色管理
- [ ] UPMS 權限管理
- [ ] TOM 任務管理
- [ ] TOM 貨櫃管理
- [ ] ADM 字典管理

### 建議實現順序

1. **優先級 1**: 核心業務模組（訂單、任務）
2. **優先級 2**: 基礎資料模組（車輛、司機、用戶）
3. **優先級 3**: 系統管理模組（角色、權限、字典）

---

## ❓ 常見問題

### Q: 如何新增更多 Mock 數據？

A: 編輯對應的 Mock 數據文件，例如：
- 訂單列表：`src/app/pages/tom/order/list/mockOrders.tsx`
- 訂單詳情：`src/app/pages/tom/order/detail/mockOrderDetail.tsx`

### Q: Mock 數據會影響真實用戶嗎？

A: 不會。Mock 模式僅對 TEST 帳號或開發環境生效，生產環境的正常用戶不受影響。

### Q: 如何關閉 Mock 模式？

A: 
1. 使用非 TEST 帳號登入
2. 或在 `.env` 中設置 `VITE_USE_MOCK=false`（或移除該變數）

### Q: Mock 數據如何模擬錯誤情況？

A: 在 Mock 函數中可以模擬錯誤：
```typescript
if (shouldUseMockData()) {
  // 模擬錯誤
  if (someCondition) {
    showAlert?.('模擬錯誤訊息', 'danger')
    return false
  }
  // ... 正常 Mock 流程
}
```

---

## 📞 技術支援

如有任何問題或建議，請聯繫開發團隊。

---

**最後更新**: 2025-01-09  
**版本**: 1.0.0
