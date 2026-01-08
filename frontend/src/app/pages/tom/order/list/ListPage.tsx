// src/app/pages/tom/order/ListPage.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Content } from '@/_metronic/layout/components/content'
import { KTIcon } from '@/_metronic/helpers'

import { useAlert } from '@/app/pages/common/AlertType'
import { AppToolbar } from '@/app/pages/common/AppToolbar'

import { OrderListItem } from '../Model'
import OrderList from './List'
import { FormModal } from './FormModal'

// 如果你要完全改成「開頁面」：FormModal / editingUser / formModalOpen 之後可以移除

/**
 * ===============================================================
 * ListPage（訂單列表頁）
 * - 負責：Toolbar、查詢條件（v1 先用 keyword）、導向新增頁、刷新列表
 * - 不負責：列表內 API / 分頁 / 刪除（交給 <OrderList />）
 * ===============================================================
 */
export function ListPage() {
  const { alert, showAlert, Alert } = useAlert()

  const navigate = useNavigate()

  const [searchKeyword, setSearchKeyword] = useState('')
  const [tempKeyword, setTempKeyword] = useState('')
  const [listKey, setListKey] = useState(0)

  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<OrderListItem | null>(null)

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchKeyword(tempKeyword.trim())
    }
  }

  const reloadList = () => {
    // 讓 UserList 重新掛載（常用於新增/編輯成功後回來刷新）
    setListKey((prev) => prev + 1)
    setFormModalOpen(false)
    setEditingOrder(null)
  }

  /**
   * 新增：導向 /upms/user/create（Create mode）
   */
  const openCreate = () => {
    // 方式一：開啟 Model 彈窗
    // setEditingUser(null)
    // setFormModalOpen(true)

    // 方式二：直接跳轉頁面
    navigate('/tom/order/create')
  }

  /**
   * 編輯：開啟 Model 快速簡易編輯
   */
  const openEdit = (order: OrderListItem) => {
    setEditingOrder(order)
    setFormModalOpen(true)
  }
  
  useEffect(() => {

  }, [showAlert]) // 👈 空依賴，只跑一次

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='訂單列表'
        breadcrumbs={[
          { label: '訂單管理', href: '#'},
          { label: '訂單列表', active: true },
        ]}
      />

      {/* Content */}
      <div className='flex-column-fluid'>
        <div className='card'>
          {/* Header：搜尋 + 新增 */}
          <div className='card-header border-0 pt-6'>
            <div className='card-title'>
              <div className='d-flex align-items-center position-relative my-1'>
                <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
                <input
                  type='text'
                  className='form-control form-control-solid w-250px ps-14'
                  placeholder='訂單編號 / 櫃號 / 船名航次…'
                  value={tempKeyword}
                  onChange={(e) => setTempKeyword(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
            </div>

            <div className='card-toolbar'>
              <div className='d-flex justify-content-end gap-2 flex-wrap'>
                {/* <button
                  type='button'
                  className='btn btn-light'
                  onClick={handleReset}
                >
                  重置
                </button> */}

                {/* <button
                  type='button'
                  className='btn btn-light-primary'
                  onClick={handleSearchClick}
                >
                  查詢
                </button> */}
                {/* <UsersListFilter /> */}

                <button
                  type='button'
                  className='btn btn-primary'
                  onClick={openCreate}
                >
                  <KTIcon iconName='plus' className='fs-2' />
                  建立訂單
                </button>
              </div>
            </div>
          </div>

          {/* Body：清單（API/分頁/刪除都在 List.tsx） */}
          <div className='card-body py-4'>
            <OrderList
              key={listKey}
              searchKeyword={searchKeyword}
              showAlert={showAlert}
              onEdit={openEdit}
              onAssign={openEdit}
            />
          </div>
        </div>
      </div>

      {/* 共用 Edit Modal 簡易編輯 */}
      <FormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false)
          setEditingOrder(null)
        }}
        showAlert={showAlert}
        editingOrder={editingOrder}
        onSaved={reloadList}
      />
    </Content>
  )
}
