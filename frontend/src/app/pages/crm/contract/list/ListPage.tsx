// src/app/pages/crm/contract/list/ListPage.tsx
import React, { useEffect, useState } from 'react'

import { Content } from '@/_metronic/layout/components/content'
import { KTIcon } from '@/_metronic/helpers'

import { useAlert } from '@/app/pages/common/AlertType'
import { AppToolbar } from '@/app/pages/common/AppToolbar'

import { ContractTemplateListItem } from '../../Model'
import ContractList from './List'
import { FormModal } from './FormModal'

/**
 * ===============================================================
 * ListPage（合約模板列表頁）
 * ===============================================================
 */
export function ListPage() {
  const { alert, showAlert, Alert } = useAlert()

  const [searchKeyword, setSearchKeyword] = useState('')
  const [tempKeyword, setTempKeyword] = useState('')
  const [listKey, setListKey] = useState(0)

  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingContract, setEditingContract] = useState<ContractTemplateListItem | null>(null)

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchKeyword(tempKeyword.trim())
    }
  }

  const reloadList = () => {
    setListKey((prev) => prev + 1)
    setFormModalOpen(false)
    setEditingContract(null)
  }

  const openCreate = () => {
    setEditingContract(null)
    setFormModalOpen(true)
  }

  const openEdit = (contract: ContractTemplateListItem) => {
    setEditingContract(contract)
    setFormModalOpen(true)
  }
  
  useEffect(() => {
    // 初始化
  }, [showAlert])

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='合約模板'
        breadcrumbs={[
          { label: 'CRM 客戶管理', href: '#'},
          { label: '合約模板', active: true },
        ]}
      />

      <div className='flex-column-fluid'>
        <div className='card'>
          <div className='card-header border-0 pt-6'>
            <div className='card-title'>
              <div className='d-flex align-items-center position-relative my-1'>
                <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
                <input
                  type='text'
                  className='form-control form-control-solid w-250px ps-14'
                  placeholder='合約名稱 / 客戶名稱…'
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
                  新增合約模板
                </button>
              </div>
            </div>
          </div>

          <div className='card-body py-4'>
            <ContractList
              key={listKey}
              searchKeyword={searchKeyword}
              showAlert={showAlert}
              onEdit={openEdit}
            />
          </div>
        </div>
      </div>

      <FormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false)
          setEditingContract(null)
        }}
        showAlert={showAlert}
        editingContract={editingContract}
        onSaved={reloadList}
      />
    </Content>
  )
}
