import { useEffect, useState } from 'react';
import { Content } from '../../../../_metronic/layout/components/content';
import { KTIcon } from '../../../../_metronic/helpers';
import { useAlert } from '../../common/useAlert';
import { Tree } from './Tree';
import { Role } from '../../model/RoleModel';
import { System } from '../../model/SystemModel';
import { Permission } from '../../model/PermissionModel';

export function Overview() {
  const { alert, showAlert, Alert } = useAlert();
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [roles, setRoles] = useState<Role[]>();
  const [systems, setSystems] = useState<System[]>();
  const [systemId, setSystemId] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<number | null>(null);

  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/adm/system");
        const responseData = await response.json();
        if (response.ok) {
          setSystems(responseData.data);
          if (responseData.data.length > 0) {
            setSystemId(responseData.data[0].uuid);
          }
          return;
        }
        showAlert(responseData.message, "warning");
      } catch (error) {
        console.error("API 錯誤:", error);
      }
    };
    fetchSystems();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/upms/roles`);
        const responseData = await response.json();
        if (response.ok) {
          setRoles(responseData.data);
          if (responseData.data.length > 0) {
            setRoleId(responseData.data[0].id);
          }
        } else {
          showAlert(responseData.message, "warning");
        }
      } catch (error) {
        console.error("API 錯誤:", error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (!systemId || !roleId) {
      return;
    }
    const fetchPermissions = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/upms/permissions?systemId=${systemId}&roleId=${roleId}`);
        const responseData = await response.json();
        if (response.ok) {
          const updatedPermissions: { [key: string]: boolean } = {};
          responseData.data.forEach((perm: Permission) => {
            updatedPermissions[perm.id] = perm.allowed;
          });
          setCheckedItems(updatedPermissions);
          return;
        }
        showAlert(responseData.message, "warning");
      } catch (error) {
        console.error("API 錯誤:", error);
        showAlert("系統錯誤，請稍後再試！", "danger");
      }
    };
    fetchPermissions();
  }, [roleId, systemId]);

  // 處理系統選單變動
  const handleSystemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSystemId(event.target.value);
  };

  // 處理角色選單變動
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleId(Number(event.target.value));
  };

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}
      <div className="">
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
              <select
                className="form-select form-select-solid w-auto"
                name="systemId"
                onChange={handleSystemChange}
              >
                {systems && systems.length > 0 ? (
                  systems.map((system) => (
                    <option key={system.uuid} value={system.uuid}>{system.name}</option>
                  ))
                ) : (
                  <option disabled>無系統可選</option>
                )}
              </select>
              <select
                className="form-select form-select-solid w-auto"
                name="roleId"
                onChange={handleRoleChange}
              >
                {roles && roles.length > 0 ? (
                  roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.code}</option>
                  ))
                ) : (
                  <option disabled>無角色可選</option>
                )}
              </select>
              <button type="button" className="btn btn-success d-flex align-items-center">
                <KTIcon iconName="setting-4" className="fs-2 me-2" />
                儲存
              </button>
            </div>
          </div>
          <div className="card-body py-4">
            <div className="accordion accordion-icon-toggle" id="system">
              <Tree id="auth" title="權限管理">
                <div className="accordion accordion-icon-toggle">
                  <Tree id="user_management" title="使用者管理">
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
                  </Tree>

                  <Tree id="role_management" title="角色管理">
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
                  </Tree>
                </div>
              </Tree>
            </div>
          </div>
        </div>
      </div>

    </Content>
  );
}
