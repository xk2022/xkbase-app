import { useState } from 'react';
import { Content } from '../../../../_metronic/layout/components/content';
import { KTIcon } from '../../../../_metronic/helpers';
import { CreateModal } from './CreateModal';
import { EditModal } from './EditModal';

export function Overview() {
  
  const [showModal, setShowModal] = useState(false);

  return (
    <Content>
      <div className="container">
        <ol className="breadcrumb text-muted fs-6 fw-bold">
          <li className="breadcrumb-item pe-3">
            <a href="#" className="pe-3">
              權限
            </a>
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
                  data-kt-user-table-filter="search"
                  className="form-control form-control-solid w-250px ps-14"
                  placeholder="請輸入關鍵字"
                />
              </div>
            </div>
            <div className="card-toolbar">
              <div className="d-flex justify-content-end" data-kt-user-table-toolbar="base">
                <button type="button" className="btn btn-primary" onClick={() => setShowModal(true)}>
                  <KTIcon iconName="plus" className="fs-2" />
                  新增使用者
                </button>
              </div>
            </div>
          </div>
          <div className="card-body py-4">
            <div className="table-responsive">
              <table
                id="kt_table_users"
                className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
              >
                <thead>
                  <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                    <th className="min-w-125px">名稱</th>
                    <th className="min-w-125px">角色</th>
                    <th className="min-w-125px">信箱</th>
                    <th className="min-w-125px">手機</th>
                    <th className="min-w-125px">最後登入時間</th>
                    <th className="min-w-125px">狀態</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 這裡應該放使用者資料 */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <CreateModal showModal={showModal} onClose={() => setShowModal(false)} />
      
    </Content>
  );
}
