import React from 'react'

export const OrderAssign: React.FC = () => {
  return (
    <div className='card'>
      <div className='card-header'>
        <h3 className='card-title'>訂單指派</h3>
      </div>
      <div className='card-body'>
        <div className='row'>
          <div className='col-md-6'>
            <h5>待指派訂單</h5>
            <div className='card bg-light-warning'>
              <div className='card-body'>
                <div className='text-center py-10'>
                  <h4>12</h4>
                  <p className='text-muted'>筆待指派訂單</p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <h5>可用車輛</h5>
            <div className='card bg-light-success'>
              <div className='card-body'>
                <div className='text-center py-10'>
                  <h4>5</h4>
                  <p className='text-muted'>輛可用車輛</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className='separator my-10'></div>
        
        <div className='text-center py-10'>
          <h4>自動指派功能</h4>
          <p className='text-muted'>此功能將實現自動/手動指派訂單給可用車輛</p>
          <button className='btn btn-primary me-3'>自動指派</button>
          <button className='btn btn-secondary'>手動指派</button>
        </div>
      </div>
    </div>
  )
}
