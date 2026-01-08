// src/app/pages/hrm/salary/list/List.tsx
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { KTIcon } from '@/_metronic/helpers'

import type { AlertType } from '@/app/pages/common/AlertType'
import { ConfirmDeleteModal } from '@/app/pages/common/ConfirmDeleteModal'
import { Error500WithLayout } from '@/app/pages/common/Error500WithLayout'
import { MockDataDialog } from '@/app/pages/common/MockDataDialog'
import { ApiError } from '@/app/pages/common/ApiError'
import { enableTempMockData } from '@/shared/utils/useMockData'

import { Column, PagedTable } from '@/app/pages/common/PagedTable'
import type { SalaryFormulaListItem } from '../Model'
import { deleteSalaryFormula, fetchSalaryFormulas } from '../Query'

interface SalaryListProps {
  searchKeyword: string
  showAlert: (message: string, type: AlertType) => void
  onEdit?: (formula: SalaryFormulaListItem) => void
}

const PAGE_SIZE = 10

const formatDate = (ts?: string) => {
  if (!ts) return '-'
  return new Date(ts).toLocaleDateString('zh-TW')
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(amount)
}

const statusBadge = (s?: string) => {
  if (!s) return { label: '-', className: 'badge-light-secondary' }
  switch (s) {
    case 'active':
      return { label: '啟用', className: 'badge-light-success' }
    case 'inactive':
      return { label: '停用', className: 'badge-light-danger' }
    default:
      return { label: s, className: 'badge-light-secondary' }
  }
}

const SalaryList: React.FC<SalaryListProps> = ({
  searchKeyword,
  showAlert,
  onEdit,
}) => {
  const navigate = useNavigate()

  const [formulas, setFormulas] = useState<SalaryFormulaListItem[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<SalaryFormulaListItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [showError500, setShowError500] = useState(false)
  const [showMockDialog, setShowMockDialog] = useState(false)

  const loadFormulas = useCallback(async () => {
    setLoading(true)
    setShowError500(false)
    try {
      const query = {
        page: page - 1,
        size: PAGE_SIZE,
        keyword: searchKeyword?.trim() ? searchKeyword.trim() : undefined,
      }

      const data = await fetchSalaryFormulas(query, showAlert)

      setFormulas(data.content)
      setTotalElements(data.totalElements)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      const apiError = ApiError.fromAxiosError(error)
      if (apiError.isServerError) {
        setShowError500(true)
        setShowMockDialog(true)
      } else {
        showAlert('取得薪資計算公式列表失敗，請稍後再試', 'danger')
      }
    } finally {
      setLoading(false)
    }
  }, [page, searchKeyword, showAlert])

  const handleUseMockData = useCallback(() => {
    enableTempMockData()
    setShowMockDialog(false)
    setShowError500(false)
    loadFormulas()
  }, [loadFormulas])

  const handleRetry = useCallback(() => {
    setShowError500(false)
    loadFormulas()
  }, [loadFormulas])

  useEffect(() => {
    setPage(1)
  }, [searchKeyword])

  useEffect(() => {
    loadFormulas()
  }, [loadFormulas])

  const goDetail = useCallback(
    (f: SalaryFormulaListItem) => {
      navigate(`/hrm/salary/${f.id}/detail`)
    },
    [navigate],
  )

  const openDelete = (f: SalaryFormulaListItem) => setDeleteTarget(f)

  const confirmDelete = async () => {
    if (!deleteTarget) return

    const id = deleteTarget.id
    if (!id) {
      showAlert('缺少薪資計算公式識別碼，無法刪除', 'danger')
      return
    }

    try {
      setDeleting(true)
      const ok = await deleteSalaryFormula(String(id), showAlert)
      if (ok) {
        await loadFormulas()
        setDeleteTarget(null)
      }
    } finally {
      setDeleting(false)
    }
  }

  if (showError500) {
    return (
      <>
        <Error500WithLayout
          onRetry={handleRetry}
          showMockOption={true}
          onUseMock={handleUseMockData}
        />
        <MockDataDialog
          open={showMockDialog}
          onConfirm={handleUseMockData}
          onCancel={() => setShowMockDialog(false)}
        />
      </>
    )
  }

  const columns: Column[] = [
    { header: '公式名稱', className: 'min-w-150px' },
    { header: '司機姓名', className: 'min-w-100px' },
    { header: '趟次費', className: 'min-w-120px text-end' },
    { header: '加班費率', className: 'min-w-120px text-end' },
    { header: '夜間補貼', className: 'min-w-120px text-end' },
    { header: '生效日期', className: 'min-w-120px' },
    { header: '狀態', className: 'min-w-100px' },
    { header: '操作', className: 'text-end min-w-200px' },
  ]

  return (
    <>
      <PagedTable<SalaryFormulaListItem>
        columns={columns}
        rows={formulas}
        loading={loading}
        emptyText='沒有薪資計算公式資料'
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
        renderRow={(f) => {
          const status = statusBadge(f.status)

          return (
            <tr
              key={String(f.id ?? Math.random())}
              className='cursor-pointer table-row-hover'
              onClick={() => goDetail(f)}
            >
              <td className='fw-bold text-gray-900'>{f.formulaName}</td>
              <td>{f.driverName || '-'}</td>
              <td className='text-end'>{formatCurrency(f.tripFee)}</td>
              <td className='text-end'>{formatCurrency(f.overtimeRate)}/時</td>
              <td className='text-end'>{formatCurrency(f.nightShiftSubsidy)}/時</td>
              <td>{formatDate(f.effectiveDate)}</td>
              <td>
                <span className={`badge ${status.className} fw-bold`}>
                  {status.label}
                </span>
              </td>

              <td className='text-end' onClick={(e) => e.stopPropagation()}>
                <div className='d-flex justify-content-end gap-2'>
                  <button
                    className='btn btn-light-primary btn-sm'
                    onClick={(e) => {
                      e.preventDefault()
                      goDetail(f)
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
                        onEdit(f)
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
                      openDelete(f)
                    }}
                    title='刪除'
                  >
                    <KTIcon iconName='trash' className='fs-2' />
                  </button>
                </div>
              </td>
            </tr>
          )
        }}
      />

      {deleteTarget && (
        <ConfirmDeleteModal
          open={!!deleteTarget}
          title='刪除薪資計算公式'
          deleting={deleting}
          message={
            <>
              <p>
                確定要刪除薪資計算公式 <strong>{deleteTarget.formulaName ?? '-'}</strong> 嗎？
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

export default SalaryList
