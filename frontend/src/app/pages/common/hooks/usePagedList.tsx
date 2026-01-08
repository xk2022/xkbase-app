import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import type {AlertType} from '../AlertType'
import type {PageQuery, PageResult} from '../paging'

type ShowAlert = (message: string, type: AlertType) => void

interface UsePagedListOptions<T> {
  keyword?: string
  pageSize?: number
  showAlert?: ShowAlert

  /**
   * 你現有的 fetchXxx(query, showAlert) 也能吃
   * 但建議 hook 內只吃 fetcher(query) 即可
   */
  fetcher: (query: PageQuery) => Promise<PageResult<T>>

  /**
   * 若你要從外層強制刷新（例如 listKey++）
   * 把 refreshKey 丟進來即可
   */
  refreshKey?: unknown

  /**
   * keyword 變更是否自動回到第一頁（預設 true）
   */
  resetPageOnKeywordChange?: boolean
}

export function usePagedList<T>(opts: UsePagedListOptions<T>) {
  const {
    keyword,
    pageSize = 10,
    fetcher,
    refreshKey,
    resetPageOnKeywordChange = true,
  } = opts

  const [rows, setRows] = useState<T[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // UI 1-based page
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  // 用來避免舊請求覆蓋新請求（競態）
  const requestSeq = useRef(0)

  const trimmedKeyword = useMemo(() => {
    const k = keyword?.trim()
    return k ? k : undefined
  }, [keyword])

  const buildQuery = useCallback((): PageQuery => {
    return {
      page: Math.max(0, page - 1),
      size: pageSize,
      keyword: trimmedKeyword,
    }
  }, [page, pageSize, trimmedKeyword])

  const reload = useCallback(async () => {
    const seq = ++requestSeq.current
    setLoading(true)

    try {
      const query = buildQuery()
      const data = await fetcher(query)

      // 只接受最新一次請求
      if (seq !== requestSeq.current) return

      setRows(data.content || [])
      setTotalElements(data.totalElements ?? 0)
      setTotalPages(data.totalPages || 1)
    } finally {
      // 只結束最新一次請求的 loading
      if (seq === requestSeq.current) setLoading(false)
    }
  }, [buildQuery, fetcher])

  // keyword 變更 → 回到第 1 頁
  useEffect(() => {
    if (!resetPageOnKeywordChange) return
    setPage(1)
  }, [trimmedKeyword, resetPageOnKeywordChange])

  // page/keyword/refreshKey 變更 → reload
  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, trimmedKeyword, refreshKey])

  const pagination = useMemo(
    () => ({
      page,
      totalPages,
      totalElements,
      setPage,
      prev: () => setPage((p) => Math.max(1, p - 1)),
      next: () => setPage((p) => Math.min(totalPages || 1, p + 1)),
    }),
    [page, totalPages, totalElements],
  )

  return {
    rows,
    totalElements,
    totalPages,
    page,
    setPage,
    loading,
    reload,
    pagination,
  }
}
