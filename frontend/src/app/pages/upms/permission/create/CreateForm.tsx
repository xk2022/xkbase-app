// src/app/pages/upms/permission/create/CreateForm.tsx
import React, {useEffect, useMemo, useState} from 'react'
import type {CreatePermissionReq} from '../Model'

import {trim, toUndef, upper, CODE_RE} from '@/app/pages/common/form/formUtils'
import {useFormMeta} from '@/app/pages/common/form/useFormMeta'

// 取得 systemCode 清單（UPMS System）
import {fetchSystems} from '@/app/pages/upms/system/Query'
import type {System} from '@/app/pages/upms/system/Model'

/** ===============================================================
 * Types
 * =============================================================== */
type Props = {
  submitting?: boolean
  onSubmit: (values: CreatePermissionReq) => void | Promise<void>
  onCancel: () => void
}

type SystemOption = Pick<System, 'code' | 'name'>

const ACTION_OPTIONS = [
  {value: 'CREATE', label: 'CREATE（新增）'},
  {value: 'READ', label: 'READ（查詢）'},
  {value: 'UPDATE', label: 'UPDATE（更新）'},
  {value: 'DELETE', label: 'DELETE（刪除）'},
  {value: 'LIST', label: 'LIST（列表）'},
  {value: 'MANAGE', label: 'MANAGE（管理/全權）'},
]

/** ===============================================================
 * Component
 * =============================================================== */
export const CreateForm: React.FC<Props> = ({
  submitting = false,
  onSubmit,
  onCancel,
}) => {
  /** -----------------------------
   * State
   * ------------------------------ */
  const [systems, setSystems] = useState<SystemOption[]>([])
  const [loadingSystems, setLoadingSystems] = useState(false)

  const [values, setValues] = useState<CreatePermissionReq>({
    // code / groupKey 會自動從三碼組合（下方 computed + readonly 顯示）
    systemCode: '',
    resourceCode: '',
    actionCode: 'READ',
    name: '',
    description: '',
    enabled: true,
    sortOrder: 0,
  })

  /** ===============================================================
   * Helpers
   * =============================================================== */
  const {touch, markSubmitted, showError, invalidClass} =
    useFormMeta<CreatePermissionReq>()

  /** ===============================================================
   * System options from API
   * =============================================================== */
  useEffect(() => {
    let mounted = true

    const run = async () => {
      setLoadingSystems(true)
      try {
        // 依你的 fetchSystems 設計：PageQuery(page/size/keyword)
        const page = await fetchSystems({page: 0, size: 200, keyword: ''})
        const content = (page.content ?? []) as System[]
        const opts: SystemOption[] = content.map((s) => ({
          code: s.code,
          name: s.name,
        }))

        if (mounted) {
          setSystems(opts)
          // 若目前沒選，且有第一筆，預設帶入（可依喜好拿掉）
          if (!values.systemCode && opts.length > 0) {
            setValues((p) => ({...p, systemCode: opts[0].code}))
          }
        }
      } catch {
        // 這裡不 showAlert，避免 CreateForm 依賴外層；失敗就留空讓使用者手動填
        if (mounted) setSystems([])
      } finally {
        if (mounted) setLoadingSystems(false)
      }
    }

    run()
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** -----------------------------
   * Computed: groupKey / code
   * ------------------------------ */
  const computed = useMemo(() => {
    const systemCode = upper(values.systemCode)
    const resourceCode = upper(values.resourceCode)
    const actionCode = upper(values.actionCode)

    const groupKey =
      systemCode && resourceCode ? `${systemCode}_${resourceCode}` : ''
    const code =
      systemCode && resourceCode && actionCode
        ? `${systemCode}_${resourceCode}_${actionCode}`
        : ''

    return {systemCode, resourceCode, actionCode, groupKey, code}
  }, [values.systemCode, values.resourceCode, values.actionCode])

  /** -----------------------------
   * Validation
   * ------------------------------ */
  const errors: Partial<Record<keyof CreatePermissionReq, string>> = useMemo(() => {
    const e: Partial<Record<keyof CreatePermissionReq, string>> = {}

    const systemCode = computed.systemCode
    const resourceCode = computed.resourceCode
    const actionCode = computed.actionCode
    const name = trim(values.name)
    const desc = trim(values.description)

    if (!systemCode) e.systemCode = '系統代碼為必填'
    else if (!CODE_RE.test(systemCode))
      e.systemCode = '格式不正確（2~50，英數 + _-，且需以英數開頭）'

    if (!resourceCode) e.resourceCode = '資源代碼為必填'
    else if (!CODE_RE.test(resourceCode))
      e.resourceCode = '格式不正確（2~50，英數 + _-，且需以英數開頭）'

    if (!actionCode) e.actionCode = '動作代碼為必填'
    else if (!CODE_RE.test(actionCode))
      e.actionCode = '格式不正確（2~50，英數 + _-，且需以英數開頭）'

    if (!name) e.name = '權限名稱為必填'
    else if (name.length > 100) e.name = '權限名稱長度不可超過 100'

    if (desc && desc.length > 500) e.description = '說明長度不可超過 500'

    const so = Number(values.sortOrder)
    if (Number.isNaN(so)) e.sortOrder = '排序必須為數字'
    else if (so < 0) e.sortOrder = '排序不可小於 0'
    else if (!Number.isInteger(so)) e.sortOrder = '排序必須為整數'

    return e
  }, [
    values.name,
    values.description,
    values.sortOrder,
    computed.systemCode,
    computed.resourceCode,
    computed.actionCode,
  ])

  /** -----------------------------
   * Handlers
   * ------------------------------ */
  const set =
    (k: keyof CreatePermissionReq) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setValues((p) => ({...p, [k]: e.target.value}))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    markSubmitted()
    if (Object.keys(errors).length) return

    await onSubmit({
      ...values,

      systemCode: computed.systemCode,
      resourceCode: computed.resourceCode,
      actionCode: computed.actionCode,

      name: trim(values.name),
      description: toUndef(trim(values.description)),
      enabled: !!values.enabled,
      sortOrder: Number(values.sortOrder),
    })
  }

  return (
    <form onSubmit={submit} className='form'>
      <div className='row g-6'>
        {/* systemCode (from api) */}
        <div className='col-12 col-lg-4'>
          <label className='form-label fw-bold'>
            系統代碼 <span className='text-danger'>*</span>
          </label>

          {systems.length > 0 ? (
            <select
              className={`form-select form-select-solid ${invalidClass(
                'systemCode',
                errors,
              )}`}
              value={values.systemCode}
              onChange={(e) =>
                setValues((p) => ({
                  ...p,
                  systemCode: e.target.value.toUpperCase(),
                }))
              }
              onBlur={touch('systemCode')}
              disabled={submitting || loadingSystems}
            >
              {systems.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.code}（{s.name}）
                </option>
              ))}
            </select>
          ) : (
            <input
              className={`form-control form-control-solid ${invalidClass(
                'systemCode',
                errors,
              )}`}
              placeholder='例如：UPMS / TOM / ADM'
              value={values.systemCode}
              onChange={(e) =>
                setValues((p) => ({
                  ...p,
                  systemCode: e.target.value.toUpperCase(),
                }))
              }
              onBlur={touch('systemCode')}
              disabled={submitting}
              autoFocus
            />
          )}

          <div className='form-text text-muted'>
            {systems.length > 0
              ? '已從系統清單載入，可直接選擇'
              : '尚未載入系統清單時可手動輸入；會自動轉大寫'}
          </div>
          {showError('systemCode', errors) && (
            <div className='invalid-feedback'>{errors.systemCode}</div>
          )}
        </div>

        {/* resourceCode */}
        <div className='col-12 col-lg-4'>
          <label className='form-label fw-bold'>
            資源代碼 <span className='text-danger'>*</span>
          </label>
          <input
            className={`form-control form-control-solid ${invalidClass(
              'resourceCode',
              errors,
            )}`}
            placeholder='例如：USER / ROLE / PERMISSION / ORDER'
            value={values.resourceCode}
            onChange={(e) =>
              setValues((p) => ({
                ...p,
                resourceCode: e.target.value.toUpperCase(),
              }))
            }
            onBlur={touch('resourceCode')}
            disabled={submitting}
          />
          {showError('resourceCode', errors) && (
            <div className='invalid-feedback'>{errors.resourceCode}</div>
          )}
        </div>

        {/* actionCode */}
        <div className='col-12 col-lg-4'>
          <label className='form-label fw-bold'>
            動作代碼 <span className='text-danger'>*</span>
          </label>
          <select
            className={`form-select form-select-solid ${invalidClass(
              'actionCode',
              errors,
            )}`}
            value={values.actionCode}
            onChange={(e) =>
              setValues((p) => ({
                ...p,
                actionCode: e.target.value.toUpperCase(),
              }))
            }
            onBlur={touch('actionCode')}
            disabled={submitting}
          >
            {ACTION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {showError('actionCode', errors) && (
            <div className='invalid-feedback'>{errors.actionCode}</div>
          )}
        </div>

        {/* groupKey (readonly computed) */}
        <div className='col-12 col-lg-6'>
          <label className='form-label fw-bold'>分組鍵（groupKey）</label>
          <input
            className='form-control form-control-solid'
            value={computed.groupKey}
            readOnly
            disabled
          />
          <div className='form-text text-muted'>
            自動組合：<code>SYSTEM_RESOURCE</code>
          </div>
        </div>

        {/* code (readonly computed) */}
        <div className='col-12 col-lg-6'>
          <label className='form-label fw-bold'>權限代碼（code）</label>
          <input
            className='form-control form-control-solid'
            value={computed.code}
            readOnly
            disabled
          />
          <div className='form-text text-muted'>
            自動組合：<code>SYSTEM_RESOURCE_ACTION</code>
          </div>
        </div>

        {/* name */}
        <div className='col-12 col-lg-8'>
          <label className='form-label fw-bold'>
            權限名稱 <span className='text-danger'>*</span>
          </label>
          <input
            className={`form-control form-control-solid ${invalidClass(
              'name',
              errors,
            )}`}
            placeholder='例如：使用者-查詢 / 訂單-建立 / 派遣-管理'
            value={values.name}
            onChange={set('name')}
            onBlur={touch('name')}
            disabled={submitting}
          />
          {showError('name', errors) && (
            <div className='invalid-feedback'>{errors.name}</div>
          )}
        </div>

        {/* sortOrder (no any) */}
        <div className='col-12 col-lg-4'>
          <label className='form-label fw-bold'>排序</label>
          <input
            className={`form-control form-control-solid ${invalidClass(
              'sortOrder',
              errors,
            )}`}
            type='number'
            min={0}
            step={1}
            placeholder='例如：0'
            value={values.sortOrder ?? 0}
            onChange={(e) => {
              const raw = e.target.value
              const n = raw === '' ? 0 : Number(raw)
              setValues((p) => ({
                ...p,
                sortOrder: Number.isNaN(n) ? p.sortOrder : Math.max(0, Math.trunc(n)),
              }))
            }}
            onBlur={touch('sortOrder')}
            disabled={submitting}
          />
          {showError('sortOrder', errors) && (
            <div className='invalid-feedback d-block'>{errors.sortOrder}</div>
          )}
        </div>

        {/* enabled */}
        <div className='col-12'>
          <div className='form-check form-switch'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={!!values.enabled}
              onChange={(e) =>
                setValues((p) => ({...p, enabled: e.target.checked}))
              }
              disabled={submitting}
            />
            <label className='form-check-label'>啟用</label>
          </div>
          <div className='text-muted fs-8 mt-1'>停用後通常不允許授權（視後端規則）</div>
        </div>

        {/* description */}
        <div className='col-12'>
          <label className='form-label fw-bold'>說明</label>
          <textarea
            className={`form-control form-control-solid ${invalidClass(
              'description',
              errors,
            )}`}
            placeholder='可留空（例如：提供後台列表查詢權限）'
            rows={3}
            value={values.description ?? ''}
            onChange={set('description')}
            onBlur={touch('description')}
            disabled={submitting}
          />
          {showError('description', errors) && (
            <div className='invalid-feedback d-block'>{errors.description}</div>
          )}
        </div>
      </div>

      <div className='d-flex justify-content-end gap-3 mt-10'>
        <button
          type='button'
          className='btn btn-light'
          onClick={onCancel}
          disabled={submitting}
        >
          取消
        </button>
        <button type='submit' className='btn btn-primary' disabled={submitting}>
          新增權限
        </button>
      </div>
    </form>
  )
}
