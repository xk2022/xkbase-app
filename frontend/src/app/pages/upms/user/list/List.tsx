// src/app/pages/upms/user/List.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  flexRender,
} from '@tanstack/react-table'

import { KTIcon, toAbsoluteUrl } from '@/_metronic/helpers'

import type { AlertType } from '@/app/pages/common/AlertType'
import { ConfirmDeleteModal } from '@/app/pages/common/ConfirmDeleteModal'

import type { Role } from '../../role/Model'
import type { User } from '../Model'
import { deleteUser, fetchUsers, getLockedUserIds } from '../Query'
import { useQueryRequest } from '@/app/modules/apps/user-management/users-list/core/QueryRequestProvider'

/**
 * ===============================================================
 * UserList（列表表格元件）
 * ---------------------------------------------------------------
 * 職責：
 * - 根據 searchKeyword / page 打 API 拿分頁資料
 * - 顯示 table（使用 @tanstack/react-table）
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
  // Filter State (from QueryRequestProvider)
  // =============================================================
  const { state: queryState } = useQueryRequest()
  const filterStatus = (queryState.filter as { status?: string } | undefined)?.status

  // =============================================================
  // State - Table (使用 0-based pageIndex)
  // =============================================================
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })
  const [sorting, setSorting] = useState<SortingState>([])

  // =============================================================
  // State - Data
  // =============================================================
  const [users, setUsers] = useState<User[]>([])
  const [totalElements, setTotalElements] = useState(0)
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
      // 處理狀態篩選
      let enabled: boolean | undefined
      let locked: boolean | undefined

      if (filterStatus === 'enabled') {
        enabled = true
      } else if (filterStatus === 'disabled') {
        enabled = false
      } else if (filterStatus === 'locked') {
        locked = true
      }

      const query = {
        page: pagination.pageIndex, // 0-based
        size: pagination.pageSize,
        keyword: searchKeyword?.trim() ? searchKeyword.trim() : undefined,
        enabled,
        locked,
      }

      const data = await fetchUsers(query, showAlert)

      // 如果篩選「鎖定」，需要進一步過濾（因為 locked 可能不在 User 模型中）
      let filteredContent = data.content
      if (filterStatus === 'locked') {
        const lockedUserIds = getLockedUserIds()
        filteredContent = filteredContent.filter((u) => lockedUserIds.has(u.id))
      }

      setUsers(filteredContent)
      setTotalElements(data.totalElements || 0)
    } finally {
      setLoading(false)
    }
  }, [pagination.pageIndex, pagination.pageSize, searchKeyword, filterStatus, showAlert])

  // =============================================================
  // Effects
  // =============================================================

  // keyword 或 filter 變動時：回到第 0 頁（0-based）
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [searchKeyword, filterStatus])

  // pagination / keyword 變動時：重新載入
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
  // Table Columns Definition
  // =============================================================
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: '使用者',
        cell: ({ row }) => {
          const user = row.original
  return (
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
                        {user.initials?.label || user.email?.charAt(0)?.toUpperCase() || 'U'}
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
          )
        },
        size: 250,
        minSize: 200,
        maxSize: 350,
      },
      {
        accessorKey: 'roleCodes',
        id: 'roleCodes',
        header: '角色',
        cell: ({ row }) => {
          const user = row.original
          return user.roleCodes && user.roleCodes.length > 0 ? (
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
          )
        },
        size: 150,
        minSize: 120,
        maxSize: 200,
      },
      {
        accessorKey: 'enabled',
        id: 'enabled',
        header: '狀態',
        cell: ({ row }) => {
          const user = row.original
          return user.enabled ? (
                <span className='badge badge-light-success fw-bolder'>啟用</span>
              ) : (
                <span className='badge badge-light-secondary fw-bolder'>停用</span>
          )
        },
        size: 120,
        minSize: 100,
        maxSize: 150,
      },
      {
        accessorKey: 'last_login',
        id: 'last_login',
        header: '最後登入',
        cell: ({ row }) => {
          const user = row.original
          return user.last_login ? (
                <div className='badge badge-light fw-bolder'>{formatDateTime(user.last_login)}</div>
              ) : (
                <span className='text-muted'>-</span>
          )
        },
        size: 180,
        minSize: 150,
        maxSize: 220,
      },
      {
        accessorKey: 'joined_day',
        id: 'joined_day',
        header: '加入日期',
        cell: ({ row }) => {
          const user = row.original
          return user.joined_day ? (
                <span className='text-gray-800 fw-bold'>{formatDate(user.joined_day)}</span>
              ) : (
                <span className='text-muted'>-</span>
          )
        },
        size: 150,
        minSize: 130,
        maxSize: 180,
      },
      {
        id: 'actions',
        header: '操作',
        cell: ({ row }) => {
          const user = row.original
          return (
            <div className='d-flex justify-content-end align-items-center' onClick={(e) => e.stopPropagation()}>
              {/* 查看按鈕 - 灰色 */}
              <OverlayTrigger placement='top' overlay={<Tooltip>查看詳情</Tooltip>}>
                <button
                  className='btn btn-light-secondary btn-sm'
                  onClick={(e) => {
                    e.preventDefault()
                    goDetail(user)
                  }}
                >
                  <KTIcon iconName='eye' className='fs-2 me-1' />
                  查看
                </button>
              </OverlayTrigger>

              {/* 編輯按鈕 - 藍色 */}
              <OverlayTrigger placement='top' overlay={<Tooltip>編輯使用者</Tooltip>}>
                <button
                  className='btn btn-light-primary btn-sm ms-2'
                  onClick={(e) => {
                    e.preventDefault()
                    onEdit(user)
                  }}
                >
                  <KTIcon iconName='message-edit' className='fs-2 me-1' />
                  編輯
                </button>
              </OverlayTrigger>

              {/* 刪除按鈕 - 紅色，間距拉開 */}
              <OverlayTrigger
                placement='top'
                overlay={<Tooltip>刪除使用者（不可復原）</Tooltip>}
              >
                <button
                  className='btn btn-light-danger btn-sm ms-4'
                  onClick={(e) => {
                    e.preventDefault()
                    openDelete(user)
                  }}
                >
                  <KTIcon iconName='trash' className='fs-2 me-1' />
                  刪除
                </button>
              </OverlayTrigger>
              </div>
          )
        },
        size: 280,
        minSize: 250,
        maxSize: 320,
        enableSorting: false,
      },
    ],
    [goDetail, onEdit],
  )

  // =============================================================
  // React Table Setup
  // =============================================================
  const pageCount = Math.ceil(totalElements / pagination.pageSize)

  const table = useReactTable({
    data: users,
    columns,
    pageCount,
    getRowId: (row) => row.id,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
  })

  // =============================================================
  // Render
  // =============================================================
  return (
    <>
      <div className='table-responsive'>
        <table
          id='kt_table_users'
          className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
          style={{ width: '100%' }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'
              >
                {headerGroup.headers.map((header) => {
                  const columnSize = header.getSize()
                  return (
                    <th
                      key={header.id}
                      style={{
                        width: columnSize ? `${columnSize}px` : undefined,
                        minWidth: header.column.columnDef.minSize
                          ? `${header.column.columnDef.minSize}px`
                          : undefined,
                        maxWidth: header.column.columnDef.maxSize
                          ? `${header.column.columnDef.maxSize}px`
                          : undefined,
                      }}
                      className='pe-3'
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className='text-gray-600 fw-bold'>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className='text-center py-10'>
                  <span className='spinner-border spinner-border-sm align-middle me-2' />
                  載入中…
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='text-center text-muted py-10'>
                  沒有使用者資料
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className='cursor-pointer table-row-hover text-gray-600 fw-bold'
                  onClick={() => goDetail(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={clsx('pe-3', {
                        'text-end': cell.column.id === 'actions',
                      })}
                      style={{
                        paddingTop: '1rem',
                        paddingBottom: '1rem',
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='row mt-4'>
        <div className='col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'>
          <span className='text-muted'>
            共 {totalElements} 筆
          </span>
        </div>
        <div className='col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'>
          <div className='dt-paging paging_simple_numbers'>
            <nav aria-label='分頁'>
              <ul className='pagination'>
                {/* Previous Button */}
                <li
                  className={clsx('dt-paging-button page-item', {
                    disabled: !table.getCanPreviousPage() || loading,
                  })}
                >
                  <button
                    className='page-link previous'
                    type='button'
                    role='link'
                    aria-controls='kt_table_users'
                    aria-disabled={!table.getCanPreviousPage() || loading}
                    aria-label='Previous'
                    disabled={!table.getCanPreviousPage() || loading}
                    onClick={() => table.previousPage()}
                  >
                    <i className='previous'></i>
                  </button>
                </li>

                {/* Page Numbers */}
                {(() => {
                  const currentPage = pagination.pageIndex + 1 // 1-based for display
                  const totalPages = pageCount || 1
                  const pagesToShow: number[] = []

                  // 計算要顯示的頁碼（最多顯示5個）
                  if (totalPages <= 5) {
                    // 如果總頁數 <= 5，顯示所有頁碼
                    for (let i = 1; i <= totalPages; i++) {
                      pagesToShow.push(i)
                    }
                  } else {
                    // 如果總頁數 > 5，顯示當前頁前後各2頁
                    const start = Math.max(1, currentPage - 2)
                    const end = Math.min(totalPages, currentPage + 2)

                    if (start > 1) {
                      pagesToShow.push(1)
                      if (start > 2) {
                        pagesToShow.push(-1) // -1 表示省略號
                      }
                    }

                    for (let i = start; i <= end; i++) {
                      pagesToShow.push(i)
                    }

                    if (end < totalPages) {
                      if (end < totalPages - 1) {
                        pagesToShow.push(-1) // -1 表示省略號
                      }
                      pagesToShow.push(totalPages)
                    }
                  }

                  return pagesToShow.map((pageNum, idx) => {
                    if (pageNum === -1) {
                      // 省略號
                      return (
                        <li key={`ellipsis-${idx}`} className='page-item disabled'>
                          <span className='page-link'>...</span>
                        </li>
                      )
                    }

                    const isActive = pageNum === currentPage
                    return (
                      <li
                        key={pageNum}
                        className={clsx('dt-paging-button page-item', {
                          active: isActive,
                        })}
                      >
                        <button
                          className='page-link'
                          type='button'
                          role='link'
                          aria-controls='kt_table_users'
                          aria-current={isActive ? 'page' : undefined}
                          disabled={loading}
                          onClick={() => {
                            table.setPageIndex(pageNum - 1) // 轉換為 0-based
                          }}
                        >
                          {pageNum}
                        </button>
                      </li>
                    )
                  })
                })()}

                {/* Next Button */}
                <li
                  className={clsx('dt-paging-button page-item', {
                    disabled: !table.getCanNextPage() || loading,
                  })}
                >
                  <button
                    className='page-link next'
                    type='button'
                    role='link'
                    aria-controls='kt_table_users'
                    aria-disabled={!table.getCanNextPage() || loading}
                    aria-label='Next'
                    disabled={!table.getCanNextPage() || loading}
                    onClick={() => table.nextPage()}
                  >
                    <i className='next'></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

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
