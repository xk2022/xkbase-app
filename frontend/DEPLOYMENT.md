# 部署指南

本專案可以部署到多個平台，推薦使用 **Vercel**（最簡單）或 **Netlify**。

## 🚀 快速部署到 Vercel（推薦）

### 方法一：通過 Vercel 網站（最簡單）

1. **訪問 Vercel**
   - 前往 [https://vercel.com](https://vercel.com)
   - 使用 GitHub 帳號登入

2. **導入專案**
   - 點擊 "Add New Project"
   - 選擇 GitHub 倉庫：`xk2022/xkbase-app`
   - 選擇根目錄：`frontend`

3. **配置專案**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **設置環境變數**
   在 "Environment Variables" 中添加：
   ```
   VITE_API_BASE_URL=https://your-backend-api.com
   ```
   ⚠️ **重要**：請將 `https://your-backend-api.com` 替換為您的實際後端 API 地址

5. **部署**
   - 點擊 "Deploy"
   - 等待部署完成（約 2-3 分鐘）

6. **訪問網站**
   - 部署完成後，Vercel 會提供一個網址，例如：`https://xkbase-app.vercel.app`
   - 由於專案使用 `/xkBase/` 作為基礎路徑，實際訪問地址為：`https://xkbase-app.vercel.app/xkBase/`

### 方法二：使用 Vercel CLI

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 在 frontend 目錄下執行
cd frontend
vercel

# 按照提示操作
# 首次部署會詢問一些配置，選擇默認值即可
```

## 🌐 部署到 Netlify

1. **訪問 Netlify**
   - 前往 [https://netlify.com](https://netlify.com)
   - 使用 GitHub 帳號登入

2. **導入專案**
   - 點擊 "Add new site" → "Import an existing project"
   - 選擇 GitHub 倉庫：`xk2022/xkbase-app`

3. **配置構建設置**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

4. **設置環境變數**
   在 "Site settings" → "Environment variables" 中添加：
   ```
   VITE_API_BASE_URL=https://your-backend-api.com
   ```

5. **配置重定向規則**
   創建 `netlify.toml` 文件（已包含在專案中）：
   ```toml
   [[redirects]]
     from = "/xkBase/*"
     to = "/xkBase/index.html"
     status = 200
   ```

6. **部署**
   - 點擊 "Deploy site"
   - 等待部署完成

## 📝 部署前檢查清單

- [ ] 確保代碼已推送到 GitHub
- [ ] 設置環境變數 `VITE_API_BASE_URL`（指向您的後端 API）
- [ ] 確認後端 API 已部署並可訪問
- [ ] 檢查 CORS 設置（後端需要允許前端域名）

## 🔧 環境變數說明

| 變數名稱 | 說明 | 是否必需 | 範例 |
|---------|------|---------|------|
| `VITE_API_BASE_URL` | 後端 API 基礎 URL | ✅ 是 | `https://api.example.com` |

## 🌍 自定義域名

### Vercel
1. 在專案設置中點擊 "Domains"
2. 添加您的域名
3. 按照提示配置 DNS 記錄

### Netlify
1. 在 "Domain settings" 中添加自定義域名
2. 按照提示配置 DNS 記錄

## 📌 注意事項

1. **基礎路徑**：本專案使用 `/xkBase/` 作為基礎路徑，所有路由都會加上此前綴
2. **API 代理**：開發環境使用 Vite 代理，生產環境需要設置 `VITE_API_BASE_URL`
3. **CORS**：確保後端 API 允許前端域名的跨域請求
4. **環境變數**：所有以 `VITE_` 開頭的環境變數會在構建時注入到前端代碼中

## 🐛 常見問題

### 問題 1：頁面刷新後出現 404
**解決方案**：確保配置了正確的重定向規則（見上方配置）

### 問題 2：API 請求失敗
**解決方案**：
- 檢查 `VITE_API_BASE_URL` 是否正確設置
- 檢查後端 API 是否可訪問
- 檢查 CORS 設置

### 問題 3：靜態資源載入失敗
**解決方案**：確保 `vite.config.ts` 中的 `base` 設置為 `/xkBase/`

## 📞 需要幫助？

如果遇到問題，請檢查：
1. 構建日誌中的錯誤訊息
2. 瀏覽器控制台的錯誤訊息
3. 網路請求是否成功
