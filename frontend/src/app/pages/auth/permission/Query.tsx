import { PermissionUpdate } from '../../model/PermissionModel'

export const fetchPermissions = async (systemUuid: string, roleUuid: string, showAlert: (message: string, type: "success" | "warning" | "danger") => void) => {
  try {
    const response = await fetch(
      `http://localhost:8081/api/upms/permission/${systemUuid}/${roleUuid}`
    );
    const responseData = await response.json();
    if (response.ok) {
      return responseData.data;
    }
    if (Array.isArray(responseData.errorDetails.length)) {
      showAlert(responseData.errorDetails.join("\n"), "warning");
      return [];
    }
    showAlert(responseData.errorDetails, "warning");
    return [];
  } catch (error) {
    console.error("API 錯誤:", error);
    showAlert("獲取資料失敗，請稍後再試", "danger");
    return [];
  }
};

export const editPermissions = async (permission: PermissionUpdate, systemUuid: string, roleUuid: string, showAlert: (message: string, type: "success" | "warning" | "danger") => void) => {
  try {
    const response = await fetch(`http://localhost:8081/api/upms/permission/${systemUuid}/${roleUuid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(permission),
    });
    if (response.ok) {
      showAlert("編輯成功！", "success");
      return true;
    }
    const responseData = await response.json();
    if (response.ok) {
      return responseData.data;
    }
    if (Array.isArray(responseData.errorDetails.length)) {
      showAlert(responseData.errorDetails.join("\n"), "warning");
      return [];
    }
    showAlert(responseData.errorDetails, "warning");
    return [];
  } catch (error) {
    console.error("API 錯誤:", error);
    showAlert("獲取資料失敗，請稍後再試", "danger");
    return [];
  }
};