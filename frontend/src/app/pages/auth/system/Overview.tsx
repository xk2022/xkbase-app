import { useState } from "react";
import { Content } from "../../../../_metronic/layout/components/content";
import { KTIcon } from "../../../../_metronic/helpers";
import { CreateModal } from "./CreateModal";
import { useAlert } from "../../common/useAlert";
import SystemList from "./List";

export function Overview() {
  const { alert, showAlert, Alert } = useAlert();
  const [createModal, setCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSystemCreated = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}
      <div className="">
        <ol className="breadcrumb text-muted fs-6 fw-bold">
          <li className="breadcrumb-item pe-3">
            <a href="#" className="pe-3">權限</a>
          </li>
          <li className="breadcrumb-item px-3 text-muted">系統</li>
        </ol>
      </div>
      <div className="app-content flex-column-fluid">
        <div className="card">
          <div className="card-header border-0 pt-6">
            <div className="card-title"></div>
            <div className="card-toolbar">
              <button type="button" className="btn btn-primary" onClick={() => setCreateModal(true)}>
                <KTIcon iconName="plus" className="fs-2" />
                新增系統
              </button>
            </div>
          </div>
          <div className="card-body py-4">
            <SystemList key={refreshKey} showAlert={showAlert} />
          </div>
        </div>
      </div>

      <CreateModal
        createModal={createModal}
        onClose={() => setCreateModal(false)}
        showAlert={showAlert}
        onSystemCreated={handleSystemCreated}
      />
    </Content>
  );
}
