// src/app/pages/port/list/ListPage.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Content } from '@/_metronic/layout/components/content'
import { KTIcon } from '@/_metronic/helpers'

import { useAlert } from '@/app/pages/common/AlertType'
import { AppToolbar } from '@/app/pages/common/AppToolbar'

import { PortListItem } from '../Model'
import PortList from './List'

/**
 * ===============================================================
 * ListPage（港口列表頁）
 * - 負責：Toolbar、查詢條件、導向新增頁、刷新列表
 * - 不負責：列表內 API / 分頁 / 刪除（交給 <PortList />）
 * ===============================================================
 */
export function ListPage() {
  const { alert, showAlert, Alert } = useAlert()

  const navigate = useNavigate()

  const [searchKeyword, setSearchKeyword] = useState('')
  const [tempKeyword, setTempKeyword] = useState('')
  const [listKey, setListKey] = useState(0)

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchKeyword(tempKeyword.trim())
    }
  }

  const reloadList = () => {
    // 讓 PortList 重新掛載（常用於新增/編輯成功後回來刷新）
    setListKey((prev) => prev + 1)
  }

  /**
   * 新增：導向 /port/create（Create mode）
   */
  const openCreate = () => {
    navigate('/port/create')
  }

  /**
   * 編輯：導向編輯頁面
   */
  const openEdit = (port: PortListItem) => {
    navigate(`/port/${port.id}/edit`)
  }
  
  useEffect(() => {

  }, [showAlert]) // 👈 空依賴，只跑一次

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='港口列表'
        breadcrumbs={[
          { label: '港口整合', href: '#'},
          { label: '港口列表', active: true },
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
                  placeholder='港口代碼 / 名稱 / 地址…'
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
                  建立港口
                </button>
              </div>
            </div>
          </div>

          {/* Body：清單（API/分頁/刪除都在 List.tsx） */}
          <div className='card-body py-4'>
            <PortList
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
