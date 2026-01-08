// src/app/pages/adm/dictionary/items/ItemsTable.tsx
import React, {useEffect, useMemo, useState} from 'react'
import {Spinner} from 'react-bootstrap'

import type {AlertFn} from '@/app/pages/common/AlertType'
import type {DictionaryItem, CreateDictionaryItemReq, UpdateDictionaryItemReq} from '../Model'
import {
  fetchDictionaryItems,
  createDictionaryItem,
  updateDictionaryItem,
  deleteDictionaryItem,
} from '../Query'

type Props = {
  dictionaryId: string
  showAlert?: AlertFn
  onReload?: () => void | Promise<void>
}

type NewRowState = {
  itemCode: string
  itemLabel: string
  sortOrder: string // input 用字串
  enabled: boolean
  remark: string
}

type EditRowState = {
  itemCode: string
  itemLabel: string
  sortOrder: string
  enabled: boolean
  remark: string
}

export default function ItemsTable({dictionaryId, showAlert, onReload}: Props) {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<DictionaryItem[]>([])

  const [creating, setCreating] = useState(false)
  const [newRow, setNewRow] = useState<NewRowState>({
    itemCode: '',
    itemLabel: '',
    sortOrder: '',
    enabled: true,
    remark: '',
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [editRow, setEditRow] = useState<EditRowState | null>(null)

  const canCreate = useMemo(() => {
    return newRow.itemCode.trim() && newRow.itemLabel.trim()
  }, [newRow.itemCode, newRow.itemLabel])

  const load = async () => {
    setLoading(true)
    try {
      const list = await fetchDictionaryItems(dictionaryId, showAlert)
      setItems(list ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dictionaryId])

  const startEdit = (row: DictionaryItem) => {
    setEditingId(row.id)
    setEditRow({
      itemCode: row.itemCode ?? '',
      itemLabel: row.itemLabel ?? '',
      sortOrder: row.sortOrder === null || row.sortOrder === undefined ? '' : String(row.sortOrder),
      enabled: row.enabled ?? true,
      remark: row.remark ?? '',
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditRow(null)
  }

  const submitCreate = async () => {
    if (!canCreate) return

    setCreating(true)
    try {
      const payload: CreateDictionaryItemReq = {
        dictionaryId,
        itemCode: newRow.itemCode.trim(),
        itemLabel: newRow.itemLabel.trim(),
        sortOrder: newRow.sortOrder === '' ? undefined : Number(newRow.sortOrder),
        enabled: newRow.enabled,
        remark: newRow.remark || undefined,
      }
      const ok = await createDictionaryItem(dictionaryId, payload, showAlert)
      if (ok) {
        // 留在新增狀態方便連續新增：只清空主要欄位
        setNewRow((p) => ({...p, itemCode: '', itemLabel: '', remark: ''}))
        await load()
        await onReload?.()
      }
    } finally {
      setCreating(false)
    }
  }

  const submitUpdate = async (id: string) => {
    if (!editRow) return
    if (!editRow.itemCode.trim() || !editRow.itemLabel.trim()) {
      showAlert?.('itemCode / itemLabel 不可為空', 'danger')
      return
    }

    setSavingId(id)
    try {
      const payload: UpdateDictionaryItemReq = {
        itemCode: editRow.itemCode.trim(),
        itemLabel: editRow.itemLabel.trim(),
        sortOrder: editRow.sortOrder === '' ? undefined : Number(editRow.sortOrder),
        enabled: editRow.enabled,
        remark: editRow.remark || undefined,
      }
      const updated = await updateDictionaryItem(id, payload, showAlert)
      if (updated) {
        cancelEdit()
        await load()
        await onReload?.()
      }
    } finally {
      setSavingId(null)
    }
  }

  const remove = async (row: DictionaryItem) => {
    if (!window.confirm(`確定刪除項目「${row.itemLabel}」嗎？`)) return
    const ok = await deleteDictionaryItem(row.id, showAlert)
    if (ok) {
      await load()
      await onReload?.()
    }
  }

  return (
    <div className='table-responsive'>
      <table className='table align-middle table-row-dashed fs-6 gy-5'>
        <thead>
          <tr className='text-start text-muted fw-bold fs-7 text-uppercase gs-0'>
            <th className='min-w-180px'>Label</th>
            <th className='min-w-160px'>Value</th>
            <th className='min-w-90px'>Sort</th>
            <th className='min-w-120px'>狀態</th>
            <th className='min-w-180px text-end'>操作</th>
          </tr>
        </thead>

        <tbody className='text-gray-700 fw-semibold'>
          {/* 新增列（inline create） */}
          <tr>
            <td>
              <input
                className='form-control form-control-sm form-control-solid'
                placeholder='例如：已建立'
                value={newRow.itemLabel}
                onChange={(e) => setNewRow((p) => ({...p, itemLabel: e.target.value}))}
                disabled={creating}
              />
            </td>
            <td>
              <input
                className='form-control form-control-sm form-control-solid'
                placeholder='例如：CREATED'
                value={newRow.itemCode}
                onChange={(e) => setNewRow((p) => ({...p, itemCode: e.target.value}))}
                disabled={creating}
              />
            </td>
            <td>
              <input
                className='form-control form-control-sm form-control-solid'
                placeholder='1'
                value={newRow.sortOrder}
                onChange={(e) => setNewRow((p) => ({...p, sortOrder: e.target.value}))}
                disabled={creating}
                inputMode='numeric'
              />
            </td>
            <td>
              <div className='form-check form-switch form-check-custom form-check-solid'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  checked={newRow.enabled}
                  onChange={(e) => setNewRow((p) => ({...p, enabled: e.target.checked}))}
                  disabled={creating}
                />
                <span className='form-check-label'>{newRow.enabled ? '啟用' : '停用'}</span>
              </div>
            </td>
            <td className='text-end'>
              <button
                type='button'
                className='btn btn-sm btn-primary'
                onClick={submitCreate}
                disabled={!canCreate || creating}
              >
                {creating ? (
                  <>
                    <Spinner animation='border' size='sm' className='me-2' />
                    新增中...
                  </>
                ) : (
                  '新增'
                )}
              </button>
            </td>
          </tr>

          {/* 內容列 */}
          {loading ? (
            <tr>
              <td colSpan={5}>
                <div className='d-flex justify-content-center py-10'>
                  <Spinner animation='border' />
                </div>
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={5}>
                <div className='text-center py-10 text-muted'>尚無項目，請先新增一筆</div>
              </td>
            </tr>
          ) : (
            items.map((row) => {
              const isEditing = editingId === row.id
              const isSaving = savingId === row.id

              return (
                <tr key={row.id}>
                  <td>
                    {!isEditing ? (
                      <div className='d-flex flex-column'>
                        <span className='fw-bold text-gray-900'>{row.itemLabel}</span>
                        <span className='text-muted fs-8'>UUID：{row.id}</span>
                      </div>
                    ) : (
                      <input
                        className='form-control form-control-sm form-control-solid'
                        value={editRow?.itemLabel ?? ''}
                        onChange={(e) => setEditRow((p) => (p ? {...p, itemLabel: e.target.value} : p))}
                        disabled={isSaving}
                      />
                    )}
                  </td>

                  <td>
                    {!isEditing ? (
                      row.itemCode
                    ) : (
                      <input
                        className='form-control form-control-sm form-control-solid'
                        value={editRow?.itemCode ?? ''}
                        onChange={(e) => setEditRow((p) => (p ? {...p, itemCode: e.target.value} : p))}
                        disabled={isSaving}
                      />
                    )}
                  </td>

                  <td>
                    {!isEditing ? (
                      row.sortOrder ?? '-'
                    ) : (
                      <input
                        className='form-control form-control-sm form-control-solid'
                        value={editRow?.sortOrder ?? ''}
                        onChange={(e) => setEditRow((p) => (p ? {...p, sortOrder: e.target.value} : p))}
                        disabled={isSaving}
                        inputMode='numeric'
                      />
                    )}
                  </td>

                  <td>
                    {!isEditing ? (
                      row.enabled ? (
                        <span className='badge badge-light-success'>啟用</span>
                      ) : (
                        <span className='badge badge-light-secondary'>停用</span>
                      )
                    ) : (
                      <div className='form-check form-switch form-check-custom form-check-solid'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          checked={!!editRow?.enabled}
                          onChange={(e) => setEditRow((p) => (p ? {...p, enabled: e.target.checked} : p))}
                          disabled={isSaving}
                        />
                        <span className='form-check-label'>
                          {editRow?.enabled ? '啟用' : '停用'}
                        </span>
                      </div>
                    )}
                  </td>

                  <td className='text-end'>
                    {!isEditing ? (
                      <div className='d-inline-flex gap-2'>
                        <button
                          type='button'
                          className='btn btn-sm btn-light-primary'
                          onClick={() => startEdit(row)}
                        >
                          編輯
                        </button>
                        <button
                          type='button'
                          className='btn btn-sm btn-light-danger'
                          onClick={() => remove(row)}
                        >
                          刪除
                        </button>
                      </div>
                    ) : (
                      <div className='d-inline-flex gap-2'>
                        <button
                          type='button'
                          className='btn btn-sm btn-primary'
                          onClick={() => submitUpdate(row.id)}
                          disabled={isSaving}
                        >
                          {isSaving ? '更新中...' : '更新'}
                        </button>
                        <button
                          type='button'
                          className='btn btn-sm btn-light'
                          onClick={cancelEdit}
                          disabled={isSaving}
                        >
                          取消
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
