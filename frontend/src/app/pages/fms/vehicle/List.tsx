// src/app/pages/fms/vehicle/List.tsx
import React, { useCallback, useEffect, useState } from 'react'
import { KTIcon } from '@/_metronic/helpers'
import { AlertType } from '@/app/pages/common/AlertType'

import { deleteVehicle, fetchVehicles } from './Query'
import { Vehicle } from './Model'
import { PageQuery } from '../../model/PageQuery'
import { ConfirmDeleteModal } from '@/app/pages/common/ConfirmDeleteModal'
import { useNavigate } from 'react-router-dom'

interface VehicleListProps {
  searchKeyword: string
  showAlert: (message: string, type: AlertType) => void
  // 新增：交由父層決定如何「編輯」（打開 FormModal）
  onEdit: (vehicle: Vehicle) => void
}

const pageSize = 10

const VehicleList: React.FC<VehicleListProps> = ({
  searchKeyword,
  showAlert,
  onEdit,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null)
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  const loadVehicles = useCallback(async () => {
    setLoading(true)

    const query: PageQuery = {
      page: page - 1,
      size: pageSize,
      keyword: searchKeyword || undefined,
    }

    const data = await fetchVehicles(query, showAlert)

    setVehicles(data.content)
    setTotalElements(data.totalElements)
    setTotalPages(data.totalPages || 1)

    setLoading(false)
  }, [page, searchKeyword, showAlert])

  useEffect(() => {
    setPage(1)
  }, [searchKeyword])

  useEffect(() => {
    loadVehicles()
  }, [loadVehicles])

  const handleDeleteClick = (v: Vehicle) => {
    setDeleteTarget(v)
  }

  const handleDeleted = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      const ok = await deleteVehicle(deleteTarget.uuid, showAlert)
      if (ok) {
        showAlert('刪除車輛成功', 'success')
        await loadVehicles()
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
              <th className='min-w-150px'>車牌</th>
              <th className='min-w-125px'>車種</th>
              <th className='min-w-125px'>狀態</th>
              <th className='min-w-80px'>可派遣</th>
              <th className='min-w-125px'>里程數</th>
              <th className='min-w-80px'>司機</th>
              <th className='min-w-125px text-end'>功能</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className='text-center py-10'>
                  載入中…
                </td>
              </tr>
            ) : vehicles.length > 0 ? (
              vehicles.map((v) => (
                <tr
                  key={v.uuid}
                  className='cursor-pointer table-row-hover'
                  onClick={() => navigate(`/fms/vehicle/${v.uuid}/detail`)}
                >
                  <td>{v.plateNo}</td>
                  <td>{v.type}</td>

                  {/* 狀態 Badge */}
                  <td>
                    {v.status === 'AVAILABLE' || v.status === 'IDLE' ? (
                      <span className='badge badge-light-success fw-bolder px-4 py-3'>
                        {v.status}
                      </span>
                    ) : v.status === 'IN_USE' ? (
                      <span className='badge badge-light-warning fw-bolder px-4 py-3'>
                        執行中
                      </span>
                    ) : v.status === 'MAINTENANCE' ? (
                      <span className='badge badge-light-danger fw-bolder px-4 py-3'>
                        維修中
                      </span>
                    ) : (
                      <span className='badge badge-light-secondary fw-bolder px-4 py-3'>
                        {v.status}
                      </span>
                    )}
                  </td>

                  {/* 可派遣 */}
                  <td>
                    {v.enabled ? (
                      <span className='badge badge-light-success fw-bolder px-4 py-3'>
                        可派遣
                      </span>
                    ) : (
                      <span className='badge badge-light-secondary fw-bolder px-4 py-3'>
                        停用
                      </span>
                    )}
                  </td>

                  <td>{v.currentOdometer ?? '-'}</td>

                  {/* 司機若有綁定就顯示 icon */}
                  <td>
                    {v.currentDriverId ? (
                      <KTIcon iconName='user' className='fs-2 text-primary' />
                    ) : (
                      <span className='text-muted'>無</span>
                    )}
                  </td>

                  <td className='text-end'>
                    <button
                      className='btn btn-sm btn-warning'
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(v)
                      }}
                    >
                      <KTIcon iconName='message-edit' className='fs-2' />
                      編輯
                    </button>

                    <button
                      className='btn btn-sm btn-danger ms-2'
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClick(v)
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
                <td colSpan={7} className='text-center text-muted py-10'>
                  尚無車輛資料
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

      {/* 刪除 Modal */}
      {deleteTarget && (
        <ConfirmDeleteModal
          open={!!deleteTarget}
          title='刪除車輛'
          deleting={deleting}
          message={
            <p>
              是否確定要刪除車輛「<strong>{deleteTarget.plateNo}</strong>」？
            </p>
          }
          onClose={() => (!deleting ? setDeleteTarget(null) : null)}
          onConfirm={handleDeleted}
        />
      )}
    </>
  )
}

export default VehicleList
