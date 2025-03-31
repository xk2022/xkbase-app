import { SidebarMenuMain } from './SidebarMenuMain';
import Select from 'react-select';
import { useMemo, useState, useEffect } from 'react';
import { useSystem } from '../../../../../app/pages/common/SystemContext';

const SidebarMenu = () => {
  const { systems } = useSystem();
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  // 使用 useMemo 來避免每次渲染時都重新創建 options
  const options = useMemo(() => {
    return systems.map((system) => ({
      value: system.uuid, 
      label: system.name,
    }));
  }, [systems]);

  // 設置預設選中的系統為第一個系統
  useEffect(() => {
    if (systems.length > 0) {
      setSelectedSystem(systems[0].uuid);
    }
  }, [systems]);

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
        <div className='app-sidebar-logo px-6' id='kt_app_sidebar_logo'>
          <div className='mb-10'>
            <label className='form-label'>Select an Option</label>
            <Select
              className='react-select-styled' 
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
              value={options.find(option => option.value === selectedSystem)}
              onChange={(selectedOption) => setSelectedSystem(selectedOption?.value || null)}
              placeholder='Choose...'
            />

          </div>
        </div>

        <div className='menu menu-column menu-rounded menu-sub-indention px-3' data-kt-menu='true'>
          <SidebarMenuMain />
        </div>
      </div>
    </div>
  )
}

export { SidebarMenu }
