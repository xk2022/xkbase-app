import type { LoginModel } from '../../../pages/model/LoginModel'

export const signin = async (login: LoginModel) => {
  try {
    const response = await fetch("http://localhost:8081/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login),
    });

    const responseData = await response.json();

    if (response.ok) {
      // showAlert("登入成功！", "success");
      return responseData;
    }

    if (Array.isArray(responseData.errorDetails.length)) {
      // showAlert(responseData.errorDetails.join("\n"), "warning");
      return responseData;
    }

    // showAlert(responseData.errorDetails, "warning");
    return null;
  } catch (error) {
    console.error("提交錯誤:", error);
    // showAlert("系統錯誤，請稍後再試！", "danger");
    return null;
  }
};