// src/app/pages/tom/order/detail/DetailPage.tsx
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'

import { Content } from '@/_metronic/layout/components/content'
import { useAlert } from '@/app/pages/common/AlertType'
import { Error500WithLayout } from '@/app/pages/common/Error500WithLayout'
import { MockDataDialog } from '@/app/pages/common/MockDataDialog'
import { ApiError } from '@/app/pages/common/ApiError'
import { enableTempMockData } from '@/shared/utils/useMockData'

import type { OrderDetail } from './Model'
import { fetchOrderDetail } from './Query'

import { AppToolbar } from '@/app/pages/common/AppToolbar'

// 5 cards
import { OrderSummaryCard } from './cards/OrderSummaryCard'
import { OrderContainersCard } from './cards/OrderContainersCard'
import { OrderBillingCard } from './cards/OrderBillingCard'
import { OrderDispatchCard } from './cards/OrderDispatchCard'
import { OrderLogsCard } from './cards/OrderLogsCard'

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { alert, showAlert, Alert } = useAlert()

  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<OrderDetail | null>(null)

  // 錯誤處理狀態
  const [showError500, setShowError500] = useState(false)
  const [showMockDialog, setShowMockDialog] = useState(false)

  const loadDetail = useCallback(async () => {
    if (!id) {
      setDetail(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setShowError500(false)
    try {
      const data = await fetchOrderDetail(id, showAlert)
      setDetail(data)
    } catch (error) {
      console.error(error)
      
      // 檢查是否為 API 500 錯誤
      const apiError = ApiError.fromAxiosError(error)
      if (apiError.isServerError) {
        setShowError500(true)
        setShowMockDialog(true)
      } else {
        // 其他錯誤，顯示提示
        showAlert('取得訂單詳情失敗', 'danger')
        setDetail(null)
      }
    } finally {
      setLoading(false)
    }
  }, [id, showAlert])

  const handleUseMockData = useCallback(() => {
    enableTempMockData()
    setShowMockDialog(false)
    setShowError500(false)
    // 重新載入數據
    loadDetail()
  }, [loadDetail])

  const handleRetry = useCallback(() => {
    setShowError500(false)
    loadDetail()
  }, [loadDetail])

  useEffect(() => {
    loadDetail()
  }, [loadDetail])

  // 如果顯示 500 錯誤頁面
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

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='訂單詳情'
        breadcrumbs={[
          { label: '訂單管理', href: '/tom' },
          { label: '訂單', href: '/tom/order' },
          { label: '詳情', active: true },
        ]}
      />

      <div className='app-container container-fluid'>
        {loading ? (
          <div className='d-flex justify-content-center py-10'>
            <Spinner animation='border' />
          </div>
        ) : !detail ? (
          <div className='text-center py-10 text-muted'>查無訂單資料</div>
        ) : (
          <div className='row g-6'>
            {/* 上排：基本 + 計費 */}
            <div className='col-12 col-lg-6'>
              <OrderSummaryCard detail={detail} reload={loadDetail} />
            </div>
            <div className='col-12 col-lg-6'>
              <OrderBillingCard detail={detail} reload={loadDetail} />
            </div>

            {/* 中排：貨櫃清單（全寬） */}
            <div className='col-12'>
              <OrderContainersCard detail={detail} reload={loadDetail} />
            </div>

            {/* 下排：派車 + 紀錄 */}
            <div className='col-12 col-lg-6'>
              <OrderDispatchCard detail={detail} reload={loadDetail} />
            </div>
            <div className='col-12 col-lg-6'>
              <OrderLogsCard detail={detail} />
            </div>
          </div>
        )}
      </div>
    </Content>
  )
}
