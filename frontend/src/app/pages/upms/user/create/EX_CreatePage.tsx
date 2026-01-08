// src/app/pages/<module>/<entity>/create/CreatePage.tsx
import React, {useCallback, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {Content} from '@/_metronic/layout/components/content'
import {useAlert} from '@/app/pages/common/AlertType'
import {AppToolbar} from '@/app/pages/common/AppToolbar'

import type {CreateXxxReq, CreateXxxFormValues} from '../Model'
import {createXxx} from '../Query'
import {CreateForm} from './CreateForm'
import {toUndef, trim} from '@/app/pages/common/form/formUtils'

/** ===============================================================
 * Mapper (UI Values -> API Req)
 * - 集中在 Page：API DTO 改了，只改這裡
 * =============================================================== */
const toCreateReq = (v: CreateXxxFormValues): CreateXxxReq => ({
  // ✅ 最常見：trim + optional undef
  // code: upper(trim(v.code)),
  name: trim(v.name),
  remark: toUndef(trim(v.remark ?? '')),
  enabled: !!v.enabled,
})

export const CreatePage: React.FC = () => {
  const navigate = useNavigate()
  const {alert, showAlert, Alert} = useAlert()
  const [submitting, setSubmitting] = useState(false)

  const handleCancel = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const handleSubmit = useCallback(
    async (values: CreateXxxFormValues) => {
      setSubmitting(true)
      try {
        const ok = await createXxx(toCreateReq(values), showAlert)
        if (ok) {
          navigate('/<module>/<entity>/overview')
          return
        }
        // createXxx 若回 false：通常已 showAlert
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
        title='新增'
        breadcrumbs={[
          {label: '權限管理', href: '#', active: false},
          {label: '<Entity>', active: false},
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
