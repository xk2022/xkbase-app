import { useState, useEffect } from 'react';
import { Content } from '../../../../_metronic/layout/components/content';
import { KTIcon } from '../../../../_metronic/helpers';

interface Role {
  id: number;
  code: string;
  title: string;
  description: string;
  orders: number;
}

interface EditModalProps {
  editModal: boolean;
  onClose: () => void;
  role: Role | null;
  onAlert: (message: string, type: "success" | "danger" | "warning") => void;
  onRoleUpdated: () => void;
}

export function EditModal({ editModal, onClose, role, onAlert, onRoleUpdated }: EditModalProps) {
  const initialErrorState = { code: false, title: false, orders: false };
  const initialTouchedState = { code: false, title: false, orders: false };

  const [formData, setFormData] = useState<Role | null>(role);
  const [errors, setErrors] = useState(initialErrorState);
  const [touched, setTouched] = useState(initialTouchedState);

  useEffect(() => {
    if (editModal && role) {
      setFormData(role);
    }
  }, [editModal, role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => prevState ? { ...prevState, [name]: value } : prevState);
    if (touched[name as keyof typeof touched]) {
      setErrors({ ...errors, [name]: value.trim() === '' });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: value.trim() === '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) {
      return
    };
    const newErrors = {
      code: formData.code.trim() === '',
      title: formData.title.trim() === '',
      orders: isNaN(Number(formData.orders)) || Number(formData.orders) < 0 || Number(formData.orders) > 100,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8081/api/upms/roles/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        onAlert("編輯成功！", "success");
        onRoleUpdated();
        onClose();
        return;
      }
      const responseData = await response.json();
      if(Array.isArray(responseData.errorDetails.length)){
        onAlert(responseData.errorDetails.join("\n"), "warning");
        return;
      }
      onAlert(responseData.errorDetails, "warning");
    } catch (error) {
      console.error("提交錯誤:", error);
      onAlert("系統錯誤，請稍後再試！", "danger");
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
              <h2 className="fw-bolder">編輯角色</h2>
              <button type="button" className="btn btn-icon btn-sm btn-active-icon-primary" onClick={onClose}>
                <KTIcon iconName="cross" className="fs-1" />
              </button>
            </div>
            <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
              <form className="form" onSubmit={handleSubmit}>

                <div className="row fv-row mb-6">
                  <label className="col-lg-2 col-form-label required fw-bold fs-6">名稱</label>
                  <div className="col-lg-10">
                    <input
                      placeholder="請輸入名稱"
                      className="form-control form-control-solid"
                      type="text"
                      name="code"
                      autoComplete="off"
                      value={formData.code}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {touched.code && errors.code && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">名稱不得為空</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="row fv-row mb-6">
                  <label className="col-lg-2 col-form-label required fw-bold fs-6">標題</label>
                  <div className="col-lg-10">
                    <input
                      placeholder="請輸入標題"
                      className="form-control form-control-solid"
                      type="text"
                      name="title"
                      autoComplete="off"
                      value={formData.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {touched.title && errors.title && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">標題不得為空</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="row fv-row mb-6">
                  <label className="col-lg-2 col-form-label required fw-bold fs-6">描述</label>
                  <div className="col-lg-10">
                    <input
                      placeholder="請輸入描述"
                      className="form-control form-control-solid"
                      type="text"
                      name="description"
                      autoComplete="off"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row fv-row mb-6">
                  <label className="col-lg-2 col-form-label required fw-bold fs-6">排序</label>
                  <div className="col-lg-10">
                    <input
                      placeholder="請輸入排序值"
                      className="form-control form-control-solid"
                      type="text"
                      name="orders"
                      autoComplete="off"
                      value={formData.orders}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={(e) => {
                        if (!/^[0-9]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  {touched.orders && errors.orders && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">排序值必須為 0 ~ 100</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={onClose}>關閉</button>
                  <button type="submit" className="btn btn-primary">儲存</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Content>
  );
}
