import React, { useState, useEffect } from "react";
import { KTIcon } from '../../../../_metronic/helpers';
import { EditModal } from "./EditModal";
import { DeleteModal } from "./DeleteModal";

interface Role {
  id: number;
  code: string;
  title: string;
  description: string;
  orders: number;
}

interface RoleListProps {
  searchKeyword: string;
  onAlert: (message: string, type: "success" | "warning" | "danger") => void;
}

const RoleList: React.FC<RoleListProps> = ({ searchKeyword, onAlert }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [editModal, setEditModalOpen] = useState(false);
  const [deleteModal, setDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // 獲取角色列表的函數
  const fetchRoles = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/upms/roles?keyword=${encodeURIComponent(searchKeyword)}`
      );
      const responseData = await response.json();
      if (response.ok) {
        setRoles(responseData.data);
        return;
      }
      if(Array.isArray(responseData.errorDetails.length)){
        onAlert(responseData.errorDetails.join("\n"), "warning");
        return;
      }
      onAlert(responseData.errorDetails, "warning");
    } catch (error) {
      console.error("API 錯誤:", error);
    }
  };

  // 當 searchKeyword 更新時重新獲取角色資料
  useEffect(() => {
    fetchRoles();
  }, [searchKeyword]);

  // 打開編輯模式
  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    setEditModalOpen(true);
  };

  // 打開刪除模式
  const handleDeleteClick = (role: Role) => {
    setSelectedRole(role);
    setDeleteModalOpen(true); // 開啟刪除Modal
  };

  // 角色更新後刷新角色列表
  const handleRoleUpdated = () => {
    fetchRoles();
    setEditModalOpen(false);
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer">
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
            {roles.length > 0 ? (
              roles.map((role) => (
                <tr key={role.id}>
                  <td>{role.code}</td>
                  <td>{role.title}</td>
                  <td>{role.description}</td>
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
          onAlert={onAlert}
          onRoleUpdated={handleRoleUpdated}
        />
      )}

      {deleteModal && selectedRole && (
        <DeleteModal
          deleteModal={deleteModal}
          onClose={() => setDeleteModalOpen(false)}
          role={selectedRole}
          onAlert={onAlert}
          onRoleUpdated={handleRoleUpdated}
        />
      )}
    </>
  );
};

export default RoleList;
