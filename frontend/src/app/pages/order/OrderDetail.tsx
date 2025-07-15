import React from 'react'
import { useParams } from 'react-router-dom'

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div className='card'>
      <div className='card-header'>
        <h3 className='card-title'>訂單詳情 #{id}</h3>
      </div>
      <div className='card-body'>
        <div className='row'>
          <div className='col-md-6'>
            <h5>基本資訊</h5>
            <table className='table table-row-bordered'>
              <tbody>
                <tr>
                  <td className='fw-bold'>訂單號:</td>
                  <td>ORD-2025-001</td>
                </tr>
                <tr>
                  <td className='fw-bold'>客戶名稱:</td>
                  <td>台灣貿易公司</td>
                </tr>
                <tr>
                  <td className='fw-bold'>訂單類型:</td>
                  <td>出口</td>
                </tr>
                <tr>
                  <td className='fw-bold'>狀態:</td>
                  <td><span className='badge badge-light-warning'>待處理</span></td>
                </tr>
                <tr>
                  <td className='fw-bold'>建立時間:</td>
                  <td>2025-01-15 10:00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='col-md-6'>
            <h5>進度追蹤</h5>
            <div className='timeline'>
              <div className='timeline-item'>
                <div className='timeline-line w-40px'></div>
                <div className='timeline-icon symbol symbol-circle symbol-40px'>
                  <div className='symbol-label bg-light'>
                    <i className='ki-duotone ki-message-text-2 fs-2 text-gray-500'>
                      <span className='path1'></span>
                      <span className='path2'></span>
                      <span className='path3'></span>
                    </i>
                  </div>
                </div>
                <div className='timeline-content mb-10 mt-n1'>
                  <div className='pe-3 mb-5'>
                    <div className='fs-5 fw-semibold mb-2'>訂單已建立</div>
                    <div className='d-flex align-items-center mt-1 fs-6'>
                      <div className='text-muted me-2 fs-7'>2025-01-15 10:00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className='separator my-10'></div>
        
        <h5>訂單詳情</h5>
        <div className='text-center py-10'>
          <p className='text-muted'>此處將顯示完整的訂單詳情，包括出口/進口的所有欄位資訊</p>
        </div>
      </div>
    </div>
  )
}
