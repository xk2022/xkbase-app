import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Overview } from './Overview'
import { OrderList } from './OrderList'
import { OrderCreate } from './OrderCreate'
import { OrderEdit } from './OrderEdit'
import { OrderDetail } from './OrderDetail'
import { OrderAssign } from './OrderAssign'
import { OrderReport } from './OrderReport'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: '訂單管理',
    path: '/order/overview',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const OrderPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='overview'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>訂單總覽</PageTitle>
            <Overview />
          </>
        }
      />
      <Route
        path='list'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>訂單列表</PageTitle>
            <OrderList />
          </>
        }
      />
      <Route
        path='create'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>建立訂單</PageTitle>
            <OrderCreate />
          </>
        }
      />
      <Route
        path='edit/:id'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>編輯訂單</PageTitle>
            <OrderEdit />
          </>
        }
      />
      <Route
        path='detail/:id'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>訂單詳情</PageTitle>
            <OrderDetail />
          </>
        }
      />
      <Route
        path='assign'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>訂單指派</PageTitle>
            <OrderAssign />
          </>
        }
      />
      <Route
        path='report'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>訂單報表</PageTitle>
            <OrderReport />
          </>
        }
      />
    </Routes>
  )
}

export default OrderPage
