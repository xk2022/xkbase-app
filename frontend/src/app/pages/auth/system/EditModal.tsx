import { useState, useEffect, useRef } from 'react';
import { Content } from '../../../../_metronic/layout/components/content';
import { KTIcon } from '../../../../_metronic/helpers';

interface System {
  id: number;
  name: string;
  orders: number;
}

interface EditModalProps {
  editModal: boolean;
  onClose: () => void;
  system: System | null;
  showAlert: (message: string, type: "success" | "danger" | "warning") => void;
  onSystemUpdated: () => void;
}

export function EditModal({ editModal, onClose, system, showAlert, onSystemUpdated }: EditModalProps) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const initialErrorState = { name: false, orders: false };
  const initialTouchedState = { name: false, orders: false };
  const [formData, setFormData] = useState<System | null>(system);
  const [errors, setErrors] = useState(initialErrorState);
  const [touched, setTouched] = useState(initialTouchedState);

  useEffect(() => {
    if (editModal && system) {
      setFormData(system);
    }
  }, [editModal, system]);

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
      name: formData.name.trim() === '',
      orders: isNaN(Number(formData.orders)) || Number(formData.orders) < 0 || Number(formData.orders) > 100,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }
    try {
      // loading開啟
      btnRef.current?.setAttribute('data-kt-indicator', 'on');
      const response = await fetch(`http://localhost:8081/api/upms/systems/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      // loading關閉
      btnRef.current?.removeAttribute("data-kt-indicator");
      if (response.ok) {
        showAlert("編輯成功！", "success");
        onSystemUpdated();
        onClose();
        return;
      }
      const responseData = await response.json();
      if (Array.isArray(responseData.errorDetails.length)) {
        showAlert(responseData.errorDetails.join("\n"), "warning");
        return;
      }
      showAlert(responseData.errorDetails, "warning");
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
              <h2 className="fw-bolder">編輯系統</h2>
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
                      name="name"
                      autoComplete="off"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {touched.name && errors.name && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">名稱不得為空</span>
                      </div>
                    </div>
                  )}
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
      </div>
    </Content>
  );
}
