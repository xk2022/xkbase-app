// src/app/pages/adm/dictionary/OverviewPage.tsx
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Spinner} from 'react-bootstrap'
import {Content} from '@/_metronic/layout/components/content'
import {KTIcon} from '@/_metronic/helpers'

import {useAlert} from '@/app/pages/common/AlertType'
import {AppToolbar} from '@/app/pages/common/AppToolbar'

import type {Dictionary} from '../Model'
import {fetchDictionaries} from '../Query'

import ItemsTable from './ItemsTable'
import CreateDictionaryModal from './FormModal'

type ModalMode = 'create' | 'edit'

export function Overview() {
  const {alert, showAlert, Alert} = useAlert()

  // -----------------------------
  // Filters
  // -----------------------------
  const [tempKeyword, setTempKeyword] = useState('')
  const [keyword, setKeyword] = useState('')
  const [enabled, setEnabled] = useState<boolean | ''>('')

  // -----------------------------
  // Left list state
  // -----------------------------
  const [loadingLeft, setLoadingLeft] = useState(true)
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([])
  const [selected, setSelected] = useState<Dictionary | null>(null)

  // -----------------------------
  // Modal state
  // -----------------------------
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>('create')
  const [editTarget, setEditTarget] = useState<Dictionary | null>(null)

  const enabledParam = useMemo(() => (enabled === '' ? undefined : enabled), [enabled])
  const keywordParam = useMemo(() => (keyword.trim() ? keyword.trim() : undefined), [keyword])

  /**
   * 左側清單載入（MVP：一次取回全部）
   * - keepSelectedId：希望保留選取（常用於更新後）
   */
  const loadLeft = useCallback(
    async (keepSelectedId?: string | null) => {
      setLoadingLeft(true)
      try {
        // v1：後端回 List；若你未實作 query，傳了也不會壞（會被忽略）
        const list = await fetchDictionaries(
          {
            keyword: keywordParam,
            enabled: enabledParam,
          },
          showAlert
        )

        const safeList = list ?? []
        setDictionaries(safeList)

        // 1) 有指定要保留的 id → 找得到就選，找不到就 fallback
        if (keepSelectedId) {
          const keep = safeList.find((d) => d.id === keepSelectedId) ?? null
          setSelected(keep ?? (safeList.length > 0 ? safeList[0] : null))
          return
        }

        // 2) 沒指定保留：若目前選取還在清單內 → 保留；不在 → 選第一筆
        setSelected((prev) => {
          if (prev && safeList.some((d) => d.id === prev.id)) return prev
          return safeList.length > 0 ? safeList[0] : null
        })
      } finally {
        setLoadingLeft(false)
      }
    },
    [enabledParam, keywordParam, showAlert]
  )

  // 初次載入 + 篩選改變 → reload left
  useEffect(() => {
    loadLeft(selected?.id ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywordParam, enabledParam])

  // -----------------------------
  // UX handlers
  // -----------------------------
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') setKeyword(tempKeyword.trim())
  }

  const doSearch = () => setKeyword(tempKeyword.trim())

  const reset = () => {
    setTempKeyword('')
    setKeyword('')
    setEnabled('')
  }

  const refresh = () => loadLeft(selected?.id ?? null)

  const openCreate = () => {
    setModalMode('create')
    setEditTarget(null)
    setShowModal(true)
  }

  const openEdit = () => {
    if (!selected) {
      showAlert?.('請先選取一個字典分類', 'warning')
      return
    }
    setModalMode('edit')
    setEditTarget(selected)
    setShowModal(true)
  }

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='字典檔 Dictionary'
        breadcrumbs={[
          {label: 'ADM 系統設定', href: '#'},
          {label: '字典檔', active: true},
        ]}
      />

      <div className='app-container container-fluid'>
        <div className='row g-6'>
          {/* ======================================================
              Left: Dictionary List
             ====================================================== */}
          <div className='col-12 col-lg-4 col-xxl-3'>
            <div className='card'>
              {/* Header */}
              <div className='card-header border-0 pt-6 pb-4'>
                <div className='card-title'>
                  <div className='d-flex flex-column'>
                    <span className='fw-bold fs-4'>字典分類</span>
                    <span className='text-muted fs-8'>平台共用下拉 / 枚舉 / 分類碼表</span>
                  </div>
                </div>

                <div className='card-toolbar'>
                  <div className='d-flex gap-2'>
                    <button type='button' className='btn btn-sm btn-primary' onClick={openCreate}>
                      <KTIcon iconName='plus' className='fs-3' />
                      新增
                    </button>
                    <button
                      type='button'
                      className='btn btn-sm btn-light-primary'
                      onClick={openEdit}
                      disabled={!selected}
                      title={!selected ? '請先選取分類' : '編輯分類'}
                    >
                      <KTIcon iconName='pencil' className='fs-3' />
                      編輯
                    </button>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className='card-body pt-0 pb-4'>
                <div className='d-flex flex-column gap-3'>
                  <div className='d-flex align-items-center position-relative'>
                    <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
                    <input
                      type='text'
                      className='form-control form-control-solid ps-14'
                      placeholder='搜尋：代碼 / 名稱…'
                      value={tempKeyword}
                      onChange={(e) => setTempKeyword(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                    />
                  </div>

                  <div className='d-flex gap-2 flex-wrap'>
                    <select
                      className='form-select form-select-solid'
                      value={enabled === '' ? '' : enabled ? 'true' : 'false'}
                      onChange={(e) => {
                        const v = e.target.value
                        setEnabled(v === '' ? '' : v === 'true')
                      }}
                    >
                      <option value=''>全部狀態</option>
                      <option value='true'>啟用</option>
                      <option value='false'>停用</option>
                    </select>

                    <button type='button' className='btn btn-light-primary' onClick={doSearch}>
                      搜尋
                    </button>
                    <button type='button' className='btn btn-light' onClick={reset}>
                      重置
                    </button>

                    <button type='button' className='btn btn-light ms-auto' onClick={refresh} title='刷新'>
                      <KTIcon iconName='arrows-circle' className='fs-2' />
                    </button>
                  </div>
                </div>
              </div>

              {/* List */}
              <div className='card-body pt-0'>
                {loadingLeft ? (
                  <div className='d-flex justify-content-center py-10'>
                    <Spinner animation='border' />
                  </div>
                ) : dictionaries.length === 0 ? (
                  <div className='text-center py-10 text-muted'>
                    查無字典分類
                    <div className='fs-8 mt-2'>可點右上「新增」建立第一筆</div>
                  </div>
                ) : (
                  <div className='d-flex flex-column gap-2'>
                    {dictionaries.map((d) => {
                      const active = selected?.id === d.id
                      return (
                        <button
                          key={d.id}
                          type='button'
                          className={`btn text-start d-flex align-items-center justify-content-between ${
                            active ? 'btn-light-primary' : 'btn-light'
                          }`}
                          onClick={() => setSelected(d)}
                        >
                          <div className='d-flex flex-column'>
                            <div className='d-flex align-items-center gap-2'>
                              <span className='fw-bold text-gray-900'>{d.name}</span>
                              {!d.enabled && <span className='badge badge-light-secondary'>停用</span>}
                            </div>
                            <span className='text-muted fs-8'>Code：{d.code}</span>
                          </div>
                          <KTIcon iconName='arrow-right' className='fs-2' />
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ======================================================
              Right: Items Workspace
             ====================================================== */}
          <div className='col-12 col-lg-8 col-xxl-9'>
            <div className='card'>
              <div className='card-header border-0 pt-6 pb-4'>
                <div className='card-title'>
                  <div className='d-flex flex-column'>
                    <span className='fw-bold fs-3'>{selected ? selected.name : '字典項目'}</span>
                    <span className='text-muted fs-8'>
                      {selected ? `Code：${selected.code}｜UUID：${selected.id}` : '尚未選取字典分類'}
                    </span>
                  </div>
                </div>

                <div className='card-toolbar'>
                  {selected ? (
                    <span className={`badge ${selected.enabled ? 'badge-light-success' : 'badge-light-secondary'}`}>
                      {selected.enabled ? '啟用中' : '已停用'}
                    </span>
                  ) : (
                    <span className='badge badge-light'>No Selection</span>
                  )}
                </div>
              </div>

              <div className='card-body py-4'>
                {!selected ? (
                  <div className='d-flex flex-column align-items-center justify-content-center py-10 text-muted'>
                    <KTIcon iconName='information-5' className='fs-2x mb-2' />
                    <div className='fw-bold'>請先從左側選擇一個字典分類</div>
                    <div className='fs-8 mt-1'>選取後即可在右側新增/編輯/停用字典項目</div>
                  </div>
                ) : (
                  <>
                    <ItemsTable
                      dictionaryId={selected.id}
                      showAlert={showAlert}
                      onReload={async () => {
                        // Items 變更後你如果要同步左側（例如顯示 count）可在此 refresh()
                      }}
                    />
                    <div className='text-muted fs-8 mt-3'>
                      提示：表格上方可加入「新增列」與 inline 編輯，適合營運快速維護下拉選單。
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          Create / Edit Dictionary Modal
         ====================================================== */}
      <CreateDictionaryModal
        show={showModal}
        mode={modalMode}
        initial={editTarget}
        showAlert={showAlert}
        onClose={() => setShowModal(false)}
        onSuccess={async (updated?: Dictionary | null) => {
          // 1) 先關 modal（避免多次觸發造成 UX 卡住）
          setShowModal(false)

          // 2) create：若後端 create 只回 boolean，那就 reload 後保留原選取或選第一筆
          if (modalMode === 'create') {
            await loadLeft(selected?.id ?? null)
            return
          }

          // 3) edit：保留當前 id（通常不變），並且若 modal 有回 updated，直接同步 selected
          const keepId = updated?.id ?? editTarget?.id ?? selected?.id ?? null
          await loadLeft(keepId)

          if (updated) setSelected(updated)
        }}
      />
    </Content>
  )
}

export default Overview
