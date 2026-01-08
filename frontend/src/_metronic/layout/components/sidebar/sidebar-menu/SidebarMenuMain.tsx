// src/_metronic/layout/components/sidebar/sidebar-menu/SidebarMenuMain.tsx
import {SidebarMenuItemWithSub} from './SidebarMenuItemWithSub'
import {SidebarMenuItem} from './SidebarMenuItem'
import {useSystem} from '../../../../../app/pages/common/SystemContext'
import {useRole} from '../../../../../_metronic/partials'
import {useLayout} from '../../../core'
import {KTIcon} from '../../../../helpers'
import {useMemo} from 'react'
import {MENU_CONFIG, type MenuSectionConfig, type MenuItemConfig} from './menuConfig'

/**
 * 根據系統和權限過濾菜單項
 * 同時檢查系統權限和角色權限
 */
const useFilteredMenuConfig = () => {
  const {selectedSystemCode, hasSystemPermission, hasSystem} = useSystem()
  const {hasPermission: hasRolePermission} = useRole()

  return useMemo(() => {
    // 如果沒有選中系統，只顯示 Dashboard 和不需要系統的菜單
    if (!selectedSystemCode) {
      return MENU_CONFIG
        .filter(section => !section.requiredSystem)
        .map(section => ({
          ...section,
          items: section.items.filter(item => !item.requiredSystem),
        }))
    }

    return MENU_CONFIG.map(section => {
      // 檢查區塊級別的系統要求
      if (section.requiredSystem && !hasSystem(section.requiredSystem)) {
        return null
      }

      // 檢查區塊級別的權限要求（系統權限 + 角色權限）
      if (section.requiredPermission) {
        const hasSystemPerm = hasSystemPermission(section.requiredPermission)
        const hasRolePerm = hasRolePermission(section.requiredPermission)
        if (!hasSystemPerm || !hasRolePerm) {
          return null
        }
      }

      // 過濾菜單項
      const filteredItems = section.items
        .map(item => {
          // 檢查菜單項的系統要求
          if (item.requiredSystem && !hasSystem(item.requiredSystem)) {
            return null
          }

          // 檢查菜單項的權限要求（系統權限 + 角色權限）
          if (item.requiredPermission) {
            const hasSystemPerm = hasSystemPermission(item.requiredPermission)
            const hasRolePerm = hasRolePermission(item.requiredPermission)
            if (!hasSystemPerm || !hasRolePerm) {
              return null
            }
          }

          // 如果有子菜單，過濾子菜單項
          if (item.type === 'submenu' && item.children) {
            const filteredChildren = item.children
              .filter(child => {
                if (child.requiredSystem && !hasSystem(child.requiredSystem)) {
                  return false
                }
                if (child.requiredPermission) {
                  const hasSystemPerm = hasSystemPermission(child.requiredPermission)
                  const hasRolePerm = hasRolePermission(child.requiredPermission)
                  if (!hasSystemPerm || !hasRolePerm) {
                    return false
                  }
                }
                return true
              })
              .map(child => ({
                ...child,
                type: 'item' as const,
              }))

            // 如果子菜單沒有可顯示的項目，不顯示父菜單
            if (filteredChildren.length === 0) {
              return null
            }

            return {
              ...item,
              children: filteredChildren,
            }
          }

          return item
        })
        .filter((item): item is MenuItemConfig => item !== null)

      // 如果區塊沒有可顯示的項目，返回 null
      if (filteredItems.length === 0) {
        return null
      }

      return {
        ...section,
        items: filteredItems,
      }
    }).filter((section): section is MenuSectionConfig => section !== null)
  }, [selectedSystemCode, hasSystemPermission, hasSystem, hasRolePermission])
}

const SidebarMenuMain = () => {
  const filteredConfig = useFilteredMenuConfig()
  const {config} = useLayout()
  const {app} = config

  return (
    <>
      {filteredConfig.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          {/* 區塊標題 */}
          {section.sectionTitle && (
            <div className='menu-item'>
              <div className='menu-content pt-3 pb-2'>
                <span className='menu-section text-muted text-uppercase fs-8 ls-1 d-flex align-items-center gap-2'>
                  {section.sectionIcon && app?.sidebar?.default?.menu?.iconType === 'svg' && (
                    <KTIcon iconName={section.sectionIcon} className='fs-5' />
                  )}
                  {section.sectionTitle}
                </span>
              </div>
            </div>
          )}

          {/* 渲染菜單項 */}
          {section.items.map((item, itemIndex) => {
            const key = `${sectionIndex}-${itemIndex}-${item.to}`

            if (item.type === 'item') {
              return (
                <SidebarMenuItem
                  key={key}
                  to={item.to}
                  title={item.title}
                  icon={item.icon}
                  fontIcon={item.fontIcon}
                  hasBullet={item.hasBullet}
                />
              )
            }

            if (item.type === 'submenu' && item.children) {
              return (
                <SidebarMenuItemWithSub
                  key={key}
                  to={item.to}
                  title={item.title}
                  icon={item.icon}
                  fontIcon={item.fontIcon}
                  hasBullet={item.hasBullet}
                >
                  {item.children.map((child, childIndex) => (
                    <SidebarMenuItem
                      key={`${key}-${childIndex}`}
                      to={child.to}
                      title={child.title}
                      icon={child.icon}
                      fontIcon={child.fontIcon}
                      hasBullet={child.hasBullet}
                    />
                  ))}
                </SidebarMenuItemWithSub>
              )
            }

            return null
          })}
        </div>
      ))}

      {/* ============================
            --- 以下為 Metronic 原生內容 ---
          ============================ */}
      {/* <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Crafted</span>
        </div>
      </div>

      <SidebarMenuItemWithSub
        to='/crafted/pages'
        title='Pages'
        fontIcon='bi-archive'
        icon='element-plus'
      >
        <SidebarMenuItemWithSub to='/crafted/pages/profile' title='Profile' hasBullet={true}>
          <SidebarMenuItem to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} />
          <SidebarMenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
          <SidebarMenuItem to='/crafted/pages/profile/campaigns' title='Campaigns' hasBullet={true} />
          <SidebarMenuItem to='/crafted/pages/profile/documents' title='Documents' hasBullet={true} />
          <SidebarMenuItem to='/crafted/pages/profile/connections' title='Connections' hasBullet={true} />
        </SidebarMenuItemWithSub>

        <SidebarMenuItemWithSub to='/crafted/pages/wizards' title='Wizards' hasBullet={true}>
          <SidebarMenuItem to='/crafted/pages/wizards/horizontal' title='Horizontal' hasBullet={true}/>
          <SidebarMenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true}/>
        </SidebarMenuItemWithSub>
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub
        to='/crafted/accounts'
        title='Accounts'
        icon='profile-circle'
        fontIcon='bi-person'
      >
        <SidebarMenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
        <SidebarMenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub
        to='/error'
        title='Errors'
        fontIcon='bi-sticky'
        icon='cross-circle'
      >
        <SidebarMenuItem to='/error/404' title='Error 404' hasBullet={true} />
        <SidebarMenuItem to='/error/500' title='Error 500' hasBullet={true} />
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub
        to='/crafted/widgets'
        title='Widgets'
        icon='element-7'
        fontIcon='bi-layers'
      >
        <SidebarMenuItem to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/mixed' title='Mixed' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} />
      </SidebarMenuItemWithSub>

      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Apps</span>
        </div>
      </div>

      <SidebarMenuItem
        to='/apps/user-management/users'
        icon='abstract-28'
        title='User management'
        fontIcon='bi-layers'
      /> */}
    </>
  )
}

export {SidebarMenuMain}
