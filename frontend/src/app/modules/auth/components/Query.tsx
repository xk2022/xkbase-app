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
    if(responseData.data.locked){
      showAlert("帳號已被鎖定，請聯絡管理員", "warning");
      return null;
    }
    if(responseData.data.enabled){
      showAlert("帳號尚未啟用，請聯絡管理員", "warning");
      return null;
    }
    showAlert("登入成功", "success");
    return responseData;
  } catch (error) {
    console.error("API 錯誤:", error);
    return null;
  }
};