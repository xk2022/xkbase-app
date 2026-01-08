// src/app/pages/tom/task/create/CreatePage.tsx
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Content } from '@/_metronic/layout/components/content'
import { useAlert } from '@/app/pages/common/AlertType'
import { AppToolbar } from '@/app/pages/common/AppToolbar'

import type { CreateTomTaskReq } from '../Model'
import { createTomTask } from '../Query'
import { CreateForm } from './CreateForm'

export const CreatePage: React.FC = () => {
  const navigate = useNavigate()
  const { alert, showAlert, Alert } = useAlert()
  const [submitting, setSubmitting] = useState(false)

  const handleCancel = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const handleSubmit = useCallback(
    async (req: CreateTomTaskReq) => {
      setSubmitting(true)
      try {
        const created = await createTomTask(req, showAlert)
        showAlert('建立任務成功', 'success')

        // MVP：先回列表（你也可導到 task detail）
        navigate('/tom/task/list')

        // 若你想導到 container detail：
        // if (created.containerId) navigate(`/tom/container/${created.containerId}/detail`)
      } catch (e) {
        console.error(e)
        showAlert('建立任務失敗，請稍後再試', 'danger')
      } finally {
        setSubmitting(false)
      }
    },
    [navigate, showAlert],
  )

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}

      <AppToolbar
        title='新增任務（TOM）'
        breadcrumbs={[
          { label: 'TOM 運輸管理', href: '/tom' },
          { label: '任務管理', href: '/tom/task/list' },
          { label: '新增', active: true },
        ]}
      />

      <div className='app-container container-fluid'>
        <div className='card'>
          <div className='card-body'>
            <CreateForm submitting={submitting} onSubmit={handleSubmit} onCancel={handleCancel} />
          </div>
        </div>
      </div>
    </Content>
  )
}

export default CreatePage
