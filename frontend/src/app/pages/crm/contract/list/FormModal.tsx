// src/app/pages/crm/contract/list/FormModal.tsx
import React, { useEffect, useState } from 'react'
import { KTIcon } from '@/_metronic/helpers'

import type { AlertType } from '@/app/pages/common/AlertType'
import type {
  ContractTemplateListItem,
  CreateContractTemplateReq,
  UpdateContractTemplateReq,
  ContractStatus,
  BillingMode,
  StandardClause,
  BillingRule,
} from '../../Model'
import { createContractTemplate, updateContractTemplate } from '../../Query'

type Props = {
  open: boolean
  onClose: () => void
  onSaved: () => void
  showAlert: (message: string, type: AlertType) => void
  editingContract: ContractTemplateListItem | null
}

const normalizeText = (v: string) => v.trim()

export const FormModal: React.FC<Props> = ({
  open,
  onClose,
  onSaved,
  showAlert,
  editingContract,
}) => {
  const isEdit = !!editingContract

  const [name, setName] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [status, setStatus] = useState<ContractStatus>('draft')
  const [effectiveDate, setEffectiveDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [note, setNote] = useState('')
  const [clauses, setClauses] = useState<Omit<StandardClause, 'id'>[]>([])
  const [billingRules, setBillingRules] = useState<Omit<BillingRule, 'id'>[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return

    if (!editingContract) {
      setName('')
      setCustomerId('')
      setStatus('draft')
      setEffectiveDate('')
      setExpiryDate('')
      setNote('')
      setClauses([])
      setBillingRules([{ mode: 'volume' }])
      return
    }

    setName(editingContract.name || '')
    setCustomerId(editingContract.customerId || '')
    setStatus(editingContract.status || 'draft')
    setEffectiveDate(editingContract.effectiveDate || '')
    setExpiryDate(editingContract.expiryDate || '')
  }, [open, editingContract])

  const validate = () => {
    if (!normalizeText(name)) {
      showAlert('請輸入合約名稱', 'warning')
      return false
    }

    if (billingRules.length === 0) {
      showAlert('請至少設定一個計費規則', 'warning')
      return false
    }

    return true
  }

  const handleSave = async () => {
    if (!validate()) return

    try {
      setSaving(true)

      if (isEdit && editingContract) {
        const payload: UpdateContractTemplateReq = {
          name: normalizeText(name),
          customerId: normalizeText(customerId) || undefined,
          status,
          effectiveDate: effectiveDate || undefined,
          expiryDate: expiryDate || undefined,
          clauses: clauses.length > 0 ? clauses : undefined,
          billingRules: billingRules.length > 0 ? billingRules : undefined,
          note: normalizeText(note) || undefined,
        }
        await updateContractTemplate(editingContract.id, payload, showAlert)
      } else {
        const payload: CreateContractTemplateReq = {
          name: normalizeText(name),
          customerId: normalizeText(customerId) || undefined,
          effectiveDate: effectiveDate || undefined,
          expiryDate: expiryDate || undefined,
          clauses: clauses.length > 0 ? clauses : undefined,
          billingRules,
          note: normalizeText(note) || undefined,
        }
        await createContractTemplate(payload, showAlert)
      }

      onSaved()
    } catch (e) {
      console.error(e)
      showAlert('儲存失敗，請稍後再試', 'danger')
    } finally {
      setSaving(false)
    }
  }

  const addClause = () => {
    setClauses([...clauses, { title: '', content: '', order: clauses.length + 1 }])
  }

  const removeClause = (index: number) => {
    setClauses(clauses.filter((_, i) => i !== index))
  }

  const updateClause = (index: number, field: keyof StandardClause, value: string | number) => {
    const updated = [...clauses]
    updated[index] = { ...updated[index], [field]: value }
    setClauses(updated)
  }

  const addBillingRule = () => {
    setBillingRules([...billingRules, { mode: 'volume' }])
  }

  const removeBillingRule = (index: number) => {
    setBillingRules(billingRules.filter((_, i) => i !== index))
  }

  const updateBillingRule = (index: number, field: keyof BillingRule, value: any) => {
    const updated = [...billingRules]
    updated[index] = { ...updated[index], [field]: value }
    setBillingRules(updated)
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
      <div className='modal-dialog modal-xl'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>
              <KTIcon
                iconName={isEdit ? 'message-edit' : 'plus'}
                className='fs-2 me-2'
              />
              {isEdit ? '編輯合約模板' : '新增合約模板'}
            </h5>
            <button
              type='button'
              className='btn btn-sm btn-light'
              onClick={onClose}
              disabled={saving}
            >
              ×
            </button>
          </div>

          <div className='modal-body'>
            <div className='row g-5 mb-5'>
              <div className='col-12 col-md-6'>
                <label className='form-label required'>合約名稱</label>
                <input
                  className='form-control'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='請輸入合約名稱'
                  autoFocus={!isEdit}
                />
              </div>
              <div className='col-12 col-md-6'>
                <label className='form-label'>關聯客戶 ID</label>
                <input
                  className='form-control'
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder='留空則為通用模板'
                />
              </div>
              {isEdit && (
                <div className='col-12 col-md-6'>
                  <label className='form-label'>狀態</label>
                  <select
                    className='form-select'
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ContractStatus)}
                  >
                    <option value='draft'>草稿</option>
                    <option value='active'>啟用</option>
                    <option value='expired'>已過期</option>
                    <option value='archived'>已歸檔</option>
                  </select>
                </div>
              )}
              <div className='col-12 col-md-6'>
                <label className='form-label'>生效日期</label>
                <input
                  className='form-control'
                  type='date'
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                />
              </div>
              <div className='col-12 col-md-6'>
                <label className='form-label'>到期日期</label>
                <input
                  className='form-control'
                  type='date'
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
            </div>

            {/* 標準條款 */}
            <div className='mb-5'>
              <div className='d-flex justify-content-between align-items-center mb-3'>
                <h5 className='mb-0'>標準條款</h5>
                <button className='btn btn-sm btn-light-primary' onClick={addClause}>
                  <KTIcon iconName='plus' className='fs-7' />
                  新增條款
                </button>
              </div>
              {clauses.map((clause, index) => (
                <div key={index} className='card mb-3'>
                  <div className='card-body'>
                    <div className='d-flex justify-content-end mb-2'>
                      <button
                        className='btn btn-sm btn-light-danger'
                        onClick={() => removeClause(index)}
                      >
                        <KTIcon iconName='trash' className='fs-7' />
                      </button>
                    </div>
                    <div className='row g-3'>
                      <div className='col-12'>
                        <label className='form-label'>條款標題</label>
                        <input
                          className='form-control'
                          value={clause.title}
                          onChange={(e) => updateClause(index, 'title', e.target.value)}
                          placeholder='例如：服務範圍'
                        />
                      </div>
                      <div className='col-12'>
                        <label className='form-label'>條款內容</label>
                        <textarea
                          className='form-control'
                          rows={3}
                          value={clause.content}
                          onChange={(e) => updateClause(index, 'content', e.target.value)}
                          placeholder='請輸入條款內容'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {clauses.length === 0 && (
                <div className='text-center text-muted py-5'>
                  <p>尚無標準條款，點擊「新增條款」開始新增</p>
                </div>
              )}
            </div>

            {/* 計費規則 */}
            <div className='mb-5'>
              <div className='d-flex justify-content-between align-items-center mb-3'>
                <h5 className='mb-0'>計費規則</h5>
                <button className='btn btn-sm btn-light-primary' onClick={addBillingRule}>
                  <KTIcon iconName='plus' className='fs-7' />
                  新增規則
                </button>
              </div>
              {billingRules.map((rule, index) => (
                <div key={index} className='card mb-3'>
                  <div className='card-body'>
                    <div className='d-flex justify-content-end mb-2'>
                      <button
                        className='btn btn-sm btn-light-danger'
                        onClick={() => removeBillingRule(index)}
                      >
                        <KTIcon iconName='trash' className='fs-7' />
                      </button>
                    </div>
                    <div className='row g-3'>
                      <div className='col-12 col-md-6'>
                        <label className='form-label required'>計費模式</label>
                        <select
                          className='form-select'
                          value={rule.mode}
                          onChange={(e) => updateBillingRule(index, 'mode', e.target.value as BillingMode)}
                        >
                          <option value='fixed'>固定價格</option>
                          <option value='volume'>按量計費</option>
                          <option value='distance'>按距離計費</option>
                          <option value='time'>按時間計費</option>
                          <option value='hybrid'>混合模式</option>
                        </select>
                      </div>
                      {rule.mode === 'fixed' && (
                        <div className='col-12 col-md-6'>
                          <label className='form-label'>基礎價格</label>
                          <input
                            className='form-control'
                            type='number'
                            value={rule.basePrice || ''}
                            onChange={(e) => updateBillingRule(index, 'basePrice', Number(e.target.value))}
                            placeholder='請輸入價格'
                          />
                        </div>
                      )}
                      {rule.mode !== 'fixed' && (
                        <>
                          <div className='col-12 col-md-6'>
                            <label className='form-label'>單價</label>
                            <input
                              className='form-control'
                              type='number'
                              value={rule.unitPrice || ''}
                              onChange={(e) => updateBillingRule(index, 'unitPrice', Number(e.target.value))}
                              placeholder='請輸入單價'
                            />
                          </div>
                          <div className='col-12 col-md-6'>
                            <label className='form-label'>計費單位</label>
                            <input
                              className='form-control'
                              value={rule.unit || ''}
                              onChange={(e) => updateBillingRule(index, 'unit', e.target.value)}
                              placeholder='例如：元/立方公尺'
                            />
                          </div>
                        </>
                      )}
                      <div className='col-12 col-md-6'>
                        <label className='form-label'>最低收費</label>
                        <input
                          className='form-control'
                          type='number'
                          value={rule.minCharge || ''}
                          onChange={(e) => updateBillingRule(index, 'minCharge', Number(e.target.value))}
                          placeholder='可選'
                        />
                      </div>
                      <div className='col-12 col-md-6'>
                        <label className='form-label'>最高收費</label>
                        <input
                          className='form-control'
                          type='number'
                          value={rule.maxCharge || ''}
                          onChange={(e) => updateBillingRule(index, 'maxCharge', Number(e.target.value))}
                          placeholder='可選'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 備註 */}
            <div className='mb-5'>
              <label className='form-label'>備註</label>
              <textarea
                className='form-control'
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder='可選'
              />
            </div>
          </div>

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
