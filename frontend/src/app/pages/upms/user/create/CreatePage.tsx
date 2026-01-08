// src/app/pages/upms/user/create/CreatePage.tsx

import React, {useCallback, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {Content} from '@/_metronic/layout/components/content'
import {KTIcon} from '@/_metronic/helpers'
import {useAlert} from '@/app/pages/common/AlertType'
import {AppToolbar} from '@/app/pages/common/AppToolbar'
import {toUndef, trim} from '@/app/pages/common/form/formUtils'

import type {CreateUserReq, CreateUserFormValues} from '../Model'
import {createUser} from '../Query'
import {CreateForm} from './CreateForm'

/** ===============================================================
 * Mapper (UI Values -> API Req)
 * - 集中在 Page：API DTO 改了，只改這裡
 * =============================================================== */
const toCreateReq = (v: CreateUserFormValues): CreateUserReq => ({
  username: trim(v.username),
  password: trim(v.password),
  roleCodes: (v.roleCodes),
  name: toUndef(v.name),
  email: toUndef(v.email),
  phone: toUndef(v.phone),
})

export const CreatePage: React.FC = () => {
  const navigate = useNavigate()
  const {alert, showAlert, Alert} = useAlert()
  const [submitting, setSubmitting] = useState(false)

  const handleCancel = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const handleSubmit = useCallback(
    async (values: CreateUserFormValues) => {
      setSubmitting(true)
      try {
        const ok = await createUser(toCreateReq(values), showAlert)
        if (ok) {
          navigate('/upms/user/overview')
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
        title='新增使用者'
        breadcrumbs={[
          {label: '權限管理', href: '#', active: false},
          {label: '使用者', href: '/upms/user/list', active: false},
          {label: '新增', active: true},
        ]}
      />

      {/* Body */}
      <div className='flex-column-fluid'>
        <div className='card'>
          {/* begin::Card Header */}
          <div className='card-header border-0 pt-6'>
            <div className='card-title'>
              <div className='d-flex align-items-center'>
                <KTIcon iconName='user' className='fs-2 me-2 text-primary' />
                <h2 className='fw-bold text-gray-900 m-0'>建立新使用者</h2>
              </div>
            </div>
            <div className='card-toolbar'>
              <button
                type='button'
                className='btn btn-light btn-active-light-primary'
                onClick={handleCancel}
                disabled={submitting}
              >
                <KTIcon iconName='arrow-left' className='fs-2' />
                返回
              </button>
            </div>
          </div>
          {/* end::Card Header */}

          {/* begin::Card Body */}
          <div className='card-body py-6'>
            <CreateForm
              submitting={submitting}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
          {/* end::Card Body */}
        </div>
      </div>
    </Content>
  )
}
