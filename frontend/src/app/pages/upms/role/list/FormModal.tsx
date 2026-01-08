// src/app/pages/upms/role/FormModal.tsx
import React, {useEffect, useState} from 'react'
import { KTIcon } from '@/_metronic/helpers'
import { AlertType } from '@/app/pages/common/AlertType'

import { CreateRoleReq, Role, UpdateRoleReq } from '../Model'
import { createRole, updateRole } from '../Query'

type Props = {
  open: boolean
  onClose: () => void
  showAlert: (message: string, type: AlertType) => void
  onSaved: () => void
  editingRole: Role | null   // null = create, 非 null = edit
}

export const FormModal: React.FC<Props> = ({
  open,
  onClose,
  showAlert,
  onSaved,
  editingRole,
}) => {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [enabled, setEnabled] = useState(true)
  const [permissionText, setPermissionText] = useState('')
  const [saving, setSaving] = useState(false)

  const isEdit = !!editingRole

  useEffect(() => {
    if (!editingRole) {
      // 🔹 Create 模式：預設值
      setCode('')
      setName('')
      setDescription('')
      setEnabled(true)
      setPermissionText('')
      return
    }

    // 🔹 Edit 模式：帶入原本資料（code 不允許修改）
    setCode(editingRole.code)
    setName(editingRole.name)
    setDescription(editingRole.description ?? '')
    setEnabled(editingRole.enabled)
    setPermissionText(
      editingRole.permissionCodes && editingRole.permissionCodes.length > 0
        ? editingRole.permissionCodes.join(', ')
        : ''
    )
  }, [editingRole])

  if (!open) return null

  const parsePermissionCodes = (): string[] =>
    permissionText
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)

  const handleSave = async () => {
    if (!name.trim()) {
      showAlert('請輸入角色名稱', 'warning')
      return
    }
    if (!isEdit && !code.trim()) {
      showAlert('請輸入角色代碼', 'warning')
      return
    }

    try {
      setSaving(true)
      const permissionCodes = parsePermissionCodes()

      if (isEdit && editingRole) {
        // 🔁 更新
        const payload: UpdateRoleReq = {
          name: name.trim(),
          description: description.trim() || undefined,
          enabled,
          permissionCodes,
        }

        const ok = await updateRole(editingRole.id, payload, showAlert)
        if (ok) {
          onSaved()
        }
      } else {
        // 🆕 新增
        const payload: CreateRoleReq = {
          code: code.trim(),
          name: name.trim(),
          description: description.trim() || undefined,
          enabled,
          permissionCodes,
        }

        const ok = await createRole(payload, showAlert)
        if (ok) {
          onSaved()
        }
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className='modal fade show d-block'
      tabIndex={-1}
      style={{backgroundColor: 'rgba(0,0,0,.25)'}}
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          {/* Header */}
          <div className='modal-header'>
            <h5 className='modal-title'>
              <KTIcon
                iconName={isEdit ? 'message-edit' : 'plus'}
                className='fs-2 me-2'
              />
              {isEdit ? '編輯角色' : '新增角色'}
            </h5>
            <button
              type='button'
              className='btn btn-sm btn-light'
              onClick={onClose}
              disabled={saving}
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className='modal-body'>
            <div className='row g-5'>
              <div className='col-md-6 d-flex flex-column gap-3'>
                {/* 角色代碼 */}
                <div>
                  <label className='form-label required'>角色代碼（code）</label>
                  <input
                    className='form-control'
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder='如：ADMIN, DRIVER, DISPATCH'
                    disabled={isEdit}         // 編輯模式不允許修改 code
                  />
                  {isEdit && (
                    <div className='form-text'>
                      角色代碼建立後不可修改，如需調整請新建角色。
                    </div>
                  )}
                </div>

                {/* 角色名稱 */}
                <div>
                  <label className='form-label required'>角色名稱（name）</label>
                  <input
                    className='form-control'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='如：系統管理員、調度人員'
                  />
                </div>

                {/* 啟用狀態 */}
                <div className='form-check form-switch form-check-custom form-check-solid'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    id='roleEnabledSwitch'
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                  />
                  <label className='form-check-label' htmlFor='roleEnabledSwitch'>
                    啟用
                  </label>
                </div>
              </div>

              {/* 右側：描述 + 權限代碼 */}
              <div className='col-md-6 d-flex flex-column gap-3'>
                <div>
                  <label className='form-label'>角色描述</label>
                  <textarea
                    className='form-control'
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='可描述此角色主要負責哪些操作、權限邊界等說明'
                  />
                </div>

                <div>
                  <label className='form-label'>權限代碼（以逗號分隔）</label>
                  <textarea
                    className='form-control'
                    rows={3}
                    value={permissionText}
                    onChange={(e) => setPermissionText(e.target.value)}
                    placeholder='如：UPMS_USER_READ, UPMS_USER_WRITE, FMS_VEHICLE_READ'
                  />
                  <div className='form-text'>
                    多個權限代碼請用逗號分隔。<br />
                    目前只是「字串代碼」，實際對應的 Permission 資源由後端維護。
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='modal-footer'>
            <button
              className='btn btn-light'
              onClick={onClose}
              disabled={saving}
            >
              取消
            </button>
            <button
              className='btn btn-primary'
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '儲存中…' : '儲存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
