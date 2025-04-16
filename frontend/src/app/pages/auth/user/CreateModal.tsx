import { useState, useEffect, useRef } from 'react';
import { Content } from '../../../../_metronic/layout/components/content';
import { KTIcon } from '../../../../_metronic/helpers';
import { Role } from '../../model/RoleModel';
import { createUser } from './Query';

interface CreateModalProps {
  createModal: boolean;
  onClose: () => void;
  showAlert: (message: string, type: 'success' | 'danger' | 'warning') => void;
  onUserCreated: () => void;
  roles: Role[];
}

export function CreateModal({ createModal, onClose, showAlert, onUserCreated, roles }: CreateModalProps) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const initialFormState = { uuid: '', username: '', email: '', cellPhone: '', roleUuid: roles.length > 0 ? roles[0].uuid : '', password: '', enabled: true, locked: false, lastLogin: '' };
  const initialErrorState = { username: false, email: false, cellPhone: false, password: false };
  const initialTouchedState = { username: false, email: false, cellPhone: false, password: false };
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrorState);
  const [touched, setTouched] = useState(initialTouchedState);

  // 預設角色下拉選單為第一筆
  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      roleUuid: prevState.roleUuid || (roles.length > 0 ? roles[0].uuid : ''),
    }));
  }, [roles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "roleUuid" ? value : value,
    });
    if (touched[name as keyof typeof touched]) {
      setErrors({ ...errors, [name]: value.trim() === '' });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: value.trim() === '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    e.preventDefault();
    setTouched({ username: true, email: true, cellPhone: true, password: true });
    const newErrors = {
      username: formData.username.trim() === '',
      email: !emailRegex.test(formData.email),
      cellPhone: formData.cellPhone.trim() === '' || isNaN(Number(formData.cellPhone)),
      password: formData.password.trim() === '',
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }
    btnRef.current?.setAttribute('disabled', 'true');
    btnRef.current?.setAttribute('data-kt-indicator', 'on');
    const success = await createUser(formData, showAlert);
    btnRef.current?.removeAttribute('disabled');
    btnRef.current?.removeAttribute("data-kt-indicator");
    if (success) {
      onUserCreated();
      onClose();
    }
  };

  // 初始化
  useEffect(() => {
    if (createModal) {
      setFormData(initialFormState);
      setErrors(initialErrorState);
      setTouched(initialTouchedState);
    }
  }, [createModal]);

  if (!createModal) {
    return null;
  }

  return (
    <Content>
      <div className={`modal fade ${createModal ? 'show d-block' : ''}`} id="kt_modal_add_user" role="dialog" tabIndex={-1} aria-modal="true">
        <div className="modal-dialog modal-dialog-centered mw-650px">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="fw-bolder">新增使用者</h2>
              <button type="button" className="btn btn-icon btn-sm btn-active-icon-primary" onClick={onClose}>
                <KTIcon iconName="cross" className="fs-1" />
              </button>
            </div>
            <form id="kt_modal_add_user_form" className="form" onSubmit={handleSubmit}>
              <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">

                <div className="row fv-row mb-6">
                  <label className="col-lg-2 col-form-label required fw-bold fs-6">名稱</label>
                  <div className="col-lg-10">
                    <input
                      placeholder="請輸入名稱"
                      className="form-control form-control-solid"
                      type="text"
                      name="username"
                      autoComplete="off"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {touched.username && errors.username && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">名稱不得為空</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="row fv-row mb-6">
                  <label className="col-lg-2 col-form-label required fw-bold fs-6">信箱</label>
                  <div className="col-lg-10">
                    <input
                      placeholder="請輸入信箱"
                      className="form-control form-control-solid"
                      type="text"
                      name="email"
                      autoComplete="off"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">信箱不得為空</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="row fv-row mb-6">
                  <label className="col-lg-2 col-form-label required fw-bold fs-6">手機</label>
                  <div className="col-lg-10">
                    <input
                      placeholder="請輸入手機"
                      className="form-control form-control-solid"
                      type="text"
                      name="cellPhone"
                      autoComplete="off"
                      value={formData.cellPhone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={(e) => {
                        if (!/^\d$/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  {touched.cellPhone && errors.cellPhone && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">手機格式錯誤</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="row fv-row mb-6">
                  <label className="col-lg-2 col-form-label required fw-bold fs-6">密碼</label>
                  <div className="col-lg-10">
                    <input
                      placeholder="請輸入密碼"
                      className="form-control form-control-solid"
                      type="password"
                      name="password"
                      autoComplete="off"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {touched.password && errors.password && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">密碼不得為空</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="row fv-row mb-6">
                  <label className="col-lg-2 col-form-label required fw-bold fs-6">角色</label>
                  <div className="col-lg-10">
                    <select
                      className="form-select form-select-solid"
                      name="roleUuid"
                      value={formData.roleUuid}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {roles.map(role => (
                        <option key={role.uuid} value={role.uuid}>{role.code}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>關閉</button>
                <button type="submit" className="btn btn-primary" ref={btnRef}>
                  <span className="indicator-label">儲存</span>
                  <span className="indicator-progress">請稍後...
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </Content>
  );
}
