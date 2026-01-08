import {FC, useMemo, useEffect} from 'react'
import {PageTitle, useLayout} from '@/_metronic/layout/core'
import {ToolbarWrapper} from '@/_metronic/layout/components/toolbar'
import {Content} from '@/_metronic/layout/components/content'
import {useSystem} from '../common/SystemContext'
import {useRole} from '@/_metronic/partials'
import {useNavigate} from 'react-router-dom'
import {MENU_CONFIG} from '@/_metronic/layout/components/sidebar/sidebar-menu/menuConfig'
import {KTIcon} from '@/_metronic/helpers'

interface ModuleItem {
  title: string
  path: string
  icon?: string
  fontIcon?: string
  requiredPermission?: string
}

interface SystemCard {
  systemCode: string
  systemName: string
  modules: ModuleItem[]
  disabled?: boolean
}

const DashboardPage: FC = () => {
  const {systems, setSelectedSystemUuid} = useSystem()
  const {hasPermission: hasRolePermission} = useRole()
  const navigate = useNavigate()
  const {config, setLayout} = useLayout()

  // 在 dashboard 页面，预设系统选择为 null
  useEffect(() => {
    setSelectedSystemUuid(null)
  }, [setSelectedSystemUuid])

  // 禁用 filter 和 create 按钮
  useEffect(() => {
    const originalFilterButton = config.app?.toolbar?.filterButton
    const originalPrimaryButton = config.app?.toolbar?.primaryButton

    setLayout({
      app: {
        ...config.app,
        toolbar: {
          ...config.app?.toolbar,
          filterButton: false,
          primaryButton: false,
        },
      },
    })

    // 组件卸载时恢复原始设置
    return () => {
      setLayout({
        app: {
          ...config.app,
          toolbar: {
            ...config.app?.toolbar,
            filterButton: originalFilterButton,
            primaryButton: originalPrimaryButton,
          },
        },
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 按系統分組模組
  // 在 dashboard 頁面，顯示所有系統，但根據角色權限禁用
  const systemCards = useMemo(() => {
    const cards: SystemCard[] = []

    // 遍歷所有系統
    systems.forEach((system: {code?: string; name: string; id: string}) => {
      const systemCode = system.code?.toUpperCase() || ''
      const modules: ModuleItem[] = []
      const systemPermissions: string[] = []

      // 遍歷菜單配置，找到屬於當前系統的模組
      MENU_CONFIG.forEach(section => {
        // 檢查區塊是否屬於當前系統
        if (section.requiredSystem && section.requiredSystem !== systemCode) {
          return
        }

        section.items.forEach(item => {
          // 檢查模組是否屬於當前系統
          if (item.requiredSystem && item.requiredSystem !== systemCode) {
            return
          }

          // 收集系統的所有權限
          if (item.requiredPermission) {
            systemPermissions.push(item.requiredPermission)
          }

          // 如果是單個菜單項，作為模組
          if (item.type === 'item') {
            // 跳過 dashboard 本身和帶參數的路由
            if (item.to === '/dashboard' || item.to.includes('/:id/') || item.to.includes('/:uuid/')) {
              return
            }

            modules.push({
              title: item.title,
              path: item.to,
              icon: item.icon,
              fontIcon: item.fontIcon,
              requiredPermission: item.requiredPermission,
            })
          } else if (item.type === 'submenu') {
            // 如果有子菜單，將父菜單作為模組
            if (!item.to.includes('/:id/') && !item.to.includes('/:uuid/')) {
              modules.push({
                title: item.title,
                path: item.to,
                icon: item.icon,
                fontIcon: item.fontIcon,
              })
            }
          }
        })
      })

      // 只有當有配置的模組時，才添加系統卡片
      if (modules.length > 0) {
        // 檢查該系統是否有任何權限
        // 如果系統有權限要求，檢查角色是否有該系統的任何權限
        let disabled = false
        if (systemPermissions.length > 0) {
          // 檢查角色是否有該系統的任何一個權限
          const hasAnyPermission = systemPermissions.some(permission => 
            hasRolePermission(permission)
          )
          disabled = !hasAnyPermission
        }

        cards.push({
          systemCode,
          systemName: system.name,
          modules,
          disabled,
        })
      }
    })

    return cards
  }, [systems, hasRolePermission])

  const handleSystemClick = (systemCode: string, disabled?: boolean) => {
    if (disabled) {
      return
    }
    // 找到該系統的第一個模組並導航
    const system = systemCards.find(card => card.systemCode === systemCode)
    if (system && system.modules.length > 0) {
      navigate(system.modules[0].path)
    }
  }

  // 計算每個系統卡片應該占據的列數（響應式）
  // 確保系統卡片平分剩餘空間，根據螢幕大小比例縮放
  const getColClass = (totalCards: number) => {
    if (totalCards === 1) return 'col-12'
    if (totalCards === 2) return 'col-xl-6 col-lg-6 col-md-6 col-sm-12'
    if (totalCards === 3) return 'col-xl-4 col-lg-4 col-md-6 col-sm-12'
    // 4個或更多：大螢幕 25%（4列），中螢幕 50%（2列），小螢幕 100%（1列）
    return 'col-xl-3 col-lg-6 col-md-6 col-sm-12'
  }

  return (
    <>
      <ToolbarWrapper />
      <Content>
        <div className='row g-5 g-xl-8 mb-5 mb-xl-10'>
          {/* 歡迎區塊 */}
          <div className='col-12 mb-8'>
            <div className='card card-flush h-xl-100'>
              <div className='card-header pt-7'>
                <div className='card-title'>
                  <h2 className='fw-bold text-gray-800'>歡迎回來</h2>
                </div>
              </div>
              <div className='card-body pt-6'>
                <p className='text-gray-600 fs-6 mb-0'>
                  請選擇一個系統開始使用，或從左側選單快速訪問功能。
                </p>
              </div>
            </div>
          </div>

          {/* 系統卡片 - 網格布局 */}
          {systemCards.length === 0 ? (
            <div className='col-12'>
              <div className='card card-flush'>
                <div className='card-body text-center py-10'>
                  <KTIcon iconName='information-5' className='fs-3x text-gray-400 mb-5' />
                  <h3 className='text-gray-800 mb-3'>暫無可用系統</h3>
                  <p className='text-gray-600 mb-0'>
                    您目前沒有可訪問的系統，請聯繫管理員分配權限。
                  </p>
                </div>
              </div>
            </div>
          ) : (
            systemCards.map((system) => (
              <div key={system.systemCode} className={getColClass(systemCards.length)}>
                <div 
                  className={`card card-flush h-100 ${system.disabled ? 'opacity-60' : ''}`}
                  onClick={() => handleSystemClick(system.systemCode, system.disabled)}
                  style={{
                    transition: 'all 0.3s ease',
                    minHeight: '280px',
                    cursor: system.disabled ? 'not-allowed' : 'pointer',
                    opacity: system.disabled ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!system.disabled) {
                      e.currentTarget.style.transform = 'translateY(-8px)'
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = ''
                  }}
                >
                  <div className='card-body d-flex flex-column justify-content-center align-items-center p-10 text-center'>
                    <div className='mb-6 position-relative'>
                      <KTIcon 
                        iconName='element-11' 
                        className={`fs-1 ${system.disabled ? 'text-gray-400' : 'text-primary'}`} 
                      />
                      {system.disabled && (
                        <div className='position-absolute top-0 end-0 translate-middle'>
                          <KTIcon iconName='lock' className='fs-3 text-gray-400' />
                        </div>
                      )}
                    </div>
                    <h3 className={`fw-bold mb-3 fs-2 ${system.disabled ? 'text-gray-400' : 'text-gray-800'}`}>
                      {system.systemName}
                    </h3>
                    <span className={`badge mb-4 fs-6 px-3 py-2 ${
                      system.disabled ? 'badge-light-secondary' : 'badge-light-primary'
                    }`}>
                      {system.systemCode}
                    </span>
                    <p className={`mb-0 fs-5 ${system.disabled ? 'text-gray-400' : 'text-gray-600'}`}>
                      {system.modules.length} 個可用模組
                      {system.disabled && (
                        <span className='d-block mt-2 text-muted fs-7'>
                          <KTIcon iconName='information-5' className='fs-6 me-1' />
                          無權限訪問
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Content>
    </>
  )
}

const DashboardWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>儀錶板</PageTitle>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}