// src/app/pages/tom/container/create/CreatePage.tsx
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Content } from '@/_metronic/layout/components/content'
import { CreateForm } from './CreateForm'

import { useAlert } from '@/app/pages/common/AlertType'
import { AppToolbar } from '@/app/pages/common/AppToolbar'
import { toUndef, trim } from '@/app/pages/common/form/formUtils'

import type { CreateContainerFormValues, CreateContainerReq } from '../Model'

/**
 * ===============================================================
 * CreatePage
 * - 建立貨櫃頁
 * - 僅負責流程控制：
 *   1) 接收表單資料
 *   2) 呼叫 API
 *   3) 顯示訊息
 *   4) 導頁
 * - 表單 UI 全部交給 <CreateForm />
 * ===============================================================
 */

/**
 * FormValues -> CreateContainerReq
 * - 在 Page 層做最小 normalize（trim / toUndef）
 * - 不在這裡做業務判斷
 */
const toCreateReq = (v: CreateContainerFormValues): CreateContainerReq => {
  return {
    containerNo: trim(v.containerNo),
    type: trim(v.type),
    status: v.status,
    weight: toUndef(v.weight),
    remark: toUndef(v.remark),
  }
}

// ===============================================================
// Component
// ===============================================================
export const CreatePage: React.FC = () => {
  const navigate = useNavigate()
  const { alert, showAlert, Alert } = useAlert()
  const [submitting, setSubmitting] = useState(false)

  const handleCancel = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const handleSubmit = useCallback(
    async (values: CreateContainerFormValues) => {
      setSubmitting(true)
      try {
        const created = await createContainer(toCreateReq(values), showAlert)

        // 建立成功後：導回列表（跟 TOM 訂單一致）
        // 若你想導 detail，就改成 navigate(`/tom/container/${created.id}/detail`)
        showAlert('建立貨櫃成功', 'success')
        navigate('/tom/container/list')
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
        title='建立貨櫃'
        breadcrumbs={[
          { label: 'TOM 運輸管理', active: false },
          { label: '貨櫃管理', href: '/tom/container/list', active: false },
          { label: '建立貨櫃', active: true },
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

export default CreatePage
