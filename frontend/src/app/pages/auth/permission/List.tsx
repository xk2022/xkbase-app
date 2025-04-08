import { useEffect, useState } from 'react';
import { Tree } from './Tree';
import { fetchPermissions } from './Query';

interface PermissionListProps {
    systemUuid: string;
    roleId: number;
    showAlert: (message: string, type: "success" | "warning" | "danger") => void;
}

const PermissionList: React.FC<PermissionListProps> = ({ systemUuid, roleId, showAlert }) => {

    const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

    const handleCheckboxChange = (id: string) => {
        setCheckedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const getPermissions = async () => {
        if(!systemUuid || !roleId){
            return;
        }
        const fetchedPermissions = await fetchPermissions(systemUuid, roleId, showAlert);
    };

    useEffect(() => {
        const fetchData = async () => {
            await getPermissions();
        };
        fetchData();
    }, [systemUuid, roleId]); 

    return (
        <>
            <div className="accordion accordion-icon-toggle" id="system">
                <Tree id="auth" title="權限管理">
                    <div className="accordion accordion-icon-toggle">
                        <Tree id="user_management" title="使用者管理">
                            <div className="accordion accordion-icon-toggle">
                                <div className="mt-2">
                                    <div className="form-check form-check-custom form-check-solid form-check-sm">
                                        <div className="d-inline-block me-5">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="user_add"
                                                checked={checkedItems.user_add}
                                                onChange={() => handleCheckboxChange("user_add")}
                                            />
                                            <label className="form-check-label ms-2" htmlFor="user_add">新增</label>
                                        </div>

                                        <div className="d-inline-block me-5">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="user_edit"
                                                checked={checkedItems.user_edit}
                                                onChange={() => handleCheckboxChange("user_edit")}
                                            />
                                            <label className="form-check-label ms-2" htmlFor="user_edit">編輯</label>
                                        </div>

                                        <div className="d-inline-block me-5">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="user_delete"
                                                checked={checkedItems.user_delete}
                                                onChange={() => handleCheckboxChange("user_delete")}
                                            />
                                            <label className="form-check-label ms-2" htmlFor="user_delete">刪除</label>
                                        </div>

                                        <div className="d-inline-block me-5">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="user_query"
                                                checked={checkedItems.user_query}
                                                onChange={() => handleCheckboxChange("user_query")}
                                            />
                                            <label className="form-check-label ms-2" htmlFor="user_query">查詢</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tree>

                        <Tree id="role_management" title="角色管理">
                            <div className="accordion accordion-icon-toggle">
                                <div className="mt-2">
                                    <div className="form-check form-check-custom form-check-solid form-check-sm">
                                        <div className="d-inline-block me-5">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="role_add"
                                                checked={checkedItems.role_add}
                                                onChange={() => handleCheckboxChange("role_add")}
                                            />
                                            <label className="form-check-label ms-2" htmlFor="role_add">新增</label>
                                        </div>

                                        <div className="d-inline-block me-5">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="role_edit"
                                                checked={checkedItems.role_edit}
                                                onChange={() => handleCheckboxChange("role_edit")}
                                            />
                                            <label className="form-check-label ms-2" htmlFor="role_edit">編輯</label>
                                        </div>

                                        <div className="d-inline-block me-5">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="role_delete"
                                                checked={checkedItems.role_delete}
                                                onChange={() => handleCheckboxChange("role_delete")}
                                            />
                                            <label className="form-check-label ms-2" htmlFor="role_delete">刪除</label>
                                        </div>

                                        <div className="d-inline-block me-5">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="role_query"
                                                checked={checkedItems.role_query}
                                                onChange={() => handleCheckboxChange("role_query")}
                                            />
                                            <label className="form-check-label ms-2" htmlFor="role_query">查詢</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tree>
                    </div>
                </Tree>
            </div>
        </>
    );
}

export default PermissionList;
