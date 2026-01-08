import React from 'react'
import { Link } from 'react-router-dom'
import { OrderStatistics } from '../types'

export const Overview: React.FC = () => {
  // 這裡將來可以使用 React Query 獲取統計數據
  const mockStatistics: OrderStatistics = {
    totalOrders: 150,
    pendingOrders: 12,
    assignedOrders: 8,
    inTransitOrders: 15,
    completedOrders: 110,
    cancelledOrders: 5,
    todayOrders: 8,
    monthlyOrders: 45,
  }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'pending': return 'warning'
//       case 'assigned': return 'info'
//       case 'inTransit': return 'primary'
//       case 'completed': return 'success'
//       case 'cancelled': return 'danger'
//       default: return 'secondary'
//     }
//   }

  return (
    <div className='row g-5 g-xl-8'>
      {/* 統計卡片 */}
      <div className='col-xl-3'>
        <div className='card bg-primary hoverable card-xl-stretch mb-xl-8'>
          <div className='card-body'>
            <div className='text-white fw-bold fs-2 mb-2 mt-5'>
              {mockStatistics.totalOrders}
            </div>
            <div className='fw-semibold text-white'>總訂單數</div>
          </div>
        </div>
      </div>

      <div className='col-xl-3'>
        <div className='card bg-warning hoverable card-xl-stretch mb-xl-8'>
          <div className='card-body'>
            <div className='text-white fw-bold fs-2 mb-2 mt-5'>
              {mockStatistics.pendingOrders}
            </div>
            <div className='fw-semibold text-white'>待處理訂單</div>
          </div>
        </div>
      </div>

      <div className='col-xl-3'>
        <div className='card bg-success hoverable card-xl-stretch mb-xl-8'>
          <div className='card-body'>
            <div className='text-white fw-bold fs-2 mb-2 mt-5'>
              {mockStatistics.inTransitOrders}
            </div>
            <div className='fw-semibold text-white'>運送中訂單</div>
          </div>
        </div>
      </div>

      <div className='col-xl-3'>
        <div className='card bg-info hoverable card-xl-stretch mb-xl-8'>
          <div className='card-body'>
            <div className='text-white fw-bold fs-2 mb-2 mt-5'>
              {mockStatistics.todayOrders}
            </div>
            <div className='fw-semibold text-white'>今日訂單</div>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className='col-xl-6'>
        <div className='card card-xl-stretch mb-xl-8'>
          <div className='card-header border-0'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bold fs-3 mb-1'>快速操作</span>
            </h3>
          </div>
          <div className='card-body py-3'>
            <div className='row gx-4 gy-2'>
              <div className='col-6'>
                <Link
                  to='/order/create'
                  className='btn btn-outline-primary btn-outline-default btn-active-primary btn-sm px-4 py-2 w-100'
                >
                  建立新訂單
                </Link>
              </div>
              <div className='col-6'>
                <Link
                  to='/order/list'
                  className='btn btn-outline-secondary btn-outline-default btn-active-secondary btn-sm px-4 py-2 w-100'
                >
                  查看所有訂單
                </Link>
              </div>
              <div className='col-6'>
                <Link
                  to='/order/assign'
                  className='btn btn-outline-info btn-outline-default btn-active-info btn-sm px-4 py-2 w-100'
                >
                  訂單指派
                </Link>
              </div>
              <div className='col-6'>
                <Link
                  to='/order/report'
                  className='btn btn-outline-success btn-outline-default btn-active-success btn-sm px-4 py-2 w-100'
                >
                  匯出報表
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 訂單狀態統計 */}
      <div className='col-xl-6'>
        <div className='card card-xl-stretch mb-xl-8'>
          <div className='card-header border-0'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bold fs-3 mb-1'>訂單狀態統計</span>
            </h3>
          </div>
          <div className='card-body py-3'>
            <div className='d-flex align-items-center mb-3'>
              <div className='symbol symbol-30px me-4'>
                <span className={`symbol-label bg-light-warning text-warning fw-bold`}>
                  待
                </span>
              </div>
              <div className='flex-grow-1'>
                <div className='fw-semibold text-dark'>待處理</div>
                <div className='text-muted fs-7'>{mockStatistics.pendingOrders} 筆</div>
              </div>
            </div>
            <div className='d-flex align-items-center mb-3'>
              <div className='symbol symbol-30px me-4'>
                <span className={`symbol-label bg-light-info text-info fw-bold`}>
                  派
                </span>
              </div>
              <div className='flex-grow-1'>
                <div className='fw-semibold text-dark'>已指派</div>
                <div className='text-muted fs-7'>{mockStatistics.assignedOrders} 筆</div>
              </div>
            </div>
            <div className='d-flex align-items-center mb-3'>
              <div className='symbol symbol-30px me-4'>
                <span className={`symbol-label bg-light-primary text-primary fw-bold`}>
                  送
                </span>
              </div>
              <div className='flex-grow-1'>
                <div className='fw-semibold text-dark'>運送中</div>
                <div className='text-muted fs-7'>{mockStatistics.inTransitOrders} 筆</div>
              </div>
            </div>
            <div className='d-flex align-items-center'>
              <div className='symbol symbol-30px me-4'>
                <span className={`symbol-label bg-light-success text-success fw-bold`}>
                  完
                </span>
              </div>
              <div className='flex-grow-1'>
                <div className='fw-semibold text-dark'>已完成</div>
                <div className='text-muted fs-7'>{mockStatistics.completedOrders} 筆</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
