// src/app/pages/upms/system/create/CreatePage.tsx
import React, {useCallback, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {Content} from '@/_metronic/layout/components/content'

import {useAlert} from '@/app/pages/common/AlertType'
import {AppToolbar} from '@/app/pages/common/AppToolbar'

import type {CreateSystemReq} from '../Model'
import {createSystem} from '../Query'
import { CreateForm } from './CreateForm'
import { toUndef, trim, upper } from '@/app/pages/common/form/formUtils'

/**
 * ===============================================================
 * CreatePage
 * - 新增系統頁（只負責流程：送出 / 顯示訊息 / 導頁）
 * - 表單 UI 交給 <CreateForm />
 * ===============================================================
 */
const toCreateReq = (v: CreateSystemReq): CreateSystemReq => {
  return {
    code: upper(v.code),
    name: trim(v.name),
    enabled: v.enabled ?? true,
    remark: toUndef(v.remark),
  }
}

// ===============================================================
// Component
// ===============================================================
export const CreatePage: React.FC = () => {
  const navigate = useNavigate()
  const {alert, showAlert, Alert} = useAlert()
  const [submitting, setSubmitting] = useState(false)

  const handleCancel = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const handleSubmit = useCallback(
    async (values: CreateSystemReq) => {
      setSubmitting(true)
      try {
        const ok = await createSystem(toCreateReq(values), showAlert)
        if (ok) {
          // 依你的路由調整：常見是導回 list 或 overview
          navigate('/upms/system/list')
          return
        }
      } catch (e) {
        console.error(e)
        showAlert('系統發生錯誤，請稍後再試', 'danger')
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
        title='新增系統'
        breadcrumbs={[
          {label: 'UPMS 權限管理', href: '#', active: false},
          {label: '系統', active: false},
          {label: '新增', active: true},
        ]}
      />

      <div className='container-fluid'>
        <div className='card'>
          <div className='card-body'>
            <CreateForm
              submitting={submitting}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </Content>
  )
}
