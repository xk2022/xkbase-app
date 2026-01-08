// src/app/pages/fms/driver/detail/DetailPage.tsx
import React, {useCallback, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {Spinner} from 'react-bootstrap'

import {DriverDetail} from './Model'
import {fetchDriverDetail} from './Query'
import { DriverBasicInfoCard } from './DriverBasicInfoCard'
import { DriverStatusCard } from './DriverStatusCard'
import { DriverVehicleCard } from './DriverVehicleCard'
import { DriverStatsCard } from './DriverStatsCard'

// 這幾個 Card 之後你可以各自實作

export const DetailPage: React.FC = () => {
  const {id} = useParams<{id: string}>()

  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<DriverDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadDetail = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      const data = await fetchDriverDetail(id)
      if (!data) {
        setError('找不到司機資料')
      }
      setDetail(data)
    } catch (e) {
      console.error(e)
      setError('取得司機詳情失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void loadDetail()
  }, [loadDetail])

  if (!id) {
    return <div className='alert alert-danger'>缺少司機 ID</div>
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
    return <div className='alert alert-danger'>{error ?? '司機資料不存在'}</div>
  }

  return (
    <div className='row'>
      {/* 基本資訊 */}
      <div className='col-12 col-xl-4 mb-5'>
        <DriverBasicInfoCard detail={detail} reload={loadDetail} />
      </div>

      {/* 狀態 / 駕照 / OnDuty */}
      <div className='col-12 col-xl-4 mb-5'>
        <DriverStatusCard detail={detail} reload={loadDetail} />
      </div>

      {/* 綁定車輛 / 目前車輛 */}
      <div className='col-12 col-xl-4 mb-5'>
        <DriverVehicleCard detail={detail} reload={loadDetail} />
      </div>

      {/* 統計 / 歷史（可先簡單顯示，之後再補資料） */}
      <div className='col-12 mb-5'>
        <DriverStatsCard detail={detail} />
      </div>
    </div>
  )
}

export default DetailPage
