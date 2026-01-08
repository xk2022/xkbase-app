// src/app/pages/common/form/formUtils.tsx
export const trim = (v?: string) => (v ?? '').trim()

export const toUndef = (v?: string) => {
  const t = trim(v)
  return t ? t : undefined
}

export const upper = (v?: string) => trim(v).toUpperCase()

// 共用 code 規則（System / Role 共用）
export const CODE_RE = /^[A-Z0-9][A-Z0-9_-]{1,49}$/ // 2~50
