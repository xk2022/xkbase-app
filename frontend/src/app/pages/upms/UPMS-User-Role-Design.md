我用一個「高階架構圖 + 流程圖 + 對應表」一次幫你整理好，之後你可以直接複製到 README / Notion。

---

## 1️⃣ UPMS 全體架構概觀（User + Role）

用文字版架構圖先看全貌：

```mermaid
flowchart LR
  subgraph Frontend[Frontend (React / Metronic)]
    A1[UserOverview\n/user/overview]
    A2[UserCreatePage\n/user/create]
    A3[UserProfilePage\n/user/:id/detail]
    B1[RoleOverview\n/role/overview]
    B2[RoleFormModal\nCreate/Edit]
  end

  subgraph API[API Layer (Spring MVC)]
    C1[UserController\n/api/upms/users]
    C2[RoleController\n/api/upms/roles]
  end

  subgraph Service[Application / Domain Service]
    D1[UserService]
    D2[UserRoleService]
    D3[UserProfileService\n(規劃中)]
    E1[RoleService]
    E2[RolePermissionService]
  end

  subgraph Domain[Domain / JPA Entity]
    F1[User]
    F2[UserProfile]
    F3[UserRole]
    F4[Role]
    F5[RolePermission]
    F6[Permission]
  end

  subgraph Infra[Infra / Repository]
    R1[UserRepository]
    R2[UserProfileRepository]
    R3[UpmsUserRoleRepository]
    R4[RoleRepository]
    R5[RolePermissionRepository]
    R6[PermissionRepository]
  end

  A1 -->|GET /api/upms/users| C1
  A2 -->|POST /api/upms/users| C1
  A3 -->|GET /api/upms/users/{id}/profile| C1

  B1 -->|GET /api/upms/roles| C2
  B2 -->|POST/PUT /api/upms/roles| C2

  C1 --> D1
  C1 --> D2
  C1 --> D3
  C2 --> E1
  C2 --> E2

  D1 --> R1
  D3 --> R2
  D2 --> R3
  E1 --> R4
  E2 --> R5
  E2 --> R6

  R1 --> F1
  R2 --> F2
  R3 --> F3
  R4 --> F4
  R5 --> F5
  R6 --> F6
```

---

## 2️⃣ User 模組 – 前後端 Flow

### 2-1 User 列表（/upms/user/overview）

**前端：**

* `UserPage.tsx`

  * route：`/upms/user/overview` → `<Overview />`
* `Overview.tsx`

  * 管理搜尋欄位、彈窗、alert、分頁 state
  * 把 `searchKeyword`、`onEdit` 傳給 `UserList`
* `UserList.tsx`

  * `loadUsers()` → `fetchUsers(query, showAlert)`
  * `fetchUsers` 回傳 `PageResult<User>`
  * row `onClick` → `navigate('/upms/user/:id/detail')`
  * 編輯按鈕 → 呼叫父層 `onEdit(user)` 開 `FormModal`

**API 呼叫：**

```ts
// Query.ts
http.get<ApiResponse<PageResult<UserListResp>>>('/api/upms/users', { params: query })
  → mapUserListRespToUser(dto)  // UserListResp → User
```

**後端：**

* `UserController.page(...)`

```java
@GetMapping
public ApiResult<Page<UserResp>> page(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("createdTime").descending());
    Page<UserResp> result = userService.page(pageable);
    return ApiResult.success(result);
}
```

* `UserService.page(Pageable)`
  `userRepo.findAll(pageable).map(u -> XkBeanUtils.copyProperties(u, UserResp::new))`
* `UserRepository` → JPA 查 `User` entity

👉 **整體 Flow：**

```text
UserOverview / UserList
  → fetchUsers(PageQuery)
    → GET /api/upms/users
      → UserController.page
        → UserService.page
          → UserRepository.findAll(Pageable)
            → Page<User>
          → map to Page<UserResp>
      → ApiResult<Page<UserResp>>
    → mapUserListRespToUser → PageResult<User>
  → render table
```

---

### 2-2 User 新增 / 編輯

**前端：**

* `UserCreatePage.tsx`

  * `onSubmit` → `createUser(payload)` → 成功後 `navigate('/upms/user/overview')`
* `User FormModal.tsx`

  * `isEdit` (有帶 `editingUser`) 決定呼叫 `createUser` 或 `updateUser`
  * `selectedRoleCodes` 來自「角色多選」

**API 呼叫：**

* 新增：

```ts
// Query.ts
http.post<ApiResponse<UserResp>>('/api/upms/users', payload)
```

* 更新：

```ts
http.put<ApiResponse<UserResp>>(`/api/upms/users/${id}`, payload)
```

**後端：**

```java
// UserController.create
@PostMapping
public ApiResult<UserResp> create(@RequestBody UserCreateReq req) {
    return ApiResult.success(userService.create(req));
}

// UserController.update
@PutMapping("/{id}")
public ApiResult<UserResp> update(@PathVariable UUID id, @RequestBody UserUpdateReq req) {
    return ApiResult.success(userService.update(id, req));
}
```

* `UserService.create(UserCreateReq)`

  * 建立 `User` + `UserProfile`
  * `userRepo.save(user)`
  * 透過 `userRoleService.assignRole(userUuid, roleCode)` 建 `UserRole`
* `UserService.update(id, UserUpdateReq)`

  * 更新 `User` / `UserProfile` 欄位
  * 重設角色：`userRoleService.clearRoles(uuid)` → 再 `assignRole(...)`

---

### 2-3 User 詳情 / Profile

**前端：**

* Route：`/upms/user/:id/detail` → `UserProfilePage`
* `UserProfilePage.tsx`

  * `useParams().id`
  * `useEffect/loadDetail` → `fetchUserProfile(id)`
  * 結果塞進 `UserProfile`
  * 分拆成 4 卡片：

    * `UserBasicInfoCard`
    * `UserRolesCard`
    * `UserLoginHistoryCard`
    * `UserPasswordCard`

**API 呼叫：**

```ts
// UserProfileQuery.ts
http.get<ApiResponse<UserProfile>>(`/api/upms/users/${id}/profile`)
```

**後端（建議規劃）：**

```java
// UserController
@GetMapping("/{id}/profile")
public ApiResult<UserProfileDetailResp> profile(@PathVariable UUID id) {
    return ApiResult.success(userProfileService.getProfile(id));
}
```

* `UserProfileService.getProfile(UUID userId)`

  * 讀取 `User`, `UserProfile`, `UserRole` + `Role`, `RolePermission` + `Permission`, LoginHistory
  * 組合成 `UserProfileDetailResp` 回給前端

---

### 2-4 User 安全相關

* **啟用/停用帳號：**

  前端 `UserBasicInfoCard` / `UserList` 之後可加 Switch / Button 呼叫：

  ```ts
  PATCH /api/upms/users/{id}/enable?enabled=true|false
  ```

  後端：

  ```java
  public UserResp enable(UUID id, boolean enabled) { ... }
  ```

* **重設密碼：**

  `UserPasswordCard` → `resetUserPassword(id, newPassword)`

  ```ts
  PATCH /api/upms/users/{id}/password?newPassword=xxxx
  ```

---

## 3️⃣ Role 模組 – 前後端 Flow

### 3-1 Role 列表（/upms/role/overview）

**前端：**

* `RolePage.tsx`
  route：`/upms/role/overview` → `<Overview />`
* `Overview.tsx`

  * 搜尋 + 新增按鈕 + `FormModal` 管理
  * `RoleList` 顯示表格 (之後你可以照 UserList 寫 RoleList)
* `Query.ts`：

```ts
export async function fetchRoles(
  query: PageQuery,
  showAlert?: AlertFn
): Promise<PageResult<Role>> {
  const res = await http.get<ApiResponse<PageResult<RoleListResp>>>(
    '/api/upms/roles',
    { params: query }
  )
  const page = res.data.data
  return {
    ...page,
    content: (page.content || []).map(mapRoleListRespToRole),
  }
}
```

**後端：**

```java
// RoleController
@GetMapping
public ApiResult<Page<RoleResp>> page(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("createdTime").descending());
    return ApiResult.success(roleService.page(pageable));
}
```

* `RoleService.page(Pageable)` → `roleRepo.findAll(pageable).map(...)`

---

### 3-2 Role 新增 / 編輯（FormModal.tsx）

**前端：**

* `Role FormModal.tsx`（你剛剛產出的那支）：

  * `CreateRoleReq` / `UpdateRoleReq`
  * 欄位：

    * code（建立後不可修改）
    * name
    * description
    * enabled
    * permissionCodes（逗號分隔）

**API：**

* 新增：`POST /api/upms/roles`
* 更新：`PUT /api/upms/roles/{id}`

**後端：**

```java
// RoleController
@PostMapping
public ApiResult<RoleResp> create(@RequestBody RoleCreateReq req) {
    return ApiResult.success(roleService.create(req));
}

@PutMapping("/{id}")
public ApiResult<RoleResp> update(@PathVariable UUID id,
                                  @RequestBody RoleUpdateReq req) {
    roleService.update(id, req);
    return ApiResult.success();
}
```

* `RoleService.create`：建 `Role`，再透過 `RolePermissionService.assignPermission(roleUuid, permCode)` 建 `RolePermission`
* `RoleService.update`：更新 Role 欄位，清除舊 `RolePermission` 再重建

---

### 3-3 Role options（提供 User 選角色）

**前端：**

在 `User FormModal` / `UserCreatePage` 裡：

```ts
const loadRoles = async () => {
  const data = await fetchOptions(showAlert)
  setRoleOptions(Array.isArray(data) ? data : [])
}
```

> 注意：這裡用的是 `RoleOptionResp`，和 `Role` model 不同。

`RoleOptionResp`：

```ts
export interface RoleOptionResp {
  id: string
  code: string
  name: string
}
```

**後端：**

```java
// RoleController
@GetMapping("/options")
public ApiResult<List<RoleOptionResp>> options() {
    return ApiResult.success(roleService.options());
}
```

`RoleService.options()` → 讀 `Role`，只丟 `id, code, name` 給前端。

---

## 4️⃣ Model & API 對應表

### 4-1 User 模組

| 面向             | 名稱                                    | 說明                                                                         |
| -------------- | ------------------------------------- | -------------------------------------------------------------------------- |
| **Entity**     | `User`                                | 使用者基本帳號資料（username、password、enabled、locked...）                             |
| Entity         | `UserProfile`                         | 使用者個人資訊（姓名、暱稱、email、phone、avatarUrl）                                       |
| Entity         | `UserRole`                            | User ↔ Role 中介（user_uuid, role_uuid）                                       |
| DTO (Req)      | `UserCreateReq`                       | 建立使用者：username、password、enabled、roleCodes、profile                          |
| DTO (Req)      | `UserUpdateReq`                       | 更新使用者：username、enabled、roleCodes、profile                                   |
| DTO (Resp)     | `UserResp`                            | 分頁列表 / 單筆使用（簡版：id, username, enabled, ...）                                 |
| DTO (Resp)     | `UserListResp`                        | 給前端列表專用的扁平 dto（含 name, avatarUrl, roleCodes, lastLoginAt, joinedAt）        |
| DTO (Resp)     | `UserProfileDetailResp` *(建議名稱)*      | 詳情頁用（含 profile, roles, permissions, loginHistory）                          |
| Frontend Model | `User` (`UserModel.ts`)               | 列表畫面用的 User（uuid, name, avatar, role, last_login, joined_day, initials...） |
| Frontend Model | `UserProfile` (`UserProfileModel.ts`) | 詳情畫面用（profile, roles, permissions, loginHistory）                           |
| API            | `GET /api/upms/users`                 | 回傳 `ApiResult<Page<UserResp or UserListResp>>` → `PageResult<User>`        |
| API            | `POST /api/upms/users`                | 建立使用者，回 `ApiResult<UserResp>`                                              |
| API            | `PUT /api/upms/users/{id}`            | 更新使用者，回 `ApiResult<UserResp>`                                              |
| API            | `DELETE /api/upms/users/{id}`         | 刪除使用者                                                                      |
| API            | `PATCH /api/upms/users/{id}/enable`   | 啟用/停用使用者                                                                   |
| API            | `PATCH /api/upms/users/{id}/password` | 重設密碼                                                                       |
| API            | `GET /api/upms/users/{id}/profile`    | 取得詳情 + Profile + Roles + Permissions + LoginHistory                        |

---

### 4-2 Role 模組

| 面向             | 名稱                            | 說明                                                          |
| -------------- | ----------------------------- | ----------------------------------------------------------- |
| Entity         | `Role`                        | 角色主體：code, name, description, enabled                       |
| Entity         | `RolePermission`              | Role ↔ Permission 中介                                        |
| Entity         | `Permission`                  | 權限資源（code, name, description...）                            |
| DTO (Req)      | `RoleCreateReq`               | 建立角色：code, name, description, enabled, permissionCodes      |
| DTO (Req)      | `RoleUpdateReq`               | 更新角色：name, description, enabled, permissionCodes            |
| DTO (Resp)     | `RoleResp`                    | 一般回傳用：id, code, name, description, enabled, permissionCodes |
| DTO (Resp)     | `RoleDetailResp`              | 詳情用（之後可加 userCount 等）                                       |
| DTO (Resp)     | `RoleOptionResp`              | 下拉選單用：id, code, name                                        |
| Frontend Model | `Role` (`RoleModel.ts`)       | 角色列表 / edit 模式用                                             |
| Frontend Model | `RoleListResp`                | 對應後端 RoleResp，經 `mapRoleListRespToRole` 轉為 `Role`           |
| Frontend Model | `RoleOptionResp`              | `/roles/options` 回來直接用在 checkbox / select                   |
| API            | `GET /api/upms/roles`         | 分頁角色列表，回 `ApiResult<Page<RoleResp>>`                        |
| API            | `GET /api/upms/roles/options` | 回 `ApiResult<List<RoleOptionResp>>`，給 User 選擇角色用            |
| API            | `GET /api/upms/roles/{id}`    | 單一角色詳情                                                      |
| API            | `POST /api/upms/roles`        | 建立角色                                                        |
| API            | `PUT /api/upms/roles/{id}`    | 更新角色（含重設權限）                                                 |
| API            | `DELETE /api/upms/roles/{id}` | 刪除角色（先刪 RolePermission 再刪 Role）                             |

---

## 5️⃣ 建議後續文件化方式

你可以在專案根目錄放一個：

* `docs/upms/UPMS-User-Role-Design.md`

內容大致就是：

1. 上面那張 mermaid 架構圖
2. User Flow（列表 / 新增 / 詳情）
3. Role Flow（列表 / 新增 / 權限綁定）
4. Model & API 對應表

之後開新 GPT 對話，你只要把這份丟進來，我就能直接「讀完接手」，不需要再重新解釋架構。

如果你願意，我也可以下一步直接幫你產出這個 `UPMS-User-Role-Design.md` 的完整版本（含章節標題、說明文字），讓你貼到 repo 裡直接用。
