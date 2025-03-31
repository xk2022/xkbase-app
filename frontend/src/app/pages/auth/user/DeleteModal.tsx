import { useRef } from 'react';
import { Content } from '../../../../_metronic/layout/components/content';
import { KTIcon } from '../../../../_metronic/helpers';
import { User } from '../../model/UserModel';
import { deleteUser } from './Query';

interface DeleteModalProps {
    deleteModal: boolean;
    onClose: () => void;
    user: User | null;
    showAlert: (message: string, type: "success" | "danger" | "warning") => void;
    onUserUpdated: () => void;
}

export function DeleteModal({ deleteModal, onClose, user, showAlert, onUserUpdated }: DeleteModalProps) {
    const btnRef = useRef<HTMLButtonElement | null>(null);
    // 刪除使用者
    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            return;
        }
        btnRef.current?.setAttribute('data-kt-indicator', 'on');
        const success = await deleteUser(user, showAlert);
        btnRef.current?.removeAttribute("data-kt-indicator");
        if (success) {
            onUserUpdated();
            onClose();
        }
    };

    if (!deleteModal || !user) {
        return null;
    }

    return (
        <Content>
            <div className="modal fade show d-block">
                <div className="modal-dialog modal-dialog-centered mw-650px">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="fw-bolder">刪除使用者</h2>
                            <button type="button" className="btn btn-icon btn-sm btn-active-icon-primary" onClick={onClose}>
                                <KTIcon iconName="cross" className="fs-1" />
                            </button>
                        </div>
                        <form className="form" noValidate onSubmit={handleDelete}>
                            <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
                                <div className="row fv-row">
                                    <label className="col-lg col-form-label fw-bold fs-6">
                                        是否確定要刪除使用者 "{user.username}"？
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
