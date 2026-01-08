import {FC, ReactNode} from 'react'
import {KTIcon} from '@/_metronic/helpers'

type Props = {
  title: string
  to?: string
  children: ReactNode
  fontIcon?: string
  hasArrow?: boolean
  hasBullet?: boolean
  menuPlacement?: string
  menuTrigger?: string
}

export const MenuInnerWithSub: FC<Props> = ({
  title,
  to,
  children,
  fontIcon,
  hasArrow,
  hasBullet,
  menuPlacement = 'bottom-start',
  menuTrigger = 'click',
}) => {
  return (
    <div
      className='menu-item menu-lg-down-accordion me-lg-1'
      data-kt-menu-trigger={menuTrigger}
      data-kt-menu-placement={menuPlacement}
    >
      <span className='menu-link'>
        {hasBullet && <span className='menu-bullet'><span className='bullet bullet-dot'></span></span>}
        {fontIcon && <span className='menu-icon'><i className={`${fontIcon} fs-2`}></i></span>}
        <span className='menu-title'>{title}</span>
        {hasArrow && <span className='menu-arrow d-lg-none'></span>}
        <span className='menu-arrow d-none d-lg-block'>
          <KTIcon iconName='down' className='fs-5' />
        </span>
      </span>
      <div className='menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown p-0 w-100 w-lg-850px'>
        <div className='menu-state-inner menu-state-active menu-state-icon-primary'>
          <div className='menu-item menu-lg-down-accordion'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
