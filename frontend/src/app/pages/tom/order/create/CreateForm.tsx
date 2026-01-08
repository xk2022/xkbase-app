// 
import React from 'react'
import {useFormik} from 'formik'

import type {CreateTomOrderFormValues} from '../Model'

interface Props {
  submitting: boolean
  onSubmit: (v: CreateTomOrderFormValues) => void
  onCancel: () => void
}

/**
 * ===============================================================
 * CreateForm (MVP)
 * - 只收集「最小建單」欄位
 * - 驗證只做 required（HTML required），不要在 MVP 卡太死
 * ===============================================================
 *
 * MVP 欄位：
 * - orderType
 * - customerUuid + customerName (snapshot)
 * - pickupAddress
 * - deliveryAddress
 * - scheduledAt? / customerRefNo? / note?
 */
export const CreateForm: React.FC<Props> = ({submitting, onSubmit, onCancel}) => {
  const formik = useFormik<CreateTomOrderFormValues>({
    initialValues: {
      orderType: 'IMPORT',

      customerUuid: '',
      customerName: '',

      pickupAddress: '',
      deliveryAddress: '',

      scheduledAt: '',
      customerRefNo: '',
      note: '',
    },
    onSubmit,
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='row g-5'>
        {/* 訂單類型 */}
        <div className='col-md-4'>
          <label className='form-label'>訂單類型</label>
          <select className='form-select' {...formik.getFieldProps('orderType')}>
            <option value='IMPORT'>進口</option>
            <option value='EXPORT'>出口</option>
            <option value='LOCAL'>內陸</option>
          </select>
        </div>

        {/* 客戶 UUID */}
        <div className='col-md-6'>
          <label className='form-label'>客戶 UUID</label>
          <input
            type='text'
            className='form-control'
            placeholder='請輸入客戶 UUID'
            {...formik.getFieldProps('customerUuid')}
            required
            disabled={submitting}
          />
          <div className='form-text'>MVP：先手動輸入，之後再接客戶選擇器</div>
        </div>

        {/* 客戶名稱（快照） */}
        <div className='col-md-6'>
          <label className='form-label'>客戶名稱（快照）</label>
          <input
            type='text'
            className='form-control'
            placeholder='請輸入客戶名稱'
            {...formik.getFieldProps('customerName')}
            required
            disabled={submitting}
          />
        </div>

        {/* 取件地址 */}
        <div className='col-md-12'>
          <label className='form-label'>取件地址</label>
          <input
            type='text'
            className='form-control'
            placeholder='例如：桃園市蘆竹區...'
            {...formik.getFieldProps('pickupAddress')}
            required
            disabled={submitting}
          />
        </div>

        {/* 送達地址 */}
        <div className='col-md-12'>
          <label className='form-label'>送達地址</label>
          <input
            type='text'
            className='form-control'
            placeholder='例如：台北市內湖區...'
            {...formik.getFieldProps('deliveryAddress')}
            required
            disabled={submitting}
          />
        </div>

        {/* 預計時段（可選） */}
        <div className='col-md-6'>
          <label className='form-label'>預計時段（可選）</label>
          <input
            type='datetime-local'
            className='form-control'
            {...formik.getFieldProps('scheduledAt')}
            disabled={submitting}
          />
        </div>

        {/* 客戶參考號（可選） */}
        <div className='col-md-6'>
          <label className='form-label'>客戶參考號（可選）</label>
          <input
            type='text'
            className='form-control'
            placeholder='客戶端單號/參考號'
            {...formik.getFieldProps('customerRefNo')}
            disabled={submitting}
          />
        </div>

        {/* 備註（可選） */}
        <div className='col-md-12'>
          <label className='form-label'>備註（可選）</label>
          <textarea
            className='form-control'
            rows={3}
            placeholder='補充說明（例如：需冷藏、需堆高機...）'
            {...formik.getFieldProps('note')}
            disabled={submitting}
          />
        </div>
      </div>

      {/* actions */}
      <div className='d-flex justify-content-end gap-3 mt-8'>
        <button
          type='button'
          className='btn btn-light'
          onClick={onCancel}
          disabled={submitting}
        >
          取消
        </button>
        <button type='submit' className='btn btn-primary' disabled={submitting}>
          {submitting ? '建立中…' : '建立訂單'}
        </button>
      </div>
    </form>
  )
}
