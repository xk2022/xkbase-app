import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Content } from '@/_metronic/layout/components/content'
import { CreateForm } from './CreateForm'

import { useAlert } from '@/app/pages/common/AlertType'
import { AppToolbar } from '@/app/pages/common/AppToolbar'
import { toUndef, trim } from '@/app/pages/common/form/formUtils'

import type { CreateTomOrderFormValues, CreateTomOrderReq } from '../Model'
import { createTomOrder } from '../Query'

/**
 * ===============================================================
 * CreatePage
 * - 建立 TOM 訂單頁
 * - 僅負責流程控制：
 *   1) 接收表單資料
 *   2) 呼叫 API
 *   3) 顯示訊息
 *   4) 導頁
 * - 表單 UI 全部交給 <CreateForm />
 * ===============================================================
 */

/**
 * FormValues -> CreateTomOrderReq
 * - 在 Page 層做最小 normalize
 * - 不在這裡做業務判斷
 */
const toCreateReq = (v: CreateTomOrderFormValues): CreateTomOrderReq => {
  return {
    orderType: v.orderType,

    customerUuid: trim(v.customerUuid),
    customerName: trim(v.customerName),

    pickupAddress: trim(v.pickupAddress),
    deliveryAddress: trim(v.deliveryAddress),

    scheduledAt: toUndef(v.scheduledAt),
    customerRefNo: toUndef(v.customerRefNo),
    note: toUndef(v.note),
  }
}

// ===============================================================
// Component
// ===============================================================
export const CreatePage: React.FC = () => {
  const navigate = useNavigate()
  const { alert, showAlert, Alert } = useAlert()
  const [ submitting, setSubmitting ] = useState(false)

  const handleCancel = useCallback(() => {
    navigate(-1)
  }, [ navigate ])

  const handleSubmit = useCallback(
    async (values: CreateTomOrderFormValues) => {
      setSubmitting(true)
      try {
        const ok = await createTomOrder(toCreateReq(values), showAlert)
        if (ok) {
          // 建立成功後，導回訂單列表
          navigate('/tom/order/list')
          return
        }
      } catch (e) {
        console.error(e)
        showAlert('系統發生錯誤，請稍後再試', 'danger')
      } finally {
        setSubmitting(false)
      }
    },
    [ navigate, showAlert ],
  )

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='建立訂單'
        breadcrumbs={[
          {label: 'TOM 運輸管理', active: false},
          {label: '訂單管理', href: '/tom/order/list', active: false},
          {label: '建立訂單', active: true},
        ]}
      />

      <div className='container-fluid'>
        <div className='card'>
          <div className='card-body'>
            <CreateForm
              submitting={submitting}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </Content>
  )
}
