// src/app/pages/sample/v1/list/ListPage.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Content } from '@/_metronic/layout/components/content'
import { KTIcon } from '@/_metronic/helpers'

import { useAlert } from '@/app/pages/common/AlertType'
import { AppToolbar } from '@/app/pages/common/AppToolbar'

import SampleList from './List'
import { Sample } from '../Model'

// 如果你要完全改成「開頁面」：FormModal / editingSample / formModalOpen 之後可以移除
import { FormModal } from './FormModal'

/**
 * ===============================================================
 * ListPage（Sample 清單頁）
 * - 負責：查詢、列表、導向新增/編輯頁
 * ===============================================================
 */
export function ListPage() {
  // ===============================================================
  // Alerts（統一錯誤/提示）
  // ===============================================================
  const { alert, showAlert, Alert } = useAlert()

  // ===============================================================
  // Router
  // ===============================================================
  const navigate = useNavigate()

  // ===============================================================
  // Search / List State
  // ===============================================================
  const [searchKeyword, setSearchKeyword] = useState('')
  const [tempKeyword, setTempKeyword] = useState('')
  const [listKey, setListKey] = useState(0)

  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingSample, setEditingSample] = useState<Sample | null>(null)

  // ===============================================================
  // Handlers - Search
  // ===============================================================
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchKeyword(tempKeyword.trim())
    }
  }

  // ===============================================================
  // Handlers - List Reload
  // ===============================================================
  const reloadList = () => {
    // 讓 SampleList 重新掛載（常用於新增/編輯成功後回來刷新）
    setListKey((prev) => prev + 1)
    setFormModalOpen(false)
    setEditingSample(null)
  }

  // ===============================================================
  // Navigation - Create / Edit
  // ===============================================================

  /**
   * 新增：導向 /sample/v1/create（Create mode）
   */
  const openCreate = () => {
    // 方式一：開啟 Modal 彈窗
    setEditingSample(null)
    setFormModalOpen(true)

    // 方式二：直接跳轉頁面（如果需要）
    // navigate('/sample/v1/create')
  }

  /**
   * 編輯：開啟 Modal 快速簡易編輯
   */
  const openEdit = (sample: Sample) => {
    setEditingSample(sample)
    setFormModalOpen(true)
  }

  // ===============================================================
  // Render
  // ===============================================================
  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='Sample 列表'
        breadcrumbs={[
          { label: 'Sample 管理', href: '#' },
          { label: 'Sample', active: true },
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
                  placeholder='請輸入關鍵字'
                  value={tempKeyword}
                  onChange={(e) => setTempKeyword(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
            </div>

            <div className='card-toolbar'>
              <div className='d-flex justify-content-end' data-kt-sample-table-toolbar='base'>
                <button
                  type='button'
                  className='btn btn-primary'
                  onClick={openCreate}
                >
                  <KTIcon iconName='plus' className='fs-2' />
                  新增 Sample
                </button>
              </div>
            </div>
          </div>

          {/* Body：清單 */}
          <div className='card-body py-4'>
            <SampleList
              key={listKey}
              searchKeyword={searchKeyword}
              showAlert={showAlert}
              // 把 openEdit 傳給 List，用來打開 FormModal（編輯模式）
              onEdit={openEdit}
              // 你如果有 onReload / onDeleted 之類，可以呼叫 reloadList()
            />
          </div>
        </div>
      </div>

      {/* 共用 Create + Edit Modal */}
      <FormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false)
          setEditingSample(null)
        }}
        showAlert={showAlert}
        editingSample={editingSample}
        onSaved={reloadList}
      />
    </Content>
  )
}
