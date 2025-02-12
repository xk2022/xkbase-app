import { useState } from "react";
import { Content } from "../../../../_metronic/layout/components/content";
import { KTIcon } from "../../../../_metronic/helpers";

// 檢核標單資料是否有效
const validateFormData = (formData: { code: string; title: string; description: string; orders: number }) => {
  return {
    code: formData.code.trim() === '',
    title: formData.title.trim() === '',
    description: formData.description.trim() === '',
    orders: !Number.isInteger(formData.orders) || formData.orders < 0 || formData.orders > 100,
  };
};

// 自定義錯誤訊息
const ErrorMessage = ({ show, message }: { show: boolean; message: string }) => {
  return show ? (
    <div className="fv-plugins-message-container">
      <div className="fv-help-block">
        <span role="alert">{message}</span>
      </div>
    </div>
  ) : null;
};

export function Overview() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    orders: 0,
  });

  const [errors, setErrors] = useState({
    code: false,
    title: false,
    description: false,
    orders: false,
  });

  // 處理輸入變更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'orders' ? Number(value) || 0 : value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: value.trim() === '' || (name === 'orders' && (Number(value) < 0 || Number(value) > 100)), 
    }));
  };

  // 表單提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateFormData(formData);
    setErrors(newErrors);
    if (Object.values(newErrors).includes(true)){
      return;
    } 
    try {
      const response = await fetch("http://localhost:8081/api/upms/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("表單提交成功！");
        setIsModalOpen(false);
      } else {
        alert("提交失敗，請稍後再試！");
      }
    } catch (error) {
      console.error("提交錯誤:", error);
      alert("發生錯誤，請稍後再試！");
    }
  };

  // 開啟 Modal
  const openModal = () => {
    setIsModalOpen(true);
    setFormData(
      { 
        code: '', 
        title: '', 
        description: '', 
        orders: 0 
      }
    );
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
                <input type="text" className="form-control form-control-solid w-250px ps-14" placeholder="請輸入關鍵字" />
              </div>
            </div>
            <div className="card-toolbar">
              <button type="button" className="btn btn-primary" onClick={openModal}>
                <KTIcon iconName="plus" className="fs-2" />
                新增角色
              </button>
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
                    <td className="min-w-125px">標題</td>
                    <td className="min-w-125px">描述</td>
                    <td className="min-w-125px">排序</td>
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
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-centered mw-650px">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="fw-bolder">新增角色</h2>
                  <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsModalOpen(false)}>
                    <KTIcon iconName="cross" className="fs-1" />
                  </div>
                </div>
                <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
                  <form className="form" noValidate onSubmit={handleSubmit}>
                    {/* 名稱 */}
                    <div className="row fv-row mb-6">
                      <label className="col-lg-2 col-form-label required fw-bold fs-6">名稱</label>
                      <div className="col-lg-10">
                        <input className="form-control form-control-solid" type="text" name="code" value={formData.code} onChange={handleChange} />
                      </div>
                      <ErrorMessage show={errors.code} message="名稱不得為空" />
                    </div>

                    {/* 標題 */}
                    <div className="row fv-row mb-6">
                      <label className="col-lg-2 col-form-label required fw-bold fs-6">標題</label>
                      <div className="col-lg-10">
                        <input className="form-control form-control-solid" type="text" name="title" value={formData.title} onChange={handleChange} />
                      </div>
                      <ErrorMessage show={errors.title} message="標題不得為空" />
                    </div>

                    {/* 描述 */}
                    <div className="row fv-row mb-6">
                      <label className="col-lg-2 col-form-label fw-bold fs-6">描述</label>
                      <div className="col-lg-10">
                        <input className="form-control form-control-solid" type="text" name="description" value={formData.description} onChange={handleChange} />
                      </div>
                      <ErrorMessage show={errors.description} message="描述不得為空" />
                    </div>

                    {/* 排序 */}
                    <div className="row fv-row mb-6">
                      <label className="col-lg-2 col-form-label required fw-bold fs-6">排序</label>
                      <div className="col-lg-10">
                        <input className="form-control form-control-solid" type="number" name="orders" value={formData.orders} onChange={handleChange} />
                      </div>
                      <ErrorMessage show={errors.orders} message="排序值必須為 0 ~ 100" />
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
