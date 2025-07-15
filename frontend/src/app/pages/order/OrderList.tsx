import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Order, OrderStatus, OrderType } from './types'

export const OrderList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('')
  const [typeFilter, setTypeFilter] = useState<OrderType | ''>('')

  // 模擬訂單數據
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2025-001',
      type: 'EXPORT',
      status: 'PENDING',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z',
      customerId: '1',
      customerName: '台灣貿易公司',
      exportDetails: {
        date: '2025-01-20',
        shippingCompany: '長榮海運',
        shipName: 'EVER GIVEN',
        voyage: 'EG001',
        customsClearanceDate: '2025-01-19',
        containerPickupCode: 'EVG001',
        containerType: '40GP',
        containerPickupLocation: '高雄港',
        containerNumber: 'EVGU1234567',
        containerDropoffLocation: '台北港',
        loadingLocation: '台北市',
        loadingDate: '2025-01-18',
        loadingTime: '14:00',
      },
      history: []
    },
    {
      id: '2',
      orderNumber: 'ORD-2025-002',
      type: 'IMPORT',
      status: 'IN_TRANSIT',
      createdAt: '2025-01-14T09:30:00Z',
      updatedAt: '2025-01-15T11:00:00Z',
      customerId: '2',
      customerName: '亞洲進出口',
      assignedTo: '張司機',
      vehicleId: 'VH001',
      importDetails: {
        date: '2025-01-15',
        deliveryOrderLocation: '高雄港DO',
        shippingCompany: '陽明海運',
        shipName: 'YM EXCELLENCE',
        voyage: 'YM002',
        containerNumber: 'YMLU9876543',
        containerType: '20GP',
        containerYard: '高雄港CY',
        containerPickupDeadline: '2025-01-20',
        deliveryLocation: '台中市',
        deliveryDate: '2025-01-16',
        deliveryTime: '10:00',
        containerReturnLocation: '台中港',
        containerReturnDate: '2025-01-17',
        containerReturnTime: '16:00',
      },
      history: []
    }
  ]

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      PENDING: { class: 'badge-light-warning', text: '待處理' },
      ASSIGNED: { class: 'badge-light-info', text: '已指派' },
      IN_TRANSIT: { class: 'badge-light-primary', text: '運送中' },
      COMPLETED: { class: 'badge-light-success', text: '已完成' },
      CANCELLED: { class: 'badge-light-danger', text: '已取消' }
    }
    return statusConfig[status]
  }

  const getTypeBadge = (type: OrderType) => {
    return type === 'EXPORT' ? { class: 'badge-light-success', text: '出口' } : { class: 'badge-light-primary', text: '進口' }
  }

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === '' || order.status === statusFilter
    const matchesType = typeFilter === '' || order.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className='card'>
      <div className='card-header border-0 pt-6'>
        <div className='card-title'>
          <div className='d-flex align-items-center position-relative my-1'>
            <i className='ki-duotone ki-magnifier fs-3 position-absolute ms-4'>
              <span className='path1'></span>
              <span className='path2'></span>
            </i>
            <input
              type='text'
              className='form-control form-control-solid w-250px ps-14'
              placeholder='搜尋訂單號或客戶名稱...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className='card-toolbar'>
          <div className='d-flex justify-content-end'>
            <select
              className='form-select form-select-solid me-3'
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
            >
              <option value=''>所有狀態</option>
              <option value='PENDING'>待處理</option>
              <option value='ASSIGNED'>已指派</option>
              <option value='IN_TRANSIT'>運送中</option>
              <option value='COMPLETED'>已完成</option>
              <option value='CANCELLED'>已取消</option>
            </select>
            <select
              className='form-select form-select-solid me-3'
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as OrderType | '')}
            >
              <option value=''>所有類型</option>
              <option value='EXPORT'>出口</option>
              <option value='IMPORT'>進口</option>
            </select>
            <Link to='/order/create' className='btn btn-primary'>
              建立新訂單
            </Link>
          </div>
        </div>
      </div>
      <div className='card-body pt-0'>
        <div className='table-responsive'>
          <table className='table align-middle table-row-dashed fs-6 gy-5'>
            <thead>
              <tr className='text-start text-muted fw-bold fs-7 text-uppercase gs-0'>
                <th className='min-w-125px'>訂單號</th>
                <th className='min-w-125px'>客戶名稱</th>
                <th className='min-w-125px'>類型</th>
                <th className='min-w-125px'>狀態</th>
                <th className='min-w-125px'>指派對象</th>
                <th className='min-w-125px'>建立時間</th>
                <th className='text-end min-w-100px'>操作</th>
              </tr>
            </thead>
            <tbody className='text-gray-600 fw-semibold'>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link to={`/order/detail/${order.id}`} className='text-dark fw-bold text-hover-primary'>
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td>{order.customerName}</td>
                  <td>
                    <span className={`badge ${getTypeBadge(order.type).class}`}>
                      {getTypeBadge(order.type).text}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(order.status).class}`}>
                      {getStatusBadge(order.status).text}
                    </span>
                  </td>
                  <td>{order.assignedTo || '-'}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString('zh-TW')}</td>
                  <td className='text-end'>
                    <div className='d-flex justify-content-end flex-shrink-0'>
                      <Link
                        to={`/order/detail/${order.id}`}
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      >
                        <i className='ki-duotone ki-switch fs-2'>
                          <span className='path1'></span>
                          <span className='path2'></span>
                        </i>
                      </Link>
                      <Link
                        to={`/order/edit/${order.id}`}
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      >
                        <i className='ki-duotone ki-pencil fs-2'>
                          <span className='path1'></span>
                          <span className='path2'></span>
                        </i>
                      </Link>
                      <button className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                        <i className='ki-duotone ki-trash fs-2'>
                          <span className='path1'></span>
                          <span className='path2'></span>
                          <span className='path3'></span>
                          <span className='path4'></span>
                          <span className='path5'></span>
                        </i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
