// src/app/pages/upms/role/create/CreatePage.tsx
import React, {useCallback, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {Content} from '@/_metronic/layout/components/content'

import {useAlert} from '@/app/pages/common/AlertType'
import {AppToolbar} from '@/app/pages/common/AppToolbar'

import {createRole} from '../Query'
import type {CreateRoleReq} from '../Model'
import {CreateForm, type RoleFormValues} from './CreateForm'

/**
 * Helpers
 */
const trimUndef = (v?: string) => (v?.trim() ? v.trim() : undefined)
const toUpper = (v?: string) => (v?.trim() ? v.trim().toUpperCase() : '')

const parsePermissionCodes = (s?: string): string[] | undefined => {
  const t = s?.trim()
  if (!t) return undefined
  const arr = t
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
  return arr.length ? arr : undefined
}

/**
 * RoleFormValues -> CreateRoleReq
 */
const toCreateReq = (v: RoleFormValues): CreateRoleReq => {
  return {
    code: toUpper(v.code),
    name: v.name.trim(),
    enabled: v.enabled ?? true,
    description: trimUndef(v.description),
    permissionCodes: parsePermissionCodes(v.permissionCodes),
  }
}

export const CreatePage: React.FC = () => {
  const navigate = useNavigate()
  const {alert, showAlert, Alert} = useAlert()
  const [submitting, setSubmitting] = useState(false)

  const handleCancel = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const handleSubmit = useCallback(
    async (values: RoleFormValues) => {
      setSubmitting(true)
      try {
        const ok = await createRole(toCreateReq(values), showAlert)
        if (ok) {
          navigate('/upms/role/list')
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
        title='新增角色'
        breadcrumbs={[
          {label: 'UPMS 權限管理', href: '#', active: false},
          {label: '角色', active: false},
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
