// src/app/pages/fms/vehicle/Overview.tsx
import React, { useState } from 'react'
import { Content } from '@/_metronic/layout/components/content'
import { KTIcon } from '@/_metronic/helpers'
import { useAlert } from '@/app/pages/common/AlertType'

import VehicleList from "./List"
import { Vehicle } from './Model'
import { FormModal } from './FormModal'

export const Overview: React.FC = () => {
  const { alert, showAlert, Alert } = useAlert()

  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)

  const [searchKeyword, setSearchKeyword] = useState('')
  const [tempKeyword, setTempKeyword] = useState('')

  // 這個 key 用來強制重掛 List（新增 / 編輯後重新載入）
  const [listKey, setListKey] = useState(0)

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setSearchKeyword(tempKeyword.trim())
    }
  }

  const handleSaved = () => {
    // 新增 / 更新 成功後，強制 List 重新掛載載入
    setListKey((prev) => prev + 1)
    setFormModalOpen(false)
    setEditingVehicle(null)
  }

  // 開啟「新增」模式
  const openCreate = () => {
    setEditingVehicle(null)
    setFormModalOpen(true)
  }

  // 開啟「編輯」模式
  const openEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setFormModalOpen(true)
  }

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      {/* 麵包屑 */}
      <div className=''>
        <ol className='breadcrumb text-muted fs-6 fw-bold'>
          <li className='breadcrumb-item pe-3'>
            <a href='#' className='pe-3'>
              FMS 車輛管理
            </a>
          </li>
          <li className='breadcrumb-item px-3 text-muted'>車輛列表</li>
        </ol>
      </div>

      <div className='app-content flex-column-fluid'>
        <div className='card'>
          {/* Header */}
          <div className='card-header border-0 pt-6'>
            <div className='card-title'>
              <div className='d-flex align-items-center position-relative my-1'>
                <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
                <input
                  type='text'
                  className='form-control form-control-solid w-250px ps-14'
                  placeholder='搜尋車牌 / 車種 / 品牌'
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
                新增車輛
              </button>
            </div>
          </div>

          {/* Body：清單 */}
          <div className='card-body py-4'>
            <VehicleList 
              key={listKey}
              searchKeyword={searchKeyword}
              showAlert={showAlert}
              onEdit={openEdit}
            />
          </div>
        </div>
      </div>

      {/* ✅ 共用 Create + Edit Modal */}
      <FormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false)
          setEditingVehicle(null)
        }}
        showAlert={showAlert}
        editingVehicle={editingVehicle}
        onSaved={handleSaved}
      />
    </Content>
  )
}
