// src/app/pages/fms/vehicle/FormPage.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CreateVehicleReq } from './Model'
import { createVehicle } from './Query'
import { Form, VehicleFormValues } from './Form'

export const FormPage: React.FC = () => {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (values: VehicleFormValues) => {
    setSubmitting(true)

    // 組合後端 payload
    const payload: CreateVehicleReq = {
      plateNo: values.plateNo.trim(),
      type: values.type,
      brand: values.brand || undefined,
      model: values.model || undefined,
      capacityTon: values.capacityTon ? Number(values.capacityTon) : undefined,
      status: values.status,
      enabled: values.enabled ?? true,
      remark: values.remark || undefined,
    }

    const success = await createVehicle(payload)
    setSubmitting(false)

    if (success) {
      navigate('/fms/vehicle/list') // 或 navigate(-1)
    } else {
      console.error('新增車輛失敗')
    }
  }

  const handleCancel = () => {
    navigate(-1) // 或 navigate('/fms/vehicle/list')
  }

  return (
    <div className='card'>
      <div className='card-header'>
        <h2 className='card-title'>新增車輛</h2>
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
