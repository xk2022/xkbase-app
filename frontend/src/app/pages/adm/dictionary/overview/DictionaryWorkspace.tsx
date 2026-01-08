import React from 'react'
import { Dictionary } from '../Model'
import DictionaryHeaderActions from './DictionaryHeaderActions'

type Props = {
  selected: Dictionary | null
  remark: string
  onEdit: () => void
  onCopy: () => void
  onToggleEnabled: () => void
  children: React.ReactNode
}

export default function DictionaryWorkspace({
  selected,
  remark,
  onEdit,
  onCopy,
  onToggleEnabled,
  children,
}: Props) {
  return (
    <div className='card' style={{boxShadow: '0 6px 18px rgba(0,0,0,0.05)'}}>
      <div className='card-header border-0 pt-6 pb-4' style={{borderBottom: '1px solid #eff2f5'}}>
        <div className='card-title'>
          <div className='d-flex flex-column'>
            <span className='fw-bold fs-3'>{selected ? selected.name : '字典項目'}</span>

            <div className='text-muted fs-8'>
              {selected ? (
                <>
                  <span className='me-3'>UUID：{selected.id}</span>
                  <br />
                  <span className='me-3'>Code：{selected.code}</span>
                  <span>Remark：{remark}</span>
                </>
              ) : (
                '尚未選取字典分類'
              )}
            </div>
          </div>
        </div>

        <div className='card-toolbar'>
          <DictionaryHeaderActions
            selected={selected}
            onEdit={onEdit}
            onCopy={onCopy}
            onToggleEnabled={onToggleEnabled}
          />
        </div>
      </div>

      <div className='card-body py-4'>{children}</div>
    </div>
  )
}
