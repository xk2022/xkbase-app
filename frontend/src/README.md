src/
  app/              ← App 殼與全域 Provider
  routing/          ← 路由與守衛
  shared/
    api/            ← http 客戶端、型別、自動重試策略
    auth/           ← auth store、權限工具
    ui/             ← 共用元件（Button/DataTable/Form 等）
    hooks/          ← useDict / useToast / useDebounce
    config/         ← 常數、feature flags
    utils/          ← 時間/金額/單位換算
  modules/          ← 業務模組（upms/fms/tom/billing…）
  pages/            ← 頁面級（可逐步搬進 modules/*/pages）
