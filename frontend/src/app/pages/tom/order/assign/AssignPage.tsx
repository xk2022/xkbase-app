// src/app/pages/tom/order/assign/AssignPage.tsx
import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { Content } from '@/_metronic/layout/components/content'
import { KTIcon } from '@/_metronic/helpers'

import { useAlert } from '@/app/pages/common/AlertType'
import { AppToolbar } from '@/app/pages/common/AppToolbar'

import type { OrderListItem } from '../Model'
import AssignList from './AssignList'
import AssignModal from './AssignModal'

/**
 * ===============================================================
 * AssignPage (訂單指派頁面)
 * - 顯示待指派訂單列表（status = 'pending'）
 * - 提供指派功能（選擇車輛和司機）
 * - 指派成功後更新訂單狀態
 * ===============================================================
 */
export const AssignPage: React.FC = () => {
  const navigate = useNavigate()
  const { alert, showAlert, Alert } = useAlert()

  const [assigningOrder, setAssigningOrder] = useState<OrderListItem | null>(null)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [listKey, setListKey] = useState(0)

  const handleAssignClick = useCallback((order: OrderListItem) => {
    // 只允許指派待處理的訂單
    if (order.orderStatus !== 'pending' && order.orderStatus !== 'CREATED') {
      showAlert('只有待處理的訂單可以指派', 'warning')
      return
    }
    setAssigningOrder(order)
    setAssignModalOpen(true)
  }, [showAlert])

  const handleAssignSuccess = useCallback(() => {
    setAssignModalOpen(false)
    setAssigningOrder(null)
    // 刷新列表
    setListKey((prev) => prev + 1)
    showAlert('指派成功', 'success')
  }, [showAlert])

  const handleAssignCancel = useCallback(() => {
    setAssignModalOpen(false)
    setAssigningOrder(null)
  }, [])

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='訂單指派'
        breadcrumbs={[
          { label: 'TOM 運輸管理', href: '/tom' },
          { label: '訂單管理', href: '/tom/order/list', active: false },
          { label: '訂單指派', active: true },
        ]}
      />

      <div className='flex-column-fluid'>
        <div className='card'>
          {/* Header */}
          <div className='card-header border-0 pt-6'>
            <div className='card-title'>
              <div className='d-flex align-items-center'>
                <KTIcon iconName='truck' className='fs-2 me-2 text-primary' />
                <h3 className='mb-0'>待指派訂單</h3>
              </div>
            </div>

            <div className='card-toolbar'>
              <div className='d-flex justify-content-end gap-2 flex-wrap'>
                <button
                  type='button'
                  className='btn btn-light'
                  onClick={() => navigate('/tom/order/list')}
                >
                  <KTIcon iconName='arrow-left' className='fs-2' />
                  返回列表
                </button>
              </div>
            </div>
          </div>

          {/* Body：待指派訂單列表 */}
          <div className='card-body py-4'>
            <AssignList
              key={listKey}
              showAlert={showAlert}
              onAssign={handleAssignClick}
            />
          </div>
        </div>
      </div>

      {/* 指派 Modal */}
      {assigningOrder && (
        <AssignModal
          open={assignModalOpen}
          order={assigningOrder}
          onClose={handleAssignCancel}
          onSuccess={handleAssignSuccess}
          showAlert={showAlert}
        />
      )}
    </Content>
  )
}
