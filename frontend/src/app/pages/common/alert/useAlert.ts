import { useState } from "react";

type AlertType = { message: string; type: "success" | "danger" | "warning" } | null;

export function useAlert() {
  const [alert, setAlert] = useState<AlertType>(null);

  const showAlert = (message: string, type: "success" | "danger" | "warning") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  return { alert, showAlert };
}
