import React, { useState, useEffect, useMemo } from "react";
import { KTIcon } from '../../../../_metronic/helpers';
import { EditModal } from "./EditModal";
import { DeleteModal } from "./DeleteModal";
import { User } from '../../model/UserModel';
import { Role } from '../../model/RoleModel';
import { fetchUsers } from './Query'; 

interface UserListProps {
  searchKeyword: string;
  showAlert: (message: string, type: "success" | "warning" | "danger") => void;
  roles: Role[];
}

const UserList: React.FC<UserListProps> = ({ searchKeyword, showAlert, roles }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [editModal, setEditModalOpen] = useState(false);
  const [deleteModal, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 獲取角色列表的函數
  const getUsers = async () => {
    const fetchedUsers = await fetchUsers(searchKeyword, showAlert);
    setUsers(fetchedUsers);
  };

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
    getUsers();
    setEditModalOpen(false);
    setDeleteModalOpen(false);
  };

  // 取得角色
  const roleMap = useMemo(() => {
    return new Map(roles.map(role => [role.uuid, role.code]));
  }, [roles]);
  
  const getRoleCode = (roleUuid: string) => {
    return roleMap.get(roleUuid) || "未分配角色";
  };

  // 初始化取得使用者清單
  useEffect(() => {
    const fetchData = async () => {
      await getUsers();
    };
    fetchData();
  }, [searchKeyword]);

  return (
    <>
      <div className="table-responsive">
        <table className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer">
          <thead>
            <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
              <td className="min-w-125px">帳號</td>
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
                <tr key={user.uuid}>
                  <td>{user.account}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.cellPhone}</td>
                  <td>{getRoleCode(user.roleUuid)}</td>
                  <td>
                    {user.enabled ? (
                      <span className="badge badge-light-success fw-bolder me-auto px-4 py-3">啟用</span>
                    ) : (
                      <span className="badge badge-light-secondary fw-bolder me-auto px-4 py-3">停用</span>
                    )}
                  </td>
                  <td>
                    {user.locked ? (
                      <span className="badge badge-light-danger fw-bolder me-auto px-4 py-3">已鎖定</span>
                    ) : (
                      <span className="badge badge-light-success fw-bolder me-auto px-4 py-3">未鎖定</span>
                    )}
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
          showAlert={showAlert}
          onUserUpdated={handleUserUpdated}
          roles={roles}
        />
      )}

      {deleteModal && selectedUser && (
        <DeleteModal
          deleteModal={deleteModal}
          onClose={() => setDeleteModalOpen(false)}
          user={selectedUser}
          showAlert={showAlert}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </>
  );
};

export default UserList;
