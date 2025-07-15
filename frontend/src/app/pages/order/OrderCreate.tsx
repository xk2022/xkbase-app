import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OrderType, ExportOrderDetails, ImportOrderDetails } from './types'
import { useCreateOrder } from './hooks'
import { validateOrderData } from './utils'
import { CustomerSelect } from './components/CustomerSelect'
import { ToastNotification } from './components/ToastNotification'

export const OrderCreate: React.FC = () => {
  const navigate = useNavigate()
  const createOrderMutation = useCreateOrder()
  const [orderType, setOrderType] = useState<OrderType>('EXPORT')
  const [customerId, setCustomerId] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
  } | null>(null)
  const [exportDetails, setExportDetails] = useState<ExportOrderDetails>({
    date: '',
    shippingCompany: '',
    shipName: '',
    voyage: '',
    customsClearanceDate: '',
    containerPickupCode: '',
    containerType: '',
    containerPickupLocation: '',
    containerNumber: '',
    containerDropoffLocation: '',
    loadingLocation: '',
    loadingDate: '',
    loadingTime: '',
  })
  const [importDetails, setImportDetails] = useState<ImportOrderDetails>({
    date: '',
    deliveryOrderLocation: '',
    shippingCompany: '',
    shipName: '',
    voyage: '',
    containerNumber: '',
    containerType: '',
    containerYard: '',
    containerPickupDeadline: '',
    deliveryLocation: '',
    deliveryDate: '',
    deliveryTime: '',
    containerReturnLocation: '',
    containerReturnDate: '',
    containerReturnTime: '',
  })
  const [notes, setNotes] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 清除之前的錯誤
    setErrors([])
    setIsSubmitting(true)
    
    // 準備訂單資料
    const orderData = {
      type: orderType,
      customerName,
      customerId: customerId || '1', // 使用選擇的客戶ID，或預設值
      status: 'PENDING' as const,
      exportDetails: orderType === 'EXPORT' ? exportDetails : undefined,
      importDetails: orderType === 'IMPORT' ? importDetails : undefined,
      notes: notes || undefined,
    }
    
    // 驗證資料
    const validationErrors = validateOrderData(orderData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setIsSubmitting(false)
      return
    }
    
    try {
      // 使用 React Query mutation 建立訂單
      const result = await createOrderMutation.mutateAsync(orderData)
      
      // 顯示成功通知
      setNotification({
        message: `訂單 ${result.orderNumber} 建立成功！`,
        type: 'success'
      })
      
      // 延遲導航，讓用戶看到成功訊息
      setTimeout(() => {
        navigate(`/order/detail/${result.id}`)
      }, 1500)
      
    } catch (error) {
      console.error('建立訂單失敗:', error)
      setNotification({
        message: '建立訂單失敗，請稍後再試',
        type: 'error'
      })
      setErrors(['建立訂單失敗，請稍後再試'])
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExportDetailsChange = (field: keyof ExportOrderDetails, value: string) => {
    setExportDetails(prev => ({ ...prev, [field]: value }))
  }

  const handleImportDetailsChange = (field: keyof ImportOrderDetails, value: string) => {
    setImportDetails(prev => ({ ...prev, [field]: value }))
  }

  const handleCustomerChange = (newCustomerId: string, newCustomerName: string) => {
    setCustomerId(newCustomerId)
    setCustomerName(newCustomerName)
  }

  // 模擬客戶資料 - 實際應用中會從API獲取
  const mockCustomers = [
    { id: '1', name: '台灣貿易公司', contactPerson: '王小明', phone: '02-12345678', email: 'contact@taiwan-trade.com', address: '台北市信義區' },
    { id: '2', name: '亞洲進出口', contactPerson: '李大華', phone: '07-87654321', email: 'info@asia-export.com', address: '高雄市前鎮區' },
    { id: '3', name: '國際物流', contactPerson: '張美麗', phone: '04-11223344', email: 'service@global-logistics.com', address: '台中市西屯區' },
  ]

  return (
    <div className='card'>
      <div className='card-header'>
        <h3 className='card-title'>建立新訂單</h3>
      </div>
      <div className='card-body'>
        {/* 通知訊息 */}
        {notification && (
          <ToastNotification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        {/* 錯誤訊息顯示 */}
        {errors.length > 0 && (
          <div className='alert alert-danger mb-6'>
            <div className='alert-text'>
              <ul className='mb-0'>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* React Query 錯誤訊息 */}
        {createOrderMutation.isError && (
          <div className='alert alert-danger mb-6'>
            <div className='alert-text'>
              建立訂單時發生錯誤，請稍後再試
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 基本資訊 */}
          <div className='row mb-6'>
            <div className='col-md-6'>
              <CustomerSelect
                value={customerId}
                onChange={handleCustomerChange}
                customers={mockCustomers}
              />
            </div>
            <div className='col-md-6'>
              <label className='form-label required'>訂單類型</label>
              <select
                className='form-select'
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as OrderType)}
                required
              >
                <option value='EXPORT'>出口</option>
                <option value='IMPORT'>進口</option>
              </select>
            </div>
          </div>

          {/* 出口訂單詳情 */}
          {orderType === 'EXPORT' && (
            <div className='mb-6'>
              <h5 className='text-dark fw-bold mb-4'>出口訂單詳情</h5>
              <div className='row mb-3'>
                <div className='col-md-4'>
                  <label className='form-label'>日期</label>
                  <input
                    type='date'
                    className='form-control'
                    value={exportDetails.date}
                    onChange={(e) => handleExportDetailsChange('date', e.target.value)}
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>船公司</label>
                  <input
                    type='text'
                    className='form-control'
                    value={exportDetails.shippingCompany}
                    onChange={(e) => handleExportDetailsChange('shippingCompany', e.target.value)}
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>船名/航次</label>
                  <input
                    type='text'
                    className='form-control'
                    value={exportDetails.shipName}
                    onChange={(e) => handleExportDetailsChange('shipName', e.target.value)}
                  />
                </div>
              </div>
              <div className='row mb-3'>
                <div className='col-md-4'>
                  <label className='form-label'>結關日</label>
                  <input
                    type='date'
                    className='form-control'
                    value={exportDetails.customsClearanceDate}
                    onChange={(e) => handleExportDetailsChange('customsClearanceDate', e.target.value)}
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>領櫃代號</label>
                  <input
                    type='text'
                    className='form-control'
                    value={exportDetails.containerPickupCode}
                    onChange={(e) => handleExportDetailsChange('containerPickupCode', e.target.value)}
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>櫃型</label>
                  <select
                    className='form-select'
                    value={exportDetails.containerType}
                    onChange={(e) => handleExportDetailsChange('containerType', e.target.value)}
                  >
                    <option value=''>請選擇</option>
                    <option value='20GP'>20GP</option>
                    <option value='40GP'>40GP</option>
                    <option value='40HQ'>40HQ</option>
                    <option value='45HQ'>45HQ</option>
                  </select>
                </div>
              </div>
              <div className='row mb-3'>
                <div className='col-md-4'>
                  <label className='form-label'>領櫃場</label>
                  <input
                    type='text'
                    className='form-control'
                    value={exportDetails.containerPickupLocation}
                    onChange={(e) => handleExportDetailsChange('containerPickupLocation', e.target.value)}
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>櫃號</label>
                  <input
                    type='text'
                    className='form-control'
                    value={exportDetails.containerNumber}
                    onChange={(e) => handleExportDetailsChange('containerNumber', e.target.value)}
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>交櫃場</label>
                  <input
                    type='text'
                    className='form-control'
                    value={exportDetails.containerDropoffLocation}
                    onChange={(e) => handleExportDetailsChange('containerDropoffLocation', e.target.value)}
                  />
                </div>
              </div>
              <div className='row mb-3'>
                <div className='col-md-4'>
                  <label className='form-label'>上貨地點</label>
                  <input
                    type='text'
                    className='form-control'
                    value={exportDetails.loadingLocation}
                    onChange={(e) => handleExportDetailsChange('loadingLocation', e.target.value)}
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>上貨日期</label>
                  <input
                    type='date'
                    className='form-control'
                    value={exportDetails.loadingDate}
                    onChange={(e) => handleExportDetailsChange('loadingDate', e.target.value)}
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>上貨時間</label>
                  <input
                    type='time'
                    className='form-control'
                    value={exportDetails.loadingTime}
                    onChange={(e) => handleExportDetailsChange('loadingTime', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 進口訂單詳情 */}
          {orderType === 'IMPORT' && (
            <div className='mb-6'>
              <h5 className='text-dark fw-bold mb-4'>進口訂單詳情</h5>
              <div className='row mb-3'>
                <div className='col-md-4'>
                  <label className='form-label'>日期</label>
                  <input
                    type='date'
                    className='form-control'
                    value={importDetails.date}
                    onChange={(e) => handleImportDetailsChange('date', e.target.value)}
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>提貨單位置(DO)</label>
                  <input
                    type='text'
                    className='form-control'
                    value={importDetails.deliveryOrderLocation}
                    onChange={(e) => handleImportDetailsChange('deliveryOrderLocation', e.target.value)}
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>船公司</label>
                  <input
                    type='text'
                    className='form-control'
                    value={importDetails.shippingCompany}
                    onChange={(e) => handleImportDetailsChange('shippingCompany', e.target.value)}
                  />
                </div>
              </div>
              <div className='row mb-3'>
                <div className='col-md-4'>
                  <label className='form-label'>船名/航次</label>
                  <input
                    type='text'
                    className='form-control'
                    value={importDetails.shipName}
                    onChange={(e) => handleImportDetailsChange('shipName', e.target.value)}
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>櫃號</label>
                  <input
                    type='text'
                    className='form-control'
                    value={importDetails.containerNumber}
                    onChange={(e) => handleImportDetailsChange('containerNumber', e.target.value)}
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>櫃型</label>
                  <select
                    className='form-select'
                    value={importDetails.containerType}
                    onChange={(e) => handleImportDetailsChange('containerType', e.target.value)}
                  >
                    <option value=''>請選擇</option>
                    <option value='20GP'>20GP</option>
                    <option value='40GP'>40GP</option>
                    <option value='40HQ'>40HQ</option>
                    <option value='45HQ'>45HQ</option>
                  </select>
                </div>
              </div>
              <div className='row mb-3'>
                <div className='col-md-4'>
                  <label className='form-label'>櫃場</label>
                  <input
                    type='text'
                    className='form-control'
                    value={importDetails.containerYard}
                    onChange={(e) => handleImportDetailsChange('containerYard', e.target.value)}
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>領櫃期限</label>
                  <input
                    type='date'
                    className='form-control'
                    value={importDetails.containerPickupDeadline}
                    onChange={(e) => handleImportDetailsChange('containerPickupDeadline', e.target.value)}
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>送貨地點</label>
                  <input
                    type='text'
                    className='form-control'
                    value={importDetails.deliveryLocation}
                    onChange={(e) => handleImportDetailsChange('deliveryLocation', e.target.value)}
                  />
                </div>
              </div>
              <div className='row mb-3'>
                <div className='col-md-4'>
                  <label className='form-label'>送貨日期</label>
                  <input
                    type='date'
                    className='form-control'
                    value={importDetails.deliveryDate}
                    onChange={(e) => handleImportDetailsChange('deliveryDate', e.target.value)}
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>送貨時間</label>
                  <input
                    type='time'
                    className='form-control'
                    value={importDetails.deliveryTime}
                    onChange={(e) => handleImportDetailsChange('deliveryTime', e.target.value)}
                  />
                </div>
                <div className='col-md-4'>
                  <label className='form-label'>還櫃地點</label>
                  <input
                    type='text'
                    className='form-control'
                    value={importDetails.containerReturnLocation}
                    onChange={(e) => handleImportDetailsChange('containerReturnLocation', e.target.value)}
                  />
                </div>
              </div>
              <div className='row mb-3'>
                <div className='col-md-6'>
                  <label className='form-label'>還櫃日期</label>
                  <input
                    type='date'
                    className='form-control'
                    value={importDetails.containerReturnDate}
                    onChange={(e) => handleImportDetailsChange('containerReturnDate', e.target.value)}
                  />
                </div>
                <div className='col-md-6'>
                  <label className='form-label'>還櫃時間</label>
                  <input
                    type='time'
                    className='form-control'
                    value={importDetails.containerReturnTime}
                    onChange={(e) => handleImportDetailsChange('containerReturnTime', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 備註 */}
          <div className='mb-6'>
            <label className='form-label'>備註</label>
            <textarea
              className='form-control'
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* 操作按鈕 */}
          <div className='d-flex justify-content-end'>
            <button
              type='button'
              className='btn btn-light me-3'
              onClick={() => navigate('/order/list')}
              disabled={isSubmitting}
            >
              取消
            </button>
            <button 
              type='submit' 
              className='btn btn-primary'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                  建立中...
                </>
              ) : (
                '建立訂單'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
