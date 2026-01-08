// src/app/pages/fms/driver/List.tsx
import React, { useCallback, useEffect, useState } from 'react'
import { KTIcon } from '@/_metronic/helpers'
import { AlertType } from '@/app/pages/common/AlertType'

import { deleteDriver, fetchDrivers } from './Query'
import { Driver } from './Model'
import { PageQuery } from '../../model/PageQuery'
import { ConfirmDeleteModal } from '@/app/pages/common/ConfirmDeleteModal'
import { useNavigate } from 'react-router-dom'

interface DriverListProps {
  searchKeyword: string
  showAlert: (message: string, type: AlertType) => void
  onEdit: (driver: Driver) => void
}

const pageSize = 10

const DriverList: React.FC<DriverListProps> = ({
  searchKeyword,
  showAlert,
  onEdit,
}) => {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Driver | null>(null)
  const [deleting, setDeleting] = useState(false)

  const navigate = useNavigate()

  const loadDrivers = useCallback(async () => {
    setLoading(true)

    const query: PageQuery = {
      page: page - 1,
      size: pageSize,
      keyword: searchKeyword || undefined,
    }

    const data = await fetchDrivers(query, showAlert)

    setDrivers(data.content)
    setTotalElements(data.totalElements)
    setTotalPages(data.totalPages || 1)

    setLoading(false)
  }, [page, searchKeyword, showAlert])

  useEffect(() => {
    setPage(1)
  }, [searchKeyword])

  useEffect(() => {
    loadDrivers()
  }, [loadDrivers])

  const handleDeleteClick = (d: Driver) => {
    setDeleteTarget(d)
  }

  const handleDriverDeleted = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      const ok = await deleteDriver(deleteTarget.uuid, showAlert)
      if (ok) {
        showAlert('刪除司機成功', 'success')
        await loadDrivers()
        setDeleteTarget(null)
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className='table-responsive'>
        <table className='table align-middle table-row-dashed fs-6 gy-5'>
          <thead>
            <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
              <th className='min-w-150px'>姓名</th>
              <th className='min-w-150px'>電話</th>
              <th className='min-w-125px'>駕照類型</th>
              <th className='min-w-125px'>狀態</th>
              <th className='min-w-80px'>上線</th>
              <th className='min-w-125px text-end'>功能</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className='text-center py-10'>
                  載入中…
                </td>
              </tr>
            ) : drivers.length > 0 ? (
              drivers.map((d) => (
                <tr
                  key={d.uuid}
                  className='cursor-pointer table-row-hover'
                  onClick={() => navigate(`/fms/driver/${d.uuid}/detail`)}
                >
                  {/* 姓名（暫以 phone 或 userId 代表，未來可改 name） */}
                  <td>{d.name ?? '-'}</td>
                  <td>{d.phone ?? '-'}</td>

                  {/* 駕照類型 */}
                  <td>{d.licenseType}</td>

                  {/* 狀態 */}
                  <td>
                    {d.status === 'ACTIVE' ? (
                      <span className='badge badge-light-success fw-bolder px-4 py-3'>
                        ACTIVE
                      </span>
                    ) : d.status === 'INACTIVE' ? (
                      <span className='badge badge-light-secondary fw-bolder px-4 py-3'>
                        INACTIVE
                      </span>
                    ) : d.status === 'LEAVE' ? (
                      <span className='badge badge-light-warning fw-bolder px-4 py-3'>
                        LEAVE
                      </span>
                    ) : (
                      <span className='badge badge-light-secondary fw-bolder px-4 py-3'>
                        {d.status}
                      </span>
                    )}
                  </td>

                  {/* 上線狀態 */}
                  <td>
                    {d.onDuty ? (
                      <span className='badge badge-light-success fw-bolder px-4 py-3'>
                        上線
                      </span>
                    ) : (
                      <span className='badge badge-light-secondary fw-bolder px-4 py-3'>
                        離線
                      </span>
                    )}
                  </td>

                  {/* 功能按鈕 */}
                  <td className='text-end'>
                    <button
                      className='btn btn-sm btn-warning'
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(d)
                      }}
                    >
                      <KTIcon iconName='message-edit' className='fs-2' />
                      編輯
                    </button>

                    <button
                      className='btn btn-sm btn-danger ms-2'
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClick(d)
                      }}
                    >
                      <KTIcon iconName='cross' className='fs-2' />
                      刪除
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className='text-center text-muted py-10'>
                  尚無司機資料
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 分頁 */}
      <div className='d-flex justify-content-between align-items-center mt-4'>
        <span className='text-muted'>
          第 {page} / {totalPages} 頁，共 {totalElements} 筆
        </span>

        <div className='d-flex gap-2'>
          <button
            className='btn btn-sm btn-light'
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            上一頁
          </button>

          <button
            className='btn btn-sm btn-light'
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            下一頁
          </button>
        </div>
      </div>

      {/* 刪除彈窗 */}
      {deleteTarget && (
        <ConfirmDeleteModal
          open={!!deleteTarget}
          title='刪除司機'
          deleting={deleting}
          message={
            <p>
              是否確定要刪除司機「
              <strong>{deleteTarget.name ?? deleteTarget.phone}</strong>
              」？
            </p>
          }
          onClose={() => (!deleting ? setDeleteTarget(null) : null)}
          onConfirm={handleDriverDeleted}
        />
      )}
    </>
  )
}

export default DriverList
