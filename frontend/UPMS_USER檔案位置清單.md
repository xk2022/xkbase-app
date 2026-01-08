# UPMS User 模組檔案位置清單

**生成時間**: 2025-01-09  
**模組路徑**: `src/app/pages/upms/user/`

---

## 📁 檔案結構總覽

```
src/app/pages/upms/user/
├── index.tsx                    # 路由入口
├── Model.tsx                    # 數據模型定義
├── Query.tsx                    # API 調用函數
├── mockUsers.tsx                # Mock 數據
├── ListPage.tsx                 # 列表頁面
├── List.tsx                     # 列表組件
├── OverviewPage.tsx             # 總覽頁面
├── FormModal.tsx                # 快速編輯 Modal
├── UsersListFilter.tsx          # 列表篩選組件
├── UpmsUser.md                  # 模組文檔
│
├── create/                      # 新增使用者
│   ├── CreatePage.tsx           # 新增頁面
│   ├── CreateForm.tsx           # 新增表單
│   ├── EX_CreatePage.tsx        # 範例頁面（備用）
│   └── EX_CreateForm.tsx       # 範例表單（備用）
│
└── detail/                      # 使用者詳情
    ├── DetailPage.tsx           # 詳情頁面
    ├── UserBasicInfoCard.tsx    # 基本資訊卡片
    ├── UserStatusCard.tsx       # 狀態卡片（含停用功能）
    ├── UserRolesCard.tsx        # 角色卡片
    ├── UserPermissionSummaryCard.tsx  # 權限摘要卡片
    ├── UserLoginHistoryCard.tsx # 登入紀錄卡片
    └── UserPasswordCard.tsx     # 密碼卡片
```

---

## 📋 檔案詳細列表

### 🔷 核心檔案

| 檔案 | 路徑 | 說明 |
|------|------|------|
| **路由入口** | `index.tsx` | 定義所有使用者相關路由 |
| **數據模型** | `Model.tsx` | User、UserProfile、CreateUserReq 等類型定義 |
| **API 調用** | `Query.tsx` | 所有使用者相關的 API 函數（含 Mock 支持） |
| **Mock 數據** | `mockUsers.tsx` | Mock 使用者數據和詳情數據 |

### 🔷 列表相關

| 檔案 | 路徑 | 說明 |
|------|------|------|
| **列表頁面** | `ListPage.tsx` | 使用者列表頁面容器 |
| **列表組件** | `List.tsx` | 使用者列表表格組件 |
| **總覽頁面** | `OverviewPage.tsx` | 使用者總覽頁面 |
| **快速編輯** | `FormModal.tsx` | 快速編輯使用者的 Modal |
| **列表篩選** | `UsersListFilter.tsx` | 列表篩選組件 |

### 🔷 新增使用者

| 檔案 | 路徑 | 說明 |
|------|------|------|
| **新增頁面** | `create/CreatePage.tsx` | 新增使用者頁面容器 |
| **新增表單** | `create/CreateForm.tsx` | 新增使用者表單組件 |
| **範例頁面** | `create/EX_CreatePage.tsx` | 範例頁面（備用） |
| **範例表單** | `create/EX_CreateForm.tsx` | 範例表單（備用） |

### 🔷 使用者詳情

| 檔案 | 路徑 | 說明 |
|------|------|------|
| **詳情頁面** | `detail/DetailPage.tsx` | 使用者詳情頁面容器 |
| **基本資訊** | `detail/UserBasicInfoCard.tsx` | 基本資訊顯示卡片 |
| **狀態卡片** | `detail/UserStatusCard.tsx` | 狀態管理卡片（啟用/停用/鎖定） |
| **角色卡片** | `detail/UserRolesCard.tsx` | 角色顯示卡片 |
| **權限摘要** | `detail/UserPermissionSummaryCard.tsx` | 權限摘要顯示卡片 |
| **登入紀錄** | `detail/UserLoginHistoryCard.tsx` | 登入歷史記錄卡片 |
| **密碼卡片** | `detail/UserPasswordCard.tsx` | 密碼重設卡片 |

### 🔷 文檔

| 檔案 | 路徑 | 說明 |
|------|------|------|
| **模組文檔** | `UpmsUser.md` | 使用者管理模組功能規劃文檔 |

---

## 🔗 相關檔案位置

### 路由配置

| 檔案 | 路徑 | 說明 |
|------|------|------|
| **路由定義** | `src/app/routing/PrivateRoutes.tsx` | 包含 `UserPage` 路由配置 |

### Sidebar 配置

| 檔案 | 路徑 | 說明 |
|------|------|------|
| **側邊欄選單** | `src/_metronic/layout/components/sidebar/sidebar-menu/SidebarMenuMain.tsx` | 包含使用者管理選單項 |

---

## 📊 檔案統計

- **總檔案數**: 21 個
- **核心檔案**: 4 個
- **列表相關**: 5 個
- **新增相關**: 4 個（含 2 個範例檔案）
- **詳情相關**: 7 個
- **文檔**: 1 個

---

## 🎯 主要功能對應檔案

### 新增使用者
- 頁面：`create/CreatePage.tsx`
- 表單：`create/CreateForm.tsx`
- API：`Query.tsx` → `createUser()`

### 編輯使用者
- 快速編輯：`FormModal.tsx`
- API：`Query.tsx` → `updateUser()`

### 停用/啟用帳號
- 組件：`detail/UserStatusCard.tsx`
- API：`Query.tsx` → `updateUserStatus()`

### 刪除使用者
- 組件：`List.tsx`（含確認對話框）
- API：`Query.tsx` → `deleteUser()`

### 使用者列表
- 頁面：`ListPage.tsx`
- 組件：`List.tsx`
- API：`Query.tsx` → `fetchUsers()`

### 使用者詳情
- 頁面：`detail/DetailPage.tsx`
- 卡片組件：`detail/*.tsx`
- API：`Query.tsx` → `fetchUserProfile()`

---

## 📝 快速查找指南

### 需要修改 API 調用？
→ `Query.tsx`

### 需要修改數據模型？
→ `Model.tsx`

### 需要修改列表顯示？
→ `List.tsx` 或 `ListPage.tsx`

### 需要修改新增表單？
→ `create/CreateForm.tsx` 或 `create/CreatePage.tsx`

### 需要修改詳情頁面？
→ `detail/DetailPage.tsx` 或對應的卡片組件

### 需要修改路由？
→ `index.tsx`

### 需要添加 Mock 數據？
→ `mockUsers.tsx`

---

## 🔍 檔案依賴關係

```
index.tsx
  ├── ListPage.tsx
  │   ├── List.tsx
  │   │   └── Query.tsx
  │   └── FormModal.tsx
  │       └── Query.tsx
  ├── create/CreatePage.tsx
  │   └── create/CreateForm.tsx
  │       └── Query.tsx
  └── detail/DetailPage.tsx
      ├── detail/UserBasicInfoCard.tsx
      ├── detail/UserStatusCard.tsx
      │   └── Query.tsx
      ├── detail/UserRolesCard.tsx
      ├── detail/UserPermissionSummaryCard.tsx
      └── detail/UserLoginHistoryCard.tsx

所有組件都依賴：
  - Model.tsx (類型定義)
  - Query.tsx (API 調用)
```

---

**最後更新**: 2025-01-09  
**版本**: 1.0.0
