// src/app/pages/upms/role/permissions/PermissionPage.tsx
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {Spinner} from 'react-bootstrap'

import {Content} from '@/_metronic/layout/components/content'
import {KTIcon} from '@/_metronic/helpers'
import {useAlert} from '@/app/pages/common/AlertType'
import {AppToolbar} from '@/app/pages/common/AppToolbar'

import {Role} from '../Model'
import {fetchRoleDetail, updateRole} from '../Query'
import {Permission} from '../../permission/Model'
import {fetchPermissions} from '../../permission/Query'
import {PermissionList} from './PermissionList'

/**
 * ===============================================================
 * Role Permission Page（角色權限設定頁面）
 * ---------------------------------------------------------------
 * 職責：
 * - 顯示角色基本資訊
 * - 顯示所有可用權限列表（分系統分組）
 * - 允許勾選/取消勾選權限
 * - 保存權限設定
 * ===============================================================
 */
export const PermissionPage: React.FC = () => {
  const {id} = useParams<{id: string}>()
  const navigate = useNavigate()
  const {alert, showAlert, Alert} = useAlert()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [role, setRole] = useState<Role | null>(null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedPermissionCodes, setSelectedPermissionCodes] = useState<string[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedSystemCode, setSelectedSystemCode] = useState<string>('')

  // 載入角色資訊
  const loadRole = useCallback(async () => {
    if (!id) return
    try {
      const data = await fetchRoleDetail(id, showAlert)
      if (data) {
        setRole(data)
        setSelectedPermissionCodes(data.permissionCodes ?? [])
      }
    } catch (e) {
      console.error(e)
      showAlert('取得角色資訊失敗', 'danger')
    }
  }, [id, showAlert])

  // 載入權限列表
  const loadPermissions = useCallback(async () => {
    try {
      const query = {
        page: 0,
        size: 1000, // 取得所有權限
        keyword: searchKeyword.trim() || undefined,
        systemCode: selectedSystemCode || undefined,
        enabled: true, // 只顯示啟用的權限
      }
      const data = await fetchPermissions(query, showAlert)
      setPermissions(data.content || [])
    } catch (e) {
      console.error(e)
      showAlert('取得權限列表失敗', 'danger')
    }
  }, [searchKeyword, selectedSystemCode, showAlert])

  // 初始化載入
  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await Promise.all([loadRole(), loadPermissions()])
      setLoading(false)
    }
    init()
  }, [loadRole, loadPermissions])

  // 權限分組（依 systemCode）
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {}
    permissions.forEach((perm) => {
      const systemCode = perm.systemCode || 'OTHER'
      if (!groups[systemCode]) {
        groups[systemCode] = []
      }
      groups[systemCode].push(perm)
    })
    return groups
  }, [permissions])

  // 系統代碼列表
  const systemCodes = useMemo(() => {
    const codes = new Set<string>()
    permissions.forEach((perm) => {
      if (perm.systemCode) {
        codes.add(perm.systemCode)
      }
    })
    return Array.from(codes).sort()
  }, [permissions])

  // 切換權限選擇
  const togglePermission = (code: string) => {
    setSelectedPermissionCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    )
  }

  // 全選/取消全選（指定權限列表）
  const toggleAllPermissions = (permissionCodes: string[]) => {
    const allSelected = permissionCodes.every((code) => selectedPermissionCodes.includes(code))

    if (allSelected) {
      // 取消全選
      setSelectedPermissionCodes((prev) => prev.filter((code) => !permissionCodes.includes(code)))
    } else {
      // 全選
      setSelectedPermissionCodes((prev) => {
        const newCodes = [...prev]
        permissionCodes.forEach((code) => {
          if (!newCodes.includes(code)) {
            newCodes.push(code)
          }
        })
        return newCodes
      })
    }
  }

  // 全選/取消全選（指定系統）
  const toggleAllInSystem = (systemCode: string) => {
    const systemPerms = groupedPermissions[systemCode] || []
    const systemCodes = systemPerms.map((p) => p.code)
    toggleAllPermissions(systemCodes)
  }

  // 計算統計資訊
  const permissionStats = useMemo(() => {
    const stats = {
      total: permissions.length,
      selected: selectedPermissionCodes.length,
      bySystem: {} as Record<string, {total: number; selected: number}>,
    }

    Object.entries(groupedPermissions).forEach(([systemCode, systemPerms]) => {
      const selected = systemPerms.filter((p) => selectedPermissionCodes.includes(p.code)).length
      stats.bySystem[systemCode] = {
        total: systemPerms.length,
        selected,
      }
    })

    return stats
  }, [permissions, selectedPermissionCodes, groupedPermissions])

  // 保存權限設定
  const handleSave = async () => {
    if (!id || !role) return

    const confirmed = window.confirm('確定要更新角色的權限設定嗎？')
    if (!confirmed) return

    setSaving(true)
    try {
      const ok = await updateRole(
        id,
        {
          permissionCodes: selectedPermissionCodes,
        },
        showAlert
      )
      if (ok) {
        // 重新載入角色資訊
        await loadRole()
        showAlert('權限設定已更新', 'success')
      }
    } catch (e) {
      console.error(e)
      showAlert('更新權限設定失敗', 'danger')
    } finally {
      setSaving(false)
    }
  }

  // 取消（返回詳情頁）
  const handleCancel = () => {
    navigate(`/upms/role/${id}/detail`)
  }

  if (loading) {
    return (
      <Content>
        <AppToolbar
          title='角色權限設定'
          breadcrumbs={[
            {label: '權限管理', href: '#', active: false},
            {label: '角色', active: false},
            {label: '權限設定', active: true},
          ]}
        />
        <div className='d-flex justify-content-center py-10'>
          <Spinner animation='border' />
        </div>
      </Content>
    )
  }

  if (!role) {
    return (
      <Content>
        <AppToolbar
          title='角色權限設定'
          breadcrumbs={[
            {label: '權限管理', href: '#', active: false},
            {label: '角色', active: false},
            {label: '權限設定', active: true},
          ]}
        />
        <div className='text-center py-10 text-muted'>查無角色資料</div>
      </Content>
    )
  }

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='角色權限設定'
        breadcrumbs={[
          {label: '權限管理', href: '#', active: false},
          {label: '角色', active: false},
          {label: role.name, href: `/upms/role/${id}/detail`, active: false},
          {label: '權限設定', active: true},
        ]}
      />

      <div className='app-container container-fluid'>
        <div className='row g-6'>
          {/* 左側：角色資訊 */}
          <div className='col-12 col-lg-4'>
            <div className='card'>
              <div className='card-header border-0 pt-6'>
                <h3 className='card-title align-items-start flex-column'>
                  <span className='card-label fw-bold fs-3 mb-1'>角色資訊</span>
                </h3>
              </div>
              <div className='card-body pt-0'>
                <table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-3'>
                  <tbody>
                    <tr>
                      <td className='text-muted w-100px'>角色代碼</td>
                      <td className='fw-semibold'>{role.code}</td>
                    </tr>
                    <tr>
                      <td className='text-muted'>角色名稱</td>
                      <td className='fw-semibold'>{role.name}</td>
                    </tr>
                    <tr>
                      <td className='text-muted'>描述</td>
                      <td className='fw-semibold'>{role.description || '-'}</td>
                    </tr>
                    <tr>
                      <td className='text-muted'>狀態</td>
                      <td>
                        {role.enabled ? (
                          <span className='badge badge-light-success'>啟用</span>
                        ) : (
                          <span className='badge badge-light-secondary'>停用</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className='text-muted'>已選權限</td>
                      <td>
                        <span className='badge badge-light-primary fs-6 fw-bold'>
                          {selectedPermissionCodes.length} 個
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 右側：權限列表 */}
          <div className='col-12 col-lg-8'>
            <div className='card mb-5'>
              <div className='card-header border-0 pt-6'>
                <h3 className='card-title align-items-start flex-column'>
                  <span className='card-label fw-bold fs-3 mb-1'>權限列表</span>
                  <span className='text-muted mt-1 fw-semibold fs-7'>
                    勾選要賦予此角色的權限（已選 {permissionStats.selected} / {permissionStats.total}）
                  </span>
                </h3>
                <div className='card-toolbar'>
                  <div className='d-flex gap-2'>
                    <input
                      type='text'
                      className='form-control form-control-solid w-200px'
                      placeholder='搜尋權限...'
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          loadPermissions()
                        }
                      }}
                    />
                    {systemCodes.length > 0 && (
                      <select
                        className='form-select form-select-solid w-150px'
                        value={selectedSystemCode}
                        onChange={(e) => setSelectedSystemCode(e.target.value)}
                      >
                        <option value=''>所有系統</option>
                        {systemCodes.map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              <div className='card-body pt-0'>
                <PermissionList
                  groupedPermissions={groupedPermissions}
                  selectedPermissions={new Set(selectedPermissionCodes)}
                  stats={permissionStats}
                  onToggle={togglePermission}
                  onToggleAll={toggleAllPermissions}
                />
              </div>

              <div className='card-footer border-0 pt-6'>
                <div className='d-flex justify-content-end gap-3'>
                  <button
                    type='button'
                    className='btn btn-light'
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    取消
                  </button>
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className='spinner-border spinner-border-sm me-2' />
                        儲存中...
                      </>
                    ) : (
                      <>
                        <KTIcon iconName='check' className='fs-2 me-2' />
                        儲存權限設定
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Content>
  )
}

export default PermissionPage
