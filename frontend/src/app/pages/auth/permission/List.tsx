import { useEffect, useState } from 'react';
import { fetchPermissions } from './Query';
import { Permission, Action } from '../../model/PermissionModel';

interface PermissionListProps {
  systemUuid: string;
  roleUuid: string;
  showAlert: (message: string, type: "success" | "warning" | "danger") => void;
  setPermissionsData: React.Dispatch<React.SetStateAction<Permission[]>>;
}

const PermissionList: React.FC<PermissionListProps> = ({ systemUuid, roleUuid, showAlert, setPermissionsData }) => {
  const [permissionsData, setPermissionsDataState] = useState<Permission[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({});
  const [openPermissions, setOpenPermissions] = useState<{ [key: string]: boolean }>({});

  const handleCheckboxChange = (key: string) => {
    setCheckedItems((prev) => {
      const newChecked = {
        ...prev,
        [key]: !prev[key],
      };
      syncToPermissionsData(newChecked);
      return newChecked;
    });
  };

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const togglePermission = (permId: string) => {
    setOpenPermissions((prev) => ({
      ...prev,
      [permId]: !prev[permId],
    }));
  };

  const syncToPermissionsData = (checked: { [key: string]: boolean }) => {
    const updated = permissionsData.map((group) => {
      const groupKey = `group-${group.uuid}`;
      const updatedGroup: Permission = {
        ...group,
        active: !!checked[groupKey],
        permissions: group.permissions?.map((perm) => {
          const permKey = `perm-${perm.uuid}`;
          return {
            ...perm,
            active: !!checked[permKey],
            actions: perm.actions?.map((action) => {
              const actionKey = `${group.uuid}_${perm.uuid}_${action.name}`;
              return {
                ...action,
                active: !!checked[actionKey],
              };
            }) || [],
          };
        }) || [],
      };
      return updatedGroup;
    });

    setPermissionsDataState(updated);
    setPermissionsData(updated);
  };

  const getPermissions = async () => {
    if (!systemUuid || !roleUuid) return;

    const result = await fetchPermissions(systemUuid, roleUuid, showAlert);
    if (!result) return;

    setPermissionsDataState(result);
    setPermissionsData(result);

    const newChecked: { [key: string]: boolean } = {};

    result.forEach((group: Permission) => {
      const groupKey = `group-${group.uuid}`;
      newChecked[groupKey] = group.active;

      group.permissions?.forEach((perm: Permission) => {
        const permKey = `perm-${perm.uuid}`;
        newChecked[permKey] = perm.active;

        perm.actions?.forEach((action: Action) => {
          const actionKey = `${group.uuid}_${perm.uuid}_${action.name}`;
          newChecked[actionKey] = action.active;
        });
      });
    });

    setCheckedItems(newChecked);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    getPermissions();
  }, [systemUuid, roleUuid]);

  const renderPermissionTree = () => {
    return permissionsData.map((group: Permission) => (
      <div key={group.uuid} className="mb-5">
        <div
          className="d-flex align-items-center mb-3 mt-5"
          style={{ cursor: 'pointer' }}
          onClick={() => toggleGroup(`group-${group.uuid}`)}
        >
          <div className="form-check form-check-custom form-check-solid form-check-sm">
            <input
              className="form-check-input"
              type="checkbox"
              checked={!!checkedItems[`group-${group.uuid}`]}
              onChange={() => handleCheckboxChange(`group-${group.uuid}`)}
              onClick={handleCheckboxClick}
            />
            <label className="form-check-label ms-2 mt-2"><h3>{group.name}</h3></label>
          </div>
        </div>
        <div className={`fs-6 collapse ${openGroups[`group-${group.uuid}`] ? "show" : ""}`} id={`group-${group.uuid}`}>
          <div className="ps-10">
            {group.permissions?.map((perm: Permission) => (
              <div key={perm.uuid} className="mb-3">
                <div
                  className="d-flex align-items-center mb-3 mt-5"
                  style={{ cursor: 'pointer' }}
                  onClick={() => togglePermission(`perm-${perm.uuid}`)}
                >
                  <div className="form-check form-check-custom form-check-solid form-check-sm">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={!!checkedItems[`perm-${perm.uuid}`]}
                      onChange={() => handleCheckboxChange(`perm-${perm.uuid}`)}
                      onClick={handleCheckboxClick}
                    />
                    <label className="form-check-label ms-2 mt-2"><h4>{perm.name}</h4></label>
                  </div>
                </div>
                <div className={`fs-6 collapse ${openPermissions[`perm-${perm.uuid}`] ? "show" : ""}`} id={`perm-${perm.uuid}`}>
                  <div className="ps-10">
                    <div className="form-check form-check-custom form-check-solid form-check-sm">
                      {perm.actions?.map((action: Action) => {
                        const key = `${group.uuid}_${perm.uuid}_${action.name}`;
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ));
  };

  return <div className="accordion accordion-icon-toggle" id="system">{renderPermissionTree()}</div>;
};

export default PermissionList;
