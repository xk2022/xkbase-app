// src/app/pages/common/PagedTable.tsx
import React from 'react'

export type Column = {
  header: React.ReactNode
  className?: string
}

type Props<T> = {
  columns: Column[]
  rows: T[]
  loading?: boolean
  emptyText?: string

  page: number // 1-based
  totalPages: number
  totalElements?: number
  onPrev: () => void
  onNext: () => void

  /** renderRow 可以回 <tr> 或回 <td> 片段 */
  renderRow: (row: T, index: number) => React.ReactNode

  tableClassName?: string

  getRowKey?: (row: T, index: number) => React.Key
  onRowClick?: (row: T, index: number) => void
  rowClassName?: (row: T, index: number) => string
}

/** 型別守衛：判斷是否為 <tr> 的 ReactElement */
function isTrElement(node: React.ReactNode): node is React.ReactElement<React.HTMLAttributes<HTMLTableRowElement>> {
  return React.isValidElement(node) && node.type === 'tr'
}

export function PagedTable<T>({
  columns,
  rows,
  loading = false,
  emptyText = '沒有資料',
  page,
  totalPages,
  totalElements,
  onPrev,
  onNext,
  renderRow,
  tableClassName = 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer',
  getRowKey,
  onRowClick,
  rowClassName,
}: Props<T>) {
  const colSpan = Math.max(columns.length, 1)
  const safeTotalPages = totalPages || 1

  return (
    <>
      <div className='table-responsive'>
        <table className={tableClassName} id='kt_table_users'>
          <thead>
            <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
              {columns.map((c, i) => (
                <th key={i} className={c.className}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className='text-gray-600 fw-bold'>
            {loading ? (
              <tr>
                <td colSpan={colSpan} className='text-center py-10'>
                  載入中…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className='text-center text-muted py-10'>
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => {
                const key = getRowKey ? getRowKey(r, idx) : idx
                const clickable = typeof onRowClick === 'function'
                const extraCls = rowClassName ? rowClassName(r, idx) : ''
                const mergedClassName = [extraCls, clickable ? 'cursor-pointer table-row-hover' : '']
                  .filter(Boolean)
                  .join(' ')

                const rendered = renderRow(r, idx)

                // ✅ 若 renderRow 已經回 <tr>，我們 clone 並補上 key/className/onClick
                if (isTrElement(rendered)) {
                  const prevClassName = rendered.props.className ?? ''
                  const finalClassName = [prevClassName, mergedClassName].filter(Boolean).join(' ')

                  const handleClick: React.MouseEventHandler<HTMLTableRowElement> = (e) => {
                    // 保留原本 <tr> 的 onClick
                    rendered.props.onClick?.(e)
                    // 若使用者在原 onClick 裡 e.preventDefault()，就不觸發 onRowClick
                    if (!e.defaultPrevented && clickable) onRowClick?.(r, idx)
                  }

                  return React.cloneElement(rendered, {
                    key,
                    className: finalClassName,
                    onClick: handleClick,
                  })
                }

                // ✅ 否則，PagedTable 自己包 <tr>
                return (
                  <tr
                    key={key}
                    className={mergedClassName}
                    onClick={() => onRowClick?.(r, idx)}
                  >
                    {rendered}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='d-flex justify-content-between align-items-center mt-4'>
        <span className='text-muted'>
          第 {page} / {safeTotalPages} 頁
          {typeof totalElements === 'number' ? `，共 ${totalElements} 筆` : ''}
        </span>

        <div className='d-flex gap-2'>
          <button className='btn btn-sm btn-light' disabled={page <= 1 || loading} onClick={onPrev}>
            上一頁
          </button>
          <button className='btn btn-sm btn-light' disabled={page >= safeTotalPages || loading} onClick={onNext}>
            下一頁
          </button>
        </div>
      </div>
    </>
  )
}
