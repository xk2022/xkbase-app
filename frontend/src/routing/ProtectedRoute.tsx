import { Navigate, Outlet } from 'react-router-dom'
// import { useAuth } from '../modules/auth' // 取用你現有的 useAuth()（Metronic 模版提供）
import React from 'react'
import { useAuth } from '@/app/modules/auth';

type Props = { role?: string; perm?: string }

// 若你已有更完整的權限檢查，可把 hasRole/hasPerm 接到你的 store
const useHasRole = (role?: string) => role ? true : true
const useHasPerm = (perm?: string) => perm ? true : true

export function ProtectedRoute({ role, perm }: Props) {
  const { currentUser } = useAuth()
  if (!currentUser) return <Navigate to="/auth" replace />

  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (role && !useHasRole(role)) return <Navigate to="/error/403" replace />
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (perm && !useHasPerm(perm)) return <Navigate to="/error/403" replace />

  return <Outlet />
}
