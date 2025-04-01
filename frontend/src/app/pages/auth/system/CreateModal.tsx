import { useState, useEffect, useRef } from 'react';
import { Content } from '../../../../_metronic/layout/components/content';
import { KTIcon } from '../../../../_metronic/helpers';
import { useSystem } from '../../common/SystemContext';
import { createSystem } from './Query'; 

interface CreateModalProps {
  createModal: boolean;
  onClose: () => void;
  showAlert: (message: string, type: 'success' | 'danger' | 'warning') => void;
  onSystemCreated: () => void;
}

export function CreateModal({ createModal, onClose, showAlert, onSystemCreated }: CreateModalProps) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const initialFormState = { uuid: '', code: '', name: '', description: '', enabled: true };
  const initialErrorState = { code: false, name: false };
  const initialTouchedState = { code: false, name: false };
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrorState);
  const [touched, setTouched] = useState(initialTouchedState);
  // global系統參數
  const { refreshSystems } = useSystem();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    setTouched({ code: true, name: true });
    const newErrors = {
      code: formData.code.trim() === '',
      name: formData.name.trim() === '',
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }
    btnRef.current?.setAttribute('disabled', 'true');
    btnRef.current?.setAttribute('data-kt-indicator', 'on');
    const success = await createSystem(formData, showAlert);
    btnRef.current?.removeAttribute('disabled');
    btnRef.current?.removeAttribute("data-kt-indicator");
    if (success) {
      onSystemCreated();
      refreshSystems();
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
      <div className={`modal fade ${createModal ? 'show d-block' : ''}`} id="kt_modal_add_system" role="dialog" tabIndex={-1} aria-modal="true">
        <div className="modal-dialog modal-dialog-centered mw-650px">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="fw-bolder">新增系統</h2>
              <button type="button" className="btn btn-icon btn-sm btn-active-icon-primary" onClick={onClose}>
                <KTIcon iconName="cross" className="fs-1" />
              </button>
            </div>
            <form id="kt_modal_add_system_form" className="form" onSubmit={handleSubmit}>
              <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">

                <div className="row fv-row mb-6">
                  <label className="col-lg-2 col-form-label required fw-bold fs-6">代碼</label>
                  <div className="col-lg-10">
                    <input
                      placeholder="請輸入代碼"
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
                        <span role="alert">代碼不得為空</span>
                      </div>
                    </div>
                  )}
                </div>

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
                  <label className="col-lg-2 col-form-label fw-bold fs-6">描述</label>
                  <div className="col-lg-10">
                    <input
                      placeholder="請輸入描述"
                      className="form-control form-control-solid"
                      type="text"
                      name="description"
                      autoComplete="off"
                      value={formData.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  <span className="indicator-label">關閉</span>
                </button>
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
