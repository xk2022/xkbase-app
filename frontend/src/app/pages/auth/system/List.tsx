import React, { useState, useEffect } from "react";
import { KTIcon } from '../../../../_metronic/helpers';
import { System } from '../../model/SystemModel';
import { EditModal } from './EditModal';
import { DeleteModal } from './DeleteModal';
import { fetchSystems } from './Query'; 

interface SystemListProps {
  showAlert: (message: string, type: "success" | "warning" | "danger") => void;
}

const SystemList: React.FC<SystemListProps> = ({ showAlert }) => {
  const [systems, setSystems] = useState<System[]>([]);
  const [editModal, setEditModalOpen] = useState(false);
  const [deleteModal, setDeleteModalOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<System | null>(null);

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
    getSystems();
    setEditModalOpen(false);
  };

  // 獲取系統列表的函數
  const getSystems = async () => {
    const fetchedSystems = await fetchSystems(showAlert);
    setSystems(fetchedSystems);
  };
  
  // 初始化取得系統清單
  useEffect(() => {
    const fetchData = async () => {
      await getSystems();
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="table-responsive">
        <table className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer">
          <thead>
            <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
              <td className="min-w-125px">代碼</td>
              <td className="min-w-125px">名稱</td>
              <td className="min-w-125px">描述</td>
              <td className="min-w-125px">狀態</td>
              <td className="min-w-125px">功能</td>
            </tr>
          </thead>
          <tbody>
            {systems.length > 0 ? (
              systems.map((system) => (
                <tr key={system.uuid}>
                  <td>{system.code}</td>
                  <td>{system.name}</td>
                  <td>{system.description}</td>
                  <td>
                    {system.enabled ? (
                      <span className="badge badge-light-success fw-bolder me-auto px-4 py-3">啟用</span>
                    ) : (
                      <span className="badge badge-light-secondary fw-bolder me-auto px-4 py-3">停用</span>
                    )}
                  </td>
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
