# localStorage 鍵名修復說明

## 🔧 修復的問題

**問題描述**：登入後能進入 `/dashboard`，但會被導回登入頁面

**根本原因**：localStorage 中使用的 key 與代碼中讀取的 key 不一致

---

## 🐛 問題分析

### localStorage 中的實際鍵名

根據您提供的 localStorage 內容：
```json
{
  "authUser": "...",        // 小寫格式
  "authToken": "mock-token-dev",  // 小寫格式
  "kt-auth-react-v": "..."  // Metronic 模板的舊格式
}
```

### 代碼中期望的鍵名

```typescript
// src/app/modules/auth/core/AuthHelpers.ts
const AUTH_USER_STORAGE_KEY = 'AUTH_USER';    // 大寫格式
const AUTH_TOKEN_STORAGE_KEY = 'AUTH_TOKEN';  // 大寫格式
```

### 問題影響

1. `getAuth()` 讀取 `AUTH_USER`，但數據在 `authUser`，讀取失敗
2. `getToken()` 讀取 `AUTH_TOKEN`，但數據在 `authToken`，讀取失敗
3. `AuthInit` 檢查時發現沒有 token 和 user，認為未登入
4. 自動清除認證狀態並導航到登入頁

---

## ✅ 修復方案

### 1. 兼容性讀取

修改 `getAuth()` 和 `getToken()` 函數，支持兩種鍵名格式：

```typescript
const getAuth = (): UserModel | undefined => {
  // 優先讀取大寫 key（標準格式）
  let value = localStorage.getItem('AUTH_USER')
  if (!value) {
    value = localStorage.getItem('authUser') // 兼容舊格式
  }
  
  if (value) {
    // 如果讀取的是舊格式，自動遷移到標準格式
    if (localStorage.getItem('AUTH_USER') !== value) {
      localStorage.setItem('AUTH_USER', value)
      localStorage.removeItem('authUser')
    }
    return JSON.parse(value)
  }
}

const getToken = (): string | undefined => {
  let token = localStorage.getItem('AUTH_TOKEN')
  if (!token) {
    token = localStorage.getItem('authToken') // 兼容舊格式
    if (token) {
      localStorage.setItem('AUTH_TOKEN', token)
      localStorage.removeItem('authToken')
    }
  }
  return token ?? undefined
}
```

### 2. 清理舊鍵名

修改 `removeAuth()` 和 `clearAuthStorage()`，確保清理所有可能的鍵名：

```typescript
const removeAuth = () => {
  // 清理標準格式
  localStorage.removeItem('AUTH_USER')
  localStorage.removeItem('AUTH_TOKEN')
  // 清理舊格式
  localStorage.removeItem('authUser')
  localStorage.removeItem('authToken')
  // 清理 Metronic 模板的舊 key
  localStorage.removeItem('kt-auth-react-v')
}
```

### 3. 修復初始狀態

修改 `AuthProvider`，從 localStorage 讀取初始狀態：

```typescript
const AuthProvider: FC<WithChildren> = ({ children }) => {
  // 從 localStorage 讀取初始狀態，避免閃爍
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>(() => {
    try {
      return authHelper.getAuth()
    } catch {
      return undefined
    }
  })
  // ...
}
```

---

## 📋 修復的文件

1. **src/app/modules/auth/core/AuthHelpers.ts**
   - 修改 `getAuth()` - 兼容兩種鍵名格式
   - 修改 `getToken()` - 兼容兩種鍵名格式
   - 修改 `removeAuth()` - 清理所有可能的鍵名
   - 自動遷移舊格式到新格式

2. **src/app/modules/auth/core/Auth.tsx**
   - 修改 `AuthProvider` - 從 localStorage 讀取初始狀態

3. **src/shared/api/http.ts**
   - 修改 `clearAuthStorage()` - 清理所有可能的鍵名

---

## 🧪 測試步驟

### 1. 清除現有的 localStorage

打開瀏覽器開發者工具（F12）：
```javascript
// 在 Console 中執行
localStorage.clear()
```

或者手動刪除：
- `authUser`
- `authToken`
- `kt-auth-react-v`

### 2. 重新登入

使用 TEST 帳號登入：
- 帳號：`test`
- 密碼：`1234`

### 3. 檢查 localStorage

登入後，localStorage 應該包含：
```javascript
{
  "AUTH_USER": "{...}",      // 標準格式（大寫）
  "AUTH_TOKEN": "mock-token-dev"  // 標準格式（大寫）
}
```

**注意**：舊的 `authUser` 和 `authToken` 應該已經被自動遷移並刪除。

### 4. 驗證路由

- ✅ 登入後自動跳轉到 `/dashboard`
- ✅ 刷新頁面後保持登入狀態
- ✅ 不會自動跳回登入頁

---

## 🔄 數據遷移流程

修復後的代碼會自動執行以下遷移：

1. **讀取時遷移**：
   - 如果讀取到舊格式（`authUser`/`authToken`）
   - 自動複製到標準格式（`AUTH_USER`/`AUTH_TOKEN`）
   - 刪除舊格式的鍵

2. **寫入時統一**：
   - 所有新寫入的數據都使用標準格式（大寫）

3. **清理時完整**：
   - 清除所有可能的鍵名，避免殘留

---

## ⚠️ 注意事項

### 如果問題仍然存在

1. **手動清理 localStorage**：
   ```javascript
   // 在瀏覽器 Console 中執行
   localStorage.removeItem('authUser')
   localStorage.removeItem('authToken')
   localStorage.removeItem('AUTH_USER')
   localStorage.removeItem('AUTH_TOKEN')
   localStorage.removeItem('kt-auth-react-v')
   ```

2. **檢查 Console**：
   - 查看是否有錯誤訊息
   - 檢查 `getAuth()` 和 `getToken()` 的執行結果

3. **驗證數據格式**：
   ```javascript
   // 檢查 AUTH_USER 的內容
   const user = JSON.parse(localStorage.getItem('AUTH_USER'))
   console.log('User:', user)
   
   // 檢查是否有 token 字段
   console.log('Has token field:', 'token' in user)
   ```

---

## 📝 後續建議

1. **統一鍵名標準**：
   - 所有新開發的功能都使用 `AUTH_USER` 和 `AUTH_TOKEN`
   - 避免使用小寫或其他格式

2. **文檔化**：
   - 在代碼註釋中明確說明使用的鍵名
   - 避免團隊成員使用不一致的鍵名

3. **類型安全**：
   - 考慮使用常量文件統一管理所有 localStorage 鍵名
   - 避免硬編碼字符串

---

**修復日期**: 2025-01-09  
**影響範圍**: 認證系統、localStorage 管理
