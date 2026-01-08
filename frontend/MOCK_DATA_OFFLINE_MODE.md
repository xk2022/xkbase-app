# Mock 假資料完整性處理 - 離線模式

## 📋 概述

已完成離線模式支持，系統現在可以在離線狀態下使用 `mock / 1234` 登入，並完整顯示所有假資料。

---

## 🔐 登入方式

### 離線模式登入

**登入資訊**：
- **帳號**: `mock`
- **密碼**: `1234`

**重要說明**：
- 離線模式下，**只允許** `mock / 1234` 登入
- 其他帳號將顯示錯誤訊息：「離線模式只支援 mock / 1234 登入」
- 已移除開發環境限制，支持完全離線使用

---

## ✅ 已實現 Mock 數據的模組

### 1. TOM 運輸訂單管理 ✅

| 功能 | Mock 狀態 | 說明 |
|------|----------|------|
| 訂單列表 | ✅ 已實現 | 使用 `MOCK_ORDERS` |
| 訂單詳情 | ✅ 已實現 | 使用 `MOCK_ORDER_DETAIL_MAP` |
| 創建訂單 | ✅ 已實現 | 模擬成功回應 |
| 更新訂單 | ✅ 已實現 | 模擬成功回應 |
| 刪除訂單 | ✅ 已實現 | 模擬成功回應 |
| 指派訂單 | ✅ 已實現 | 模擬成功回應 |
| 更新狀態 | ✅ 已實現 | 模擬成功回應 |

**Mock 數據位置**：
- `src/app/pages/tom/order/list/mockOrders.tsx`
- `src/app/pages/tom/order/detail/mockOrderDetail.tsx`

---

### 2. TOM 貨櫃管理 ✅

| 功能 | Mock 狀態 | 說明 |
|------|----------|------|
| 貨櫃列表 | ✅ 已實現 | 使用 `MOCK_CONTAINERS` |
| 創建貨櫃 | ✅ 已實現 | 模擬成功回應 |

**Mock 數據位置**：
- `src/app/pages/tom/container/__mock__/mockContainers.tsx`

---

### 3. TOM 任務管理 ✅

| 功能 | Mock 狀態 | 說明 |
|------|----------|------|
| 任務列表 | ✅ 已實現 | 使用 `MOCK_TASKS` |
| 創建任務 | ✅ 已實現 | 模擬成功回應 |
| 取消任務 | ✅ 已實現 | 模擬成功回應 |

**Mock 數據位置**：
- `src/app/pages/tom/tasks/__mock__/mockTasks.tsx`

---

### 4. FMS 車隊管理 - 車輛 ✅

| 功能 | Mock 狀態 | 說明 |
|------|----------|------|
| 車輛列表 | ✅ 已實現 | 使用 `MOCK_VEHICLES` (8筆) |
| 創建車輛 | ✅ 已實現 | 模擬成功回應 |
| 更新車輛 | ✅ 已實現 | 模擬成功回應 |
| 刪除車輛 | ✅ 已實現 | 模擬成功回應 |

**Mock 數據位置**：
- `src/app/pages/fms/vehicle/mockVehicles.tsx`

**Mock 數據內容**：
- 包含 8 筆車輛資料
- 涵蓋各種車輛類型：TRACTOR、TRAILER_20、TRAILER_40、REFRIGERATED_TRUCK、SMALL_TRUCK、VAN
- 包含各種狀態：AVAILABLE、IN_USE、BUSY、MAINTENANCE、RESERVED、IDLE

---

### 5. FMS 車隊管理 - 司機 ✅

| 功能 | Mock 狀態 | 說明 |
|------|----------|------|
| 司機列表 | ✅ 已實現 | 使用 `MOCK_DRIVERS` (8筆) |
| 司機選項 | ✅ 已實現 | 使用 `MOCK_DRIVERS` |
| 創建司機 | ✅ 已實現 | 模擬成功回應 |
| 更新司機 | ✅ 已實現 | 模擬成功回應 |
| 刪除司機 | ✅ 已實現 | 模擬成功回應 |

**Mock 數據位置**：
- `src/app/pages/fms/driver/mockDrivers.tsx`

**Mock 數據內容**：
- 包含 8 筆司機資料
- 涵蓋各種駕照類型：LARGE、MEDIUM、SMALL、TRAILER
- 包含各種狀態：ACTIVE、INACTIVE、LEAVE
- 部分司機已指派車輛

---

### 6. UPMS 用戶權限管理 ✅

#### 6.1 用戶管理

| 功能 | Mock 狀態 | 說明 |
|------|----------|------|
| 用戶列表 | ✅ 已實現 | 使用 `MOCK_USERS` |
| 創建用戶 | ✅ 已實現 | 模擬成功回應 |
| 更新用戶 | ✅ 已實現 | 模擬成功回應 |
| 刪除用戶 | ✅ 已實現 | 模擬成功回應 |

**Mock 數據位置**：
- `src/app/pages/upms/user/mockUsers.tsx`

#### 6.2 角色管理

| 功能 | Mock 狀態 | 說明 |
|------|----------|------|
| 角色列表 | ✅ 已實現 | 使用 `MOCK_ROLES` |
| 創建角色 | ✅ 已實現 | 模擬成功回應 |
| 更新角色 | ✅ 已實現 | 模擬成功回應 |
| 刪除角色 | ✅ 已實現 | 模擬成功回應 |

**Mock 數據位置**：
- `src/app/pages/upms/role/mockRoles.tsx`

#### 6.3 系統管理

| 功能 | Mock 狀態 | 說明 |
|------|----------|------|
| 系統列表 | ✅ 已實現 | 使用 `MOCK_SYSTEMS` |
| 創建系統 | ✅ 已實現 | 模擬成功回應 |
| 更新系統 | ✅ 已實現 | 模擬成功回應 |
| 刪除系統 | ✅ 已實現 | 模擬成功回應 |

**Mock 數據位置**：
- `src/app/pages/upms/system/mockSystems.tsx`

#### 6.4 權限管理

| 功能 | Mock 狀態 | 說明 |
|------|----------|------|
| 權限列表 | ✅ 已實現 | 使用 `MOCK_PERMISSIONS` |
| 創建權限 | ✅ 已實現 | 模擬成功回應 |
| 更新權限 | ✅ 已實現 | 模擬成功回應 |
| 刪除權限 | ✅ 已實現 | 模擬成功回應 |

**Mock 數據位置**：
- `src/app/pages/upms/permission/mockPermissions.tsx`

---

### 7. CRM 客戶關係管理 ✅

| 功能 | Mock 狀態 | 說明 |
|------|----------|------|
| 客戶列表 | ✅ 已實現 | 使用內嵌 Mock 數據 |
| 客戶詳情 | ✅ 已實現 | 使用內嵌 Mock 數據 |
| 創建客戶 | ✅ 已實現 | 模擬成功回應 |
| 更新客戶 | ✅ 已實現 | 模擬成功回應 |
| 刪除客戶 | ✅ 已實現 | 模擬成功回應 |
| 合約模板列表 | ✅ 已實現 | 使用內嵌 Mock 數據 |
| 合約模板詳情 | ✅ 已實現 | 使用內嵌 Mock 數據 |
| 建立合約模板 | ✅ 已實現 | 模擬成功回應 |
| 更新合約模板 | ✅ 已實現 | 模擬成功回應 |
| 刪除合約模板 | ✅ 已實現 | 模擬成功回應 |
| 查詢貨櫃進度 | ✅ 已實現 | 使用內嵌 Mock 數據 |
| 建立線上提單 | ✅ 已實現 | 模擬成功回應 |

**Mock 數據位置**：
- `src/app/pages/crm/Query.tsx` (內嵌 Mock 數據)

---

### 8. HRM 人力資源管理 ✅

#### 8.1 司機管理

| 功能 | Mock 狀態 | 說明 |
|------|----------|------|
| 司機列表 | ✅ 已實現 | 使用 `MOCK_DRIVERS` |
| 司機詳情 | ✅ 已實現 | 使用 `MOCK_DRIVERS` |
| 創建司機 | ✅ 已實現 | 模擬成功回應 |
| 更新司機 | ✅ 已實現 | 模擬成功回應 |
| 刪除司機 | ✅ 已實現 | 模擬成功回應 |

**Mock 數據位置**：
- `src/app/pages/hrm/driver/list/mockDrivers.tsx`

#### 8.2 工時規劃

| 功能 | Mock 狀態 | 說明 |
|------|----------|------|
| 工時規劃列表 | ✅ 已實現 | 使用 `MOCK_SCHEDULES` |
| 工時規劃詳情 | ✅ 已實現 | 使用 `MOCK_SCHEDULES` |
| 創建工時規劃 | ✅ 已實現 | 模擬成功回應 |
| 更新工時規劃 | ✅ 已實現 | 模擬成功回應 |
| 刪除工時規劃 | ✅ 已實現 | 模擬成功回應 |

**Mock 數據位置**：
- `src/app/pages/hrm/schedule/list/mockSchedules.tsx`

#### 8.3 薪資計算公式

| 功能 | Mock 狀態 | 說明 |
|------|----------|------|
| 薪資公式列表 | ✅ 已實現 | 使用 `MOCK_SALARY_FORMULAS` |
| 薪資公式詳情 | ✅ 已實現 | 使用 `MOCK_SALARY_FORMULAS` |
| 創建薪資公式 | ✅ 已實現 | 模擬成功回應 |
| 更新薪資公式 | ✅ 已實現 | 模擬成功回應 |
| 刪除薪資公式 | ✅ 已實現 | 模擬成功回應 |

**Mock 數據位置**：
- `src/app/pages/hrm/salary/list/mockSalaryFormulas.tsx`

---

### 9. ADM 系統管理 - 字典管理 ✅

| 功能 | Mock 狀態 | 說明 |
|------|----------|------|
| 字典分類列表 | ✅ 已實現 | 使用 `MOCK_DICTIONARIES` (5筆) |
| 字典分類詳情 | ✅ 已實現 | 使用 `MOCK_DICTIONARIES` |
| 創建字典分類 | ✅ 已實現 | 模擬成功回應 |
| 更新字典分類 | ✅ 已實現 | 模擬成功回應 |
| 刪除字典分類 | ✅ 已實現 | 模擬成功回應 |
| 複製字典分類 | ✅ 已實現 | 模擬成功回應 |
| 字典項目列表 | ✅ 已實現 | 使用 `MOCK_DICTIONARY_ITEMS` (17筆) |
| 創建字典項目 | ✅ 已實現 | 模擬成功回應 |
| 更新字典項目 | ✅ 已實現 | 模擬成功回應 |
| 刪除字典項目 | ✅ 已實現 | 模擬成功回應 |
| 更新字典項目排序 | ✅ 已實現 | 模擬成功回應 |

**Mock 數據位置**：
- `src/app/pages/adm/dictionary/mockDictionaries.tsx`

**Mock 數據內容**：
- **字典分類** (5筆)：
  - ORDER_STATUS (訂單狀態)
  - VEHICLE_TYPE (車輛類型)
  - DRIVER_STATUS (司機狀態)
  - CONTAINER_TYPE (貨櫃類型)
  - PAYMENT_STATUS (付款狀態)

- **字典項目** (17筆)：
  - 訂單狀態：待處理、已確認、進行中、已完成、已取消
  - 車輛類型：車頭、20尺板車、40尺板車
  - 司機狀態：在職、離職、請假
  - 貨櫃類型：20尺一般櫃、40尺一般櫃、40尺高櫃
  - 付款狀態：未付款、部分付款、已付款

---

### 10. 港口管理 ✅

| 功能 | Mock 狀態 | 說明 |
|------|----------|------|
| 港口列表 | ✅ 已實現 | 使用內嵌 Mock 數據 (3筆) |
| 港口詳情 | ✅ 已實現 | 使用內嵌 Mock 數據 |
| 創建港口 | ✅ 已實現 | 模擬成功回應 |
| 更新港口 | ✅ 已實現 | 模擬成功回應 |
| 刪除港口 | ✅ 已實現 | 模擬成功回應 |

**Mock 數據位置**：
- `src/app/pages/port/Query.tsx` (內嵌 Mock 數據)

**Mock 數據內容**：
- 台北港 (TPE)
- 高雄港 (KHH)
- 台中港 (TWN)

---

## 🔧 技術實現

### Mock 模式判斷邏輯

系統使用 `shouldUseMockDataWithTemp()` 函數判斷是否使用 Mock 數據：

1. **帳號檢查**（優先級最高）
   - 檢查當前登入用戶的 `account` 或 `username`
   - 如果為 `mock`，使用 Mock 數據

2. **臨時啟用標誌**
   - 檢查 `sessionStorage` 中的 `TEMP_USE_MOCK_DATA` 標誌
   - 如果為 `true`，使用 Mock 數據

3. **環境變數**（開發用）
   - 如果 `VITE_USE_MOCK === 'true'`，強制使用 Mock

4. **真實 API**（預設）
   - 其他情況使用真實 API

### 統一 Mock 數據模式

所有 Query 函數都遵循以下模式：

```typescript
export async function fetchData(
  query: any,
  showAlert?: AlertFn,
): Promise<PageResult<Data>> {
  // 1. 檢查是否使用 Mock 數據
  if (shouldUseMockDataWithTemp()) {
    console.log('[Mock] 使用 Mock 數據', query)
    await new Promise(resolve => setTimeout(resolve, 300)) // 模擬延遲
    
    // 2. 關鍵字篩選（如需要）
    let filtered = [...MOCK_DATA]
    if (query.keyword?.trim()) {
      // 篩選邏輯
    }
    
    // 3. 分頁處理
    const page = query.page || 0
    const size = query.size || 10
    const start = page * size
    const end = start + size
    const paginated = filtered.slice(start, end)
    
    // 4. 返回分頁結果
    return {
      content: paginated,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      size,
      number: page,
      first: page === 0,
      last: end >= filtered.length,
      empty: paginated.length === 0,
    }
  }
  
  // 5. 真實 API 調用
  try {
    const res = await http.get<ApiResponse<PageResult<Data>>>(
      API_PREFIX,
      { params: query }
    )
    return res.data.data
  } catch (e) {
    // 錯誤處理
  }
}
```

---

## 📝 注意事項

### 1. Mock 數據的局限性

- Mock 數據是**靜態的**，不會真正保存到資料庫
- 重新整理頁面後，之前創建的 Mock 數據不會保留
- Mock 數據主要用於**離線展示和測試 UI**

### 2. 離線模式限制

- 離線模式下，**只允許** `mock / 1234` 登入
- 其他帳號將無法登入
- 所有 API 調用都會使用 Mock 數據

### 3. 資料一致性

- 使用 Mock 時，不同頁面之間的資料可能不一致
- 建議在開發完 UI 後，盡快連接到真實 API 進行整合測試

---

## 🎯 使用方式

### 1. 登入系統

使用 `mock / 1234` 登入系統。

### 2. 驗證 Mock 模式

登入後，打開瀏覽器開發者工具（F12），在 Console 中應該會看到：
```
[Mock] 使用 Mock 數據（TEST 帳號）
```

當執行任何 API 操作時，也會看到相應的 Mock 日誌：
```
[Mock] 使用 Mock 車輛列表 {...}
[Mock] 模擬建立車輛 {...}
```

### 3. 瀏覽各模組

登入後，可以瀏覽所有已實現 Mock 數據的模組：
- TOM 運輸訂單管理
- TOM 貨櫃管理
- TOM 任務管理
- FMS 車隊管理（車輛、司機）
- UPMS 用戶權限管理（用戶、角色、系統、權限）
- CRM 客戶關係管理
- HRM 人力資源管理（司機、工時規劃、薪資公式）
- ADM 系統管理（字典管理）
- 港口管理

---

## 📞 技術支援

如有任何問題或建議，請聯繫開發團隊。

---

**最後更新**: 2025-01-09  
**版本**: 2.0.0 (離線模式完整版)
