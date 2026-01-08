// PermissionList.tsx
import React from 'react'
import {KTIcon} from '@/_metronic/helpers'

import type {Permission} from '../../permission/Model'

type Props = {
  groupedPermissions: Record<string, Permission[]>
  selectedPermissions: Set<string>
  stats: {
    total: number
    selected: number
    bySystem: Record<string, {total: number; selected: number}>
  }
  onToggle: (permissionCode: string) => void
  onToggleAll: (permissionCodes: string[]) => void
}

export const PermissionList: React.FC<Props> = ({
  groupedPermissions,
  selectedPermissions,
  stats,
  onToggle,
  onToggleAll,
}) => {
  const systemCodes = Object.keys(groupedPermissions).sort()

  return (
    <div className='card mb-5'>
      <div className='card-header border-0 pt-6'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>權限列表</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            勾選要授予此角色的權限
          </span>
        </h3>
      </div>

      <div className='card-body pt-0'>
        {systemCodes.length === 0 ? (
          <div className='text-center py-10 text-muted'>
            <KTIcon iconName='lock' className='fs-2x text-muted mb-3' />
            <p className='mb-0'>目前沒有可用的權限</p>
          </div>
        ) : (
          <div className='accordion accordion-icon-toggle' id='permissionAccordion'>
            {systemCodes.map((systemCode, idx) => {
              const permissions = groupedPermissions[systemCode]
              const systemStats = stats.bySystem[systemCode]
              const allSelected = systemStats.selected === systemStats.total && systemStats.total > 0
              const someSelected = systemStats.selected > 0 && systemStats.selected < systemStats.total

              return (
                <div key={systemCode} className='accordion-item mb-3'>
                  <h2 className='accordion-header' id={`heading-${idx}`}>
                    <button
                      className={`accordion-button ${idx === 0 ? '' : 'collapsed'}`}
                      type='button'
                      data-bs-toggle='collapse'
                      data-bs-target={`#collapse-${idx}`}
                      aria-expanded={idx === 0 ? 'true' : 'false'}
                      aria-controls={`collapse-${idx}`}
                    >
                      <div className='d-flex align-items-center justify-content-between w-100 me-3'>
                        <div className='d-flex align-items-center gap-3'>
                          <KTIcon iconName='element-11' className='fs-2 text-primary' />
                          <span className='fw-bold fs-5'>{systemCode}</span>
                        </div>
                        <div className='d-flex align-items-center gap-3'>
                          <span className='text-muted fs-7'>
                            已選 {systemStats.selected} / {systemStats.total}
                          </span>
                          <div className='form-check form-switch'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              checked={allSelected}
                              ref={(input) => {
                                if (input) {
                                  input.indeterminate = someSelected
                                }
                              }}
                              onChange={(e) => {
                                e.stopPropagation()
                                onToggleAll(permissions.map((p) => p.code))
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  </h2>
                  <div
                    id={`collapse-${idx}`}
                    className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`}
                    aria-labelledby={`heading-${idx}`}
                    data-bs-parent='#permissionAccordion'
                  >
                    <div className='accordion-body pt-0'>
                      <div className='table-responsive'>
                        <table className='table table-row-dashed table-row-gray-300 align-middle gs-0'>
                          <thead>
                            <tr className='fw-bold text-muted'>
                              <th className='min-w-50px w-50px'>
                                <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                  <input
                                    className='form-check-input'
                                    type='checkbox'
                                    checked={allSelected}
                                    onChange={() =>
                                      onToggleAll(permissions.map((p) => p.code))
                                    }
                                  />
                                </div>
                              </th>
                              <th className='min-w-200px'>權限代碼</th>
                              <th className='min-w-200px'>權限名稱</th>
                              <th className='min-w-150px'>資源</th>
                              <th className='min-w-150px'>操作</th>
                              <th className='min-w-100px'>狀態</th>
                            </tr>
                          </thead>
                          <tbody>
                            {permissions.map((permission) => {
                              const isSelected = selectedPermissions.has(permission.code)
                              return (
                                <tr
                                  key={permission.code}
                                  className={isSelected ? 'table-active' : ''}
                                >
                                  <td>
                                    <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                      <input
                                        className='form-check-input'
                                        type='checkbox'
                                        checked={isSelected}
                                        onChange={() => onToggle(permission.code)}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <span className='badge badge-light-info fs-7 fw-bold'>
                                      {permission.code}
                                    </span>
                                  </td>
                                  <td>
                                    <span className='text-gray-800 fw-bold'>
                                      {permission.name}
                                    </span>
                                    {permission.description && (
                                      <div className='text-muted fs-7'>
                                        {permission.description}
                                      </div>
                                    )}
                                  </td>
                                  <td>
                                    <span className='text-gray-700'>
                                      {permission.resourceCode || '-'}
                                    </span>
                                  </td>
                                  <td>
                                    <span className='text-gray-700'>
                                      {permission.actionCode || '-'}
                                    </span>
                                  </td>
                                  <td>
                                    {permission.enabled ? (
                                      <span className='badge badge-light-success fs-7'>
                                        啟用
                                      </span>
                                    ) : (
                                      <span className='badge badge-light-secondary fs-7'>
                                        停用
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
