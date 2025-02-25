import React, { useState, useEffect } from "react";
import { KTIcon } from '../../../../_metronic/helpers';
import { EditModal } from "./EditModal";
import { DeleteModal } from "./DeleteModal";

interface System {
  id: number;
  name: string;
  orders: number;
}

interface SystemListProps {
  searchKeyword: string;
  showAlert: (message: string, type: "success" | "warning" | "danger") => void;
}

const SystemList: React.FC<SystemListProps> = ({ searchKeyword, showAlert }) => {
  const [systems, setSystems] = useState<System[]>([]);
  const [editModal, setEditModalOpen] = useState(false);
  const [deleteModal, setDeleteModalOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<System | null>(null);

  // 獲取角色列表的函數
  const fetchSystems = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/upms/systems?keyword=${encodeURIComponent(searchKeyword)}`
      );
      const responseData = await response.json();
      if (response.ok) {
        setSystems(responseData.data);
        return;
      }
      if(Array.isArray(responseData.errorDetails.length)){
        showAlert(responseData.errorDetails.join("\n"), "warning");
        return;
      }
      showAlert(responseData.errorDetails, "warning");
    } catch (error) {
      console.error("API 錯誤:", error);
    }
  };

  // 當 searchKeyword 更新時重新獲取角色資料
  useEffect(() => {
    fetchSystems();
  }, [searchKeyword]);

  // 打開編輯模式
  const handleEditClick = (system: System) => {
    setSelectedSystem(system);
    setEditModalOpen(true);
  };

  // 打開刪除模式
  const handleDeleteClick = (system: System) => {
    setSelectedSystem(system);
    setDeleteModalOpen(true);
  };

  // 系統更新後刷新系統列表
  const handleSystemUpdated = () => {
    fetchSystems();
    setEditModalOpen(false);
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer">
          <thead>
            <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
              <td className="min-w-125px">名稱</td>
            </tr>
          </thead>
          <tbody>
            {systems.length > 0 ? (
              systems.map((system) => (
                <tr key={system.id}>
                  <td>{system.name}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEditClick(system)}
                    >
                      <KTIcon iconName="message-edit" className="fs-2" />
                      編輯
                    </button>
                    <button
                      className="btn btn-sm btn-danger ms-2"
                      onClick={() => handleDeleteClick(system)}
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
                  沒有系統資料
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editModal && selectedSystem && (
        <EditModal
          editModal={editModal}
          onClose={() => setEditModalOpen(false)}
          system={selectedSystem}
          showAlert={showAlert}
          onSystemUpdated={handleSystemUpdated}
        />
      )}

      {deleteModal && selectedSystem && (
        <DeleteModal
          deleteModal={deleteModal}
          onClose={() => setDeleteModalOpen(false)}
          system={selectedSystem}
          showAlert={showAlert}
          onSystemUpdated={handleSystemUpdated}
        />
      )}
    </>
  );
};

export default SystemList;
