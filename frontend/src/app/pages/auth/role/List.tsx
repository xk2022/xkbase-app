import React, { useState, useEffect, useMemo } from "react";
import { KTIcon } from '../../../../_metronic/helpers';
import { EditModal } from "./EditModal";
import { DeleteModal } from "./DeleteModal";
import { Role } from '../../model/RoleModel';
import { System } from "../../model/SystemModel";
import { fetchRoles } from "./Query";

interface RoleListProps {
  searchKeyword: string;
  showAlert: (message: string, type: "success" | "warning" | "danger") => void;
  systems: System[];
}

const RoleList: React.FC<RoleListProps> = ({ searchKeyword, showAlert, systems }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [editModal, setEditModalOpen] = useState(false);
  const [deleteModal, setDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // 打開編輯模式
  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    setEditModalOpen(true);
  };

  // 打開刪除模式
  const handleDeleteClick = (role: Role) => {
    setSelectedRole(role);
    setDeleteModalOpen(true);
  };

  // 角色更新後刷新角色列表
  const handleRoleUpdated = () => {
    getRoles();
    setEditModalOpen(false);
  };

  // 獲取角色列表的函數
  const getRoles = async () => {
    const fetchedRoles = await fetchRoles(searchKeyword, showAlert);
    setRoles(fetchedRoles);
  };

  // 取得系統
  const systemMap = useMemo(() => {
    return new Map(systems.map(system => [system.uuid, system.name]));
  }, [systems]);

  // 取得系統名稱
  const getSystemName = (systemUuids: string[]) => {
    if (!systemUuids?.length) {
      return "未分配系統";
    }
    const names = systemUuids.map(uuid => systemMap.get(uuid) || "未知系統");
    return names.join("、");
  };

  // 初始化 及 當 searchKeyword 更新時重新獲取角色資料
  useEffect(() => {
    const fetchData = async () => {
      await getRoles();
    };
    fetchData();
  }, [searchKeyword]);

  return (
    <>
      <div className="table-responsive">
        <table className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer">
          <thead>
            <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
              <td className="min-w-125px">名稱</td>
              <td className="min-w-125px">標題</td>
              <td className="min-w-125px">描述</td>
              <td className="min-w-125px">系統</td>
              <td className="min-w-125px">排序</td>
              <td className="min-w-125px">功能</td>
            </tr>
          </thead>
          <tbody>
            {roles.length > 0 ? (
              roles.map((role) => (
                <tr key={role.uuid}>
                  <td>{role.code}</td>
                  <td>{role.title}</td>
                  <td>{role.description}</td>
                  <td>{getSystemName(role.systemUuids)}</td>
                  <td>{role.orders}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEditClick(role)}
                    >
                      <KTIcon iconName="message-edit" className="fs-2" />
                      編輯
                    </button>
                    <button
                      className="btn btn-sm btn-danger ms-2"
                      onClick={() => handleDeleteClick(role)}
                    >
                      <KTIcon iconName="cross" className="fs-2" />
                      刪除
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  沒有角色資料
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editModal && selectedRole && (
        <EditModal
          editModal={editModal}
          onClose={() => setEditModalOpen(false)}
          role={selectedRole}
          showAlert={showAlert}
          onRoleUpdated={handleRoleUpdated}
          systems={systems}
        />
      )}

      {deleteModal && selectedRole && (
        <DeleteModal
          deleteModal={deleteModal}
          onClose={() => setDeleteModalOpen(false)}
          role={selectedRole}
          showAlert={showAlert}
          onRoleUpdated={handleRoleUpdated}
        />
      )}
    </>
  );
};

export default RoleList;
