# Base Path 統一配置說明

## 📋 概述

本專案已將所有與 base path 相關的設定統一管理，避免在多處重複定義。當需要修改 base path 時，只需在統一配置檔案中修改即可。

## 🎯 統一配置檔案

**主要配置檔案**：`src/shared/config/path.config.ts`

此檔案定義了所有與 base path 相關的常數和工具函數：

- `APP_BASE_PATH` - 應用程式的 Base Path（含結尾斜線）
  - 開發環境：`'/xkBase/'`
  - 生產環境：`'/'`

- `APP_BASE_PATH_NO_TRAILING` - Base Path（不含結尾斜線）
  - 開發環境：`'/xkBase'`
  - 生產環境：`''`

- `LOGIN_PATH` - 登入頁面路徑
  - 開發環境：`'/xkBase/auth'`
  - 生產環境：`'/auth'`

- `toAbsolutePath(pathname)` - 將相對路徑轉換為絕對路徑的工具函數

## 📍 使用此配置的檔案位置

以下檔案已更新為使用統一配置：

### 1. **vite.config.ts**
```typescript
// 構建配置中的 base 選項
// 開發環境使用 '/xkBase/'，生產環境使用 '/'
const APP_BASE_PATH = process.env.NODE_ENV === 'production' ? '/' : '/xkBase/'
base: APP_BASE_PATH
```

### 2. **src/app/routing/AppRoutes.tsx**
```typescript
// React Router 的 basename
import { APP_BASE_PATH_NO_TRAILING } from '@/shared/config/path.config'
<BrowserRouter basename={APP_BASE_PATH_NO_TRAILING}>
```

### 3. **src/shared/api/http.ts**
```typescript
// API 請求中的登入路徑
import { LOGIN_PATH } from '@/shared/config/path.config'
```

### 4. **src/_metronic/helpers/AssetHelpers.ts**
```typescript
// 靜態資源路徑處理
import { APP_BASE_PATH } from '@/shared/config/path.config'
export const toAbsoluteUrl = (pathname: string) => APP_BASE_PATH + pathname
```

## ⚠️ 需要手動同步的檔案

以下檔案由於格式限制（JSON/TOML），無法直接 import TypeScript 配置，需要手動保持同步：

### 1. **vercel.json**
```json
{
  "rewrites": [
    {
      "source": "/xkBase/(.*)",
      "destination": "/xkBase/index.html"
    }
  ]
}
```

### 2. **netlify.toml**
```toml
[[redirects]]
  from = "/xkBase/*"
  to = "/xkBase/index.html"
  status = 200
```

**重要**：修改 `path.config.ts` 中的 `APP_BASE_PATH` 後，請記得同步更新這兩個部署配置檔案中的路徑。

## 🔧 如何修改 Base Path

### 步驟 1：修改統一配置檔案

編輯 `src/shared/config/path.config.ts`：

```typescript
// 將 '/xkBase/' 改為您想要的 base path，例如 '/my-app/'
export const APP_BASE_PATH = import.meta.env.PROD ? '/my-app/' : '/'
```

### 步驟 2：同步更新 vite.config.ts

編輯 `vite.config.ts`：

```typescript
// 確保與 path.config.ts 中的設定一致
const APP_BASE_PATH = process.env.NODE_ENV === 'production' ? '/my-app/' : '/'
```

### 步驟 3：更新部署配置檔案

更新 `vercel.json` 和 `netlify.toml` 中的所有 `/xkBase/` 為新的 base path：

**vercel.json**:
```json
{
  "rewrites": [
    {
      "source": "/my-app/(.*)",
      "destination": "/my-app/index.html"
    }
  ]
}
```

**netlify.toml**:
```toml
[[redirects]]
  from = "/my-app/*"
  to = "/my-app/index.html"
  status = 200
```

### 步驟 4：驗證

執行以下命令驗證配置：

```bash
# 開發環境測試
npm run dev

# 生產環境構建測試
npm run build
npm run preview
```

## 📊 配置位置統計

| 檔案類型 | 檔案數量 | 是否已統一管理 |
|---------|---------|--------------|
| TypeScript 源碼檔案 | 4 | ✅ 是（使用統一配置） |
| 構建配置檔案 | 1 | ✅ 是（使用統一配置） |
| 部署配置檔案 | 2 | ⚠️ 需手動同步 |

## ✅ 優點

1. **單一來源**：主要配置集中在一個檔案中
2. **易於維護**：修改 base path 時只需更新少數檔案
3. **類型安全**：TypeScript 提供類型檢查
4. **清晰文檔**：每個配置都有詳細註釋

## 🔍 檢查清單

修改 base path 後，請確認：

- [ ] `src/shared/config/path.config.ts` 已更新
- [ ] `vite.config.ts` 已更新
- [ ] `vercel.json` 已更新（如使用 Vercel）
- [ ] `netlify.toml` 已更新（如使用 Netlify）
- [ ] 開發環境測試通過
- [ ] 生產環境構建測試通過

## 📝 注意事項

1. Base path 必須以 `/` 開頭，建議以 `/` 結尾（例如：`/xkBase/`）
2. 修改 base path 後，所有靜態資源路徑和路由都會受到影響
3. 確保後端 API 也支援新的 base path（如需要）
4. 更新部署配置後，需要重新部署應用

## 🆘 常見問題

### Q: 為什麼有些檔案需要手動同步？

A: `vercel.json` 和 `netlify.toml` 是 JSON/TOML 格式的配置檔案，無法直接 import TypeScript 模組。這些檔案在部署時由平台讀取，因此需要手動保持同步。

### Q: 如何確保配置一致性？

A: 建議在修改 base path 時，使用搜尋功能查找所有包含舊 base path 的位置，確保全部更新。

### Q: 可以完全自動化嗎？

A: 可以考慮創建一個構建腳本，在構建時自動從統一配置生成部署配置檔案。但目前的手動同步方式已經足夠簡單且可靠。
