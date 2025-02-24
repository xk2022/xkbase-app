import { useEffect, useState } from 'react';
import { Content } from '../../../../_metronic/layout/components/content';
import { KTIcon } from "../../../../_metronic/helpers";
import { AccordionItem } from './AccordionItem';

export function Overview() {
  // ✅ 手動定義 checkbox 狀態
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    user_add: false,
    user_edit: false,
    user_delete: false,
    user_query: false,
    role_add: false,
    role_edit: false,
    role_delete: false,
    role_query: false,
  });
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'danger' | 'warning' | null } | null>(null);
  const [systems, setSystems] = useState<{ id: number, name: string }[]>([]);
  const [roles, setRoles] = useState<{ id: number, code: string, title: string, description: string, orders: number }[]>([]);

  const onAlert = (message: string, type: 'success' | 'danger' | 'warning' | null) => {
    setAlert({ message, type });
  };

  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fetchSystems = async () => {
    // try {
    //   const response = await fetch(
    //     `http://localhost:8081/api/upms/permissions`
    //   );
    //   const responseData = await response.json();
    //   if (response.ok) {
    //     setSystems(responseData.data);
    //     return;
    //   }
    //   if (responseData.errorDetails && Array.isArray(responseData.errorDetails)) {
    //     onAlert(responseData.errorDetails.join("\n"), "warning");
    //     return;
    //   }
    //   onAlert(responseData.message, "warning");
    // } catch (error) {
    //   console.error("API 錯誤:", error);
    // }
    const mockData = [
      { id: 1, name: "系統一" },
      { id: 2, name: "系統二" },
      { id: 3, name: "系統三" },
    ];
    setSystems(mockData);
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/upms/roles`
      );
      const responseData = await response.json();
      if (response.ok) {
        setRoles(responseData.data);
        return;
      }
      if (responseData.errorDetails && Array.isArray(responseData.errorDetails)) {
        onAlert(responseData.errorDetails.join("\n"), "warning");
        return;
      }
      onAlert(responseData.message, "warning");
    } catch (error) {
      console.error("API 錯誤:", error);
    }
  };

  useEffect(() => {
    fetchSystems();
    fetchRoles();
  }, []);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <Content>
      {alert && (
        <div className={`mb-lg-15 alert alert-${alert.type} position-fixed end-0 m-3 shadow-lg`} style={{ top: "10%", zIndex: 9999, minWidth: "250px" }}>
          <div className='alert-text font-weight-bold'>{alert.message}</div>
        </div>
      )}
      <div className="container">
        <ol className="breadcrumb text-muted fs-6 fw-bold">
          <li className="breadcrumb-item pe-3">
            <a href="#" className="pe-3">權限</a>
          </li>
          <li className="breadcrumb-item px-3 text-muted">權限</li>
        </ol>
      </div>

      <div className="app-content flex-column-fluid">
        <div className="card">
          <div className="card-header border-0 pt-6">
            <div className="card-title">
            </div>
            <div className="card-toolbar d-flex align-items-center gap-3">
              <select className="form-select form-select-solid w-auto" name="systemId">
                {systems.map((system) => (
                  <option key={system.id} value={system.id}>{system.name}</option>
                ))}
              </select>
              <select className="form-select form-select-solid w-auto" name="roleId">
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.code}</option>
                ))}
              </select>
              <button type="button" className="btn btn-success d-flex align-items-center">
                <KTIcon iconName="setting-4" className="fs-2 me-2" />
                儲存
              </button>
            </div>
          </div>
          <div className="card-body py-4">
            <div className="accordion accordion-icon-toggle" id="system">

              <div className="accordion accordion-icon-toggle">
                <AccordionItem id="user_management" title="使用者管理">
                  <div className="accordion accordion-icon-toggle">
                    <div className="mt-2">
                      <div className="form-check form-check-custom form-check-solid form-check-sm">
                        <div className="d-inline-block me-5">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="user_add"
                            checked={checkedItems.user_add}
                            onChange={() => handleCheckboxChange("user_add")}
                          />
                          <label className="form-check-label ms-2" htmlFor="user_add">新增</label>
                        </div>

                        <div className="d-inline-block me-5">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="user_edit"
                            checked={checkedItems.user_edit}
                            onChange={() => handleCheckboxChange("user_edit")}
                          />
                          <label className="form-check-label ms-2" htmlFor="user_edit">編輯</label>
                        </div>

                        <div className="d-inline-block me-5">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="user_delete"
                            checked={checkedItems.user_delete}
                            onChange={() => handleCheckboxChange("user_delete")}
                          />
                          <label className="form-check-label ms-2" htmlFor="user_delete">刪除</label>
                        </div>

                        <div className="d-inline-block me-5">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="user_query"
                            checked={checkedItems.user_query}
                            onChange={() => handleCheckboxChange("user_query")}
                          />
                          <label className="form-check-label ms-2" htmlFor="user_query">查詢</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionItem>

                <AccordionItem id="role_management" title="角色管理">
                  <div className="accordion accordion-icon-toggle">
                    <div className="mt-2">
                      <div className="form-check form-check-custom form-check-solid form-check-sm">
                        <div className="d-inline-block me-5">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="role_add"
                            checked={checkedItems.role_add}
                            onChange={() => handleCheckboxChange("role_add")}
                          />
                          <label className="form-check-label ms-2" htmlFor="role_add">新增</label>
                        </div>

                        <div className="d-inline-block me-5">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="role_edit"
                            checked={checkedItems.role_edit}
                            onChange={() => handleCheckboxChange("role_edit")}
                          />
                          <label className="form-check-label ms-2" htmlFor="role_edit">編輯</label>
                        </div>

                        <div className="d-inline-block me-5">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="role_delete"
                            checked={checkedItems.role_delete}
                            onChange={() => handleCheckboxChange("role_delete")}
                          />
                          <label className="form-check-label ms-2" htmlFor="role_delete">刪除</label>
                        </div>

                        <div className="d-inline-block me-5">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="role_query"
                            checked={checkedItems.role_query}
                            onChange={() => handleCheckboxChange("role_query")}
                          />
                          <label className="form-check-label ms-2" htmlFor="role_query">查詢</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionItem>
              </div>
            </div>

          </div>
        </div>
      </div>

    </Content>
  );
}
