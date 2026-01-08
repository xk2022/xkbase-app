// src/app/pages/tom/order/assign/AssignModal.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { Modal, Spinner } from 'react-bootstrap'
import { useFormik } from 'formik'

import { KTIcon } from '@/_metronic/helpers'

import type { AlertType } from '@/app/pages/common/AlertType'
import { PageQuery } from '../../../model/PageQuery'

import type { OrderListItem } from '../Model'
import { assignOrder, type AssignOrderReq } from '../Query'

// FMS 模組
import type { Vehicle } from '../../../fms/vehicle/Model'
import { fetchVehicles } from '../../../fms/vehicle/Query'
import type { Driver } from '../../../fms/driver/Model'
import { fetchDrivers } from '../../../fms/driver/Query'

interface AssignModalProps {
  open: boolean
  order: OrderListItem
  onClose: () => void
  onSuccess: () => void
  showAlert: (message: string, type: AlertType) => void
}

interface AssignFormValues {
  vehicleId: string
  driverId: string
}

/**
 * ===============================================================
 * AssignModal (指派表單 Modal)
 * - 顯示訂單資訊
 * - 選擇車輛和司機
 * - 提交指派請求
 * ===============================================================
 */
const AssignModal: React.FC<AssignModalProps> = ({
  open,
  order,
  onClose,
  onSuccess,
  showAlert,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  const [loadingDrivers, setLoadingDrivers] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // 載入車輛列表（只載入可用的車輛）
  const loadVehicles = useCallback(async () => {
    setLoadingVehicles(true)
    try {
      const query: PageQuery = {
        page: 0,
        size: 100, // 一次載入較多車輛
        // 可以添加狀態過濾：status: 'AVAILABLE'
      }
      const data = await fetchVehicles(query, showAlert)
      // 過濾出可用的車輛
      const availableVehicles = data.content.filter(
        (v) => v.status === 'AVAILABLE' || v.status === 'IDLE' || v.enabled
      )
      setVehicles(availableVehicles)
    } catch (error) {
      console.error('載入車輛列表失敗:', error)
      showAlert('載入車輛列表失敗', 'danger')
    } finally {
      setLoadingVehicles(false)
    }
  }, [showAlert])

  // 載入司機列表（只載入可用的司機）
  const loadDrivers = useCallback(async () => {
    setLoadingDrivers(true)
    try {
      const query: PageQuery = {
        page: 0,
        size: 100, // 一次載入較多司機
      }
      const data = await fetchDrivers(query, showAlert)
      // 過濾出可用的司機
      const availableDrivers = data.content.filter(
        (d) => d.status === 'ACTIVE' && d.onDuty
      )
      setDrivers(availableDrivers)
    } catch (error) {
      console.error('載入司機列表失敗:', error)
      showAlert('載入司機列表失敗', 'danger')
    } finally {
      setLoadingDrivers(false)
    }
  }, [showAlert])

  // Modal 打開時載入數據
  useEffect(() => {
    if (open) {
      loadVehicles()
      loadDrivers()
    }
  }, [open, loadVehicles, loadDrivers])

  const formik = useFormik<AssignFormValues>({
    initialValues: {
      vehicleId: '',
      driverId: '',
    },
    onSubmit: async (values) => {
      if (!values.vehicleId || !values.driverId) {
        showAlert('請選擇車輛和司機', 'warning')
        return
      }

      setSubmitting(true)
      try {
      // 使用 UUID (string) 作為 vehicleId 和 driverId
      // 如果後端需要 number，會在 Query.tsx 中進行轉換
      const payload: AssignOrderReq = {
        vehicleId: values.vehicleId,
        driverId: values.driverId,
      }

        const ok = await assignOrder(String(order.id), payload, showAlert)
        if (ok) {
          onSuccess()
          formik.resetForm()
        }
      } catch (error) {
        console.error('指派訂單失敗:', error)
        showAlert('指派訂單失敗，請稍後再試', 'danger')
      } finally {
        setSubmitting(false)
      }
    },
  })

  const handleClose = useCallback(() => {
    if (!submitting) {
      formik.resetForm()
      onClose()
    }
  }, [formik, onClose, submitting])

  return (
    <Modal show={open} onHide={handleClose} size='lg' backdrop={!submitting}>
      <form onSubmit={formik.handleSubmit}>
        <Modal.Header closeButton={!submitting}>
          <Modal.Title>
            <KTIcon iconName='truck' className='fs-2 me-2 text-primary' />
            指派訂單
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* 訂單資訊 */}
          <div className='mb-6'>
            <h5 className='mb-3'>訂單資訊</h5>
            <div className='row g-3'>
              <div className='col-md-6'>
                <label className='form-label text-muted'>訂單編號</label>
                <div className='form-control-plaintext fw-bold'>
                  {(order as any).orderNo ?? order.id ?? '-'}
                </div>
              </div>
              <div className='col-md-6'>
                <label className='form-label text-muted'>客戶名稱</label>
                <div className='form-control-plaintext'>
                  {(order as any).customerName ?? '-'}
                </div>
              </div>
              <div className='col-md-12'>
                <label className='form-label text-muted'>路線</label>
                <div className='form-control-plaintext'>
                  {(order as any).pickupLocation ?? '-'} → {(order as any).destinationPort ?? '-'}
                </div>
              </div>
            </div>
          </div>

          <hr className='my-6' />

          {/* 指派表單 */}
          <h5 className='mb-4'>選擇車輛與司機</h5>

          {/* 車輛選擇 */}
          <div className='mb-6'>
            <label className='form-label required'>車輛</label>
            {loadingVehicles ? (
              <div className='d-flex align-items-center'>
                <Spinner size='sm' className='me-2' />
                <span className='text-muted'>載入車輛列表中...</span>
              </div>
            ) : vehicles.length === 0 ? (
              <div className='alert alert-warning mb-0'>
                <KTIcon iconName='information-5' className='fs-2 me-2' />
                目前沒有可用的車輛
              </div>
            ) : (
              <select
                className='form-select'
                {...formik.getFieldProps('vehicleId')}
                required
                disabled={submitting}
              >
                <option value=''>請選擇車輛</option>
                {vehicles.map((v) => (
                  <option key={v.uuid} value={v.uuid}>
                    {v.plateNo} - {v.type} {v.brand && v.model ? `(${v.brand} ${v.model})` : ''}
                    {v.status === 'IN_USE' ? ' [使用中]' : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 司機選擇 */}
          <div className='mb-6'>
            <label className='form-label required'>司機</label>
            {loadingDrivers ? (
              <div className='d-flex align-items-center'>
                <Spinner size='sm' className='me-2' />
                <span className='text-muted'>載入司機列表中...</span>
              </div>
            ) : drivers.length === 0 ? (
              <div className='alert alert-warning mb-0'>
                <KTIcon iconName='information-5' className='fs-2 me-2' />
                目前沒有可用的司機
              </div>
            ) : (
              <select
                className='form-select'
                {...formik.getFieldProps('driverId')}
                required
                disabled={submitting}
              >
                <option value=''>請選擇司機</option>
                {drivers.map((d) => (
                  <option key={d.uuid} value={d.uuid}>
                    {d.name} - {d.phone}
                    {d.currentVehicleId ? ` [車輛: ${d.currentVehiclePlateNo ?? '-'}]` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 提示訊息 */}
          <div className='alert alert-info mb-0'>
            <KTIcon iconName='information-5' className='fs-2 me-2' />
            <div>
              <strong>提示：</strong>
              <ul className='mb-0 mt-2'>
                <li>請選擇可用的車輛和司機</li>
                <li>指派成功後，訂單狀態將變更為「已指派」</li>
                <li>司機將收到派單通知</li>
              </ul>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            type='button'
            className='btn btn-light'
            onClick={handleClose}
            disabled={submitting}
          >
            取消
          </button>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={submitting || !formik.values.vehicleId || !formik.values.driverId}
          >
            {submitting ? (
              <>
                <span className='spinner-border spinner-border-sm me-2' />
                指派中...
              </>
            ) : (
              <>
                <KTIcon iconName='check' className='fs-2 me-2' />
                確認指派
              </>
            )}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default AssignModal
