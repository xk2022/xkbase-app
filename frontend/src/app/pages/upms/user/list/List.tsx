// src/app/pages/upms/user/List.tsx
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

import { KTIcon, toAbsoluteUrl } from '@/_metronic/helpers'

import type { AlertType } from '@/app/pages/common/AlertType'
import { ConfirmDeleteModal } from '@/app/pages/common/ConfirmDeleteModal'
import { Column, PagedTable } from '@/app/pages/common/PagedTable'

import type { Role } from '../../role/Model'
import type { User } from '../Model'
import { deleteUser, fetchUsers } from '../Query'

/**
 * ===============================================================
 * UserList（列表表格元件）
 * ---------------------------------------------------------------
 * 職責：
 * - 根據 searchKeyword / page 打 API 拿分頁資料
 * - 顯示 table
 * - 提供「詳情 / 編輯 / 刪除」操作
 *
 * 不做：
 * - 搜尋欄位輸入框（由 ListPage 管）
 * - 新增使用者（由 ListPage 跳頁）
 * - 編輯表單（交由 onEdit 打開 FormModal）
 * ===============================================================
 */

interface UserListProps {
  searchKeyword: string
  showAlert: (message: string, type: AlertType) => void
  roles: Role[] // 目前此檔未使用；之後若要顯示 role label 可再用
  onEdit: (user: User) => void
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

const formatDate = (ts?: string) => {
  if (!ts) return '-'
  try {
  const d = new Date(ts)
    if (Number.isNaN(d.getTime())) return ts
    return d.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch {
    return ts
  }
}

// ===============================================================
// Component
// ===============================================================
const UserList: React.FC<UserListProps> = ({
  searchKeyword,
  showAlert,
  roles, // eslint-disable-line @typescript-eslint/no-unused-vars
  onEdit,
}) => {
  // =============================================================
  // Router
  // =============================================================
  const navigate = useNavigate()

  // =============================================================
  // State - Data
  // =============================================================
  const [users, setUsers] = useState<User[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1) // UI 用 1-based，API 用 0-based
  const [loading, setLoading] = useState(false)

  // =============================================================
  // State - Delete Modal
  // =============================================================
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [deleting, setDeleting] = useState(false)

  // =============================================================
  // Data Loader
  // =============================================================
  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const query = {
        page: page - 1,
        size: PAGE_SIZE,
        keyword: searchKeyword?.trim() ? searchKeyword.trim() : undefined,
      }

      const data = await fetchUsers(query, showAlert)

      setUsers(data.content)
      setTotalElements(data.totalElements)
      setTotalPages(data.totalPages || 1)
    } finally {
      setLoading(false)
    }
  }, [page, searchKeyword, showAlert])

  // =============================================================
  // Effects
  // =============================================================

  // keyword 變動時：回到第 1 頁
  useEffect(() => {
    setPage(1)
  }, [searchKeyword])

  // page / keyword 變動時：重新載入
  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  // =============================================================
  // Handlers - Navigation
  // =============================================================
  const goDetail = useCallback(
    (user: User) => {
      navigate(`/upms/user/${user.id}/detail`)
    },
    [navigate],
  )

  // =============================================================
  // Handlers - Delete
  // =============================================================
  const openDelete = (user: User) => setDeleteTarget(user)

  const confirmDelete = async () => {
    if (!deleteTarget) return

    const id = deleteTarget.id
    if (!id) {
      showAlert('缺少使用者識別碼，無法刪除', 'danger')
      return
    }

    try {
      setDeleting(true)
      const ok = await deleteUser(String(id), showAlert)
      if (ok) {
        await loadUsers()
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
    { header: '使用者', className: 'min-w-200px' },
    { header: '角色', className: 'min-w-125px' },
    { header: '狀態', className: 'min-w-100px' },
    { header: '最後登入', className: 'min-w-125px' },
    { header: '加入日期', className: 'min-w-125px' },
    { header: '操作', className: 'text-end min-w-100px' },
  ]

  return (
    <>
      <PagedTable<User>
        columns={columns}
        rows={users}
        loading={loading}
        emptyText='沒有使用者資料'
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
        tableClassName='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
        renderRow={(user) => (
          <tr
            key={user.id}
            className='cursor-pointer table-row-hover text-gray-600 fw-bold'
            onClick={() => goDetail(user)}
          >
            <td>
              <div className='d-flex align-items-center'>
                {/* Avatar */}
                <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
                  <a
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      goDetail(user)
                    }}
                  >
                    {user.avatar ? (
                      <div className='symbol-label'>
                        <img
                          src={toAbsoluteUrl(`media/${user.avatar}`)}
                          alt={user.name}
                          className='w-100'
                        />
                      </div>
                    ) : (
                      <div
                        className={clsx(
                          'symbol-label fs-3',
                          `bg-light-${user.initials?.state || 'primary'}`,
                          `text-${user.initials?.state || 'primary'}`,
                        )}
                      >
                        {user.initials?.label || user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </a>
                </div>

                {/* User Info */}
                <div className='d-flex flex-column'>
                  <a
                    href='#'
                    className='text-gray-800 text-hover-primary mb-1'
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      goDetail(user)
                    }}
                  >
                    {user.name || user.username}
                  </a>
                  <span className='text-muted fs-7'>{user.email || user.username}</span>
                </div>
              </div>
            </td>

            {/* Role */}
            <td>
              {user.roleCodes && user.roleCodes.length > 0 ? (
                <div className='d-flex flex-wrap gap-1'>
                  {user.roleCodes.slice(0, 2).map((roleCode, idx) => (
                    <span key={idx} className='badge badge-light-info fs-7 fw-bold'>
                      {roleCode}
                    </span>
                  ))}
                  {user.roleCodes.length > 2 && (
                    <span className='badge badge-light fs-7 fw-bold'>
                      +{user.roleCodes.length - 2}
                    </span>
                  )}
                </div>
              ) : (
                <span className='text-muted fs-7'>未分配角色</span>
              )}
            </td>

            {/* Status */}
            <td>
              {user.enabled ? (
                <span className='badge badge-light-success fw-bolder'>啟用</span>
              ) : (
                <span className='badge badge-light-secondary fw-bolder'>停用</span>
              )}
            </td>

            {/* Last Login */}
            <td>
              {user.last_login ? (
                <div className='badge badge-light fw-bolder'>{formatDateTime(user.last_login)}</div>
              ) : (
                <span className='text-muted'>-</span>
              )}
            </td>

            {/* Joined Day */}
            <td>
              {user.joined_day ? (
                <span className='text-gray-800 fw-bold'>{formatDate(user.joined_day)}</span>
              ) : (
                <span className='text-muted'>-</span>
              )}
            </td>

            {/* Actions */}
            <td className='text-end' onClick={(e) => e.stopPropagation()}>
              <div className='d-flex justify-content-end gap-2'>
                <button
                  className='btn btn-light-primary btn-sm'
                  onClick={(e) => {
                    e.preventDefault()
                    goDetail(user)
                  }}
                  title='查看詳情'
                >
                  <KTIcon iconName='eye' className='fs-2' />
                </button>

                <button
                  className='btn btn-light-warning btn-sm'
                  onClick={(e) => {
                    e.preventDefault()
                    onEdit(user)
                  }}
                  title='編輯'
                >
                  <KTIcon iconName='message-edit' className='fs-2' />
                </button>

                <button
                  className='btn btn-light-danger btn-sm'
                  onClick={(e) => {
                    e.preventDefault()
                    openDelete(user)
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
          title='刪除使用者'
          deleting={deleting}
          message={
            <>
              <p>
                確定要刪除使用者 <strong>{deleteTarget.username}</strong> 嗎？
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

export default UserList
