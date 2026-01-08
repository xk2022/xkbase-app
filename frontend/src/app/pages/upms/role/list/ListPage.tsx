
// src/app/pages/upms/role/Overview.tsx
import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {Content} from '@/_metronic/layout/components/content'
import {KTIcon} from '@/_metronic/helpers'

import {useAlert} from '@/app/pages/common/AlertType'
import { AppToolbar } from '@/app/pages/common/AppToolbar'

import {Role} from '../Model'
import RoleList from './List'
import { FormModal } from './FormModal'

// 如果你要完全改成「開頁面」：FormModal / editingUser / formModalOpen 之後可以移除

/**
 * ===============================================================
 * ListPage（系統列表頁）
 * - 負責：Toolbar、搜尋條件（keyword）、導向新增頁、刷新列表
 * - 不負責：列表 API / 分頁 / 刪除（交給 <SystemList />）
 * ===============================================================
 */
export function ListPage() {

  const { alert, showAlert, Alert } = useAlert()

  const navigate = useNavigate()

  const [searchKeyword, setSearchKeyword] = useState('')
  const [tempKeyword, setTempKeyword] = useState('')
  const [listKey, setListKey] = useState(0)

  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchKeyword(tempKeyword.trim())
    }
  }

  const reloadList = () => {
    // 讓 UserList 重新掛載（常用於新增/編輯成功後回來刷新）
    setListKey((prev) => prev + 1)
    setFormModalOpen(false)
    setEditingRole(null)
  }

  /**
   * 新增：導向 /upms/role/create（Create mode）
   */
  const openCreate = () => {
    navigate('/upms/role/create')
  }

  /**
   * 編輯：開啟 Model 快速簡易編輯
   */
  const openEdit = (role: Role) => {
    setEditingRole(role)
    setFormModalOpen(true)
  }

  useEffect(() => {
    // v1 不做任何 side effect，保留結構一致性
  }, [])

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='角色列表'
        breadcrumbs={[
          { label: '權限管理', href: '#'},
          { label: '角色', active: true },
        ]}
      />

      <div className='flex-column-fluid'>
        <div className="card">
          {/* Header：搜尋 + 新增 */}
          <div className="card-header border-0 pt-6">
            <div className="card-title">
              <div className="d-flex align-items-center position-relative my-1">
                <KTIcon iconName="magnifier" className="fs-1 position-absolute ms-6" />
                <input
                  type="text"
                  className="form-control form-control-solid w-250px ps-14"
                  placeholder="搜尋角色..."
                  value={tempKeyword}
                  onChange={(e) => setTempKeyword(e.target.value)} // 更新 tempKeyword
                  onKeyDown={handleSearchKeyDown} // 捕獲 Enter 鍵
                />
              </div>
            </div>

            <div className="card-toolbar">
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={openCreate}
              >
                <KTIcon iconName="plus" className="fs-2" />
                新增角色
              </button>
            </div>
          </div>

          {/* Body：清單 */}
          <div className="card-body py-4">
            <RoleList 
              key={listKey} 
              searchKeyword={searchKeyword} 
              showAlert={showAlert} 
              // 把 openEdit 傳給 List，用來打開 FormModal（編輯模式）
              onEdit={openEdit}
            />
          </div>
        </div>
      </div>

      {/* 共用 Create + Edit Modal */}
      <FormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false)
          setEditingRole(null)
        }}
        showAlert={showAlert}
        editingRole={editingRole}
        onSaved={reloadList}
      />
    </Content>
  );
}
