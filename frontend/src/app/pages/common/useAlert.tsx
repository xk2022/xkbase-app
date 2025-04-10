import { useState } from "react";

type AlertType = { message: string; type: "success" | "danger" | "warning" };

export function useAlert() {
  const [alert, setAlert] = useState<AlertType | null>(null);

  const showAlert = (message: string, type: "success" | "danger" | "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000); // 3秒後自動隱藏 alert
  };

  // Alert 組件，僅接受非 null 的 alert
  const Alert = ({ message, type }: AlertType) => {
    return (
      <div
        className={`mb-lg-15 alert alert-${type} position-fixed end-0 m-3 shadow-lg`}
        style={{ top: "10%", zIndex: 9999, minWidth: "250px" }}
      >
        <div className="alert-text font-weight-bold">{message}</div>
      </div>
    );
  };

  return { alert, showAlert, Alert };
}