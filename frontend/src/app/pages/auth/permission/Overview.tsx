import { useEffect, useState } from 'react';
import { Content } from '../../../../_metronic/layout/components/content';
import { KTIcon } from '../../../../_metronic/helpers';
import { useAlert } from '../../common/useAlert';
import { Role } from '../../model/RoleModel';
import { System } from '../../model/SystemModel';
import { fetchSystems } from '../system/Query';
import { fetchRoles } from '../role/Query';
import PermissionList from "./List";

export function Overview() {
  const { alert, showAlert, Alert } = useAlert();

  const [roles, setRoles] = useState<Role[]>();
  const [systems, setSystems] = useState<System[]>();
  const [systemUuid, setSystemUuid] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<number | null>(null);

  // 獲取系統列表的函數
  const getSystems = async () => {
    const fetchedSystems = await fetchSystems(showAlert);
    setSystems(fetchedSystems);
  };

  // 獲取角色列表的函數
  const getRoles = async () => {
    const fetchedRoles = await fetchRoles('', showAlert);
    setRoles(fetchedRoles);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getSystems();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await getRoles();
    };
    fetchData();
  }, []);

  const handleSystemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("System Change:", event.target.value);
    setSystemUuid(event.target.value);
  };
  
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Role Change:", event.target.value);
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
            <PermissionList systemUuid={systemUuid ?? ''} roleId={roleId ?? 0} showAlert={showAlert} />
          </div>
        </div>
      </div>

    </Content>
  );
}
