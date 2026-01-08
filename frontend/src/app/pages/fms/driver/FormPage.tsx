// src/app/pages/fms/driver/FormPage.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CreateDriverReq } from './Model'
import { createDriver } from './Query'
import { DriverFormValues, Form } from './Form'

export const FormPage: React.FC = () => {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (values: DriverFormValues) => {
    setSubmitting(true)

    // 組合後端 payload
    const payload: CreateDriverReq = {
      userId: values.userId || undefined,       // 未來若綁定 UPMS user
      name: values.name.trim(),
      phone: values.phone.trim(),
      licenseType: values.licenseType,
      status: values.status,
      onDuty: values.onDuty ?? false,
      currentVehicleId: values.currentVehicleId || undefined,
    }

    const success = await createDriver(payload)
    setSubmitting(false)

    if (success) {
      navigate('/fms/driver/list') // 或 navigate(-1)
    } else {
      console.error('新增司機失敗')
    }
  }

  const handleCancel = () => {
    navigate(-1) // 或 navigate('/fms/driver/list')
  }

  return (
    <div className='card'>
      <div className='card-header'>
        <h2 className='card-title'>新增司機</h2>
      </div>

      <div className='card-body'>
        <Form
          mode='create'
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
