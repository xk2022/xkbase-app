import { useEffect, useState } from "react";
import { Content } from "../../../../_metronic/layout/components/content";
import { KTIcon } from "../../../../_metronic/helpers";
import { CreateModal } from "./CreateModal";
import RoleList from "./List";

export function Overview() {
  const [createModal, setCreateModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [listKey, setListKey] = useState(0);
  const [tempKeyword, setTempKeyword] = useState('');
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'danger' | 'warning' | null } | null>(null);

  const onAlert = (message: string, type: 'success' | 'danger' | 'warning' | null) => {
    setAlert({ message, type });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setSearchKeyword(tempKeyword);
    }
  };

  useEffect(() => {
    setSearchKeyword('');
  }, []);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleRoleCreated = () => {
    setListKey(prevKey => prevKey + 1); 
  };

  return (
    <Content>
      {alert && (
        <div className={`mb-lg-15 alert alert-${alert.type} position-fixed end-0 m-3 shadow-lg`} style={{ top: "10%", zIndex: 9999, minWidth: "250px" }}>
          <div className='alert-text font-weight-bold'>{alert.message}</div>
        </div>
      )}
      <div className="container">
        <ol className="breadcrumb text-muted fs-6 fw-bold">
          <li className="breadcrumb-item pe-3">
            <a href="#" className="pe-3">權限</a>
          </li>
          <li className="breadcrumb-item px-3 text-muted">角色</li>
        </ol>
      </div>
      <div className="app-content flex-column-fluid">
        <div className="card">
          <div className="card-header border-0 pt-6">
            <div className="card-title">
              <div className="d-flex align-items-center position-relative my-1">
                <KTIcon iconName="magnifier" className="fs-1 position-absolute ms-6" />
                <input
                  type="text"
                  className="form-control form-control-solid w-250px ps-14"
                  placeholder="請輸入關鍵字"
                  value={tempKeyword}
                  onChange={(e) => setTempKeyword(e.target.value)}  // 更新 tempKeyword
                  onKeyDown={handleSearchKeyDown}  // 捕獲 Enter 鍵
                />
              </div>
            </div>
            <div className="card-toolbar">
              <button type="button" className="btn btn-primary" onClick={() => setCreateModal(true)}>
                <KTIcon iconName="plus" className="fs-2" />
                新增角色
              </button>
            </div>
          </div>
          <div className="card-body py-4">
            {/* 加入 key 屬性，讓 React 強制重新渲染 RoleList */}
            <RoleList key={listKey} searchKeyword={searchKeyword} onAlert={onAlert} />
          </div>
        </div>
      </div>

      <CreateModal createModal={createModal} onClose={() => setCreateModal(false)} onAlert={onAlert} onRoleCreated={handleRoleCreated} />
      
    </Content>
  );
}
