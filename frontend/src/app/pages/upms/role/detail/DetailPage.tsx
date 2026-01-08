// src/app/pages/upms/role/detail/DetailPage.tsx
import React, {useCallback, useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {Spinner} from 'react-bootstrap'

import {Content} from '@/_metronic/layout/components/content'
import {useAlert} from '@/app/pages/common/AlertType'
import {AppToolbar} from '@/app/pages/common/AppToolbar'

import {Role} from '../Model'
import {fetchRoleDetail, deleteRole} from '../Query'

// Cards
import {RoleBasicInfoCard} from './cards/RoleBasicInfoCard'
import {RolePermissionsCard} from './cards/RolePermissionsCard'

export const DetailPage: React.FC = () => {
  const {id} = useParams<{id: string}>()
  const navigate = useNavigate()
  const {alert, showAlert, Alert} = useAlert()

  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<Role | null>(null)

  const loadDetail = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await fetchRoleDetail(id, showAlert)
      setDetail(data)
    } catch (e) {
      console.error(e)
      showAlert('取得角色詳情失敗', 'danger')
      setDetail(null)
    } finally {
      setLoading(false)
    }
  }, [id, showAlert])

  useEffect(() => {
    loadDetail()
  }, [loadDetail])

  const handleEdit = () => {
    if (!detail) return
    // 導向列表頁，由列表頁的 FormModal 處理編輯
    // 可以通過 query params 或其他方式傳遞編輯狀態
    navigate('/upms/role/list', {state: {editRoleId: detail.id}})
  }

  const handleDelete = async () => {
    if (!detail || !id) return
    const confirmed = window.confirm(
      `確定要刪除角色「${detail.name} (${detail.code})」嗎？\n\n此操作無法復原。`
    )
    if (confirmed) {
      try {
        const ok = await deleteRole(id, showAlert)
        if (ok) {
          navigate('/upms/role/list')
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  return (
    <Content>
      {/* Alert */}
      {alert && <Alert message={alert.message} type={alert.type} />}

      {/* Toolbar */}
      <AppToolbar
        title='角色詳情'
        breadcrumbs={[
          {label: '權限管理', href: '#'},
          {label: '角色', active: false},
          {label: '詳情', active: true},
        ]}
      />

      <div className='app-container container-fluid'>
        {loading ? (
          <div className='d-flex justify-content-center py-10'>
            <Spinner animation='border' />
          </div>
        ) : !detail ? (
          <div className='text-center py-10 text-muted'>查無角色資料</div>
        ) : (
          <div className='row g-6'>
            {/* 1) 基本資訊：code, name, description, enabled */}
            <div className='col-12 col-lg-6'>
              <RoleBasicInfoCard 
                detail={detail} 
                reload={loadDetail} 
                showAlert={showAlert}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

            {/* 2) 權限列表：顯示此角色的所有權限 */}
            <div className='col-12 col-lg-6'>
              <RolePermissionsCard 
                detail={detail} 
                showAlert={showAlert}
              />
            </div>
          </div>
        )}
      </div>
    </Content>
  )
}

export default DetailPage
