// src/app/pages/tom/order/OrderOverviewPage.tsx
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { Content } from '@/_metronic/layout/components/content'
import { KTIcon } from '@/_metronic/helpers'
import { useAlert } from '@/app/pages/common/AlertType'

type OrderStatus = 'CREATED' | 'ASSIGNED' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'

type OverviewOrderItem = {
  id: string
  orderNo: string
  customerName: string
  pickupLocation: string
  destinationPort: string
  pickupDate?: string
  containerCount: number
  orderStatus: OrderStatus
  updatedTime: string
}

type AssignableItem = {
  id: string
  orderNo: string
  customerName: string
  pickupLocation: string
  destinationPort: string
  pickupDate?: string
  containerCount: number
  // for quick action
  reason: 'UNASSIGNED_TASK' | 'PARTIAL_ASSIGNED'
}

const fmtDate = (ts?: string) => {
  if (!ts) return '-'
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ts
  return d.toLocaleDateString('zh-TW')
}

const joinRoute = (from?: string, to?: string) => {
  const a = from?.trim()
  const b = to?.trim()
  if (!a && !b) return '-'
  if (a && !b) return `${a} → -`
  if (!a && b) return `- → ${b}`
  return `${a} → ${b}`
}

const statusMeta = (s: OrderStatus) => {
  switch (s) {
    case 'CREATED':
      return { label: '待處理', color: 'warning' as const }
    case 'ASSIGNED':
      return { label: '已指派', color: 'primary' as const }
    case 'IN_PROGRESS':
      return { label: '運送中', color: 'info' as const }
    case 'DONE':
      return { label: '已完成', color: 'success' as const }
    case 'CANCELLED':
      return { label: '已取消', color: 'danger' as const }
    default:
      return { label: s, color: 'secondary' as const }
  }
}

const reasonMeta = (r: AssignableItem['reason']) => {
  switch (r) {
    case 'UNASSIGNED_TASK':
      return { label: '未建立/未指派任務', color: 'warning' as const, icon: 'time' }
    case 'PARTIAL_ASSIGNED':
      return { label: '部分已指派', color: 'primary' as const, icon: 'truck' }
    default:
      return { label: String(r), color: 'secondary' as const, icon: 'information-5' }
  }
}

/**
 * OrderOverviewPage (MVP with mock data)
 * - KPI
 * - 最近訂單
 * - 待派單（導到任務管理/派單頁）
 */
export const OverviewPage: React.FC = () => {
  const navigate = useNavigate()
  const { alert, Alert } = useAlert()

  // -----------------------------
  // Mock data (MVP)
  // -----------------------------
  const recentOrders: OverviewOrderItem[] = useMemo(
    () => [
      {
        id: '1',
        orderNo: 'TOM-2026-0001',
        customerName: '宏達國際物流股份有限公司',
        pickupLocation: '桃園南崁倉',
        destinationPort: '基隆港',
        pickupDate: '2026-01-05',
        containerCount: 2,
        orderStatus: 'CREATED',
        updatedTime: '2026-01-07T09:12:00+08:00',
      },
      {
        id: '2',
        orderNo: 'TOM-2026-0002',
        customerName: '聯航貨運有限公司',
        pickupLocation: '新竹物流園區',
        destinationPort: '台中港',
        pickupDate: '2026-01-06',
        containerCount: 1,
        orderStatus: 'ASSIGNED',
        updatedTime: '2026-01-07T10:03:00+08:00',
      },
      {
        id: '3',
        orderNo: 'TOM-2026-0003',
        customerName: '遠東國際運通',
        pickupLocation: '台南永康工業區',
        destinationPort: '安平港',
        pickupDate: '2026-01-10',
        containerCount: 3,
        orderStatus: 'IN_PROGRESS',
        updatedTime: '2026-01-07T13:45:00+08:00',
      },
      {
        id: '4',
        orderNo: 'TOM-2026-0004',
        customerName: '鼎盛供應鏈股份有限公司',
        pickupLocation: '台北內湖倉',
        destinationPort: '基隆港',
        pickupDate: '2026-01-07',
        containerCount: 1,
        orderStatus: 'DONE',
        updatedTime: '2026-01-07T15:10:00+08:00',
      },
    ],
    [],
  )

  const assignables: AssignableItem[] = useMemo(
    () => [
      {
        id: '1',
        orderNo: 'TOM-2026-0001',
        customerName: '宏達國際物流股份有限公司',
        pickupLocation: '桃園南崁倉',
        destinationPort: '基隆港',
        pickupDate: '2026-01-05',
        containerCount: 2,
        reason: 'UNASSIGNED_TASK',
      },
      {
        id: '3',
        orderNo: 'TOM-2026-0003',
        customerName: '遠東國際運通',
        pickupLocation: '台南永康工業區',
        destinationPort: '安平港',
        pickupDate: '2026-01-10',
        containerCount: 3,
        reason: 'PARTIAL_ASSIGNED',
      },
    ],
    [],
  )

  const kpi = useMemo(() => {
    const count = (s: OrderStatus) => recentOrders.filter((x) => x.orderStatus === s).length
    return [
      { title: '待處理', value: count('CREATED'), icon: 'time', color: 'warning' as const },
      { title: '已指派', value: count('ASSIGNED'), icon: 'truck', color: 'primary' as const },
      { title: '運送中', value: count('IN_PROGRESS'), icon: 'delivery-3', color: 'info' as const },
      { title: '已完成', value: count('DONE'), icon: 'check-circle', color: 'success' as const },
    ] as const
  }, [recentOrders])

  // -----------------------------
  // Render helpers
  // -----------------------------
  const goOrderList = () => navigate('/tom/order/list') // 你若是 /tom/order 改這裡
  const goTaskList = () => navigate('/tom/tasks/list')   // 任務管理（派單）入口
  const goOrderDetail = (id: string) => navigate(`/tom/order/${id}/detail`)

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      {/* Toolbar */}
      <div id='kt_app_toolbar' className='app-toolbar py-3 py-lg-6'>
        <div
          id='kt_app_toolbar_container'
          className='app-container container-fluid d-flex flex-stack flex-wrap gap-3'
        >
          <div
            id='kt_page_title'
            className='page-title d-flex flex-column justify-content-center me-3 min-w-0'
          >
            <h1 className='page-heading text-gray-900 fw-bold fs-3 my-0'>訂單總覽</h1>

            <ul className='breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0'>
              <li className='breadcrumb-item text-muted'>
                <a href='/tom' className='text-muted text-hover-primary'>
                  訂單管理
                </a>
              </li>
              <li className='breadcrumb-item'>
                <span className='bullet bg-gray-500 w-5px h-2px'></span>
              </li>
              <li className='breadcrumb-item text-gray-900'>總覽</li>
            </ul>
          </div>

          <div className='d-flex gap-2'>
            <button className='btn btn-sm btn-light' onClick={goOrderList}>
              <KTIcon iconName='row-horizontal' className='fs-3' />
              前往訂單列表
            </button>
            <button className='btn btn-sm btn-primary' onClick={goTaskList}>
              <KTIcon iconName='truck' className='fs-3' />
              前往任務管理
            </button>
          </div>
        </div>
      </div>

      <div className='app-container container-fluid'>
        {/* KPI */}
        <div className='row g-5 g-xl-8'>
          {kpi.map((x) => (
            <div key={x.title} className='col-12 col-sm-6 col-xl-3'>
              <div className='card h-100'>
                <div className='card-body d-flex flex-column justify-content-between'>
                  <div className='d-flex align-items-center justify-content-between'>
                    <div className='d-flex flex-column'>
                      <span className='text-muted fw-semibold fs-7'>{x.title}</span>
                      <span className='fw-bold fs-2 text-gray-900 mt-1'>{x.value}</span>
                    </div>
                    <span className={`badge badge-light-${x.color} p-3`}>
                      <KTIcon iconName={x.icon} className='fs-2' />
                    </span>
                  </div>

                  <div className='separator my-4'></div>

                  <div className='d-flex align-items-center justify-content-between'>
                    <span className='text-muted fs-8'>本日</span>
                    <span className='text-muted fs-8'>mock</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className='row g-5 g-xl-8 mt-1'>
          {/* 最近訂單 */}
          <div className='col-12 col-xl-7'>
            <div className='card h-100'>
              <div className='card-header border-0 pt-6'>
                <div className='card-title'>
                  <h3 className='fw-bold m-0'>最近訂單</h3>
                </div>
                <div className='card-toolbar'>
                  <button className='btn btn-sm btn-light' onClick={goOrderList}>
                    前往列表
                  </button>
                </div>
              </div>

              <div className='card-body py-4'>
                <div className='table-responsive'>
                  <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-3'>
                    <thead>
                      <tr className='fw-bold text-muted'>
                        <th className='min-w-150px'>訂單編號</th>
                        <th className='min-w-180px'>客戶</th>
                        <th className='min-w-240px'>路線</th>
                        <th className='min-w-110px text-end'>櫃數</th>
                        <th className='min-w-120px'>狀態</th>
                        <th className='min-w-120px'>更新</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((o) => {
                        const st = statusMeta(o.orderStatus)
                        return (
                          <tr
                            key={o.id}
                            className='cursor-pointer table-row-hover'
                            onClick={() => goOrderDetail(o.id)}
                          >
                            <td className='fw-bold text-gray-900'>{o.orderNo}</td>
                            <td>{o.customerName}</td>
                            <td>{joinRoute(o.pickupLocation, o.destinationPort)}</td>
                            <td className='text-end'>{o.containerCount}</td>
                            <td>
                              <span className={`badge badge-light-${st.color}`}>{st.label}</span>
                            </td>
                            <td className='text-muted'>{fmtDate(o.updatedTime)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className='text-muted fs-8 mt-2'>
                  * MVP：目前為 mock 資料，之後接 API 後改為「最近建立/更新」。
                </div>
              </div>
            </div>
          </div>

          {/* 待派單 */}
          <div className='col-12 col-xl-5'>
            <div className='card h-100'>
              <div className='card-header border-0 pt-6'>
                <div className='card-title'>
                  <h3 className='fw-bold m-0'>待派單</h3>
                </div>
                <div className='card-toolbar'>
                  <button className='btn btn-sm btn-light' onClick={goTaskList}>
                    前往任務管理
                  </button>
                </div>
              </div>

              <div className='card-body py-4'>
                {assignables.length === 0 ? (
                  <div className='text-muted'>目前沒有待派單項目</div>
                ) : (
                  <div className='d-flex flex-column gap-3'>
                    {assignables.map((x) => {
                      const meta = reasonMeta(x.reason)
                      return (
                        <div
                          key={x.id}
                          className='d-flex align-items-center justify-content-between border rounded p-3'
                        >
                          <div className='d-flex flex-column min-w-0'>
                            <div className='d-flex align-items-center gap-2'>
                              <span className='fw-bold text-gray-900'>{x.orderNo}</span>
                              <span className={`badge badge-light-${meta.color}`}>{meta.label}</span>
                            </div>

                            <div className='text-muted fs-8 mt-1 text-truncate'>
                              {x.customerName}
                            </div>
                            <div className='text-muted fs-8 text-truncate'>
                              {joinRoute(x.pickupLocation, x.destinationPort)}
                            </div>

                            <div className='text-muted fs-8 mt-1'>
                              提貨：{fmtDate(x.pickupDate)}｜櫃數：{x.containerCount}
                            </div>
                          </div>

                          <div className='d-flex gap-2 flex-shrink-0'>
                            <button
                              className='btn btn-sm btn-light'
                              onClick={() => goOrderDetail(x.id)}
                            >
                              <KTIcon iconName='eye' className='fs-3' />
                              訂單
                            </button>
                            <button className='btn btn-sm btn-primary' onClick={goTaskList}>
                              <KTIcon iconName={meta.icon} className='fs-3' />
                              派單
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className='text-muted fs-8 mt-3'>
                  * MVP：待派單來源建議以「任務未指派 / 部分未指派」彙總，而非只看訂單狀態。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Content>
  )
}
