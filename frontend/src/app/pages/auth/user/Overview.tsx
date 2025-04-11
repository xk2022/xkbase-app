import { useEffect, useState } from "react";
import { Content } from '../../../../_metronic/layout/components/content';
import { KTIcon } from '../../../../_metronic/helpers';
import { useAlert } from '../../common/useAlert';
import { fetchRoles } from '../role/Query';
import { CreateModal } from './CreateModal';
import { Role } from '../../model/RoleModel';
import UserList from './List';

export function Overview() {
  const { alert, showAlert, Alert } = useAlert();
  const [createModal, setCreateModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [listKey, setListKey] = useState(0);
  const [tempKeyword, setTempKeyword] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setSearchKeyword(tempKeyword);
    }
  };

  const handleUserCreated = () => {
    setListKey(prevKey => prevKey + 1); 
  };

  // 獲取角色列表的函數
  const getRoles = async () => {
    const fetchedUsers = await fetchRoles(searchKeyword, showAlert);
    setRoles(fetchedUsers);
  };

  useEffect(() => {
    getRoles();
  }, []); 

  return (
    <Content>
      {alert && <Alert message={alert.message} type={alert.type} />}
      <div className="">
        <ol className="breadcrumb text-muted fs-6 fw-bold">
          <li className="breadcrumb-item pe-3">
            <a href="#" className="pe-3">權限</a>
          </li>
          <li className="breadcrumb-item px-3 text-muted">使用者</li>
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
                  onChange={(e) => setTempKeyword(e.target.value)} 
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
            </div>
            <div className="card-toolbar">
              <button type="button" className="btn btn-primary" onClick={() => setCreateModal(true)}>
                <KTIcon iconName="plus" className="fs-2" />
                新增使用者
              </button>
            </div>
          </div>
          <div className="card-body py-4">
            <UserList key={listKey} searchKeyword={searchKeyword} showAlert={showAlert} roles={roles} />
          </div>
        </div>
      </div>

      <CreateModal 
        createModal={createModal} 
        onClose={() => setCreateModal(false)} 
        showAlert={showAlert} 
        onUserCreated={handleUserCreated} 
        roles={roles}
      />

    </Content>
  );
}
