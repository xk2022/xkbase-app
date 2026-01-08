// src/app/pages/upms/system/List.tsx
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { KTIcon } from '@/_metronic/helpers'

import type { AlertType } from '@/app/pages/common/AlertType'
import { ConfirmDeleteModal } from '@/app/pages/common/ConfirmDeleteModal'

import { Column, PagedTable } from '@/app/pages/common/PagedTable'
import type { System } from '../Model'
import { deleteSystem, fetchSystems } from '../Query'

/**
 * ===============================================================
 * SystemList（列表表格元件）
 * ---------------------------------------------------------------
 * 職責：
 * - 根據 query / page 打 API 拿分頁資料
 * - 顯示 table
 * - 提供「詳情 / 編輯(可選) / 刪除」操作
 *
 * 不做：
 * - 搜尋欄位輸入框（由 ListPage 管）
 * - 建立系統（由 ListPage 跳 /upms/system/create）
 * ===============================================================
 */
interface SystemListProps {
  searchKeyword: string
  showAlert: (message: string, type: AlertType) => void
  /** v1：先不做 edit，也先把接口留著 */
  onEdit?: (system: System) => void
  /** ListPage 想要觸發外層 reload（可選） */
  onReload?: () => void
}

const PAGE_SIZE = 10

// ===============================================================
// Utilities
// ===============================================================
const formatDateTime = (ts?: string) => {
  if (!ts) return '-'
  try {
    const d = new Date(ts)
    if (Number.isNaN(d.getTime())) return ts

    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const HH = String(d.getHours()).padStart(2, '0')
    const MM = String(d.getMinutes()).padStart(2, '0')

    return `${yyyy}/${mm}/${dd} ${HH}:${MM}`
  } catch {
    return ts
  }
}

// ===============================================================
// Component
// ===============================================================
const SystemList: React.FC<SystemListProps> = ({
  searchKeyword,
  showAlert,
  onEdit,
  onReload,
}) => {
  // =============================================================
  // Router
  // =============================================================
  const navigate = useNavigate()

  // =============================================================
  // State - Data
  // =============================================================
  const [systems, setSystems] = useState<System[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1) // UI 1-based
  const [loading, setLoading] = useState(false)

  // =============================================================
  // State - Delete Modal
  // =============================================================
  const [deleteTarget, setDeleteTarget] = useState<System | null>(null)
  const [deleting, setDeleting] = useState(false)

  // =============================================================
  // Data Loader
  // =============================================================
  const loadSystems = useCallback(async () => {
    setLoading(true)

    try {
      const query = {
        page: page - 1,
        size: PAGE_SIZE,
        keyword: searchKeyword?.trim() ? searchKeyword.trim() : undefined,
      }

      const data = await fetchSystems(query, showAlert)

      setSystems(data.content)
      setTotalElements(data.totalElements)
      setTotalPages(data.totalPages || 1)
    } finally {
      setLoading(false)
    }
  }, [page, searchKeyword, showAlert])

  // =============================================================
  // Effects
  // =============================================================

  // query 變動時：回到第 1 頁
  useEffect(() => {
    setPage(1)
  }, [searchKeyword])

  // page / query 變動時：重新載入
  useEffect(() => {
    loadSystems()
  }, [loadSystems])

  // =============================================================
  // Handlers - Navigation
  // =============================================================
  const goDetail = useCallback(
    (s: System) => {
      navigate(`/upms/system/${s.id}/detail`)
    },
    [navigate],
  )

  // =============================================================
  // Handlers - Delete
  // =============================================================
  const openDelete = (s: System) => setDeleteTarget(s)

  const confirmDelete = async () => {
    if (!deleteTarget) return

    const id = deleteTarget.id
    if (!id) {
      showAlert('缺少系統識別碼，無法刪除', 'danger')
      return
    }

    try {
      setDeleting(true)
      const ok = await deleteSystem(String(id), showAlert)
      if (ok) {
        await loadSystems()
        onReload?.()
        setDeleteTarget(null)
      }
    } finally {
      setDeleting(false)
    }
  }

  // =============================================================
  // Render
  // =============================================================
  const columns: Column[] = [
    { header: '系統代碼', className: 'min-w-140px' },
    { header: '系統名稱', className: 'min-w-180px' },
    { header: '狀態', className: 'min-w-100px' },
    { header: '建立時間', className: 'min-w-125px' },
    { header: '操作', className: 'text-end min-w-100px' },
  ]

  return (
    <>
      <PagedTable<System>
        columns={columns}
        rows={systems}
        loading={loading}
        emptyText='沒有系統資料'
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
        tableClassName='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
        renderRow={(s) => (
          <tr
            key={String(s.id ?? s.code)}
            className='cursor-pointer table-row-hover text-gray-600 fw-bold'
            onClick={() => goDetail(s)}
          >
            <td className='fw-bold text-gray-900'>{s.code ?? '-'}</td>
            <td>{s.name ?? '-'}</td>
            <td>
              {s.enabled ? (
                <span className='badge badge-light-success fw-bolder'>啟用</span>
              ) : (
                <span className='badge badge-light-secondary fw-bolder'>停用</span>
              )}
            </td>
            <td>
              {s.createdTime ? (
                <span className='text-muted fw-semibold'>{formatDateTime(s.createdTime)}</span>
              ) : (
                <span className='text-muted'>-</span>
              )}
            </td>

            <td className='text-end' onClick={(e) => e.stopPropagation()}>
              <div className='d-flex justify-content-end gap-2'>
                <button
                  className='btn btn-light-primary btn-sm'
                  onClick={(e) => {
                    e.preventDefault()
                    goDetail(s)
                  }}
                  title='查看詳情'
                >
                  <KTIcon iconName='eye' className='fs-2' />
                </button>

                {onEdit && (
                  <button
                    className='btn btn-light-warning btn-sm'
                    onClick={(e) => {
                      e.preventDefault()
                      onEdit(s)
                    }}
                    title='編輯'
                  >
                    <KTIcon iconName='message-edit' className='fs-2' />
                  </button>
                )}

                <button
                  className='btn btn-light-danger btn-sm'
                  onClick={(e) => {
                    e.preventDefault()
                    openDelete(s)
                  }}
                  title='刪除'
                >
                  <KTIcon iconName='trash' className='fs-2' />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      {deleteTarget && (
        <ConfirmDeleteModal
          open={!!deleteTarget}
          title='刪除系統'
          deleting={deleting}
          message={
            <>
              <p>
                確定要刪除系統{' '}
                <strong>
                  {deleteTarget.code ?? deleteTarget.id ?? '-'}
                </strong>{' '}
                嗎？
              </p>
              <p className='text-muted mb-0'>此操作無法復原，請再次確認。</p>
            </>
          }
          onClose={() => (!deleting ? setDeleteTarget(null) : null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  )
}

export default SystemList
