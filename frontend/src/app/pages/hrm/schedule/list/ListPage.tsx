// src/app/pages/hrm/schedule/list/ListPage.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Content } from '@/_metronic/layout/components/content'
import { KTIcon } from '@/_metronic/helpers'

import { useAlert } from '@/app/pages/common/AlertType'
import { AppToolbar } from '@/app/pages/common/AppToolbar'

import { ScheduleListItem } from '../Model'
import ScheduleList from './List'
import { FormModal } from './FormModal'

export function ListPage() {
  const { alert, showAlert, Alert } = useAlert()

  const navigate = useNavigate()

  const [searchKeyword, setSearchKeyword] = useState('')
  const [tempKeyword, setTempKeyword] = useState('')
  const [listKey, setListKey] = useState(0)

  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<ScheduleListItem | null>(null)

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchKeyword(tempKeyword.trim())
    }
  }

  const reloadList = () => {
    setListKey((prev) => prev + 1)
    setFormModalOpen(false)
    setEditingSchedule(null)
  }

  const openCreate = () => {
    navigate('/hrm/schedule/create')
  }

  const openEdit = (schedule: ScheduleListItem) => {
    setEditingSchedule(schedule)
    setFormModalOpen(true)
  }

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='工時規劃'
        breadcrumbs={[
          { label: '人資管理', href: '#'},
          { label: '工時規劃', active: true },
        ]}
      />

      <div className='flex-column-fluid'>
        <div className='card'>
          <div className='card-header border-0 pt-6'>
            <div className='card-title'>
              <div className='d-flex align-items-center position-relative my-1'>
                <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
                <input
                  type='text'
                  className='form-control form-control-solid w-250px ps-14'
                  placeholder='司機姓名 / 日期…'
                  value={tempKeyword}
                  onChange={(e) => setTempKeyword(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
            </div>

            <div className='card-toolbar'>
              <div className='d-flex justify-content-end gap-2 flex-wrap'>
                <button
                  type='button'
                  className='btn btn-primary'
                  onClick={openCreate}
                >
                  <KTIcon iconName='plus' className='fs-2' />
                  新增工時規劃
                </button>
              </div>
            </div>
          </div>

          <div className='card-body py-4'>
            <ScheduleList
              key={listKey}
              searchKeyword={searchKeyword}
              showAlert={showAlert}
              onEdit={openEdit}
            />
          </div>
        </div>
      </div>

      <FormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false)
          setEditingSchedule(null)
        }}
        showAlert={showAlert}
        editingSchedule={editingSchedule}
        onSaved={reloadList}
      />
    </Content>
  )
}
