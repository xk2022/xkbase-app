// src/app/pages/upms/user/Overview.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Content } from '@/_metronic/layout/components/content'
import { KTIcon } from '@/_metronic/helpers'

import { useAlert } from '@/app/pages/common/AlertType'
import { PageQuery } from '@/app/pages/model/PageQuery'
import { AppToolbar } from '@/app/pages/common/AppToolbar'

import UserList from './List'
import { UsersListFilter } from './UsersListFilter'
import { User } from '../Model'

import { fetchRoles } from '../../role/Query'
import { Role } from '../../role/Model'

// 如果你要完全改成「開頁面」：FormModal / editingUser / formModalOpen 之後可以移除
import { FormModal } from './FormModal'

/**
 * ===============================================================
 * Overview（使用者清單頁）
 * - 負責：查詢、列表、導向新增/編輯頁
 * - 不負責：新增/編輯表單（交給 /upms/user/create）
 * ===============================================================
 */
export function ListPage() {

  // ===============================================================
  // Alerts（統一錯誤/提示）
  // ===============================================================
  const {alert, showAlert, Alert} = useAlert()

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

  // ===============================================================
  // Supporting Data（roles for filter / display）
  // ===============================================================
  const [roles, setRoles] = useState<Role[]>([])

  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

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
    // 讓 UserList 重新掛載（常用於新增/編輯成功後回來刷新）
    setListKey((prev) => prev + 1)
    setFormModalOpen(false)
    setEditingUser(null)
  }

  // ===============================================================
  // Navigation - Create / Edit
  // ===============================================================

  /**
   * 新增：導向 /upms/user/create（Create mode）
   */
  const openCreate = () => {
    // 方式一：開啟 Model 彈窗
    // setEditingUser(null)
    // setFormModalOpen(true)

    // 方式二：直接跳轉頁面
    navigate('/upms/user/create')
  }

  /**
   * 編輯：開啟 Model 快速簡易編輯
   */
  const openEdit = (user: User) => {
    setEditingUser(user)
    setFormModalOpen(true)
  }

  // ===============================================================
  // Data Loaders
  // ===============================================================

  // ===============================================================
  // Effects（init） with Data Loaders
  // ===============================================================

  useEffect(() => {
    const loadRoles = async () => {
      const query: PageQuery = {
        page: 0,
        size: 100,
        keyword: undefined,
      }

      const data = await fetchRoles(query, showAlert)
      setRoles(Array.isArray(data) ? data : [])
    }

    loadRoles()
  }, [showAlert]) // 👈 空依賴，只跑一次

  // ===============================================================
  // Render
  // ===============================================================
  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='使用者列表'
        breadcrumbs={[
          { label: '權限管理', href: '#'},
          { label: '使用者', active: true },
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
                  placeholder='搜尋使用者...'
                  value={tempKeyword}
                  onChange={(e) => setTempKeyword(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
            </div>

            <div className='card-toolbar'>
              <div className='d-flex justify-content-end gap-2' data-kt-user-table-toolbar='base'>
                <UsersListFilter />

                <button
                  type='button'
                  className='btn btn-primary'
                  onClick={openCreate}
                >
                  <KTIcon iconName='plus' className='fs-2' />
                  新增使用者
                </button>
              </div>
            </div>
          </div>

          {/* Body：清單 */}
          <div className='card-body py-4'>
            <UserList
              key={listKey}
              searchKeyword={searchKeyword}
              showAlert={showAlert}
              roles={roles}
              // 把 openEdit 傳給 List，用來打開 FormModal（編輯模式）
              onEdit={openEdit}
              // 你如果有 onReload / onDeleted 之類，可以呼叫 reloadList()
            />
          </div>
        </div>
      </div>

      {/* 共用 Edit Modal 簡易編輯 */}
      <FormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false)
          setEditingUser(null)
        }}
        showAlert={showAlert}
        roles={roles}
        editingUser={editingUser}
        onSaved={reloadList}
      />
    </Content>
  )
}
