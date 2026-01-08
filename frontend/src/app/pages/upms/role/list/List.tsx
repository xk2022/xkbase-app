// src/app/pages/upms/role/list/List.tsx
import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {KTIcon} from '@/_metronic/helpers'

import type {AlertType} from '@/app/pages/common/AlertType'
import {ConfirmDeleteModal} from '@/app/pages/common/ConfirmDeleteModal'
import type {Column} from '@/app/pages/common/PagedTable'
import {PagedTable} from '@/app/pages/common/PagedTable'

import {usePagedList} from '@/app/pages/common/hooks/usePagedList'

import type {Role} from '../Model'
import {deleteRole, fetchRoles} from '../Query'

/**
 * ===============================================================
 * RoleList（列表表格元件）
 * ---------------------------------------------------------------
 * 職責：
 * - 根據 keyword / page 打 API 拿分頁資料（usePagedList）
 * - 顯示 table（PagedTable）
 * - 提供「編輯 / 刪除」操作
 *
 * 不做：
 * - 搜尋欄位輸入框（由 ListPage 管）
 * - 建立角色（由 ListPage 跳 /upms/role/create）
 * ===============================================================
 */
interface RoleListProps {
  searchKeyword: string
  showAlert: (message: string, type: AlertType) => void
  // 交由父層決定如何「編輯」（例如開 FormModal）
  onEdit: (role: Role) => void
  onReload?: () => void
}

const PAGE_SIZE = 10

const enabledBadge = (enabled?: boolean) => {
  if (enabled) {
    return (
      <span className='badge badge-light-success fw-bolder'>啟用</span>
    )
  }
  return (
    <span className='badge badge-light-secondary fw-bolder'>停用</span>
  )
}

const RoleList: React.FC<RoleListProps> = ({
  searchKeyword,
  showAlert,
  onEdit,
  onReload,
}) => {
  const navigate = useNavigate()

  // -------------------------------------------------------------
  // Paged Data Loader (Enterprise standard)
  // -------------------------------------------------------------
  const {
    rows: roles,
    loading,
    page,
    totalPages,
    totalElements,
    setPage,
    reload,
  } = usePagedList<Role>({
    keyword: searchKeyword,
    pageSize: PAGE_SIZE,
    fetcher: (q) => fetchRoles(q, showAlert),
  })

  // -------------------------------------------------------------
  // Delete modal
  // -------------------------------------------------------------
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null)
  const [deleting, setDeleting] = useState(false)

  const openDelete = (role: Role) => setDeleteTarget(role)

  const confirmDelete = async () => {
    if (!deleteTarget) return

    const id = deleteTarget.id
    if (!id) {
      showAlert('缺少角色識別碼，無法刪除', 'danger')
      return
    }

    try {
      setDeleting(true)
      const ok = await deleteRole(String(id), showAlert)
      if (ok) {
        await reload()
        onReload?.()
        setDeleteTarget(null)
      }
    } finally {
      setDeleting(false)
    }
  }

  // -------------------------------------------------------------
  // Table columns (header only, row is custom rendered)
  // -------------------------------------------------------------
  const columns: Column[] = [
    {header: '角色代碼', className: 'min-w-140px'},
    {header: '角色名稱', className: 'min-w-180px'},
    {header: '描述', className: 'min-w-220px'},
    {header: '狀態', className: 'min-w-100px'},
    {header: '權限數', className: 'min-w-100px'},
    {header: '操作', className: 'text-end min-w-100px'},
  ]

  const goDetail = (role: Role) => {
    navigate(`/upms/role/${role.id}/detail`)
  }

  return (
    <>
      <PagedTable<Role>
        columns={columns}
        rows={roles}
        loading={loading}
        emptyText='沒有角色資料'
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
        tableClassName='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
        getRowKey={(r) => r.id}
        renderRow={(role) => (
          <tr
            key={role.id}
            className='cursor-pointer table-row-hover text-gray-600 fw-bold'
            onClick={() => goDetail(role)}
          >
            <td className='fw-bold text-gray-900'>{role.code}</td>
            <td>{role.name}</td>
            <td className='text-muted'>{role.description ?? '-'}</td>
            <td>{enabledBadge(role.enabled)}</td>
            <td>
              <span className='badge badge-light-primary fs-6 fw-bold'>
                {role.permissionCount ?? 0}
              </span>
            </td>
            <td className='text-end' onClick={(e) => e.stopPropagation()}>
              <div className='d-flex justify-content-end gap-2'>
                <button
                  className='btn btn-light-primary btn-sm'
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    goDetail(role)
                  }}
                  title='查看詳情'
                >
                  <KTIcon iconName='eye' className='fs-2' />
                </button>

                <button
                  className='btn btn-light-warning btn-sm'
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onEdit(role)
                  }}
                  title='編輯'
                >
                  <KTIcon iconName='message-edit' className='fs-2' />
                </button>

                <button
                  className='btn btn-light-danger btn-sm'
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    openDelete(role)
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
          title='刪除角色'
          deleting={deleting}
          message={
            <>
              <p>
                確定要刪除角色 <strong>{deleteTarget.name} ({deleteTarget.code})</strong> 嗎？
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

export default RoleList
