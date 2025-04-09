import { useEffect, useState, useRef } from 'react';
import { Content } from '../../../../_metronic/layout/components/content';
import { KTIcon } from '../../../../_metronic/helpers';
import { useAlert } from '../../common/useAlert';
import { Role } from '../../model/RoleModel';
import { System } from '../../model/SystemModel';
import { fetchSystems } from '../system/Query';
import { fetchRoles } from '../role/Query';
import { editPermissions } from './Query';
import PermissionList from "./List";
import { PermissionUpdate, Permission, Action } from '../../model/PermissionModel';

export function Overview() {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const { alert, showAlert, Alert } = useAlert();
  const [roles, setRoles] = useState<Role[]>();
  const [systems, setSystems] = useState<System[]>();
  const [systemUuid, setSystemUuid] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [permissionsData, setPermissionsData] = useState<Permission[]>([]);

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
      await getRoles();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (systems && systems.length > 0 && systemUuid === null) {
      const defaultSystem = systems[0].uuid;
      setSystemUuid(defaultSystem);
      handleSystemChange({ target: { value: defaultSystem } } as React.ChangeEvent<HTMLSelectElement>);
    }

    if (roles && roles.length > 0 && roleId === null) {
      const defaultRole = roles[0].id;
      setRoleId(defaultRole);
      handleRoleChange({ target: { value: String(defaultRole) } } as React.ChangeEvent<HTMLSelectElement>);
    }
  }, [systems, roles]);

  const handleSystemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSystemUuid(event.target.value);
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleId(Number(event.target.value));
  };

  const getSelectedPermissions = (): PermissionUpdate => {
    const selectedPermissions: Permission[] = permissionsData.map((perm) => {
      const actions: Action[] = perm.actions?.filter((action) => action.active).map((action) => ({
        id: action.id,
        name: action.name,
        active: action.active,
      })) || [];

      const subPermissions: Permission[] = perm.permissions?.map((subPerm) => ({
        id: subPerm.id,
        name: subPerm.name,
        active: subPerm.active,
        actions: subPerm.actions?.filter((action) => action.active).map((action) => ({
          id: action.id,
          name: action.name,
          active: action.active,
        })) || [],
        permissions: [],
      })) || [];

      const permission: Permission = {
        id: perm.id,
        name: perm.name,
        active: perm.active,
        actions: actions,
        permissions: subPermissions,
      }

      return permission;
    });
    return { permissions: selectedPermissions };
  };

  const handleSave = async () => {
    if (!systemUuid || !roleId) {
      showAlert("請選擇系統和角色！", "warning");
      return;
    }
    const selectedPermissions = getSelectedPermissions();
    btnRef.current?.setAttribute('disabled', 'true');
    btnRef.current?.setAttribute('data-kt-indicator', 'on');
    await new Promise(resolve => setTimeout(resolve, 3000));
    const success = await editPermissions(selectedPermissions, systemUuid, roleId, showAlert);
    btnRef.current?.removeAttribute('disabled');
    btnRef.current?.removeAttribute("data-kt-indicator");
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
              <button
                type="button"
                className="btn btn-success d-flex align-items-center"
                onClick={handleSave}
                ref={btnRef}
              >
                <span className="indicator-label">
                  <KTIcon iconName="setting-4" className="fs-2 me-2" />
                  儲存
                </span>
                <span className="indicator-progress">請稍後...
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              </button>
            </div>
          </div>

          <div className="card-body py-4">
            <PermissionList
              systemUuid={systemUuid ?? ''}
              roleId={roleId ?? 0}
              showAlert={showAlert}
              setPermissionsData={setPermissionsData}
            />
          </div>
        </div>
      </div>
    </Content>
  );
}
