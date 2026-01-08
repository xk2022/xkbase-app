// src/app/pages/sample/v1/list/List.tsx
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

import { KTIcon } from '@/_metronic/helpers'

import type { AlertType } from '@/app/pages/common/AlertType'
import { ConfirmDeleteModal } from '@/app/pages/common/ConfirmDeleteModal'
import { Column, PagedTable } from '@/app/pages/common/PagedTable'

import type { Sample } from '../Model'
import { deleteSample, fetchSamples } from '../Query'

/**
 * ===============================================================
 * SampleList（列表表格元件）
 * ---------------------------------------------------------------
 * 職責：
 * - 根據 searchKeyword / page 打 API 拿分頁資料
 * - 顯示 table
 * - 提供「詳情 / 編輯 / 刪除」操作
 * ===============================================================
 */

interface SampleListProps {
  searchKeyword: string
  showAlert: (message: string, type: AlertType) => void
  onEdit: (sample: Sample) => void
}

const PAGE_SIZE = 10

// ===============================================================
// Utilities
// ===============================================================
const formatDateTime = (ts?: string) => {
  if (!ts) return '-'
  const d = new Date(ts)

  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const HH = String(d.getHours()).padStart(2, '0')
  const MM = String(d.getMinutes()).padStart(2, '0')

  return `${yyyy}/${mm}/${dd} ${HH}:${MM}`
}

const formatStatus = (status?: string) => {
  switch (status) {
    case 'ACTIVE':
      return '啟用'
    case 'INACTIVE':
      return '停用'
    case 'PENDING':
      return '待處理'
    default:
      return status || '-'
  }
}

// ===============================================================
// Component
// ===============================================================
const SampleList: React.FC<SampleListProps> = ({
  searchKeyword,
  showAlert,
  onEdit,
}) => {
  // =============================================================
  // Router
  // =============================================================
  const navigate = useNavigate()

  // =============================================================
  // State - Data
  // =============================================================
  const [samples, setSamples] = useState<Sample[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1) // UI 用 1-based，API 用 0-based
  const [loading, setLoading] = useState(false)

  // =============================================================
  // State - Delete Modal
  // =============================================================
  const [deleteTarget, setDeleteTarget] = useState<Sample | null>(null)
  const [deleting, setDeleting] = useState(false)

  // =============================================================
  // Data Loader
  // =============================================================
  const loadSamples = useCallback(async () => {
    setLoading(true)
    try {
      const query = {
        page: page - 1,
        size: PAGE_SIZE,
        keyword: searchKeyword?.trim() ? searchKeyword.trim() : undefined,
      }

      const data = await fetchSamples(query, showAlert)

      setSamples(data.content)
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
    loadSamples()
  }, [loadSamples])

  // =============================================================
  // Handlers - Navigation
  // =============================================================
  const goDetail = useCallback(
    (sample: Sample) => {
      navigate(`/sample/v1/${sample.id}/detail`)
    },
    [navigate],
  )

  // =============================================================
  // Handlers - Delete
  // =============================================================
  const openDelete = (sample: Sample) => setDeleteTarget(sample)

  const confirmDelete = async () => {
    if (!deleteTarget) return

    const id = deleteTarget.id
    if (!id) {
      showAlert('缺少 Sample 識別碼，無法刪除', 'danger')
      return
    }

    try {
      setDeleting(true)
      const ok = await deleteSample(String(id), showAlert)
      if (ok) {
        await loadSamples()
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
    { header: '標題', className: 'min-w-200px' },
    { header: '描述', className: 'min-w-250px' },
    { header: '狀態', className: 'min-w-100px' },
    { header: '分類', className: 'min-w-150px' },
    { header: '創建時間', className: 'min-w-150px' },
    { header: '功能', className: 'text-end min-w-100px' },
  ]

  return (
    <>
      <PagedTable<Sample>
        columns={columns}
        rows={samples}
        loading={loading}
        emptyText='沒有 Sample 資料'
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
        renderRow={(sample) => (
          <tr
            key={sample.id}
            className='cursor-pointer table-row-hover'
            onClick={() => goDetail(sample)}
          >
            <td>
              <div className='d-flex flex-column'>
                <a
                  href='#'
                  className='text-gray-800 text-hover-primary mb-1 fw-bold'
                  onClick={(e) => {
                    e.stopPropagation()
                    goDetail(sample)
                  }}
                >
                  {sample.title}
                </a>
                {sample.tags && sample.tags.length > 0 && (
                  <div className='d-flex gap-1 mt-1'>
                    {sample.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className={clsx('badge badge-light-primary badge-circle')}
                      >
                        {tag}
                      </span>
                    ))}
                    {sample.tags.length > 3 && (
                      <span className='text-muted fs-7'>+{sample.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </td>

            <td>
              <span className='text-gray-600 fw-semibold'>
                {sample.description || '-'}
              </span>
            </td>

            <td>
              {sample.enabled ? (
                <span className='badge badge-light-success fw-bolder px-4 py-3'>
                  {formatStatus(sample.status)}
                </span>
              ) : (
                <span className='badge badge-light-secondary fw-bolder px-4 py-3'>
                  {formatStatus(sample.status)}
                </span>
              )}
            </td>

            <td>
              <span className='text-gray-800 fw-bold'>
                {sample.category || '-'}
              </span>
            </td>

            <td>
              <span className='text-muted fw-semibold'>
                {formatDateTime(sample.created_at)}
              </span>
            </td>

            <td className='text-end'>
              <div className='d-flex justify-content-end gap-2'>
                <button
                  className='btn btn-icon btn-light-primary btn-sm'
                  onClick={(e) => {
                    e.stopPropagation()
                    goDetail(sample)
                  }}
                  title='查看詳情'
                >
                  <KTIcon iconName='eye' className='fs-2' />
                </button>

                <button
                  className='btn btn-icon btn-light-warning btn-sm'
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(sample)
                  }}
                  title='編輯'
                >
                  <KTIcon iconName='message-edit' className='fs-2' />
                </button>

                <button
                  className='btn btn-icon btn-light-danger btn-sm'
                  onClick={(e) => {
                    e.stopPropagation()
                    openDelete(sample)
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
          title='刪除 Sample'
          deleting={deleting}
          message={
            <>
              <p>
                確定要刪除 Sample <strong>{deleteTarget.title}</strong> 嗎？
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

export default SampleList
