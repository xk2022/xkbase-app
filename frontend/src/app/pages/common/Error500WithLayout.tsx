// src/app/pages/common/Error500WithLayout.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Content } from '@/_metronic/layout/components/content'
import { toAbsoluteUrl } from '@/_metronic/helpers'

type Props = {
  onRetry?: () => void
  showMockOption?: boolean
  onUseMock?: () => void
}

export const Error500WithLayout: React.FC<Props> = ({
  onRetry,
  showMockOption = false,
  onUseMock,
}) => {
  return (
    <Content>
      <div className='card'>
        <div className='card-body d-flex flex-column flex-center text-center p-10'>
          {/* begin::Title */}
          <h1 className='fw-bolder fs-2qx text-gray-900 mb-4'>系統錯誤</h1>
          {/* end::Title */}

          {/* begin::Text */}
          <div className='fw-semibold fs-6 text-gray-500 mb-7'>
            系統發生錯誤，請稍後再試。
          </div>
          {/* end::Text */}

          {/* begin::Illustration */}
          <div className='mb-11'>
            <img
              src={toAbsoluteUrl('media/auth/500-error.png')}
              className='mw-100 mh-300px theme-light-show'
              alt=''
            />
            <img
              src={toAbsoluteUrl('media/auth/500-error-dark.png')}
              className='mw-100 mh-300px theme-dark-show'
              alt=''
            />
          </div>
          {/* end::Illustration */}

          {/* begin::Actions */}
          <div className='mb-0 d-flex gap-3 justify-content-center'>
            {onRetry && (
              <button className='btn btn-primary' onClick={onRetry}>
                重試
              </button>
            )}
            {showMockOption && onUseMock && (
              <button className='btn btn-light-primary' onClick={onUseMock}>
                使用 Mock 數據
              </button>
            )}
            <Link to='/tom/dashboard' className='btn btn-light'>
              返回首頁
            </Link>
          </div>
          {/* end::Actions */}
        </div>
      </div>
    </Content>
  )
}
