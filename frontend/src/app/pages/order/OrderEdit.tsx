import React from 'react'
import { useParams } from 'react-router-dom'

export const OrderEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div className='card'>
      <div className='card-header'>
        <h3 className='card-title'>編輯訂單 #{id}</h3>
      </div>
      <div className='card-body'>
        <div className='text-center py-10'>
          <h4>訂單編輯功能</h4>
          <p className='text-muted'>此功能將實現訂單編輯表單，類似於創建訂單的功能</p>
        </div>
      </div>
    </div>
  )
}
