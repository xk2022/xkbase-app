// src/app/pages/upms/permission/list/List.tsx
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {KTIcon} from '@/_metronic/helpers'

import type {AlertType} from '@/app/pages/common/AlertType'
import {ConfirmDeleteModal} from '@/app/pages/common/ConfirmDeleteModal'

import type {Column} from '@/app/pages/common/PagedTable'
import {PagedTable} from '@/app/pages/common/PagedTable'

import type {Permission} from '../Model'
import {deletePermission, fetchPermissions} from '../Query'

/**
 * ===============================================================
 * PermissionList（列表表格元件）
 * ---------------------------------------------------------------
 * 職責：
 * - 根據 keyword / page 打 API 拿分頁資料
 * - 顯示 table
 * - 提供「詳情 / 編輯(可選) / 刪除」操作
 *
 * 不做：
 * - 搜尋欄位輸入框（由 ListPage 管）
 * - 建立權限（由 ListPage 跳 /upms/permission/create）
 * ===============================================================
 */
interface PermissionListProps {
  searchKeyword: string
  showAlert: (message: string, type: AlertType) => void
  onEdit?: (permission: Permission) => void
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

const enabledBadge = (v?: boolean) => {
  if (v === undefined || v === null) return <span className='text-muted'>-</span>
  return v ? (
    <span className='badge badge-light-success fw-bolder'>啟用</span>
  ) : (
    <span className='badge badge-light-secondary fw-bolder'>停用</span>
  )
}

// ===============================================================
// Component
// ===============================================================
const PermissionList: React.FC<PermissionListProps> = ({
  searchKeyword,
  showAlert,
  onEdit,
  onReload,
}) => {
  const navigate = useNavigate()

  // =============================================================
  // State - Data
  // =============================================================
  const [rows, setRows] = useState<Permission[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1) // UI 1-based
  const [loading, setLoading] = useState(false)

  // =============================================================
  // State - Delete Modal
  // =============================================================
  const [deleteTarget, setDeleteTarget] = useState<Permission | null>(null)
  const [deleting, setDeleting] = useState(false)

  // =============================================================
  // Derived
  // =============================================================
  const trimmedKeyword = useMemo(() => {
    const k = searchKeyword?.trim()
    return k ? k : undefined
  }, [searchKeyword])

  // =============================================================
  // Data Loader
  // =============================================================
  const loadPermissions = useCallback(async () => {
    setLoading(true)
    try {
      const query = {
        page: page - 1,
        size: PAGE_SIZE,
        keyword: trimmedKeyword,
      }

      const data = await fetchPermissions(query, showAlert)
      setRows(data.content ?? [])
      setTotalElements(data.totalElements ?? 0)
      setTotalPages(data.totalPages || 1)
    } finally {
      setLoading(false)
    }
  }, [page, trimmedKeyword, showAlert])

  // =============================================================
  // Effects
  // =============================================================
  useEffect(() => {
    setPage(1)
  }, [trimmedKeyword])

  useEffect(() => {
    loadPermissions()
  }, [loadPermissions])

  // =============================================================
  // Handlers - Navigation
  // =============================================================
  const goDetail = useCallback(
    (p: Permission) => {
      navigate(`/upms/permission/${p.id}/detail`)
    },
    [navigate],
  )

  // =============================================================
  // Handlers - Delete
  // =============================================================
  const openDelete = (p: Permission) => setDeleteTarget(p)

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return

    const id = deleteTarget.id
    if (!id) {
      showAlert('缺少權限識別碼，無法刪除', 'danger')
      return
    }

    try {
      setDeleting(true)
      const ok = await deletePermission(String(id), showAlert)
      if (ok) {
        await loadPermissions()
        onReload?.()
        setDeleteTarget(null)
      }
    } finally {
      setDeleting(false)
    }
  }, [deleteTarget, loadPermissions, onReload, showAlert])

  // =============================================================
  // Render
  // =============================================================
  const columns: Column[] = [
    {header: '權限代碼', className: 'min-w-200px'},
    {header: '權限名稱', className: 'min-w-200px'},
    {header: '系統', className: 'min-w-125px'},
    {header: '資源', className: 'min-w-125px'},
    {header: '動作', className: 'min-w-125px'},
    {header: '狀態', className: 'min-w-100px'},
    {header: '建立時間', className: 'min-w-150px'},
    {header: '操作', className: 'text-end min-w-100px'},
  ]

  return (
    <>
      <PagedTable<Permission>
        columns={columns}
        rows={rows}
        loading={loading}
        emptyText='沒有權限資料'
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
        tableClassName='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
        renderRow={(p) => (
          <tr
            key={String(p.id ?? p.code)}
            className='cursor-pointer table-row-hover text-gray-600 fw-bold'
            onClick={() => goDetail(p)}
          >
            <td>
              <span className='badge badge-light-info fs-7 fw-bold'>
                {p.code ?? '-'}
              </span>
            </td>
            <td>
              <span className='text-gray-800 fw-bold'>{p.name ?? '-'}</span>
            </td>
            <td>
              <span className='badge badge-light-primary fs-7'>
                {p.systemCode ?? '-'}
              </span>
            </td>
            <td>
              <span className='text-gray-700'>{p.resourceCode ?? '-'}</span>
            </td>
            <td>
              <span className='text-gray-700'>{p.actionCode ?? '-'}</span>
            </td>
            <td>{enabledBadge(p.enabled)}</td>
            <td>
              {p.createdTime ? (
                <span className='text-muted fw-semibold'>{formatDateTime(p.createdTime)}</span>
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
                    e.stopPropagation()
                    goDetail(p)
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
                      e.stopPropagation()
                      onEdit(p)
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
                    e.stopPropagation()
                    openDelete(p)
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
          title='刪除權限'
          deleting={deleting}
          message={
            <>
              <p>
                確定要刪除權限{' '}
                <strong>{deleteTarget.code ?? deleteTarget.id ?? '-'}</strong> 嗎？
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

export default PermissionList
