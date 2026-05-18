// src/app/pages/upms/role/list/RolesListFilter.tsx
import React, {useState, useEffect} from 'react'
import {MenuComponent} from '@/_metronic/assets/ts/components'
import {KTIcon} from '@/_metronic/helpers'

export interface RoleFilterState {
  status?: 'enabled' | 'disabled' | ''
  permissionRange?: '0' | '1-5' | '6-10' | '11-20' | '21+' | ''
}

export interface RolesListFilterProps {
  /** 是否載入中 */
  isLoading?: boolean
  /** 篩選變更回調 */
  onFilterChange?: (filter: RoleFilterState) => void
}

/**
 * 角色列表篩選器元件
 * 提供狀態、權限數量範圍等篩選選項
 */
export const RolesListFilter: React.FC<RolesListFilterProps> = ({
  isLoading = false,
  onFilterChange,
}) => {
  const [status, setStatus] = useState<string>('')
  const [permissionRange, setPermissionRange] = useState<string>('')

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const resetData = () => {
    setStatus('')
    setPermissionRange('')
    const filter: RoleFilterState = {}
    onFilterChange?.(filter)
  }

  const filterData = () => {
    const filter: RoleFilterState = {
      status: status || undefined,
      permissionRange: permissionRange || undefined,
    }
    onFilterChange?.(filter)
  }

  return (
    <>
      {/* begin::Filter Button */}
      <button
        disabled={isLoading}
        type='button'
        className='btn btn-light-primary me-3'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
      >
        <KTIcon iconName='filter' className='fs-2' />
        篩選
      </button>
      {/* end::Filter Button */}

      {/* begin::SubMenu */}
      <div className='menu menu-sub menu-sub-dropdown w-300px w-md-325px' data-kt-menu='true'>
        {/* begin::Header */}
        <div className='px-7 py-5'>
          <div className='fs-5 text-gray-900 fw-bolder'>篩選選項</div>
        </div>
        {/* end::Header */}

        {/* begin::Separator */}
        <div className='separator border-gray-200'></div>
        {/* end::Separator */}

        {/* begin::Content */}
        <div className='px-7 py-5' data-kt-role-table-filter='form'>
          {/* begin::Input group - 狀態篩選 */}
          <div className='mb-10'>
            <label className='form-label fs-6 fw-bold'>狀態:</label>
            <select
              className='form-select form-select-solid fw-bolder'
              data-kt-select2='true'
              data-placeholder='選擇狀態'
              data-allow-clear='true'
              data-kt-role-table-filter='status'
              data-hide-search='true'
              onChange={(e) => setStatus(e.target.value)}
              value={status}
            >
              <option value=''>全部</option>
              <option value='enabled'>啟用</option>
              <option value='disabled'>停用</option>
            </select>
          </div>
          {/* end::Input group */}

          {/* begin::Input group - 權限數量範圍 */}
          <div className='mb-10'>
            <label className='form-label fs-6 fw-bold'>權限數量:</label>
            <select
              className='form-select form-select-solid fw-bolder'
              data-kt-select2='true'
              data-placeholder='選擇範圍'
              data-allow-clear='true'
              data-kt-role-table-filter='permission-range'
              data-hide-search='true'
              onChange={(e) => setPermissionRange(e.target.value)}
              value={permissionRange}
            >
              <option value=''>全部</option>
              <option value='0'>無權限</option>
              <option value='1-5'>1-5 個</option>
              <option value='6-10'>6-10 個</option>
              <option value='11-20'>11-20 個</option>
              <option value='21+'>21 個以上</option>
            </select>
          </div>
          {/* end::Input group */}

          {/* begin::Actions */}
          <div className='d-flex justify-content-end'>
            <button
              type='button'
              disabled={isLoading}
              onClick={resetData}
              className='btn btn-light btn-active-light-primary fw-bold me-2 px-6'
              data-kt-menu-dismiss='true'
              data-kt-role-table-filter='reset'
            >
              重置
            </button>
            <button
              disabled={isLoading}
              type='button'
              onClick={filterData}
              className='btn btn-primary fw-bold px-6'
              data-kt-menu-dismiss='true'
              data-kt-role-table-filter='filter'
            >
              套用
            </button>
          </div>
          {/* end::Actions */}
        </div>
        {/* end::Content */}
      </div>
      {/* end::SubMenu */}
    </>
  )
}
