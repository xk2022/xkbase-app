// src/app/pages/fms/driver/Overview.tsx
import React, { useState } from 'react'
import { Content } from '@/_metronic/layout/components/content'
import { KTIcon } from '@/_metronic/helpers'
import { useAlert } from '@/app/pages/common/AlertType'

import DriverList from './List'
import { Driver } from './Model'
import { FormModal } from './FormModal'

export const Overview: React.FC = () => {
  const { alert, showAlert, Alert } = useAlert()

  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)

  const [searchKeyword, setSearchKeyword] = useState('')
  const [tempKeyword, setTempKeyword] = useState('')

  // 用來強制重新掛載 List
  const [listKey, setListKey] = useState(0)

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setSearchKeyword(tempKeyword.trim())
    }
  }

  const handleSaved = () => {
    // 新增 / 更新成功 → 重新載入列表
    setListKey((prev) => prev + 1)
    setFormModalOpen(false)
    setEditingDriver(null)
  }

  // 開啟新增模式
  const openCreate = () => {
    setEditingDriver(null)
    setFormModalOpen(true)
  }

  // 開啟編輯模式
  const openEdit = (driver: Driver) => {
    setEditingDriver(driver)
    setFormModalOpen(true)
  }

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      {/* 麵包屑 */}
      <div>
        <ol className='breadcrumb text-muted fs-6 fw-bold'>
          <li className='breadcrumb-item pe-3'>
            <a href='#' className='pe-3'>
              FMS 司機管理
            </a>
          </li>
          <li className='breadcrumb-item px-3 text-muted'>司機列表</li>
        </ol>
      </div>

      <div className='app-content flex-column-fluid'>
        <div className='card'>
          {/* Header：搜尋 + 新增 */}
          <div className='card-header border-0 pt-6'>
            <div className='card-title'>
              <div className='d-flex align-items-center position-relative my-1'>
                <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
                <input
                  type='text'
                  className='form-control form-control-solid w-250px ps-14'
                  placeholder='搜尋姓名 / 電話 / 狀態'
                  value={tempKeyword}
                  onChange={(e) => setTempKeyword(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
            </div>

            <div className='card-toolbar'>
              <button
                type='button'
                className='btn btn-primary'
                onClick={openCreate}
              >
                <KTIcon iconName='plus' className='fs-2' />
                新增司機
              </button>
            </div>
          </div>

          {/* Body：列表 */}
          <div className='card-body py-4'>
            <DriverList
              key={listKey}
              searchKeyword={searchKeyword}
              showAlert={showAlert}
              onEdit={openEdit}
            />
          </div>
        </div>
      </div>

      {/* Create + Edit Modal */}
      <FormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false)
          setEditingDriver(null)
        }}
        showAlert={showAlert}
        editingDriver={editingDriver}
        onSaved={handleSaved}
      />
    </Content>
  )
}
