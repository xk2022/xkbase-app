import { useEffect, useState } from 'react';
import { fetchPermissions } from './Query';
import { Permission, Action } from '../../model/PermissionModel';
import { KTIcon } from "../../../../_metronic/helpers";

interface PermissionListProps {
  systemUuid: string;
  roleId: number;
  showAlert: (message: string, type: "success" | "warning" | "danger") => void;
  setPermissionsData: React.Dispatch<React.SetStateAction<Permission[]>>;
}

const PermissionList: React.FC<PermissionListProps> = ({ systemUuid, roleId, showAlert, setPermissionsData }) => {
  const [permissionsData, setPermissionsDataState] = useState<Permission[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({});
  const [openPermissions, setOpenPermissions] = useState<{ [key: string]: boolean }>({});

  const handleCheckboxChange = (key: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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

  const getPermissions = async () => {
    if (!systemUuid || !roleId) {
      return;
    }

    const result = await fetchPermissions(systemUuid, roleId, showAlert);
    if (!result) return;

    setPermissionsDataState(result);
    setPermissionsData(result);

    setCheckedItems((prevChecked) => {
      const newChecked = { ...prevChecked };

      result.forEach((group: Permission) => {
        const groupKey = `group-${group.id}`;
        if (!(groupKey in newChecked)) {
          newChecked[groupKey] = group.active;
        }

        group.permissions?.forEach((perm: Permission) => {
          const permKey = `perm-${perm.id}`;
          if (!(permKey in newChecked)) {
            newChecked[permKey] = perm.active;
          }

          perm.actions?.forEach((action: Action) => {
            const actionKey = `${group.id}_${perm.id}_${action.name}`;
            if (!(actionKey in newChecked)) {
              newChecked[actionKey] = action.active;
            }
          });
        });
      });

      return newChecked;
    });
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    getPermissions();
  }, [systemUuid, roleId]);

  const renderPermissionTree = () => {
    return permissionsData.map((group: Permission) => (
      <div key={group.id} className="mb-5">
        <div
          className="d-flex align-items-center mb-3 mt-5"
          style={{ cursor: 'pointer' }}
          onClick={() => toggleGroup(`group-${group.id}`)}
        >
          <div className="form-check form-check-custom form-check-solid form-check-sm">
            <input
              className="form-check-input"
              type="checkbox"
              checked={!!checkedItems[`group-${group.id}`]}
              onChange={() => handleCheckboxChange(`group-${group.id}`)}
              onClick={handleCheckboxClick}
            />
            <label className="form-check-label ms-2 mt-2"><h3>{group.name}</h3></label>
          </div>
        </div>
        <div className={`fs-6 collapse ${openGroups[`group-${group.id}`] ? "show" : ""}`} id={`group-${group.id}`}>
          <div className="ps-10">
            {group.permissions?.map((perm: Permission) => (
              <div key={perm.id} className="mb-3">
                <div
                  className="d-flex align-items-center mb-3 mt-5"
                  style={{ cursor: 'pointer' }}
                  onClick={() => togglePermission(`perm-${perm.id}`)}
                >
                  <div className="form-check form-check-custom form-check-solid form-check-sm">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={!!checkedItems[`perm-${perm.id}`]}
                      onChange={() => handleCheckboxChange(`perm-${perm.id}`)}
                      onClick={handleCheckboxClick}
                    />
                    <label className="form-check-label ms-2 mt-2"><h4>{perm.name}</h4></label>
                  </div>
                </div>
                <div className={`fs-6 collapse ${openPermissions[`perm-${perm.id}`] ? "show" : ""}`} id={`perm-${perm.id}`}>
                  <div className="ps-10">
                    <div className="form-check form-check-custom form-check-solid form-check-sm">
                      {perm.actions?.map((action: Action) => {
                        const key = `${group.id}_${perm.id}_${action.name}`;
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
