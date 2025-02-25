import { useRef } from 'react';
import { Content } from '../../../../_metronic/layout/components/content';
import { KTIcon } from '../../../../_metronic/helpers';

interface System {
    id: number;
    name: string;
    orders: number;
}

interface DeleteModalProps {
    deleteModal: boolean;
    onClose: () => void;
    system: System | null;
    showAlert: (message: string, type: "success" | "danger" | "warning") => void;
    onSystemUpdated: () => void;
}

export function DeleteModal({ deleteModal, onClose, system, showAlert, onSystemUpdated }: DeleteModalProps) {
    // 按鈕loading初始化
    const btnRef = useRef<HTMLButtonElement | null>(null);
    // 刪除角色
    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!system) {
            return;
        }
        try {
            // loading開啟
            btnRef.current?.setAttribute('data-kt-indicator', 'on');
            const response = await fetch(`http://localhost:8081/api/upms/systems/${system.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            // loading關閉
            btnRef.current?.removeAttribute("data-kt-indicator");
            if (response.ok) {
                showAlert("角色已成功刪除！", "success");
                onSystemUpdated();
                onClose();
                return;
            }
            const responseData = await response.json();
            if (Array.isArray(responseData.errorDetails.length)) {
                showAlert(responseData.errorDetails.join("\n"), "warning");
                return;
            }
            showAlert(responseData.errorDetails, "warning");
        } catch (error) {
            console.error("提交錯誤:", error);
            showAlert("系統錯誤，請稍後再試！", "danger");
            onClose();
        }
    };

    if (!deleteModal || !system) {
        return null;
    }

    return (
        <Content>
            <div className="modal fade show d-block">
                <div className="modal-dialog modal-dialog-centered mw-650px">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="fw-bolder">刪除系統</h2>
                            <button type="button" className="btn btn-icon btn-sm btn-active-icon-primary" onClick={onClose}>
                                <KTIcon iconName="cross" className="fs-1" />
                            </button>
                        </div>
                        <form className="form" noValidate onSubmit={handleDelete}>
                            <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
                                <div className="row fv-row">
                                    <label className="col-lg col-form-label fw-bold fs-6">
                                        是否確定要刪除系統 "{system.name}"？
                                    </label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>關閉</button>
                                <button type="submit" className="btn btn-danger" ref={btnRef}>
                                    <span className="indicator-label">刪除</span>
                                    <span className="indicator-progress">請稍後...
                                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </Content>
    );
}
