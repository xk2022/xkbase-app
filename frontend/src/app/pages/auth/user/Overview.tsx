import { useState } from 'react';
import { Content } from '../../../../_metronic/layout/components/content';
import { KTIcon } from '../../../../_metronic/helpers';

// 檢核標單資料是否有效
const validateFormData = (formData: { name: string, email: string, cellphone: string }) => {
  return {
    name: formData.name.trim() === '',
    email: formData.email.trim() === '',
    cellphone: formData.cellphone.trim() === '',
  };
};

// 自定義錯誤訊息
const ErrorMessage = ({ show, message }: { show: boolean, message: string }) => {
  return show ? (
    <div className="fv-plugins-message-container">
      <div className="fv-help-block">
        <span role="alert">{message}</span>
      </div>
    </div>
  ) : null;
};

export function Overview() {

  // modal開關
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 初始化表單為空字串
  const [formData, setFormData] = useState(
    { 
      name: '', 
      email: '', 
      cellphone: ''
    }
  );

  // 初始化驗證狀態為不顯示
  const [errors, setErrors] = useState(
    { 
      name: false, 
      email: false, 
      cellphone: false
    }
  );

  // 處理輸入框改變事件，更新表單資料和錯誤狀態
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    // 更新表單資料
    setFormData(prev => ({ ...prev, [name]: value }));
    // 如果輸入框為空，顯示錯誤
    setErrors(prev => ({ ...prev, [name]: value.trim() === '' }));
  };

  // 表單提交事件處理
  const handleSubmit = (e: any) => {
    // 阻止表單默認提交行為
    e.preventDefault();
    // 驗證表單資料
    const newErrors = validateFormData(formData);
    setErrors(newErrors);
    // 驗證結果
    if (!Object.values(newErrors).includes(true)) {
      alert('表單提交成功！');
      setIsModalOpen(false);
    }
  };

  const openModal = () => {
    // 設定modal為開啟狀態
    setIsModalOpen(true);
    // 設定表單資料為空
    setFormData(
      { 
        name: '', 
        email: '', 
        cellphone: '' 
      }
    );
    // 設定標單驗證不顯示
    setErrors(
      { 
        name: false, 
        email: false, 
        cellphone: false
      }
    );
  };

  return (
    <Content>
      <div className="container">
        <ol className="breadcrumb text-muted fs-6 fw-bold">
          <li className="breadcrumb-item pe-3">
            <a href="#" className="pe-3">
            權限
            </a>
          </li>
          <li className="breadcrumb-item px-3 text-muted">使用者</li>
        </ol>
      </div>
      <div className="app-content flex-column-fluid">
        <div className="card">
          <div className="card-header border-0 pt-6">
            <div className="card-title">
              <div className="d-flex align-items-center position-relative my-1">
                <KTIcon iconName="magnifier" className="fs-1 position-absolute ms-6" />
                <input
                  type="text"
                  data-kt-user-table-filter="search"
                  className="form-control form-control-solid w-250px ps-14"
                  placeholder="請輸入關鍵字"
                />
              </div>
            </div>
            <div className="card-toolbar">
              <div className="d-flex justify-content-end" data-kt-user-table-toolbar="base">
                <button type="button" className="btn btn-primary" onClick={openModal}>
                  <KTIcon iconName="plus" className="fs-2" />
                  新增使用者
                </button>
              </div>
            </div>
          </div>
          <div className="card-body py-4">
            <div className="table-responsive">
              <table
                id="kt_table_users"
                className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
              >
                <thead>
                  <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                    <td className="min-w-125px">名稱</td>
                    <td className="min-w-125px">角色</td>
                    <td className="min-w-125px">信箱</td>
                    <td className="min-w-125px">手機</td>
                    <td className="min-w-125px">最後登入時間</td>
                    <td className="min-w-125px">狀態</td>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <>
          <div className="modal fade show d-block" id="kt_modal_add_user" role="dialog" tabIndex={-1} aria-modal="true">
            <div className="modal-dialog modal-dialog-centered mw-650px">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="fw-bolder">新增使用者</h2>
                  <div
                    className="btn btn-icon btn-sm btn-active-icon-primary"
                    onClick={() => setIsModalOpen(false)}
                    style={{ cursor: 'pointer' }}
                  >
                    <KTIcon iconName="cross" className="fs-1" />
                  </div>
                </div>
                <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
                  <form id="kt_modal_add_user_form" className="form" noValidate onSubmit={handleSubmit}>
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
                        />
                      </div>
                      <ErrorMessage show={errors.name} message="名稱不得為空" />
                    </div>
                    <div className="row fv-row mb-6">
                      <label className="col-lg-2 col-form-label required fw-bold fs-6">信箱</label>
                      <div className="col-lg-10">
                        <input
                          placeholder="請輸入信箱"
                          className="form-control form-control-solid"
                          type="email"
                          name="email"
                          autoComplete="off"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <ErrorMessage show={errors.email} message="信箱不得為空" />
                    </div>
                    <div className="row fv-row mb-6">
                      <label className="col-lg-2 col-form-label required fw-bold fs-6">手機</label>
                      <div className="col-lg-10">
                        <input
                          placeholder="請輸入手機號碼"
                          className="form-control form-control-solid"
                          type="text"
                          name="cellphone"
                          autoComplete="off"
                          value={formData.cellphone}
                          onChange={handleChange}
                          onKeyDown={(e) => {
                            if (!/^[0-9]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                      <ErrorMessage show={errors.cellphone} message="手機不得為空" />
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                        關閉
                      </button>
                      <button type="submit" className="btn btn-primary">儲存</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </Content>
  );
}
