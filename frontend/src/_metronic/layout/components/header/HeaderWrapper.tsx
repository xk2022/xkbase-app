 
import clsx from 'clsx'
import {LayoutSetup, useLayout} from '../../core'
import {Navbar} from './Navbar'

export function HeaderWrapper() {
  const {config, classes} = useLayout()
  if (config.app?.header?.default?.container === 'fluid') {
    LayoutSetup.classes.headerContainer.push("container-fluid");
  } else {
    LayoutSetup.classes.headerContainer.push("container-xxl");
  }
  if (!config.app?.header?.display) {
    return null
  }

  return (
    <div
      id='kt_app_header'
      className='app-header'
      data-kt-sticky='true'
      data-kt-sticky-activate='{default: true, lg: true}'
      data-kt-sticky-name='app-header-minimize'
      data-kt-sticky-offset='{default: "200px", lg: "0"}'
      data-kt-sticky-animation='false'
    >
      <div
        id='kt_app_header_container'
        className={clsx(
          'app-container',
          classes.headerContainer.join(' '),
          config.app?.header?.default?.containerClass
        )}
      >
        <div
          id='kt_app_header_wrapper'
          className='d-flex align-items-stretch justify-content-between flex-lg-grow-1'>
          <Navbar />
        </div>
      </div>
    </div>
  )
}
