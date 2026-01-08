import React from 'react'
import { Dictionary } from '../Model'
import { KTIcon } from '@/_metronic/helpers'

type Props = {
  selected: Dictionary | null
  onEdit: () => void
  onCopy: () => void
  onToggleEnabled: () => void
}

export default function DictionaryHeaderActions({selected, onEdit, onCopy, onToggleEnabled}: Props) {
  const disabled = !selected
  const enabled = selected?.enabled ?? false

  return (
    <div className='d-flex align-items-center gap-2'>

      {selected ? (
        <span className={`badge ${enabled ? 'badge-light-success' : 'badge-light-secondary'} ms-2`}>
          {enabled ? '啟用中' : '已停用'}
        </span>
      ) : (
        <span className='badge badge-light ms-2'>No Selection</span>
      )}

      <button
        type='button'
        className={`btn btn-sm ${enabled ? 'btn-light-secondary' : 'btn-light-success'}`}
        onClick={onToggleEnabled}
        disabled={disabled}
        title='只切換分類 enabled'
      >
        <KTIcon iconName={enabled ? 'toggle-off' : 'toggle-on'} className='fs-3' />
        {enabled ? '停用分類' : '啟用分類'}
      </button>

      <button type='button' className='btn btn-sm btn-light-primary' onClick={onEdit} disabled={disabled}>
        <KTIcon iconName='pencil' className='fs-3' />
        編輯
      </button>

      <button type='button' className='btn btn-sm btn-light' onClick={onCopy} disabled={disabled}>
        <KTIcon iconName='copy' className='fs-3' />
        複製
      </button>

    </div>
  )
}
