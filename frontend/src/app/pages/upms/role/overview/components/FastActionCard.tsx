// src/app/pages/upms/role/overview/components/FastActionCard.tsx
import React from 'react'
import {useNavigate} from 'react-router-dom'
import {KTIcon} from '@/_metronic/helpers'

/**
 * 快速操作卡片元件
 * 提供新增角色、查看列表、刷新等快速操作按鈕
 */
export const FastActionCard: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className='row g-5 g-xl-8 mb-5 mb-xl-10'>
      <div className='col-12'>
        <div className='card'>
          <div className='card-header border-0 pt-6 pb-6'>
            <div className='row align-items-center w-100 g-0'>
              {/* 位置 1: 標題 */}
              <div className='col-1'>
                <h3 className='card-label fw-bold fs-3 mb-0'>快速操作</h3>
              </div>
              
              {/* 位置 2-11: */}
              <div className='col-10 d-flex align-items-center gap-3'>
                <button
                  type='button'
                  className='btn btn-primary'
                  onClick={() => navigate('/upms/role/create')}
                >
                  <KTIcon iconName='plus' className='fs-2 me-2' />
                  新增角色
                </button>
                <button
                  type='button'
                  className='btn btn-light-primary'
                  onClick={() => navigate('/upms/role/list')}
                >
                  <KTIcon iconName='list' className='fs-2 me-2' />
                  查看所有角色
                </button>
              </div>
              
              {/* 位置 12: 刷新 */}
              <div className='col-1 text-end'>
                <button
                  type='button'
                  className='btn btn-light'
                  onClick={() => {
                    // 直接重新載入當前頁面
                    window.location.reload()
                  }}
                >
                  <KTIcon iconName='arrows-circle' className='fs-2 me-2' />
                  刷新
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
