// src/app/pages/tom/task/list/ListPage.tsx
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Content } from '@/_metronic/layout/components/content'
import { useAlert } from '@/app/pages/common/AlertType'
import { AppToolbar } from '@/app/pages/common/AppToolbar'

import type { TaskSubjectType, TomTaskListItem, TomTaskStatus } from '../Model'
import TaskList from './List'

const SUBJECT_OPTIONS: Array<{ value: TaskSubjectType | ''; label: string }> = [
  { value: '', label: '全部類型' },
  { value: 'CONTAINER', label: '貨櫃' },
  { value: 'TRAILER', label: '板車' },
  { value: 'EMPTY_MOVE', label: '空車/空板回位' },
  { value: 'VEHICLE', label: '車頭' },
  { value: 'OTHER', label: '其他' },
]

const STATUS_OPTIONS: Array<{ value: TomTaskStatus | ''; label: string }> = [
  { value: '', label: '全部狀態' },
  { value: 'UNASSIGNED', label: '未指派' },
  { value: 'ASSIGNED', label: '已指派' },
  { value: 'IN_PROGRESS', label: '進行中' },
  { value: 'DONE', label: '已完成' },
  { value: 'CANCELLED', label: '已取消' },
]

export const ListPage: React.FC = () => {
  const navigate = useNavigate()
  const { alert, showAlert, Alert } = useAlert()

  const [keyword, setKeyword] = useState('')
  const [subjectType, setSubjectType] = useState<TaskSubjectType | ''>('')
  const [status, setStatus] = useState<TomTaskStatus | ''>('')

  const handleCreate = useCallback(() => {
    navigate('/tom/task/create')
  }, [navigate])

  const handleAssign = useCallback(
    (t: TomTaskListItem) => {
      // MVP：先導到 container detail（若有），否則未來可以做 FMS 指派 modal
      if (t.containerId) navigate(`/tom/container/${t.containerId}/detail`)
      else showAlert('此任務尚未接 FMS 指派（MVP）', 'info')
    },
    [navigate, showAlert],
  )

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='任務管理（TOM）'
        breadcrumbs={[
          { label: 'TOM 運輸管理', href: '/tom' },
          { label: '任務管理', active: true },
        ]}
      />

      <div className='app-container container-fluid'>
        {/* Filters */}
        <div className='card mb-6'>
          <div className='card-body'>
            <div className='row g-3 align-items-end'>
              <div className='col-12 col-md-4'>
                <label className='form-label'>關鍵字</label>
                <input
                  className='form-control'
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder='任務編號 / 訂單 / 櫃號 / 板車 / 地點 / 司機 / 車號...'
                />
              </div>

              <div className='col-12 col-md-3'>
                <label className='form-label'>類型</label>
                <select
                  className='form-select'
                  value={subjectType}
                  onChange={(e) => setSubjectType(e.target.value as TaskSubjectType | '')}
                >
                  {SUBJECT_OPTIONS.map((o) => (
                    <option key={o.label} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className='col-12 col-md-3'>
                <label className='form-label'>狀態</label>
                <select
                  className='form-select'
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TomTaskStatus | '')}
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.label} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className='col-12 col-md-2 d-grid'>
                <button className='btn btn-primary' onClick={handleCreate}>
                  新增任務
                </button>
              </div>
            </div>
          </div>
        </div>

        <TaskList
          searchKeyword={keyword}
          subjectType={subjectType}
          status={status}
          showAlert={showAlert}
          onAssign={handleAssign}
        />
      </div>
    </Content>
  )
}

export default ListPage
