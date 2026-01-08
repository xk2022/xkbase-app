// src/app/pages/adm/dictionary/hooks/useDictionaryMasterDetail.tsx
import {useEffect, useMemo, useState} from 'react'
import type {AlertFn} from '@/app/pages/common/AlertType'

import type {Dictionary} from '../../Model'
import {fetchDictionaries, updateDictionary} from '../../Query'

type Args = {
  showAlert?: AlertFn
}

export function useDictionaryMasterDetail({showAlert}: Args) {
  // ==========================================================
  // Filters（v1：全部前端 filter，不打後端）
  // ==========================================================
  const [tempKeyword, setTempKeyword] = useState('')
  const [keyword, setKeyword] = useState('')
  const [enabled, setEnabled] = useState<boolean | ''>('')

  // ==========================================================
  // List & Selection
  // ==========================================================
  const [loadingLeft, setLoadingLeft] = useState(true)

  /** ✅ 全量資料（只由 API 更新） */
  const [allDictionaries, setAllDictionaries] = useState<Dictionary[]>([])

  /** ✅ 目前選取 */
  const [selected, setSelected] = useState<Dictionary | null>(null)

  // ==========================================================
  // Frontend filter (NO API)
  // ==========================================================
  const dictionaries = useMemo(() => {
    setSelected(null)
    const kw = keyword.trim().toLowerCase()

    return (allDictionaries ?? []).filter((d) => {
      if (enabled !== '' && d.enabled !== enabled) return false
      if (!kw) return true

      const code = (d.code ?? '').toLowerCase()
      const name = (d.name ?? '').toLowerCase()
      return code.includes(kw) || name.includes(kw)
    })
  }, [allDictionaries, keyword, enabled])

  // ==========================================================
  // Load (API: only init / manual refresh)
  // ==========================================================
  /**
   * 載入左側分類清單（打後端）
   * - keepSelectedId：希望保留既有選取 id（refresh / toggle / edit 後）
   * - 若 keepSelectedId 不存在於新清單：fallback 選第一筆
   */
  const loadLeft = async (keepSelectedId?: string | null) => {
    setLoadingLeft(true)
    try {
      const list = await fetchDictionaries(undefined, showAlert)
      setAllDictionaries(list)

      // 保持選取
      if (keepSelectedId) {
        const keep = list.find((d) => d.id === keepSelectedId) ?? null
        setSelected(keep ?? (list[0] ?? null))
        return
      }

      // 預設：若尚未選取 → 選第一筆；有選取則保留（但若不存在就改第一筆）
      setSelected((prev) => {
        if (!prev) return list[0] ?? null
        const still = list.some((d) => d.id === prev.id)
        return still ? prev : null
      })
    } finally {
      setLoadingLeft(false)
    }
  }

  /** 初次載入只打一次 API */
  useEffect(() => {
    loadLeft(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ==========================================================
  // Selection fix when filter changes (NO API)
  // ==========================================================
  /**
   * 當 keyword/enabled 改變，dictionaries 會變
   * - 若 selected 被 filter 掉：改選 filtered 第一筆
   */
  useEffect(() => {
    if (!selected) return

    const stillExists = dictionaries.some((d) => d.id === selected.id)
    if (!stillExists) {
        setSelected(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dictionaries])

  // ==========================================================
  // Public actions
  // ==========================================================
  const search = () => {
    setSelected(null)
    setKeyword(tempKeyword.trim())
  }

  const reset = () => {
    setSelected(null)
    setTempKeyword('')
    setKeyword('')
    setEnabled('')
  }

  const select = (d: Dictionary) => setSelected(d)

  /** 手動刷新：打 API，盡量保留選取 */
  const reloadLeftKeepSelected = async () => {
    await loadLeft(selected?.id ?? null)
  }

  /** 指定選取某筆（例如 copy 後選到新分類） */
  const reloadLeftSelectId = async (id: string) => {
    await loadLeft(id)
  }

  /**
   * 只切分類 enabled（不動 items）
   * - update 成功後：通常希望同步 selected + refresh 全量（避免列表 badge 不一致）
   */
  const toggleCategoryEnabled = async (id: string, nextEnabled: boolean) => {
    try {
      const updated = await updateDictionary(id, {enabled: nextEnabled}, showAlert)
      if (updated) {
        setSelected(updated)
      }
      // ✅ reload 全量並保留這筆
      await loadLeft(id)
    } catch (e) {
      console.error(e)
    }
  }

  return {
    // filters
    tempKeyword,
    keyword,
    enabled,
    setTempKeyword,
    setEnabled,
    search,
    reset,

    // list
    loadingLeft,
    dictionaries, // filtered list (NO API)
    selected,
    setSelected,
    select,

    // reload (API)
    reloadLeftKeepSelected,
    reloadLeftSelectId,

    // actions
    toggleCategoryEnabled,
  }
}
