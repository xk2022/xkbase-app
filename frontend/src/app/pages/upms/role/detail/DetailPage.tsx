// src/app/pages/upms/role/detail/DetailPage.tsx
import React, {useCallback, useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {Spinner} from 'react-bootstrap'

import {Content} from '@/_metronic/layout/components/content'
import {KTIcon} from '@/_metronic/helpers'
import {useAlert} from '@/app/pages/common/AlertType'
import {AppToolbar} from '@/app/pages/common/AppToolbar'
import {ConfirmDeleteModal} from '@/app/pages/common/ConfirmDeleteModal'

import {Role} from '../Model'
import {fetchRoleDetail, deleteRole} from '../Query'
import {roleBreadCrumbs} from '../index'

// Cards
import {RoleBasicInfoCard} from './cards/RoleBasicInfoCard'
import {RolePermissionsCard} from './cards/RolePermissionsCard'
import {RoleUsersCard} from './cards/RoleUsersCard'

export const DetailPage: React.FC = () => {
  const {id} = useParams<{id: string}>()
  const navigate = useNavigate()
  const {alert, showAlert, Alert} = useAlert()

  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<Role | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null)
  const [deleting, setDeleting] = useState(false)

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
    navigate('/upms/role/list', {state: {editRoleId: detail.id}})
  }

  const handleDelete = () => {
    if (!detail) return
    setDeleteTarget(detail)
  }

  const handlePermissions = () => {
    if (!detail) return
    navigate(`/upms/role/${detail.id}/permissions`)
  }

  const confirmDelete = async () => {
    if (!deleteTarget || !id) return
    setDeleting(true)
    try {
      const ok = await deleteRole(id, showAlert)
      if (ok) {
        navigate('/upms/role/list')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
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
          {label: '權限管理', href: '#', active: false},
          {label: '角色管理', active: false},
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
          <>
            {/* 角色資訊卡片 */}
            <div className='card mb-5 mb-xl-10'>
              <div className='card-body pt-9 pb-0'>
                <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
                  <div className='flex-grow-1'>
                    <div className='d-flex flex-wrap align-items-center'>
                      <div className='d-flex flex-column flex-grow-1 my-1 my-lg-0'>
                        <div className='d-flex align-items-center mb-2'>
                          <span className='text-gray-800 fs-2hx fw-bold me-2'>
                            {detail.name}
                          </span>
                          {detail.enabled ? (
                            <span className='badge badge-light-success fs-6 fw-bold px-3 py-2'>
                              啟用
                            </span>
                          ) : (
                            <span className='badge badge-light-secondary fs-6 fw-bold px-3 py-2'>
                              停用
                            </span>
                          )}
                        </div>
                        <div className='d-flex flex-wrap align-items-center mb-2'>
                          <span className='badge badge-light-info fs-7 fw-bold me-2 px-3 py-2'>
                            {detail.code}
                          </span>
                          <span className='badge badge-light-primary fs-7 fw-bold px-3 py-2'>
                            {detail.permissionCount ?? detail.permissionCodes?.length ?? 0} 個權限
                          </span>
                        </div>
                        {detail.description && (
                          <div className='text-gray-600 fw-semibold fs-6 mt-2'>
                            {detail.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 詳細資訊卡片 */}
            <div className='row g-6 g-xl-9'>
              {/* 基本資訊 */}
              <div className='col-xl-6'>
                <RoleBasicInfoCard detail={detail} />
              </div>

              {/* 權限列表 */}
              <div className='col-xl-6'>
                <RolePermissionsCard detail={detail} />
              </div>

              {/* 使用者列表 */}
              <div className='col-xl-12'>
                <RoleUsersCard roleId={detail.id} showAlert={showAlert} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* 刪除確認對話框 */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        title='刪除角色'
        message={
          deleteTarget ? (
            <>
              <p>確定要刪除角色「<strong>{deleteTarget.name} ({deleteTarget.code})</strong>」嗎？</p>
              <p className='text-danger mb-0'>此操作無法復原。</p>
            </>
          ) : (
            ''
          )
        }
        deleting={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </Content>
  )
}

export default DetailPage
