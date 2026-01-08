// src/app/components/layout/AppToolbar.tsx
import React from 'react'

export type BreadcrumbItem = {
  label: string
  href?: string
  active?: boolean
}

type Props = {
  title: string
  breadcrumbs: BreadcrumbItem[]
  /** 右側操作區（按鈕、篩選器等） */
  actions?: React.ReactNode
}

export const AppToolbar: React.FC<Props> = ({ title, breadcrumbs, actions }) => {
  return (
    <div id='kt_app_toolbar' className='app-toolbar py-3 py-lg-6'>
      <div
        id='kt_app_toolbar_container'
        className='app-container container-fluid d-flex flex-stack flex-wrap gap-3'
      >
        {/* Left: Title + Breadcrumb */}
        <div
          id='kt_page_title'
          className='page-title d-flex flex-column justify-content-center me-3 min-w-0'
        >
          <h1 className='page-heading text-gray-900 fw-bold fs-3 my-0'>
            {title}
          </h1>

          <ul className='breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0'>
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={`${b.label}-${idx}`}>
                <li
                  className={
                    b.active ? 'breadcrumb-item text-gray-900' : 'breadcrumb-item text-muted'
                  }
                >
                  {b.href && !b.active ? (
                    <a href={b.href} className='text-muted text-hover-primary'>
                      {b.label}
                    </a>
                  ) : (
                    b.label
                  )}
                </li>

                {idx < breadcrumbs.length - 1 && (
                  <li className='breadcrumb-item'>
                    <span className='bullet bg-gray-500 w-5px h-2px'></span>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>

        {/* Right: Actions */}
        {actions && (
          <div className='d-flex align-items-center gap-2 gap-lg-3 flex-wrap'>
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
