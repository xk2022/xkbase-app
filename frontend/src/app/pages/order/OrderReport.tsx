import React from 'react'

export const OrderReport: React.FC = () => {
  return (
    <div className='card'>
      <div className='card-header'>
        <h3 className='card-title'>訂單報表</h3>
      </div>
      <div className='card-body'>
        <div className='row mb-6'>
          <div className='col-md-4'>
            <label className='form-label'>報表類型</label>
            <select className='form-select'>
              <option value='daily'>日報表</option>
              <option value='weekly'>週報表</option>
              <option value='monthly'>月報表</option>
              <option value='custom'>自訂區間</option>
            </select>
          </div>
          <div className='col-md-4'>
            <label className='form-label'>開始日期</label>
            <input type='date' className='form-control' />
          </div>
          <div className='col-md-4'>
            <label className='form-label'>結束日期</label>
            <input type='date' className='form-control' />
          </div>
        </div>
        
        <div className='row mb-6'>
          <div className='col-md-4'>
            <label className='form-label'>訂單狀態</label>
            <select className='form-select'>
              <option value=''>所有狀態</option>
              <option value='pending'>待處理</option>
              <option value='assigned'>已指派</option>
              <option value='in_transit'>運送中</option>
              <option value='completed'>已完成</option>
              <option value='cancelled'>已取消</option>
            </select>
          </div>
          <div className='col-md-4'>
            <label className='form-label'>訂單類型</label>
            <select className='form-select'>
              <option value=''>所有類型</option>
              <option value='export'>出口</option>
              <option value='import'>進口</option>
            </select>
          </div>
          <div className='col-md-4'>
            <label className='form-label'>匯出格式</label>
            <select className='form-select'>
              <option value='excel'>Excel</option>
              <option value='pdf'>PDF</option>
              <option value='csv'>CSV</option>
            </select>
          </div>
        </div>
        
        <div className='d-flex justify-content-end'>
          <button className='btn btn-light me-3'>預覽報表</button>
          <button className='btn btn-primary'>匯出報表</button>
        </div>
        
        <div className='separator my-10'></div>
        
        <div className='text-center py-10'>
          <h4>報表預覽</h4>
          <p className='text-muted'>此處將顯示報表預覽內容</p>
        </div>
      </div>
    </div>
  )
}
