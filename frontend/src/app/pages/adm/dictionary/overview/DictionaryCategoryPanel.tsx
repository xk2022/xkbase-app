import React from 'react'
import {Spinner} from 'react-bootstrap'
import { Dictionary } from '../Model'
import { KTIcon } from '@/_metronic/helpers'

type Props = {
  loading: boolean
  dictionaries: Dictionary[]
  selectedId: string | null

  tempKeyword: string
  enabled: boolean | ''
  onTempKeywordChange: (v: string) => void
  onEnabledChange: (v: boolean | '') => void

  onSearch: () => void
  onReset: () => void

  onSelect: (d: Dictionary) => void
  onCreate: () => void
}

export default function DictionaryCategoryPanel(props: Props) {
  const {
    loading,
    dictionaries,
    selectedId,
    tempKeyword,
    enabled,
    onTempKeywordChange,
    onEnabledChange,
    onSearch,
    onReset,
    onSelect,
    onCreate,
  } = props

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch()
  }

  return (
    <div className='card' style={{background: '#f9fafb'}}>
      <div className='card-header border-0 pt-6 pb-4'>
        <div className='card-title'>
          <div className='d-flex flex-column'>
            <span className='fw-bold fs-4'>字典分類</span>
            <span className='text-muted fs-8'>平台共用下拉 / 枚舉 / 分類碼表</span>
          </div>
        </div>

        <div className='card-toolbar'>
          <button type='button' className='btn btn-sm btn-primary' onClick={onCreate}>
            <KTIcon iconName='plus' className='fs-3' />
            新增
          </button>

        <button type='button' className='btn btn-light' onClick={onReset}>
            <KTIcon iconName='arrows-circle' className='fs-2' />
        </button>
        </div>
      </div>

      <div className='card-body pt-0 pb-4'>
        <div className='d-flex flex-column gap-3'>
          <div className='d-flex align-items-center position-relative'>
            <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
            <input
              type='text'
              className='form-control form-control-solid ps-14'
              placeholder='搜尋：代碼 / 名稱…'
              value={tempKeyword}
              onChange={(e) => onTempKeywordChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
          <div className='d-flex gap-2 flex-wrap'> 
            <select 
                className='form-select form-select-solid' 
                value={enabled === '' ? '' : enabled ? 'true' : 'false'} 
                onChange={(e) => { 
                    const v = e.target.value 
                    onEnabledChange(v === '' ? '' : v === 'true') 
                }} 
            > 
                <option value=''>全部狀態</option> 
                <option value='true'>啟用</option> 
                <option value='false'>停用</option> 
            </select> 
          </div>


        </div>
      </div>

      <div className='card-body pt-0'>
        {loading ? (
          <div className='d-flex justify-content-center py-10'>
            <Spinner animation='border' />
          </div>
        ) : dictionaries.length === 0 ? (
          <div className='text-center py-10 text-muted'>
            查無字典分類
            <div className='fs-8 mt-2'>可點右上「新增」建立第一筆</div>
          </div>
        ) : (
          <div className='list-group list-group-flush'>
            {dictionaries.map((d) => {
              const active = selectedId === d.id
              return (
                <button
                  key={d.id}
                  type='button'
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                    active ? 'active' : ''
                  }`}
                  onClick={() => onSelect(d)}
                  style={{
                    borderRadius: 10,
                    marginBottom: 8,
                    border: active ? '1px solid #3e97ff' : '1px solid #eef0f3',
                    background: active ? '#eef6ff' : '#ffffff',
                    opacity: d.enabled ? 1 : 0.7,
                  }}
                >
                  <div className='d-flex flex-column'>
                    <span className='fw-bold text-gray-900'>
                      {d.name}{' '}
                      {!d.enabled && <span className='badge badge-light-secondary ms-2'>停用</span>}
                    </span>
                    <span className='text-muted fs-8'>Code：{d.code}</span>
                    {d.remark && d.remark.trim() ? (
                      <span className='text-muted fs-8 text-truncate' style={{maxWidth: 220}}>
                        {d.remark}
                      </span>
                    ) : null}
                  </div>

                  <KTIcon iconName='arrow-right' className='fs-2' />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
