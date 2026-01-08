// src/app/pages/tom/container/detail/DetailPage.tsx
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'

import { Content } from '@/_metronic/layout/components/content'
import { useAlert } from '@/app/pages/common/AlertType'

import type { ContainerDetail } from './Model'
import { fetchContainerDetail } from './Query'

import { AppToolbar } from '@/app/pages/common/AppToolbar'

// Cards（你可先做空殼，逐步補）
import { ContainerSummaryCard } from './cards/ContainerSummaryCard'
import { ContainerTaskListCard } from './cards/ContainerTaskListCard'
import { ContainerBillingCard } from './cards/ContainerBillingCard'
import { ContainerDispatchCard } from './cards/ContainerDispatchCard'
import { ContainerLogsCard } from './cards/ContainerLogsCard'
import { OrderContainerStatusBar } from './cards/OrderContainerStatusBar'

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { alert, showAlert, Alert } = useAlert()

  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<ContainerDetail | null>(null)

  const loadDetail = useCallback(async () => {
    if (!id) {
      setDetail(null)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const data = await fetchContainerDetail(id)
      setDetail(data)
    } catch (e) {
      console.error(e)
      showAlert('取得貨櫃詳情失敗', 'danger')
      setDetail(null)
    } finally {
      setLoading(false)
    }
  }, [id, showAlert])

  useEffect(() => {
    loadDetail()
  }, [loadDetail])

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='貨櫃詳情'
        breadcrumbs={[
          { label: 'TOM 運輸管理', href: '/tom' },
          { label: '貨櫃管理', href: '/tom/container/list' },
          { label: '詳情', active: true },
        ]}
      />

      <div className='app-container container-fluid'>
        {loading ? (
          <div className='d-flex justify-content-center py-10'>
            <Spinner animation='border' />
          </div>
        ) : !detail ? (
          <div className='text-center py-10 text-muted'>查無貨櫃資料</div>
        ) : (
          <div className='row g-6'>
            <OrderContainerStatusBar status={detail.status} />

            {/* 上排：基本 + 計費 */}
            <div className='col-12 col-lg-6'>
              <ContainerSummaryCard detail={detail} reload={loadDetail} />
            </div>
            <div className='col-12 col-lg-6'>
              <ContainerBillingCard detail={detail} reload={loadDetail} />
            </div>

            {/* 中排：任務清單（全寬） */}
            <div className='col-12'>
              <ContainerTaskListCard detail={detail} reload={loadDetail} />
            </div>

            {/* 下排：派遣資訊 + 紀錄 */}
            <div className='col-12 col-lg-6'>
              <ContainerDispatchCard detail={detail} reload={loadDetail} />
            </div>
            <div className='col-12 col-lg-6'>
              <ContainerLogsCard detail={detail} />
            </div>
          </div>
        )}
      </div>
    </Content>
  )
}

export default DetailPage
