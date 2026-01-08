// src/app/pages/fms/vehicle/detail/DetailPage.tsx
import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'

import { VehicleDetail } from './Model'
import { fetchVehicleDetail } from './Query'

// 這四個 Card 之後可以各自實作（先當作已存在的 component）
import { VehicleBasicInfoCard } from './VehicleBasicInfoCard'
import { VehicleStatusCard } from './VehicleStatusCard'
import { VehicleDriverCard } from './VehicleDriverCard'
import { VehicleMaintenanceCard } from './VehicleMaintenanceCard'

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<VehicleDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadDetail = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      setError(null)

      const data = await fetchVehicleDetail(id)
      if (!data) {
        setError('找不到車輛資料')
      }
      setDetail(data)
    } catch (e) {
      console.error(e)
      setError('取得車輛詳情失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void loadDetail()
  }, [loadDetail])

  if (!id) {
    return <div className='alert alert-danger'>缺少車輛 ID</div>
  }

  if (loading) {
    return (
      <div className='d-flex justify-content-center py-10'>
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>載入中…</span>
        </Spinner>
      </div>
    )
  }

  if (error || !detail) {
    return (
      <div className='alert alert-danger'>
        {error ?? '車輛資料不存在'}
      </div>
    )
  }

  return (
    <div className='row'>
      {/* 基本資訊 + 狀態 */}
      <div className='col-12 col-xl-4 mb-5'>
        <VehicleBasicInfoCard detail={detail} reload={loadDetail} />
      </div>

      <div className='col-12 col-xl-4 mb-5'>
        <VehicleStatusCard detail={detail} reload={loadDetail} />
      </div>

      {/* 當前司機 / 綁定關係 */}
      <div className='col-12 col-xl-4 mb-5'>
        <VehicleDriverCard detail={detail} reload={loadDetail} />
      </div>

      {/* 維修 / 保養 / 里程紀錄（之後可以慢慢補） */}
      <div className='col-12 mb-5'>
        <VehicleMaintenanceCard detail={detail} />
      </div>
    </div>
  )
}

export default DetailPage
