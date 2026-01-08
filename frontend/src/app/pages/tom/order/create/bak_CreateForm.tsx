// src/app/pages/tom/order/CreateForm.tsx
import React, { useMemo, useState } from 'react'
import type { OrderFormValues } from '../Model'

/** ===============================================================
 * Types
 * =============================================================== */
type Props = {
  submitting?: boolean
  onSubmit: (values: OrderFormValues) => void | Promise<void>
  onCancel: () => void
}

/** ===============================================================
 * Helpers
 * =============================================================== */
// const CONTAINER_RE = /^[A-Z]{4}\d{7}$/ // MSCU1234567
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const trim = (v?: string) => (v ?? '').trim()
const toUndef = (v?: string) => {
  const t = trim(v)
  return t ? t : undefined
}
const upper = (v?: string) => trim(v).toUpperCase()

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
  const [values, setValues] = useState<OrderFormValues>({
    orderType: 'import',

    // import base
    customerUuid: '',
    pickupAddress: '',
    deliveryAddress: '',
    scheduledAt: '',

    // shipping/container
    shippingCompany: '',
    vesselVoyage: '',
    containerNo: '',
    containerType: '',
    packageQty: '',
    grossWeight: '',
    cbm: '',
    pol: '',
    pod: '',
    etd: '',
    eta: '',

    // import detail
    deliveryOrderLocation: '',
    importDeclNo: '',
    blNo: '',
    customsReleaseTime: '',
    warehouse: '',
    arrivalNotice: '',

    note: '',

    // export（先保留你原本那套）
    customerId: '',
    containerNumber: '',
    shipDate: '',
  })

  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)

  const isImport = values.orderType === 'import'
  const isExport = values.orderType === 'export'

  /** -----------------------------
   * Derived
   * ------------------------------ */
  const errors: Partial<Record<keyof OrderFormValues, string>> = useMemo(() => {
    const e: Partial<Record<keyof OrderFormValues, string>> = {}

    // common
    if (!values.orderType) e.orderType = '訂單類型為必填'

    // IMPORT required
    if (isImport) {
      if (!trim(values.customerUuid)) e.customerUuid = '客戶 UUID 為必填'
      else if (!UUID_RE.test(trim(values.customerUuid)))
        e.customerUuid = '客戶 UUID 格式不正確'

      if (!trim(values.pickupAddress)) e.pickupAddress = '取件地址為必填'
      if (!trim(values.deliveryAddress)) e.deliveryAddress = '送達地址為必填'

      if (!trim(values.shippingCompany)) e.shippingCompany = '船公司為必填'
      if (!trim(values.vesselVoyage)) e.vesselVoyage = '船名/航次為必填'

      if (!trim(values.containerNo)) e.containerNo = '櫃號為必填'
      else if (!upper(values.containerNo))
        e.containerNo = '櫃號格式不正確（例：MSCU1234567）'

      if (!trim(values.containerType)) e.containerType = '櫃型為必填'
      if (!trim(values.pol)) e.pol = 'POL 為必填'
      if (!trim(values.pod)) e.pod = 'POD 為必填'

      if (!trim(values.deliveryOrderLocation))
        e.deliveryOrderLocation = '提貨/送貨單地點為必填'
      if (!trim(values.importDeclNo)) e.importDeclNo = '進口報關號為必填'
    }

    // EXPORT required（先照你舊欄位做一組最小必填）
    if (isExport) {
      if (!trim(values.customerId)) e.customerId = '客戶 ID 為必填'
      if (!trim(values.containerNumber)) e.containerNumber = '櫃號為必填'
      if (!trim(values.shipDate)) e.shipDate = '出貨日期為必填'
    }

    return e
  }, [values, isImport, isExport])

  const show = (k: keyof OrderFormValues) =>
    (submitted || touched[k as string]) && !!errors[k]
  const invalid = (k: keyof OrderFormValues) => (show(k) ? 'is-invalid' : '')

  /** -----------------------------
   * Handlers
   * ------------------------------ */
  const set =
    (k: keyof OrderFormValues) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setValues((p: OrderFormValues) => ({ ...p, [k]: e.target.value }))

  const touch = (k: keyof OrderFormValues) => () =>
    setTouched((p) => ({ ...p, [k]: true }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length) return

    // normalize before submit
    const normalized: OrderFormValues = {
      ...values,

      // import normalize
      customerUuid: trim(values.customerUuid),
      pickupAddress: trim(values.pickupAddress),
      deliveryAddress: trim(values.deliveryAddress),
      scheduledAt: toUndef(values.scheduledAt),

      shippingCompany: trim(values.shippingCompany),
      vesselVoyage: trim(values.vesselVoyage),
      containerNo: upper(values.containerNo),
      containerType: trim(values.containerType),
      packageQty: toUndef(values.packageQty),
      grossWeight: toUndef(values.grossWeight),
      cbm: toUndef(values.cbm),
      pol: trim(values.pol),
      pod: trim(values.pod),
      etd: toUndef(values.etd),
      eta: toUndef(values.eta),

      deliveryOrderLocation: trim(values.deliveryOrderLocation),
      importDeclNo: trim(values.importDeclNo),
      blNo: toUndef(values.blNo),
      customsReleaseTime: toUndef(values.customsReleaseTime),
      warehouse: toUndef(values.warehouse),
      arrivalNotice: toUndef(values.arrivalNotice),

      note: toUndef(values.note),

      // export normalize（先保留）
      customerId: toUndef(values.customerId),
      shipDate: toUndef(values.shipDate) ?? '',
    }

    await onSubmit(normalized)
  }

  /** -----------------------------
   * Render
   * ------------------------------ */
  return (
    <form onSubmit={submit} className='form'>
      <div className='row g-6'>
        {/* orderType */}
        <div className='col-12 col-lg-4'>
          <label className='form-label fw-bold'>
            訂單類型 <span className='text-danger'>*</span>
          </label>
          <select
            className={`form-select form-select-solid ${invalid('orderType')}`}
            value={values.orderType}
            onChange={set('orderType')}
            onBlur={touch('orderType')}
          >
            <option value='import'>進口</option>
            <option value='export'>出口</option>
          </select>
          {show('orderType') && (
            <div className='invalid-feedback d-block'>{errors.orderType}</div>
          )}
        </div>

        {/* =========================
            IMPORT
           ========================= */}
        {isImport && (
          <>
            {/* base */}
            <div className='col-12 col-lg-8'>
              <label className='form-label fw-bold'>
                客戶 UUID <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className={`form-control form-control-solid ${invalid(
                  'customerUuid',
                )}`}
                placeholder='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
                value={values.customerUuid}
                onChange={set('customerUuid')}
                onBlur={touch('customerUuid')}
                autoComplete='off'
              />
              {show('customerUuid') && (
                <div className='invalid-feedback'>{errors.customerUuid}</div>
              )}
            </div>

            <div className='col-12 col-lg-6'>
              <label className='form-label fw-bold'>
                取件地址 <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className={`form-control form-control-solid ${invalid(
                  'pickupAddress',
                )}`}
                value={values.pickupAddress}
                onChange={set('pickupAddress')}
                onBlur={touch('pickupAddress')}
              />
              {show('pickupAddress') && (
                <div className='invalid-feedback'>{errors.pickupAddress}</div>
              )}
            </div>

            <div className='col-12 col-lg-6'>
              <label className='form-label fw-bold'>
                送達地址 <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className={`form-control form-control-solid ${invalid(
                  'deliveryAddress',
                )}`}
                value={values.deliveryAddress}
                onChange={set('deliveryAddress')}
                onBlur={touch('deliveryAddress')}
              />
              {show('deliveryAddress') && (
                <div className='invalid-feedback'>{errors.deliveryAddress}</div>
              )}
            </div>

            <div className='col-12 col-lg-4'>
              <label className='form-label fw-bold'>預計時段</label>
              <input
                type='datetime-local'
                className='form-control form-control-solid'
                value={values.scheduledAt ?? ''}
                onChange={set('scheduledAt')}
              />
            </div>

            {/* shipping/container */}
            <div className='col-12 col-lg-4'>
              <label className='form-label fw-bold'>
                船公司 <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className={`form-control form-control-solid ${invalid(
                  'shippingCompany',
                )}`}
                value={values.shippingCompany}
                onChange={set('shippingCompany')}
                onBlur={touch('shippingCompany')}
              />
              {show('shippingCompany') && (
                <div className='invalid-feedback'>{errors.shippingCompany}</div>
              )}
            </div>

            <div className='col-12 col-lg-4'>
              <label className='form-label fw-bold'>
                船名/航次 <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className={`form-control form-control-solid ${invalid(
                  'vesselVoyage',
                )}`}
                value={values.vesselVoyage}
                onChange={set('vesselVoyage')}
                onBlur={touch('vesselVoyage')}
              />
              {show('vesselVoyage') && (
                <div className='invalid-feedback'>{errors.vesselVoyage}</div>
              )}
            </div>

            <div className='col-12 col-lg-4'>
              <label className='form-label fw-bold'>
                櫃號 <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className={`form-control form-control-solid ${invalid(
                  'containerNo',
                )}`}
                placeholder='MSCU1234567'
                value={values.containerNo}
                onChange={(e) => {
                  const el = e.currentTarget
                  const { selectionStart, selectionEnd } = el

                  // 轉大寫（保留原字元數，不會破壞游標）
                  const next = (el.value ?? '').toUpperCase()

                  setValues((p: OrderFormValues) => ({ ...p, containerNo: next }))

                  // 還原游標位置（避免跳到最後）
                  requestAnimationFrame(() => {
                    if (selectionStart != null && selectionEnd != null) {
                      el.setSelectionRange(selectionStart, selectionEnd)
                    }
                  })
                }}
                onBlur={touch('containerNo')}
                autoComplete='off'
              />

              {show('containerNo') && (
                <div className='invalid-feedback'>{errors.containerNo}</div>
              )}
              <div className='form-text text-muted'>會自動轉大寫</div>
            </div>

            <div className='col-12 col-lg-4'>
              <label className='form-label fw-bold'>
                櫃型 <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className={`form-control form-control-solid ${invalid(
                  'containerType',
                )}`}
                placeholder='20GP / 40HQ'
                value={values.containerType}
                onChange={set('containerType')}
                onBlur={touch('containerType')}
              />
              {show('containerType') && (
                <div className='invalid-feedback'>{errors.containerType}</div>
              )}
            </div>

            <div className='col-12 col-lg-4'>
              <label className='form-label fw-bold'>
                POL <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className={`form-control form-control-solid ${invalid('pol')}`}
                value={values.pol}
                onChange={set('pol')}
                onBlur={touch('pol')}
              />
              {show('pol') && <div className='invalid-feedback'>{errors.pol}</div>}
            </div>

            <div className='col-12 col-lg-4'>
              <label className='form-label fw-bold'>
                POD <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className={`form-control form-control-solid ${invalid('pod')}`}
                value={values.pod}
                onChange={set('pod')}
                onBlur={touch('pod')}
              />
              {show('pod') && <div className='invalid-feedback'>{errors.pod}</div>}
            </div>

            <div className='col-12 col-lg-4'>
              <label className='form-label fw-bold'>ETD</label>
              <input
                type='datetime-local'
                className='form-control form-control-solid'
                value={values.etd ?? ''}
                onChange={set('etd')}
              />
            </div>

            <div className='col-12 col-lg-4'>
              <label className='form-label fw-bold'>ETA</label>
              <input
                type='datetime-local'
                className='form-control form-control-solid'
                value={values.eta ?? ''}
                onChange={set('eta')}
              />
            </div>

            <div className='col-12 col-lg-4'>
              <label className='form-label fw-bold'>件數</label>
              <input
                type='number'
                className='form-control form-control-solid'
                value={values.packageQty ?? ''}
                onChange={set('packageQty')}
                min={0}
              />
            </div>

            <div className='col-12 col-lg-4'>
              <label className='form-label fw-bold'>毛重</label>
              <input
                type='number'
                className='form-control form-control-solid'
                value={values.grossWeight ?? ''}
                onChange={set('grossWeight')}
                min={0}
                step='0.001'
              />
            </div>

            <div className='col-12 col-lg-4'>
              <label className='form-label fw-bold'>CBM</label>
              <input
                type='number'
                className='form-control form-control-solid'
                value={values.cbm ?? ''}
                onChange={set('cbm')}
                min={0}
                step='0.001'
              />
            </div>

            {/* import detail */}
            <div className='col-12 col-lg-6'>
              <label className='form-label fw-bold'>
                提貨/送貨單地點 <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className={`form-control form-control-solid ${invalid(
                  'deliveryOrderLocation',
                )}`}
                value={values.deliveryOrderLocation}
                onChange={set('deliveryOrderLocation')}
                onBlur={touch('deliveryOrderLocation')}
              />
              {show('deliveryOrderLocation') && (
                <div className='invalid-feedback'>
                  {errors.deliveryOrderLocation}
                </div>
              )}
            </div>

            <div className='col-12 col-lg-6'>
              <label className='form-label fw-bold'>
                進口報關號 <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className={`form-control form-control-solid ${invalid(
                  'importDeclNo',
                )}`}
                value={values.importDeclNo}
                onChange={set('importDeclNo')}
                onBlur={touch('importDeclNo')}
              />
              {show('importDeclNo') && (
                <div className='invalid-feedback'>{errors.importDeclNo}</div>
              )}
            </div>

            <div className='col-12 col-lg-4'>
              <label className='form-label fw-bold'>BL No</label>
              <input
                type='text'
                className='form-control form-control-solid'
                value={values.blNo ?? ''}
                onChange={set('blNo')}
              />
            </div>

            <div className='col-12 col-lg-4'>
              <label className='form-label fw-bold'>通關放行時間</label>
              <input
                type='datetime-local'
                className='form-control form-control-solid'
                value={values.customsReleaseTime ?? ''}
                onChange={set('customsReleaseTime')}
              />
            </div>

            <div className='col-12 col-lg-4'>
              <label className='form-label fw-bold'>倉庫</label>
              <input
                type='text'
                className='form-control form-control-solid'
                value={values.warehouse ?? ''}
                onChange={set('warehouse')}
              />
            </div>

            <div className='col-12'>
              <label className='form-label fw-bold'>到港通知/文件備註</label>
              <textarea
                className='form-control form-control-solid'
                rows={2}
                value={values.arrivalNotice ?? ''}
                onChange={set('arrivalNotice')}
              />
            </div>
          </>
        )}

        {/* =========================
            EXPORT (暫保留)
           ========================= */}
        {isExport && (
          <>
            <div className='col-12 col-lg-4'>
              <label className='form-label fw-bold'>
                客戶 ID <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className={`form-control form-control-solid ${invalid(
                  'customerId',
                )}`}
                value={values.customerId ?? ''}
                onChange={set('customerId')}
                onBlur={touch('customerId')}
              />
              {show('customerId') && (
                <div className='invalid-feedback'>{errors.customerId}</div>
              )}
            </div>

            <div className='col-12 col-lg-4'>
              <label className='form-label fw-bold'>
                櫃號 <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className={`form-control form-control-solid ${invalid(
                  'containerNumber',
                )}`}
                value={values.containerNumber ?? ''}
                onChange={set('containerNumber')}
                onBlur={touch('containerNumber')}
              />
              {show('containerNumber') && (
                <div className='invalid-feedback'>{errors.containerNumber}</div>
              )}
            </div>

            <div className='col-12 col-lg-4'>
              <label className='form-label fw-bold'>
                出貨日期 <span className='text-danger'>*</span>
              </label>
              <input
                type='date'
                className={`form-control form-control-solid ${invalid('shipDate')}`}
                value={values.shipDate ?? ''}
                onChange={set('shipDate')}
                onBlur={touch('shipDate')}
              />
              {show('shipDate') && (
                <div className='invalid-feedback'>{errors.shipDate}</div>
              )}
            </div>
          </>
        )}

        {/* note */}
        <div className='col-12'>
          <label className='form-label fw-bold'>備註</label>
          <textarea
            className='form-control form-control-solid'
            rows={3}
            value={values.note ?? ''}
            onChange={set('note')}
          />
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
          {submitting ? '送出中…' : '建立訂單'}
        </button>
      </div>
    </form>
  )
}
