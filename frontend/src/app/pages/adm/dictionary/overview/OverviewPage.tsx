// src/app/pages/adm/dictionary/overview/OverviewPage.tsx
import React, {useMemo, useState} from 'react'
import {Content} from '@/_metronic/layout/components/content'
import {useAlert} from '@/app/pages/common/AlertType'
import {AppToolbar} from '@/app/pages/common/AppToolbar'

import type {Dictionary} from '../Model'
import ItemsTable from './ItemsTable'
import FormModal from './FormModal'
import {useDictionaryMasterDetail} from './hooks/useDictionaryMasterDetail'
import DictionaryCategoryPanel from './DictionaryCategoryPanel'
import DictionaryWorkspace from './DictionaryWorkspace'
import CopyDictionaryModal from './CopyDictionaryModal'

export function OverviewPage() {
  const {alert, showAlert, Alert} = useAlert()

  // =========================
  // Master-Detail hook（左側狀態 / 選取 / 搜尋 / reload）
  // =========================
  const md = useDictionaryMasterDetail({showAlert})

  // =========================
  // Modals
  // =========================
  const [showFormModal, setShowFormModal] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [editTarget, setEditTarget] = useState<Dictionary | null>(null)

  const [showCopyModal, setShowCopyModal] = useState(false)

  const selected = md.selected
  const selectedId = selected?.id ?? null

  const openCreate = () => {
    setFormMode('create')
    setEditTarget(null)
    setShowFormModal(true)
  }

  const openEdit = () => {
    if (!selected) {
      showAlert?.('請先選取一個字典分類', 'warning')
      return
    }
    setFormMode('edit')
    setEditTarget(selected)
    setShowFormModal(true)
  }

  const openCopy = () => {
    if (!selected) {
      showAlert?.('請先選取一個字典分類', 'warning')
      return
    }
    setShowCopyModal(true)
  }

  const toggleEnabled = async () => {
    if (!selected) {
      showAlert?.('請先選取一個字典分類', 'warning')
      return
    }
    await md.toggleCategoryEnabled(selected.id, !selected.enabled)
  }

  const remarkText = useMemo(() => {
    const r = selected?.remark?.trim()
    return r && r.length > 0 ? r : '-'
  }, [selected?.remark])

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
          {/* =========================
              Left: Category Panel
             ========================= */}
          <div className='col-12 col-lg-4 col-xxl-3'>
            <DictionaryCategoryPanel
              loading={md.loadingLeft}
              dictionaries={md.dictionaries}
              selectedId={selectedId}
              tempKeyword={md.tempKeyword}
              enabled={md.enabled}
              onTempKeywordChange={md.setTempKeyword}
              onEnabledChange={md.setEnabled}
              onSearch={() => md.search()}
              onReset={() => md.reset()}
              onSelect={(d) => md.select(d)}
              onCreate={openCreate}
            />
          </div>

          {/* =========================
              Right: Workspace
             ========================= */}
          <div className='col-12 col-lg-8 col-xxl-9'>
            <DictionaryWorkspace
              selected={selected}
              remark={remarkText}
              onEdit={openEdit}
              onCopy={openCopy}
              onToggleEnabled={toggleEnabled}
            >
              {!selected ? (
                <div className='d-flex flex-column align-items-center justify-content-center py-10 text-muted'>
                  <div className='fw-bold'>請先從左側選擇一個字典分類</div>
                  <div className='fs-8 mt-1'>選取後即可在右側新增/編輯/停用字典項目</div>
                </div>
              ) : (
                <>
                  <ItemsTable
                    dictionaryId={selected.id}
                    showAlert={showAlert}
                    onReload={async () => {
                      // items 變更通常不必 reload 左側
                      // 若你要同步顯示 itemCount，可改成 md.reloadLeftKeepSelected()
                    }}
                  />
                  <div className='text-muted fs-8 mt-3'>
                    提示：上方第一列為「新增列」，可快速建立項目；每列可 inline 編輯更新。
                  </div>
                </>
              )}
            </DictionaryWorkspace>
          </div>
        </div>
      </div>

      {/* =========================
          Create / Edit Category Modal
         ========================= */}
      <FormModal
        show={showFormModal}
        mode={formMode}
        initial={editTarget}
        showAlert={showAlert}
        onClose={() => setShowFormModal(false)}
        onSuccess={async (updated?: Dictionary | null) => {
          setShowFormModal(false)

          // create：若後端有回傳 new category，可直接選取它（最理想）
          if (formMode === 'create') {
            if (updated?.id) {
              await md.reloadLeftSelectId(updated.id)
            } else {
              await md.reloadLeftKeepSelected()
            }
            return
          }

          // edit：保留目前選取
          await md.reloadLeftKeepSelected()

          // 同步 selected（避免 UI 一瞬間閃）
          if (updated && md.selected?.id === updated.id) {
            md.setSelected(updated)
          }
        }}
      />

      {/* =========================
          Copy Category Modal
         ========================= */}
      <CopyDictionaryModal
        show={showCopyModal}
        source={selected}
        showAlert={showAlert}
        onClose={() => setShowCopyModal(false)}
        onSuccess={async (newCategory?: Dictionary | null) => {
          setShowCopyModal(false)
          if (newCategory?.id) {
            await md.reloadLeftSelectId(newCategory.id)
          } else {
            await md.reloadLeftKeepSelected()
          }
        }}
      />
    </Content>
  )
}

export default OverviewPage
