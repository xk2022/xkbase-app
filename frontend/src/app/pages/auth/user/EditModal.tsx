import { useState, useEffect, useRef } from 'react';
import { Content } from '../../../../_metronic/layout/components/content';
import { KTIcon } from '../../../../_metronic/helpers';

interface User {
  id: number;
  username: string;
  email: string;
  cellPhone: string;
  roleId: number;
  password: string;
  enabled: boolean;
  locked: boolean;
  lastLogin: string;
}

interface EditModalProps {
  editModal: boolean;
  onClose: () => void;
  user: User | null;
  showAlert: (message: string, type: "success" | "danger" | "warning") => void;
  onUserUpdated: () => void;
  roles: { id: number, code: string, title: string, description: string, orders: number }[];
}

export function EditModal({ editModal, onClose, user, showAlert, onUserUpdated, roles }: EditModalProps) {
  // 按鈕loading初始化
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const initialErrorState = { username: false, email: false, cellPhone: false };
  const initialTouchedState = { username: false, email: false, cellPhone: false };
  const [formData, setFormData] = useState<User | null>(user);
  const [errors, setErrors] = useState(initialErrorState);
  const [touched, setTouched] = useState(initialTouchedState);

  useEffect(() => {
    if (editModal && user) {
      setFormData(user);
    }
  }, [editModal, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => prevState ? { ...prevState, [name]: value } : prevState);
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
    e.preventDefault();
    if (!formData) return;

    const newErrors = {
      username: formData.username.trim() === '',
      email: formData.email.trim() === '',
      cellPhone: formData.cellPhone.trim() === ''
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }
    try {
      // loading開啟
      btnRef.current?.setAttribute('data-kt-indicator', 'on');
      const response = await fetch(`http://localhost:8081/api/upms/users/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      // loading關閉
      btnRef.current?.removeAttribute("data-kt-indicator");
      if (response.ok) {
        showAlert("編輯成功！", "success");
        onUserUpdated();
        onClose();
        return;
      }
      const responseData = await response.json();
      if (responseData.errorDetails && Array.isArray(responseData.errorDetails)) {
        showAlert(responseData.errorDetails.join("\n"), "warning");
        return;
      }
      showAlert(responseData.message || "請求失敗，請檢查輸入資料", "warning");
    } catch (error) {
      console.error("提交錯誤:", error);
      showAlert("系統錯誤，請稍後再試！", "danger");
      onClose();
    }
  };

  if (!editModal || !formData) return null;

  return (
    <Content>
      <div className={`modal fade ${editModal ? 'show d-block' : ''}`} role="dialog">
        <div className="modal-dialog modal-dialog-centered mw-650px">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="fw-bolder">編輯使用者</h2>
              <button type="button" className="btn btn-icon btn-sm btn-active-icon-primary" onClick={onClose}>
                <KTIcon iconName="cross" className="fs-1" />
              </button>
            </div>
            <form className="form" onSubmit={handleSubmit}>
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
                      placeholder="請輸入手機號碼"
                      className="form-control form-control-solid"
                      type="text"
                      name="cellPhone"
                      autoComplete="off"
                      value={formData.cellPhone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={(e) => {
                        if (!/^[0-9]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  {touched.cellPhone && errors.cellPhone && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">手機號碼不得為空</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="row fv-row mb-6">
                  <label className="col-lg-2 col-form-label required fw-bold fs-6">角色</label>
                  <div className="col-lg-10">
                    <select
                      className="form-select form-select-solid"
                      name="roleId"
                      value={formData.roleId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.code}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row fv-row mb-6">
                  <label className="col-lg-2 col-form-label required fw-bold fs-6">啟用</label>
                  <div className="col-lg-10 d-flex">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.enabled}
                        onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="row fv-row mb-6">
                  <label className="col-lg-2 col-form-label required fw-bold fs-6">鎖定</label>
                  <div className="col-lg-10 d-flex">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.locked}
                        onChange={(e) => setFormData({ ...formData, locked: e.target.checked })}
                      />
                    </div>
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
    </Content>
  );
}
