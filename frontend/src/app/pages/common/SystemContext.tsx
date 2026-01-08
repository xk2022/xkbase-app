// src/app/pages/common/SystemContext.tsx
import React, {createContext, useContext, useEffect, useMemo, useState, useCallback} from 'react'
import { System } from '../upms/system/Model'
import { fetchEnabledSystems } from '../upms/system/Query'
import { useAuth } from '@/app/modules/auth/core/Auth'

type SystemContextValue = {
  systems: System[]
  selectedSystemUuid: string | null
  selectedSystem: System | null // 當前選中的系統
  selectedSystemCode: string | null // 當前選中系統的代碼（如 'UPMS', 'TOM', 'FMS'）
  currentSystemPermissions: string[] // 當前選中系統的權限列表
  setSelectedSystemUuid: (uuid: string | null) => void
  reloadSystems: () => Promise<void>
  loading: boolean
  hasSystemPermission: (permission: string) => boolean // 檢查是否有指定權限
  hasSystem: (systemCode: string) => boolean // 檢查是否屬於指定系統
}

const SystemContext = createContext<SystemContextValue | null>(null)

export function SystemProvider({children}: {children: React.ReactNode}) {
  const { currentUser } = useAuth()
  const [systems, setSystems] = useState<System[]>([])
  const [selectedSystemUuid, setSelectedSystemUuid] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // 獲取當前選中的系統
  const selectedSystem = useMemo(() => {
    if (!selectedSystemUuid) return null
    return systems.find(s => s.id === selectedSystemUuid) ?? null
  }, [systems, selectedSystemUuid])

  // 獲取當前選中系統的代碼
  const selectedSystemCode = useMemo(() => {
    return selectedSystem?.code?.toUpperCase() ?? null
  }, [selectedSystem])

  // 獲取當前用戶在選中系統下的權限
  const currentSystemPermissions = useMemo(() => {
    if (!currentUser || !selectedSystemUuid) return []
    
    // 從用戶的 systemDTOs 中找到對應的系統權限
    const userSystem = currentUser.systemDTOs?.find(
      sys => sys.systemUuid === selectedSystemUuid
    )
    
    if (!userSystem) {
      // 如果找不到對應的系統權限，但在開發環境或 TEST 帳號，返回所有權限（用於測試）
      const isTestAccount = ['test', 'demo', 'mock'].includes(
        (currentUser.account || currentUser.username || '').toLowerCase()
      )
      if (isTestAccount || import.meta.env.MODE === 'development') {
        console.warn('[SystemContext] 未找到系統權限，TEST 帳號/開發環境返回空權限列表（將根據系統代碼顯示菜單）')
      }
      return []
    }
    
    // 提取所有啟用的權限名稱
    return userSystem.permissionDTOS
      .filter(perm => perm.active)
      .map(perm => perm.name)
  }, [currentUser, selectedSystemUuid])

  // 檢查是否有指定權限
  const hasSystemPermission = useCallback((permission: string): boolean => {
    // 如果沒有權限列表，但屬於該系統，在開發環境或 TEST 帳號時允許訪問（用於測試）
    if (currentSystemPermissions.length === 0 && selectedSystemCode) {
      const isTestAccount = currentUser && ['test', 'demo', 'mock'].includes(
        (currentUser.account || currentUser.username || '').toLowerCase()
      )
      if (isTestAccount || import.meta.env.MODE === 'development') {
        // 開發環境/TEST 帳號：如果屬於該系統，允許訪問（只檢查系統代碼，不檢查具體權限）
        return true
      }
    }
    return currentSystemPermissions.includes(permission)
  }, [currentSystemPermissions, selectedSystemCode, currentUser])

  // 檢查是否屬於指定系統
  const hasSystem = useCallback((systemCode: string): boolean => {
    if (!selectedSystemCode) return false
    
    // 嚴格匹配系統代碼（必須完全匹配）
    const matches = selectedSystemCode === systemCode.toUpperCase()
    
    return matches
  }, [selectedSystemCode])

  const reloadSystems = async () => {
    setLoading(true)
    try {
      const list = await fetchEnabledSystems()
      setSystems(list)

      // 預設選第一個（若目前選的不存在）
      setSelectedSystemUuid((prev) => {
        if (prev && list.some((x) => x.id === prev)) return prev
        return list.length ? list[0].id : null
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reloadSystems()
  }, [])

  const value = useMemo<SystemContextValue>(
    () => ({
      systems,
      selectedSystemUuid,
      selectedSystem,
      selectedSystemCode,
      currentSystemPermissions,
      setSelectedSystemUuid,
      reloadSystems,
      loading,
      hasSystemPermission,
      hasSystem,
    }),
    [systems, selectedSystemUuid, selectedSystem, selectedSystemCode, currentSystemPermissions, loading, hasSystemPermission, hasSystem],
  )

  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
}

export function useSystem() {
  const ctx = useContext(SystemContext)
  if (!ctx) throw new Error('useSystem must be used within <SystemProvider />')
  return ctx
}
