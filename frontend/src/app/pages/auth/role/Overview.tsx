import { useState } from 'react';
import { Content } from '../../../../_metronic/layout/components/content';
import { KTIcon } from '../../../../_metronic/helpers';

// 檢核標單資料是否有效
const validateFormData = (formData: { code: string, title: string, description: string, orders: number }) => {
  return {
    code: formData.code.trim() === '',
    title: formData.title.trim() === '',
    description: formData.description.trim() === '',
    orders: !Number.isInteger(formData.orders),
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
      code: '',
      title: '',
      description: '',
      orders: 0
    }
  );

  // 初始化驗證狀態為不顯示
  const [errors, setErrors] = useState(
    { 
      code: false, 
      title: false,
      description: false,
      orders: false
    }
  );

  // 處理輸入框改變事件，更新表單資料和錯誤狀態
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    // 更新表單資料
    setFormData(prev => ({ ...prev, [name]: value }));
    // 如果輸入框為空，顯示錯誤
    setErrors(prev => ({ ...prev, [name]: value.trim() === "" || (name === "orders" && (Number(value) < 0 || Number(value) > 100))}));
  };

  // 表單提交事件處理
  const handleSubmit = async (e: any) => {
    // 阻止表單默認提交行為
    e.preventDefault();
    // 驗證表單資料
    const newErrors = validateFormData(formData);
    setErrors(newErrors);
    // 驗證結果
    if (Object.values(newErrors).includes(true)) {
      return;
    }
    try {
      // 發送請求到伺服器
      const response = await fetch('http://localhost:8081/api/upms/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      // 檢查回應是否成功
      if (response.ok) {
        alert('表單提交成功！');
        setIsModalOpen(false);
      } else {
        alert('提交失敗，請稍後再試！');
      }
    } catch (error) {
      console.error('提交錯誤:', error);
      alert('發生錯誤，請稍後再試！');
    } 
  };

  const openModal = () => {
    // 設定modal為開啟狀態
    setIsModalOpen(true);
    // 設定表單資料為空
    setFormData(
      { 
        code: '', 
        title: '',
        description: '',
        orders: 0
      }
    );
    // 設定標單驗證不顯示
    setErrors(
      { 
        code: false, 
        title: false, 
        description: false,
        orders: false
      }
    );
  };

  return (
    <Content>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">權限</li>
          <li className="breadcrumb-item">角色</li>
        </ol>
      </nav>
      <div className="app-content flex-column-fluid">
        <div className="card">
          <div className="card-header border-0 pt-6">
            <div className="card-title">
              <div className="d-flex align-items-center position-relative my-1">
                <KTIcon iconName="magnifier" className="fs-1 position-absolute ms-6" />
                <input
                  type="text"
                  data-kt-role-table-filter="search"
                  className="form-control form-control-solid w-250px ps-14"
                  placeholder="請輸入關鍵字"
                />
              </div>
            </div>
            <div className="card-toolbar">
              <div className="d-flex justify-content-end" data-kt-role-table-toolbar="base">
                <button type="button" className="btn btn-primary" onClick={openModal}>
                  <KTIcon iconName="plus" className="fs-2" />
                  新增角色
                </button>
              </div>
            </div>
          </div>
          <div className="card-body py-4">
            <div className="table-responsive">
              <table
                id="kt_table_roles"
                className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
              >
                <thead>
                  <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                    <td className="min-w-125px">角色</td>
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
          <div className="modal fade show d-block" id="kt_modal_add_role" role="dialog" tabIndex={-1} aria-modal="true">
            <div className="modal-dialog modal-dialog-centered mw-650px">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="fw-bolder">新增角色</h2>
                  <div
                    className="btn btn-icon btn-sm btn-active-icon-primary"
                    onClick={() => setIsModalOpen(false)}
                    style={{ cursor: 'pointer' }}
                  >
                    <KTIcon iconName="cross" className="fs-1" />
                  </div>
                </div>
                <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
                  <form id="kt_modal_add_role_form" className="form" noValidate onSubmit={handleSubmit}>
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
                        />
                      </div>
                      <ErrorMessage show={errors.code} message="名稱不得為空" />
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
                        />
                      </div>
                      <ErrorMessage show={errors.code} message="標題不得為空" />
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
                        />
                      </div>
                    </div>
                    <div className="row fv-row mb-6">
                      <label className="col-lg-2 col-form-label required fw-bold fs-6">排序</label>
                      <div className="col-lg-10">
                        <input
                          placeholder="請輸入排序數字0~100"
                          className="form-control form-control-solid"
                          type="number"
                          name="cellphone"
                          autoComplete="off"
                          value={formData.orders}
                          onChange={handleChange}
                          onKeyDown={(e) => {
                            if (!/^[0-9]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                      <ErrorMessage show={errors.orders} message="排序不得為空且必須小100且大於0" />
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
