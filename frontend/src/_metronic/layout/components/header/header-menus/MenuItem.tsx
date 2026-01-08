import {FC} from 'react'
import {Link} from 'react-router-dom'
import {KTIcon} from '@/_metronic/helpers'

type Props = {
  to?: string
  title: string
  icon?: string
  hasBullet?: boolean
}

export const MenuItem: FC<Props> = ({to, title, icon, hasBullet}) => {
  const content = (
    <span className='menu-link'>
      {hasBullet && <span className='menu-bullet'><span className='bullet bullet-dot'></span></span>}
      {icon && <span className='menu-icon'><KTIcon iconName={icon} className='fs-2' /></span>}
      <span className='menu-title'>{title}</span>
    </span>
  )

  if (to) {
    return (
      <Link to={to} className='menu-item'>
        {content}
      </Link>
    )
  }

  return <div className='menu-item'>{content}</div>
}
