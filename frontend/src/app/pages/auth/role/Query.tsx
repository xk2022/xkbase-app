import { Role } from '../../model/RoleModel';  

export const fetchRoles = async (searchKeyword: string, showAlert: (message: string, type: "success" | "warning" | "danger") => void) => {
  try {
    const response = await fetch(
      `http://localhost:8081/api/upms/role?keyword=${encodeURIComponent(searchKeyword)}`
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

export const createRole = async (role: Role, showAlert: (message: string, type: 'success' | 'danger' | 'warning') => void) => {
  try {
    const response = await fetch("http://localhost:8081/api/upms/role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(role),
    });

    if (response.ok) {
      showAlert("新增成功！", "success");
      return true;
    }

    const responseData = await response.json();
    if (Array.isArray(responseData.errorDetails.length)) {
      showAlert(responseData.errorDetails.join("\n"), "warning");
      return false;
    }

    showAlert(responseData.errorDetails, "warning");
    return false;
  } catch (error) {
    console.error("提交錯誤:", error);
    showAlert("系統錯誤，請稍後再試！", "danger");
    return false;
  }
};

export const editRole = async (role: Role, showAlert: (message: string, type: 'success' | 'danger' | 'warning') => void) => {
  try {
    const response = await fetch(`http://localhost:8081/api/upms/role/${role.uuid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(role),
    });

    if (response.ok) {
      showAlert("編輯成功！", "success");
      return true;
    }

    const responseData = await response.json();
    if (responseData.errorDetails && Array.isArray(responseData.errorDetails)) {
      showAlert(responseData.errorDetails.join("\n"), "warning");
      return;
    }
    showAlert(responseData.message || "請求失敗，請檢查輸入資料", "warning");
    return false;
  } catch (error) {
    console.error("提交錯誤:", error);
    showAlert("系統錯誤，請稍後再試！", "danger");
    return false;
  }
};

export const deleteRole = async (role: Role, showAlert: (message: string, type: 'success' | 'danger' | 'warning') => void) => {
  try {
    const response = await fetch(`http://localhost:8081/api/upms/role/${role.uuid}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(role),
    });

    if (response.ok) {
      showAlert("刪除成功！", "success");
      return true;
    }

    const responseData = await response.json();
    if (responseData.errorDetails && Array.isArray(responseData.errorDetails)) {
      showAlert(responseData.errorDetails.join("\n"), "warning");
      return;
    }
    showAlert(responseData.message || "請求失敗，請檢查輸入資料", "warning");
    return false;
  } catch (error) {
    console.error("提交錯誤:", error);
    showAlert("系統錯誤，請稍後再試！", "danger");
    return false;
  }
};