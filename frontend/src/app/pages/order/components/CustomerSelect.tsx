import React, { useState } from 'react'
import { Customer } from '../types'

interface CustomerSelectProps {
  value: string
  onChange: (customerId: string, customerName: string) => void
  customers?: Customer[]
  isLoading?: boolean
}

export const CustomerSelect: React.FC<CustomerSelectProps> = ({ 
  value, 
  onChange, 
  customers = [], 
  isLoading = false 
}) => {
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: ''
  })

  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value
    if (customerId === 'new') {
      setShowNewCustomerForm(true)
      return
    }
    
    const customer = customers.find(c => c.id === customerId)
    onChange(customerId, customer?.name || '')
  }

  const handleNewCustomerSubmit = () => {
    if (newCustomer.name.trim()) {
      // 這裡可以呼叫 API 建立新客戶
      // 暫時使用假的 ID
      const newId = `new-${Date.now()}`
      onChange(newId, newCustomer.name)
      setShowNewCustomerForm(false)
      setNewCustomer({ name: '', contactPerson: '', phone: '', email: '', address: '' })
    }
  }

  return (
    <div>
      <label className='form-label required'>客戶名稱</label>
      <select
        className='form-select'
        value={value}
        onChange={handleCustomerSelect}
        disabled={isLoading}
        required
      >
        <option value=''>請選擇客戶</option>
        {customers.map(customer => (
          <option key={customer.id} value={customer.id}>
            {customer.name}
          </option>
        ))}
        <option value='new'>+ 新增客戶</option>
      </select>

      {showNewCustomerForm && (
        <div className='card mt-3'>
          <div className='card-body'>
            <h6>新增客戶資料</h6>
            <div className='row'>
              <div className='col-md-6 mb-3'>
                <label className='form-label'>客戶名稱</label>
                <input
                  type='text'
                  className='form-control'
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className='col-md-6 mb-3'>
                <label className='form-label'>聯絡人</label>
                <input
                  type='text'
                  className='form-control'
                  value={newCustomer.contactPerson}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, contactPerson: e.target.value }))}
                />
              </div>
              <div className='col-md-6 mb-3'>
                <label className='form-label'>電話</label>
                <input
                  type='tel'
                  className='form-control'
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className='col-md-6 mb-3'>
                <label className='form-label'>Email</label>
                <input
                  type='email'
                  className='form-control'
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className='col-12 mb-3'>
                <label className='form-label'>地址</label>
                <input
                  type='text'
                  className='form-control'
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
            </div>
            <div className='d-flex justify-content-end'>
              <button
                type='button'
                className='btn btn-light me-2'
                onClick={() => setShowNewCustomerForm(false)}
              >
                取消
              </button>
              <button
                type='button'
                className='btn btn-primary'
                onClick={handleNewCustomerSubmit}
                disabled={!newCustomer.name.trim()}
              >
                確認新增
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
