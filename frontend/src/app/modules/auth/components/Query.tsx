import { LoginModel } from '../../../pages/model/LoginModel'

export const signin = async (login: LoginModel, showAlert: (message: string, type: 'success' | 'danger' | 'warning') => void) => {
  try {
    const response = await fetch(`http://localhost:8081/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login),
    });
    const responseData = await response.json();
    if(!responseData.data){
      showAlert("查無此使用者", "danger");
      return null;
    }
    showAlert("登入成功", "success");
    return responseData;
  } catch (error) {
    console.error("API 錯誤:", error);
    return null;
  }
};