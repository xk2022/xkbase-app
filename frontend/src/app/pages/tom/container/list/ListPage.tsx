// src/app/pages/tom/container/list/ListPage.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Content } from '@/_metronic/layout/components/content'
import { KTIcon } from '@/_metronic/helpers'

import { useAlert } from '@/app/pages/common/AlertType'
import { AppToolbar } from '@/app/pages/common/AppToolbar'

import { Container } from '../Model'
import ContainerList from './List'

/**
 * ===============================================================
 * ListPage（系統列表頁）
 * - 負責：Toolbar / Breadcrumbs、搜尋條件（keyword）、導向新增頁、刷新列表（listKey）
 * - 不負責：列表 API / 分頁 / 刪除（交給 <SystemList />）
 * ===============================================================
 */
export function ListPage() {
  const { alert, showAlert, Alert } = useAlert()
  const navigate = useNavigate()

  const [searchKeyword, setSearchKeyword] = useState('')
  const [tempKeyword, setTempKeyword] = useState('')
  const [listKey, setListKey] = useState(0)

  /** Enter 搜尋 */
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchKeyword(tempKeyword.trim())
    }
  }

  /** 重新掛載列表（常用於新增 / 編輯後） */
  const reloadList = () => {
    setListKey((prev) => prev + 1)
  }

  /** 新增系統 → 導向 Create Page */
  const openCreate = () => {
    navigate('/tom/container/create')
  }

  /** 編輯（v2 之後可開 modal 或 detail） */
  const openEdit = (container: Container) => {
    navigate(`/tom/container/${container.id}/detail`)
  }

  useEffect(() => {
    // v1 不做任何 side effect，保留結構一致性
  }, [])

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='貨櫃列表'
        breadcrumbs={[
          { label: '管理', href: '#' },
          { label: '貨櫃資料', active: true },
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
                  placeholder='代碼 / 名稱…'
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
                  新增貨櫃
                </button>
              </div>
            </div>
          </div>

          {/* Body：清單（API / 分頁 / 刪除都在 List.tsx） */}
          <div className='card-body py-4'>
            <ContainerList
              key={listKey}
              searchKeyword={searchKeyword}
              showAlert={showAlert}
              onEdit={openEdit}
            />
          </div>
        </div>
      </div>
    </Content>
  )
}
