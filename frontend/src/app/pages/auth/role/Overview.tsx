import { useEffect, useState } from "react";
import { Content } from "../../../../_metronic/layout/components/content";
import { KTIcon } from "../../../../_metronic/helpers";

// 定義角色資料的型別
interface Role {
  id: number;
  code: string;
  title: string;
  description: string;
  orders: number;
}

// 檢核標單資料是否有效
const validateFormData = (formData: { code: string; title: string; description: string; orders: number }) => {
  return {
    code: formData.code.trim() === '',
    title: formData.title.trim() === '',
    description: false,
    orders: !Number.isInteger(formData.orders) || formData.orders < 0 || formData.orders > 100,
  };
};

// 自定義錯誤訊息
const ValidErrorMessage = ({ show, message }: { show: boolean; message: string }) => {
  return show ? (
    <div className="fv-plugins-message-container">
      <div className="fv-help-block">
        <span role="alert">{message}</span>
      </div>
    </div>
  ) : null;
};

export function Overview() {

  // 設定角色清單
  const [roles, setRoles] = useState<Role[]>([]);

  // 控制新增角色視窗
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 控制編輯角色視窗
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 控制刪除角色視窗
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 表單資料（新增時預設空，編輯時帶入角色）
  const [formData, setFormData] = useState(
    { 
      code: "", 
      title: "", 
      description: "", 
      orders: 0 
    }
  );

  const [errors, setErrors] = useState({
    code: false,
    title: false,
    description: false,
    orders: false,
  });

  // 關鍵字搜尋初始化
  const [searchKeyword, setSearchKeyword] = useState('');

  // 目前選中的角色（用於編輯）
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // 打開新增角色視窗
  const openCreateModal = () => {
    setFormData({ code: "", title: "", description: "", orders: 0 });
    setIsCreateModalOpen(true);
  };

  // 打開編輯角色視窗
  const openEditModal = (role: Role) => {
    setSelectedRole(role);
    setFormData({ code: role.code, title: role.title, description: role.description, orders: role.orders });
    setIsEditModalOpen(true);
  };

  // 打開編輯角色視窗
  const openDeleteModal = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  // 初始化alert
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'danger' | 'warning' | null } | null>(null);

  // 設定alert兩秒後消失
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // 取得角色清單
  const fetchRoles = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/upms/roles?keyword=${encodeURIComponent(searchKeyword)}`);
      if (response.ok) {
        const data = await response.json();
        setRoles(data.data);
      } else {
        console.error("取得角色清單失敗");
      }
    } catch (error) {
      console.error("API 錯誤:", error);
    }
  };
  
  // 一進畫面就先取得角色清單
  useEffect(() => {
    fetchRoles();
  }, []);

  // 搜尋事件
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchRoles();
    }
  };

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

  // 新增角色
  const handleCreate = async (e: React.FormEvent) => {
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
        await fetchRoles();
        setIsCreateModalOpen(false);
        setAlert({ message: "新增成功！", type: "success" });
        return;
      }
      setAlert({ message: "新增失敗，請稍後再試！", type: "warning" });
    } catch (error) {
      console.error("提交錯誤:", error);
      setAlert({ message: "系統錯誤，請稍後再試！", type: "danger" });
    }
  };

  // 編輯角色
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      return;
    }
    const newErrors = validateFormData(formData);
    setErrors(newErrors);
    if (Object.values(newErrors).includes(true)){
      return;
    } 
    try {
      const response = await fetch(`http://localhost:8081/api/upms/roles/${selectedRole.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        await fetchRoles();
        setIsEditModalOpen(false);
        setAlert({ message: "編輯成功！", type: "success" });
        return;
      }
      setAlert({ message: "編輯失敗，請稍後再試！", type: "warning" });
    } catch (error) {
      console.error("更新角色錯誤:", error);
      setAlert({ message: "系統錯誤，請稍後再試！", type: "danger" });
    }
  };

  // 刪除角色
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8081/api/upms/roles/${selectedRole.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        await fetchRoles();
        setIsDeleteModalOpen(false);
        setAlert({ message: "刪除成功！", type: "success" });
        return;
      }
      setAlert({ message: "刪除失敗，請稍後再試！", type: "warning" });
    } catch (error) {
      console.error("刪除角色錯誤:", error);
      setAlert({ message: "系統錯誤，請稍後再試！", type: "danger" });
    }
  };

  return (
    <Content>
      {alert && (
        <div className={`mb-lg-15 alert alert-${alert.type} position-fixed end-0 m-3 shadow-lg`} style={{ top: "10%", zIndex: 1050, minWidth: "250px" }}>
          <div className='alert-text font-weight-bold'>{alert.message}</div>
        </div>
      )}
      <div className="container">
        <ol className="breadcrumb text-muted fs-6 fw-bold">
          <li className="breadcrumb-item pe-3">
            <a href="#" className="pe-3">
            權限
            </a>
          </li>
          <li className="breadcrumb-item px-3 text-muted">角色</li>
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
                  className="form-control form-control-solid w-250px ps-14"
                  placeholder="請輸入關鍵字"
                  value={searchKeyword}
                  onKeyDown={handleSearchKeyDown}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>
            </div>
            <div className="card-toolbar">
              <button type="button" className="btn btn-primary" onClick={openCreateModal}>
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
                    <td className="min-w-125px">功能</td>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.id}>
                      <td>{role.code}</td>
                      <td>{role.title}</td>
                      <td>{role.description}</td>
                      <td>{role.orders}</td>
                      <td>
                        <button className="btn btn-sm btn-warning" onClick={() => openEditModal(role)}>
                          <KTIcon iconName="message-edit" className="fs-2" />
                          編輯
                        </button>
                        <button className="btn btn-sm btn-danger ms-2" onClick={() => openDeleteModal(role)}>
                          <KTIcon iconName="cross" className="fs-2" />
                          刪除
                        </button>
                      </td>
                    </tr>
                  ))}
                  {roles.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted">沒有角色資料</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isCreateModalOpen && (
        <>
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-centered mw-650px">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="fw-bolder">新增角色</h2>
                  <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsCreateModalOpen(false)}>
                    <KTIcon iconName="cross" className="fs-1" />
                  </div>
                </div>
                <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
                  <form className="form" noValidate onSubmit={handleCreate}>
                    {/* 名稱 */}
                    <div className="row fv-row mb-6">
                      <label className="col-lg-2 col-form-label required fw-bold fs-6">名稱</label>
                      <div className="col-lg-10">
                        <input className="form-control form-control-solid" type="text" name="code" value={formData.code} onChange={handleChange} />
                      </div>
                      <ValidErrorMessage show={errors.code} message="名稱不得為空" />
                    </div>

                    {/* 標題 */}
                    <div className="row fv-row mb-6">
                      <label className="col-lg-2 col-form-label required fw-bold fs-6">標題</label>
                      <div className="col-lg-10">
                        <input className="form-control form-control-solid" type="text" name="title" value={formData.title} onChange={handleChange} />
                      </div>
                      <ValidErrorMessage show={errors.title} message="標題不得為空" />
                    </div>

                    {/* 描述 */}
                    <div className="row fv-row mb-6">
                      <label className="col-lg-2 col-form-label fw-bold fs-6">描述</label>
                      <div className="col-lg-10">
                        <input className="form-control form-control-solid" type="text" name="description" value={formData.description} onChange={handleChange} />
                      </div>
                    </div>

                    {/* 排序 */}
                    <div className="row fv-row mb-6">
                      <label className="col-lg-2 col-form-label required fw-bold fs-6">排序</label>
                      <div className="col-lg-10">
                        <input className="form-control form-control-solid" type="number" name="orders" value={formData.orders} onChange={handleChange} />
                      </div>
                      <ValidErrorMessage show={errors.orders} message="排序值必須為 0 ~ 100" />
                    </div>

                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>
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

      {isEditModalOpen && selectedRole && (
        <>
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-centered mw-650px">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="fw-bolder">編輯角色</h2>
                  <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsEditModalOpen(false)}>
                    <KTIcon iconName="cross" className="fs-1" />
                  </div>
                </div>
                <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
                  <form className="form" noValidate onSubmit={handleEdit}>
                    {/* 名稱 */}
                    <div className="row fv-row mb-6">
                      <label className="col-lg-2 col-form-label required fw-bold fs-6">名稱</label>
                      <div className="col-lg-10">
                        <input className="form-control form-control-solid" type="text" name="code" value={formData.code} onChange={handleChange} />
                      </div>
                      <ValidErrorMessage show={errors.code} message="名稱不得為空" />
                    </div>

                    {/* 標題 */}
                    <div className="row fv-row mb-6">
                      <label className="col-lg-2 col-form-label required fw-bold fs-6">標題</label>
                      <div className="col-lg-10">
                        <input className="form-control form-control-solid" type="text" name="title" value={formData.title} onChange={handleChange} />
                      </div>
                      <ValidErrorMessage show={errors.title} message="標題不得為空" />
                    </div>

                    {/* 描述 */}
                    <div className="row fv-row mb-6">
                      <label className="col-lg-2 col-form-label fw-bold fs-6">描述</label>
                      <div className="col-lg-10">
                        <input className="form-control form-control-solid" type="text" name="description" value={formData.description} onChange={handleChange} />
                      </div>
                    </div>

                    {/* 排序 */}
                    <div className="row fv-row mb-6">
                      <label className="col-lg-2 col-form-label required fw-bold fs-6">排序</label>
                      <div className="col-lg-10">
                        <input className="form-control form-control-solid" type="number" name="orders" value={formData.orders} onChange={handleChange} />
                      </div>
                      <ValidErrorMessage show={errors.orders} message="排序值必須為 0 ~ 100" />
                    </div>

                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
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

      {isDeleteModalOpen && (
        <>
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-centered mw-650px">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="fw-bolder">刪除角色</h2>
                  <div className="btn btn-icon btn-sm btn-active-icon-primary" onClick={() => setIsDeleteModalOpen(false)}>
                    <KTIcon iconName="cross" className="fs-1" />
                  </div>
                </div>
                <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
                  <form className="form" noValidate onSubmit={handleDelete}>
                    <div className="row fv-row">
                      <label className="col-lg col-form-label fw-bold fs-6">是否確定要刪除？</label>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                        關閉
                      </button>
                      <button type="submit" className="btn btn-danger">刪除</button>
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
