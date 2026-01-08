// src/app/pages/tom/container/list/List.tsx
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { KTIcon } from '@/_metronic/helpers'

import type { AlertType } from '@/app/pages/common/AlertType'
import { ConfirmDeleteModal } from '@/app/pages/common/ConfirmDeleteModal'

import { Column, PagedTable } from '@/app/pages/common/PagedTable'
import type { Container } from '../Model'
import { fetchContainers, deleteContainer } from '../Query'

/**
 * ===============================================================
 * ContainerList（貨櫃列表表格元件）
 * ---------------------------------------------------------------
 * 職責：
 * - 根據 query / page 打 API 拿分頁資料
 * - 顯示 table
 * - 提供「詳情 / 指派(可選) / 編輯(可選) / 刪除」操作
 * ===============================================================
 */

interface ContainerListProps {
  searchKeyword: string
  showAlert: (message: string, type: AlertType) => void
  onEdit?: (container: Container) => void
  onAssign?: (container: Container) => void
}

const PAGE_SIZE = 10

// ===============================================================
// Utilities
// ===============================================================
const statusLabel = (s?: string) => {
  if (!s) return '-'
  switch (s) {
    case 'UNASSIGNED':
      return '未指派'
    case 'ASSIGNED':
      return '已指派'
    case 'IN_PROGRESS':
      return '進行中'
    case 'DONE':
      return '已完成'
    case 'CANCELLED':
      return '已取消'
    default:
      return s
  }
}

// ===============================================================
// Component
// ===============================================================
const ContainerList: React.FC<ContainerListProps> = ({
  searchKeyword,
  showAlert,
  onEdit,
  onAssign,
}) => {
  const navigate = useNavigate()

  const [containers, setContainers] = useState<Container[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1) // UI 1-based
  const [loading, setLoading] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Container | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadContainers = useCallback(async () => {
    setLoading(true)
    try {
      const query = {
        page: page - 1, // API 0-based
        size: PAGE_SIZE,
        keyword: searchKeyword?.trim() ? searchKeyword.trim() : undefined,
      }

      const data = await fetchContainers(query)

      setContainers(data.content)
      setTotalElements(data.totalElements)
      setTotalPages(data.totalPages || 1)
    } finally {
      setLoading(false)
    }
  }, [page, searchKeyword, showAlert])

  // keyword 變動：回到第 1 頁
  useEffect(() => {
    setPage(1)
  }, [searchKeyword])

  // page/keyword 變動：重新載入
  useEffect(() => {
    loadContainers()
  }, [loadContainers])

  // =============================================================
  // Handlers
  // =============================================================
  const goDetail = useCallback(
    (c: Container) => {
      navigate(`/tom/container/${c.id}/detail`)
    },
    [navigate],
  )

  const openDelete = (c: Container) => setDeleteTarget(c)

  const confirmDelete = async () => {
    if (!deleteTarget) return

    const id = deleteTarget.id
    if (!id) {
      showAlert('缺少貨櫃識別碼，無法刪除', 'danger')
      return
    }

    try {
      setDeleting(true)
      const ok = await deleteContainer(String(id), showAlert)
      if (ok) {
        await loadContainers()
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
    { header: '櫃號', className: 'min-w-180px' },
    { header: '類型', className: 'min-w-100px' },
    { header: '狀態', className: 'min-w-110px' },
    { header: '重量', className: 'min-w-120px' },
    { header: '特殊需求', className: 'min-w-250px' },
    { header: '操作', className: 'min-w-260px' },
  ]

  return (
    <>
      <PagedTable<Container>
        columns={columns}
        rows={containers}
        loading={loading}
        emptyText='沒有貨櫃資料'
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
        renderRow={(c) => (
          <tr
            key={c.id}
            className='cursor-pointer table-row-hover'
            onClick={() => goDetail(c)}
          >
            <td className='fw-bold text-gray-900'>{c.containerNo || '-'}</td>
            <td>{c.type || '-'}</td>
            <td>{statusLabel(c.status)}</td>
            <td>{c.weight || '-'}</td>
            <td>{c.remark || '-'}</td>

            <td>
              <button
                className='btn btn-sm btn-success ms-2'
                onClick={(e) => {
                  e.stopPropagation()
                  goDetail(c)
                }}
              >
                <KTIcon iconName='eye' className='fs-2' />
                詳情
              </button>

              {onAssign && (
                <button
                  className='btn btn-sm btn-light-primary ms-2'
                  onClick={(e) => {
                    e.stopPropagation()
                    onAssign(c)
                  }}
                >
                  <KTIcon iconName='truck' className='fs-2' />
                  指派
                </button>
              )}

              {onEdit && (
                <button
                  className='btn btn-sm btn-warning ms-2'
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(c)
                  }}
                >
                  <KTIcon iconName='message-edit' className='fs-2' />
                  編輯
                </button>
              )}

              <button
                className='btn btn-sm btn-danger ms-2'
                onClick={(e) => {
                  e.stopPropagation()
                  openDelete(c)
                }}
              >
                <KTIcon iconName='cross' className='fs-2' />
                刪除
              </button>
            </td>
          </tr>
        )}
      />

      {deleteTarget && (
        <ConfirmDeleteModal
          open={!!deleteTarget}
          title='刪除貨櫃'
          deleting={deleting}
          message={
            <>
              <p>
                確定要刪除貨櫃{' '}
                <strong>{deleteTarget.containerNo || deleteTarget.id}</strong> 嗎？
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

export default ContainerList
