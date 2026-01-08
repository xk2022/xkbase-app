// src/app/pages/upms/permission/create/CreatePage.tsx
import React, {useCallback, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {Content} from '@/_metronic/layout/components/content'

import {useAlert} from '@/app/pages/common/AlertType'
import {AppToolbar} from '@/app/pages/common/AppToolbar'

import {createPermission} from '../Query'
import type {CreatePermissionReq} from '../Model'
import {CreateForm} from './CreateForm'

/**
 * ===============================================================
 * CreatePage
 * - 新增權限頁（只負責流程：送出 / 顯示訊息 / 導頁）
 * - 表單 UI 交給 <CreateForm />
 * ===============================================================
 */

// ===============================================================
// Helpers
// ===============================================================
const trim = (v?: string) => (v ?? '').trim()
const toUndef = (v?: string) => {
  const t = trim(v)
  return t ? t : undefined
}
const upper = (v?: string) => trim(v).toUpperCase()

const toIntOrUndef = (v?: string): number | undefined => {
  const t = trim(v)
  if (!t) return undefined
  const n = Number.parseInt(t, 10)
  return Number.isFinite(n) ? n : undefined
}

/**
 * CreateFormValues -> CreatePermissionReq
 * - 最小安全 normalize（trim/upper）
 * - code 由後端組合也沒關係：前端仍可送 system/resource/action 讓後端組
 */
const toCreateReq = (v: CreatePermissionReq): CreatePermissionReq => {
  return {
    // 若你的後端允許「直接傳 code」，就保留；若後端會自行組合可不送 code
    // ...(trim(v.code) ? {code: upper(v.code)} : {}),

    systemCode: upper(v.systemCode),
    resourceCode: upper(v.resourceCode),
    actionCode: upper(v.actionCode),

    name: trim(v.name),
    description: toUndef(v.description),

    enabled: v.enabled ?? true,
    sortOrder: typeof v.sortOrder === 'number' ? v.sortOrder : toIntOrUndef(String(v.sortOrder ?? '')),
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
    async (values: CreatePermissionReq) => {
      setSubmitting(true)
      try {
        const ok = await createPermission(toCreateReq(values), showAlert)
        if (ok) {
          navigate('/upms/permission/list')
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
        title='新增權限'
        breadcrumbs={[
          {label: 'UPMS 權限管理', href: '#', active: false},
          {label: '權限', active: false},
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
