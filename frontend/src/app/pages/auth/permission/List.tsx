import { useEffect, useState } from 'react';
import { Tree } from './Tree';
import { fetchPermissions } from './Query';
import { Permission, Action } from '../../model/PermissionModel';

interface PermissionListProps {
  systemUuid: string;
  roleId: number;
  showAlert: (message: string, type: "success" | "warning" | "danger") => void;
  setPermissionsData: React.Dispatch<React.SetStateAction<Permission[]>>; // 添加這一行
}

const PermissionList: React.FC<PermissionListProps> = ({ systemUuid, roleId, showAlert, setPermissionsData }) => {
  const [permissionsData, setPermissionsDataState] = useState<Permission[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const handleCheckboxChange = (key: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getPermissions = async () => {
    if (!systemUuid || !roleId) {
      return;
    }
    const result = await fetchPermissions(systemUuid, roleId, showAlert);
    if (!result) {
      return;
    }
    setPermissionsDataState(result); 
    setPermissionsData(result);
    const initialChecked: { [key: string]: boolean } = {};
    result.forEach((group: Permission) => {
      group.permissions?.forEach((perm: Permission) => {
        perm.actions?.forEach((action: Action) => {
          const key = `${perm.name}_${action.name}`;
          initialChecked[key] = action.active;
        });
      });
    });
    setCheckedItems(initialChecked);
  };

  useEffect(() => {
    getPermissions();
  }, [systemUuid, roleId]);

  const renderPermissionTree = () => {
    return permissionsData.map((group: Permission) => (
      <Tree key={group.id} id={`group-${group.id}`} title={group.name}>
        {group.permissions?.map((perm: Permission) => (
          <Tree key={perm.id} id={`perm-${perm.id}`} title={perm.name}>
            <div className="accordion accordion-icon-toggle mt-2">
              <div className="form-check form-check-custom form-check-solid form-check-sm">
                {perm.actions?.map((action: Action) => {
                  const key = `${perm.name}_${action.name}`;
                  return (
                    <div className="d-inline-block me-5" key={key}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={key}
                        checked={!!checkedItems[key]}
                        onChange={() => handleCheckboxChange(key)}
                      />
                      <label className="form-check-label ms-2" htmlFor={key}>
                        {action.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </Tree>
        ))}
      </Tree>
    ));
  };

  return (
    <div className="accordion accordion-icon-toggle" id="system">
      {renderPermissionTree()}
    </div>
  );
};

export default PermissionList;
