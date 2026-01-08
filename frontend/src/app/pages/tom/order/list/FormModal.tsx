// src/app/pages/tom/order/FormModal.tsx
import React, { useEffect, useState } from 'react'
import { KTIcon } from '@/_metronic/helpers'

import type { AlertType } from '@/app/pages/common/AlertType'
import type {
  CreateOrderReq,
  OrderListItem,
  OrderType,
  UpdateOrderReq,
} from '../Model'
import { updateOrder } from '../Query'

/**
 * ===============================================================
 * FormModal（TOM 訂單快速建立 / 編輯 Modal）
 * ---------------------------------------------------------------
 * 職責：
 * - Create / Edit 的「快速欄位」編輯（v1）
 * - Create：orderType + customerId + containerNumber + shipDate + note
 * - Edit：同上（是否允許取決於後端規則：僅 pending 可改）
 *
 * 不做：
 * - 指派（/assign）
 * - 進出口完整欄位（v2 再拆 Export/Import Form）
 * - 跳頁（交給父層 List/Overview）
 * ===============================================================
 */

type Props = {
  open: boolean
  onClose: () => void
  onSaved: () => void
  showAlert: (message: string, type: AlertType) => void
  editingOrder: OrderListItem | null // null = create, 非 null = edit
}

const normalizeText = (v: string) => v.trim()

export const FormModal: React.FC<Props> = ({
  open,
  onClose,
  onSaved,
  showAlert,
  editingOrder,
}) => {
  // =============================================================
  // Derived
  // =============================================================
  const isEdit = !!editingOrder

  // =============================================================
  // Form State (v1 minimal)
  // =============================================================
  const [orderType, setOrderType] = useState<OrderType>('export')
  const [customerId, setCustomerId] = useState<number | ''>('')
  const [containerNumber, setContainerNumber] = useState('')
  const [shipDate, setShipDate] = useState('') // YYYY-MM-DD
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  // =============================================================
  // Init / Reset
  // =============================================================
  useEffect(() => {
    if (!open) return

    if (!editingOrder) {
      setOrderType('export')
      setCustomerId('')
      setContainerNumber('')
      setShipDate('')
      setNote('')
      return
    }

    setOrderType(editingOrder.orderType ?? 'export')
    setContainerNumber(editingOrder.containerNumber ?? '')
  }, [open, editingOrder])

  // =============================================================
  // Validation
  // =============================================================
  const validate = () => {
    if (!orderType) {
      showAlert('請選擇訂單類型', 'warning')
      return false
    }

    if (customerId === '' || Number.isNaN(Number(customerId))) {
      showAlert('請輸入客戶 ID（customerId）', 'warning')
      return false
    }

    // v1 先用櫃號作為最小可搜尋識別（你之後也能改成 keyword）
    if (!normalizeText(containerNumber)) {
      showAlert('請輸入櫃號（containerNumber）', 'warning')
      return false
    }

    if (!shipDate) {
      showAlert('請選擇日期（shipDate）', 'warning')
      return false
    }

    return true
  }

  // =============================================================
  // Save
  // =============================================================
  const handleSave = async () => {
    if (!validate()) return

    try {
      setSaving(true)

      if (isEdit && editingOrder) {
        const payload: UpdateOrderReq = {
          orderType,
          customerId: String(customerId),
          containerNumber: normalizeText(containerNumber),
          shipDate,
          note: note.trim() || undefined,
        }
        await updateOrder(editingOrder.orderId, payload, showAlert)
      } else {
        const payload: CreateOrderReq = {
          orderType,
          customerUuid: Number(customerId),
          containerNumber: normalizeText(containerNumber),
          shipDate,
          note: note.trim(),
        }
        // await createOrder(payload, showAlert)
      }

      onSaved()
    } catch (e) {
      console.error(e)
      showAlert('儲存失敗，請稍後再試', 'danger')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div
      className='modal fade show d-block'
      tabIndex={-1}
      style={{ backgroundColor: 'rgba(0,0,0,.25)' }}
      role='dialog'
      aria-modal='true'
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          {/* Header */}
          <div className='modal-header'>
            <h5 className='modal-title'>
              <KTIcon
                iconName={isEdit ? 'message-edit' : 'plus'}
                className='fs-2 me-2'
              />
              {isEdit ? '編輯訂單' : '建立訂單'}
            </h5>

            <button
              type='button'
              className='btn btn-sm btn-light'
              onClick={onClose}
              disabled={saving}
              aria-label='Close'
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className='modal-body'>
            <div className='row g-5'>
              {/* Left */}
              <div className='col-12 col-md-6 d-flex flex-column gap-3'>
                <div>
                  <label className='form-label required'>訂單類型（orderType）</label>
                  <select
                    className='form-select'
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as OrderType)}
                  >
                    <option value='export'>出口</option>
                    <option value='import'>進口</option>
                  </select>
                </div>

                <div>
                  <label className='form-label required'>客戶 ID（customerId）</label>
                  <input
                    className='form-control'
                    value={customerId}
                    onChange={(e) => {
                      const v = e.target.value
                      setCustomerId(v === '' ? '' : Number(v))
                    }}
                    placeholder='例如：1001'
                    inputMode='numeric'
                  />
                </div>

                <div>
                  <label className='form-label required'>日期（shipDate）</label>
                  <input
                    className='form-control'
                    type='date'
                    value={shipDate}
                    onChange={(e) => setShipDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Right */}
              <div className='col-12 col-md-6 d-flex flex-column gap-3'>
                <div>
                  <label className='form-label required'>櫃號（containerNumber）</label>
                  <input
                    className='form-control'
                    value={containerNumber}
                    onChange={(e) => setContainerNumber(e.target.value)}
                    placeholder='例如：TGHU1234567'
                    autoFocus={!isEdit}
                  />
                </div>

                <div>
                  <label className='form-label'>備註（note）</label>
                  <textarea
                    className='form-control'
                    rows={5}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder='可留空'
                  />
                </div>
              </div>
            </div>

            {/* Hint */}
            <div className='text-muted fs-8 mt-4'>
              v1 先做最小可用欄位；進口/出口完整欄位（船名航次、結關日、領櫃/還櫃等）將於 v2 擴充。
            </div>
          </div>

          {/* Footer */}
          <div className='modal-footer'>
            <button className='btn btn-light' onClick={onClose} disabled={saving}>
              取消
            </button>
            <button className='btn btn-primary' onClick={handleSave} disabled={saving}>
              {saving ? '儲存中…' : '儲存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
