import { SidebarMenuMain } from './SidebarMenuMain'
import Select from 'react-select'
import { useMemo } from 'react'

const sidebarOptions = [
  { value: 'system 1', label: 'System 1' },
  { value: 'system 2', label: 'System 2' },
  { value: 'system 3', label: 'System 3' },
  { value: 'system 4', label: 'System 4' },
  { value: 'system 5', label: 'System 5' },
]

const SidebarMenu = () => {
  // useMemo 避免每次渲染都重新创建数组
  const options = useMemo(() => sidebarOptions, [])

  return (
    <div className='app-sidebar-menu overflow-hidden flex-column-fluid'>
      <div
        id='kt_app_sidebar_menu_wrapper'
        className='app-sidebar-wrapper hover-scroll-overlay-y my-5'
        data-kt-scroll='true'
        data-kt-scroll-height='auto'
        data-kt-scroll-dependencies='#kt_app_sidebar_logo, #kt_app_sidebar_footer'
        data-kt-scroll-offset='5px'
        data-kt-scroll-save-state='true'
      >
        {/* Sidebar Logo + Select Dropdown */}
        <div className='app-sidebar-logo px-6' id='kt_app_sidebar_logo'>
          <div className='mb-10'>
            <label className='form-label'>Select an Option</label>
            <Select
              className='react-select-styled react-select-solid'
              classNamePrefix='react-select'
              styles={{
                container: (base) => ({
                  ...base,
                  width: '100%',
                  minWidth: 200, // 最小宽度 200px，防止太窄
                  maxWidth: '100%', // 最大宽度自适应
                }),
                menu: (base) => ({
                  ...base,
                  width: '100%', // 让菜单宽度跟着 Select 组件大小走
                  minWidth: 200, // 避免菜单变太小
                }),
                control: (base) => ({
                  ...base,
                  minWidth: '150px', // 小屏幕适配，防止变得太窄
                  maxWidth: '100%', // 最大宽度保持自适应
                }),
              }}
              options={options}
              placeholder='Choose...'
            />

          </div>
        </div>

        {/* Sidebar Menu */}
        <div className='menu menu-column menu-rounded menu-sub-indention px-3' data-kt-menu='true'>
          <SidebarMenuMain />
        </div>
      </div>
    </div>
  )
}

export { SidebarMenu }
