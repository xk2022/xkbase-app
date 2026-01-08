// src/app/pages/crm/customer/list/ListPage.tsx
import React, { useEffect, useState } from 'react'

import { Content } from '@/_metronic/layout/components/content'
import { KTIcon } from '@/_metronic/helpers'

import { useAlert } from '@/app/pages/common/AlertType'
import { AppToolbar } from '@/app/pages/common/AppToolbar'

import { CustomerListItem } from '../../Model'
import CustomerList from './List'
import { FormModal } from './FormModal'

/**
 * ===============================================================
 * ListPage（客戶列表頁）
 * ===============================================================
 */
export function ListPage() {
  const { alert, showAlert, Alert } = useAlert()

  const [searchKeyword, setSearchKeyword] = useState('')
  const [tempKeyword, setTempKeyword] = useState('')
  const [listKey, setListKey] = useState(0)

  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<CustomerListItem | null>(null)

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchKeyword(tempKeyword.trim())
    }
  }

  const reloadList = () => {
    setListKey((prev) => prev + 1)
    setFormModalOpen(false)
    setEditingCustomer(null)
  }

  const openCreate = () => {
    setEditingCustomer(null)
    setFormModalOpen(true)
  }

  const openEdit = (customer: CustomerListItem) => {
    setEditingCustomer(customer)
    setFormModalOpen(true)
  }
  
  useEffect(() => {
    // 初始化
  }, [showAlert])

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='客戶清單'
        breadcrumbs={[
          { label: 'CRM 客戶管理', href: '#'},
          { label: '客戶清單', active: true },
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
                  placeholder='公司名稱 / 公司代碼 / 統一編號…'
                  value={tempKeyword}
                  onChange={(e) => setTempKeyword(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
            </div>

            <div className='card-toolbar'>
              <div className='d-flex justify-content-end gap-2 flex-wrap'>
                <button
                  type='button'
                  className='btn btn-primary'
                  onClick={openCreate}
                >
                  <KTIcon iconName='plus' className='fs-2' />
                  新增客戶
                </button>
              </div>
            </div>
          </div>

          {/* Body：清單 */}
          <div className='card-body py-4'>
            <CustomerList
              key={listKey}
              searchKeyword={searchKeyword}
              showAlert={showAlert}
              onEdit={openEdit}
            />
          </div>
        </div>
      </div>

      {/* 共用 Edit Modal */}
      <FormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false)
          setEditingCustomer(null)
        }}
        showAlert={showAlert}
        editingCustomer={editingCustomer}
        onSaved={reloadList}
      />
    </Content>
  )
}
