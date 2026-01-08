// src/app/pages/upms/dashboard/DashboardPage.tsx
import {FC, useMemo, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {Content} from '@/_metronic/layout/components/content'
import {KTIcon} from '@/_metronic/helpers'
import {useSystem} from '@/app/pages/common/SystemContext'
import {useRole} from '@/_metronic/partials'
import {MENU_CONFIG} from '@/_metronic/layout/components/sidebar/sidebar-menu/menuConfig'

interface MenuItem {
  title: string
  path: string
  requiredPermission?: string
  disabled?: boolean
}

interface SectionCard {
  sectionTitle: string
  displayTitle: string
  items: MenuItem[]
}

const UPMSDashboardPage: FC = () => {
  const {hasSystemPermission, hasSystem, systems, setSelectedSystemUuid} = useSystem()
  const {hasPermission: hasRolePermission} = useRole()
  const navigate = useNavigate()

  // 自動選擇 UPMS 系統
  useEffect(() => {
    const upmsSystem = systems.find(s => s.code?.toUpperCase() === 'UPMS')
    if (upmsSystem) {
      setSelectedSystemUuid(upmsSystem.id)
    }
  }, [systems, setSelectedSystemUuid])

  // 獲取主要區塊的數據，顯示所有功能，但根據角色權限禁用
  const sectionCards = useMemo(() => {
    const cards: SectionCard[] = []

    MENU_CONFIG.forEach(section => {
      // 只處理 UPMS 系統的區塊
      if (section.requiredSystem !== 'UPMS') {
        return
      }

      // 只處理有 sectionTitle 的區塊（跳過 dashboard 本身的區塊）
      if (!section.sectionTitle) {
        return
      }

      const items: MenuItem[] = []

      section.items.forEach(item => {
        // 跳過 dashboard 本身和帶參數的路由
        if (item.to === '/upms/dashboard' || item.to.includes('/:id/') || item.to.includes('/:uuid/')) {
          return
        }

        if (item.type === 'item') {
          // 檢查是否有權限（系統權限 + 角色權限）
          let disabled = false
          if (item.requiredPermission) {
            const hasSystemPerm = hasSystemPermission(item.requiredPermission)
            const hasRolePerm = hasRolePermission(item.requiredPermission)
            disabled = !hasSystemPerm || !hasRolePerm
          }

          items.push({
            title: item.title,
            path: item.to,
            requiredPermission: item.requiredPermission,
            disabled,
          })
        }
      })

      // 顯示所有卡片，即使沒有可訪問的項目
      cards.push({
        sectionTitle: section.sectionTitle,
        displayTitle: section.sectionTitle,
        items,
      })
    })

    return cards
  }, [hasSystemPermission, hasSystem, hasRolePermission])

  const handleItemClick = (path: string, disabled?: boolean) => {
    if (!disabled) {
      navigate(path)
    }
  }

  return (
    <Content>
      <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
        {/* 歡迎區塊 - 保持不變 */}
        <div className='col-12 mb-5'>
          <div className='card card-flush'>
            <div className='card-header pt-7'>
              <div className='card-title'>
                <h2 className='fw-bold text-gray-800'>UPMS 權限管理系統</h2>
              </div>
            </div>
            <div className='card-body pt-6'>
              <p className='text-gray-600 fs-6 mb-0'>
                以下是 UPMS 系統的可用功能模組，請選擇一個模組開始使用。
              </p>
            </div>
          </div>
        </div>

        {/* 功能區塊卡片 - 橫向排列，可橫向滾動 */}
        {sectionCards.length === 0 ? (
          <div className='col-12'>
            <div className='card card-flush'>
              <div className='card-body text-center py-10'>
                <KTIcon iconName='information-5' className='fs-3x text-gray-400 mb-5' />
                <h3 className='text-gray-800 mb-3'>暫無可用功能</h3>
                <p className='text-gray-600 mb-0'>
                  您目前沒有可訪問的功能，請聯繫管理員分配權限。
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className='col-12'>
            <div 
              className='d-flex gap-5 overflow-x-auto pb-3 upms-dashboard-scroll'
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#cbd5e0 transparent',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <style>{`
                .upms-dashboard-scroll::-webkit-scrollbar {
                  height: 8px;
                }
                .upms-dashboard-scroll::-webkit-scrollbar-track {
                  background: transparent;
                }
                .upms-dashboard-scroll::-webkit-scrollbar-thumb {
                  background-color: #cbd5e0;
                  border-radius: 4px;
                }
                .upms-dashboard-scroll::-webkit-scrollbar-thumb:hover {
                  background-color: #a0aec0;
                }
              `}</style>
              {sectionCards.map((section) => (
                <div 
                  key={section.sectionTitle}
                  className='card card-flush flex-shrink-0'
                  style={{
                    minWidth: '300px',
                    width: '300px',
                  }}
                >
                  <div className='card-header pt-7'>
                    <div className='card-title'>
                      <h3 className='fw-bold text-gray-800 fs-4'>{section.displayTitle}</h3>
                    </div>
                  </div>
                  <div className='card-body pt-6'>
                    <div className='d-flex flex-column gap-3'>
                      {section.items.map((item, index) => (
                        <button
                          key={index}
                          type='button'
                          className={`btn btn-flex text-start p-4 ${
                            item.disabled 
                              ? 'btn-light-secondary' 
                              : 'btn-light btn-active-light-primary'
                          }`}
                          onClick={() => handleItemClick(item.path, item.disabled)}
                          disabled={item.disabled}
                          style={{
                            transition: 'all 0.2s ease',
                            opacity: item.disabled ? 0.6 : 1,
                            cursor: item.disabled ? 'not-allowed' : 'pointer',
                          }}
                          onMouseEnter={(e) => {
                            if (!item.disabled) {
                              e.currentTarget.classList.remove('btn-light')
                              e.currentTarget.classList.add('btn-primary')
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!item.disabled) {
                              e.currentTarget.classList.remove('btn-primary')
                              e.currentTarget.classList.add('btn-light')
                            }
                          }}
                        >
                          <span className={`fw-semibold ${item.disabled ? 'text-gray-400' : 'text-gray-700'}`}>
                            {item.title}
                            {item.disabled && (
                              <KTIcon iconName='lock' className='fs-6 ms-2 text-gray-400' />
                            )}
                          </span>
                        </button>
                      ))}
                      {section.items.length === 0 && (
                        <p className='text-muted fs-7 mb-0'>暫無功能</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Content>
  )
}

export default UPMSDashboardPage