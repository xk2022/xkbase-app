// src/_metronic/layout/components/sidebar/sidebar-menu/SidebarMenu.tsx
import {SidebarMenuMain} from './SidebarMenuMain'
import Select from 'react-select'
import {useMemo} from 'react'
import {useSystem} from '../../../../../app/pages/common/SystemContext'
import {KTIcon} from '@/_metronic/helpers'
import {useNavigate} from 'react-router-dom'

const SidebarMenu = () => {
  const {systems, selectedSystemUuid, setSelectedSystemUuid, loading} = useSystem()
  const navigate = useNavigate()

  const options = useMemo(() => {
    const systemOptions = systems.map((system) => ({
      value: system.id,
      label: system.code + '｜' + system.name,
    }))
    
    return [
      { value: '', label: 'HOME｜全部系統' },
      ...systemOptions,
    ]
  }, [systems])

  const handleHomeClick = () => {
    setSelectedSystemUuid(null)
    navigate('/dashboard', { replace: true })
  }

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
            {/* 橫向布局：icon 固定寬度，select 佔據剩餘空間 */}
            <div className='d-flex align-items-center flex-nowrap gap-2'>
              {/* Icon 區域 (固定寬度) */}
              <div className='flex-shrink-0'>
                <button
                  type='button'
                  className='btn btn-icon btn-sm'
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                  onClick={handleHomeClick}
                  title='回到首頁'
                >
                  <KTIcon iconName='home' className='fs-2' iconType='duotone' />
                </button>
              </div>

              {/* Select 區域 (固定寬度) */}
              <div className='flex-grow-1' style={{ minWidth: 0, width: '100%', overflow: 'hidden' }}>
                <Select
                  className='react-select-styled'
                  classNamePrefix='react-select'
                  placeholder={loading ? '載入中…' : '請選擇系統'}
                  isLoading={loading}
                  isDisabled={loading || options.length === 0}
                  options={options}
                  value={selectedSystemUuid 
                    ? options.find((o) => o.value === selectedSystemUuid) 
                    : options.find((o) => o.value === '') ?? null}
                  onChange={(opt) => {
                    if (opt && opt.value === '') {
                      setSelectedSystemUuid(null)
                      navigate('/dashboard', { replace: true })
                    } else if (opt) {
                      setSelectedSystemUuid(opt.value)
                      // 根據系統代碼導航到對應的 dashboard
                      const selectedSystem = systems.find(s => s.id === opt.value)
                      if (selectedSystem) {
                        const systemCode = selectedSystem.code?.toUpperCase() || ''
                        const dashboardPath = `/${systemCode.toLowerCase()}/dashboard`
                        navigate(dashboardPath, { replace: true })
                      }
                    } else {
                      setSelectedSystemUuid(null)
                      navigate('/dashboard', { replace: true })
                    }
                  }}
                  menuPortalTarget={document.body}
                  menuPosition='fixed'
                  styles={{
                    container: (base) => ({...base, width: '100%', minWidth: 0}),
                    menu: (base) => ({...base, width: '100%', minWidth: 200}),
                    control: (base) => ({
                      ...base,
                      minWidth: 0,
                      width: '100%',
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }),
                    singleValue: (base) => ({
                      ...base,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                    }),
                    placeholder: (base) => ({
                      ...base,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }),
                    input: (base) => ({
                      ...base,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }),
                    menuPortal: (base) => ({...base, zIndex: 9999}),
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='menu menu-column menu-rounded menu-sub-indention px-3' data-kt-menu='true'>
          <SidebarMenuMain />
        </div>
      </div>
    </div>
  )
}

export {SidebarMenu}