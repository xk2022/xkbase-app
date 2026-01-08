import clsx from 'clsx'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import {HeaderUserMenu, HeaderRoleMenu, useRole} from '../../../partials'
import {useLayout} from '../../core'

const itemClass = 'ms-1 ms-md-4'
const userAvatarClass = 'symbol-35px'
const btnIconClass = 'fs-2'

const Navbar = () => {
  const {config} = useLayout()
  const {selectedRole} = useRole()

  return (
    <div className='app-navbar flex-shrink-0 ms-auto'>
      {/* 角色下拉選單 */}
      <div className={clsx('app-navbar-item', itemClass)}>
        <button
          className='btn btn-light btn-active-light-primary fw-bold px-4'
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          id='kt_role_menu_toggle'
        >
          {selectedRole}
          <KTIcon iconName='down' className='fs-5 ms-2' />
        </button>
        <HeaderRoleMenu />
      </div>

      {/* 用戶選單 */}
      <div className={clsx('app-navbar-item', itemClass)}>
        <div
          className={clsx('cursor-pointer symbol', userAvatarClass)}
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
        >
          <img src={toAbsoluteUrl('media/avatars/300-3.jpg')} alt='' />
        </div>
        <HeaderUserMenu />
      </div>

      {config.app?.header?.default?.menu?.display && (
        <div className='app-navbar-item d-lg-none ms-2 me-n3' title='Show header menu'>
          <div
            className='btn btn-icon btn-active-color-primary w-35px h-35px'
            id='kt_app_header_menu_toggle'
          >
            <KTIcon iconName='text-align-left' className={btnIconClass} />
          </div>
        </div>
      )}
    </div>
  )
}

export {Navbar}
