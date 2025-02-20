import React, { useState, useEffect } from "react";
import { KTIcon } from '../../../../_metronic/helpers';
import { EditModal } from "./EditModal";
import { DeleteModal } from "./DeleteModal";

interface User {
  id: number;
  username: string;
  email: string;
  cellPhone: string;
  roleId: number;
  password: string;
  enabled: boolean;
  locked: boolean;
  lastLogin: string;
}

interface UserListProps {
  searchKeyword: string;
  onAlert: (message: string, type: "success" | "warning" | "danger") => void;
  roles: { id: number, code: string, title: string, description: string, orders: number }[];
}

const UserList: React.FC<UserListProps> = ({ searchKeyword, onAlert, roles }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [editModal, setEditModalOpen] = useState(false);
  const [deleteModal, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 獲取角色列表的函數
  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/upms/users?keyword=${encodeURIComponent(searchKeyword)}`
      );
      const responseData = await response.json();
      if (response.ok) {
        setUsers(responseData.data);
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

  useEffect(() => {
    fetchUsers();
  }, [searchKeyword]);

  // 打開編輯模式
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  // 打開刪除模式
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  // 角色更新後刷新角色列表
  const handleUserUpdated = () => {
    fetchUsers();
    setEditModalOpen(false);
  };

  // 取得角色
  const getRoleCode = (roleId: number): string => {
    const role = roles.find((role) => role.id === roleId);
    return role ? role.code : "未分配角色";
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer">
          <thead>
            <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
              <td className="min-w-125px">名稱</td>
              <td className="min-w-125px">信箱</td>
              <td className="min-w-125px">手機</td>
              <td className="min-w-125px">角色</td>
              <td className="min-w-125px">啟用</td>
              <td className="min-w-125px">鎖定</td>
              <td className="min-w-125px">最後登入時間</td>
              <td className="min-w-125px">功能</td>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.cellPhone}</td>
                  <td>{getRoleCode(user.roleId)}</td>
                  <td>
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={!user.locked}
                        readOnly
                      />
                    </div>
                  </td>
                  <td>
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={!user.enabled}
                        readOnly
                      />
                    </div>
                  </td>
                  <td>{user.lastLogin}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEditClick(user)}
                    >
                      <KTIcon iconName="message-edit" className="fs-2" />
                      編輯
                    </button>
                    <button
                      className="btn btn-sm btn-danger ms-2"
                      onClick={() => handleDeleteClick(user)}
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
                  沒有使用者資料
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editModal && selectedUser && (
        <EditModal
          editModal={editModal}
          onClose={() => setEditModalOpen(false)}
          user={selectedUser}
          onAlert={onAlert}
          onUserUpdated={handleUserUpdated}
          roles={roles}
        />
      )}

      {deleteModal && selectedUser && (
        <DeleteModal
          deleteModal={deleteModal}
          onClose={() => setDeleteModalOpen(false)}
          user={selectedUser}
          onAlert={onAlert}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </>
  );
};

export default UserList;
