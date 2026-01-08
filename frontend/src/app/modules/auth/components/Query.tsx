// src/app/modules/auth/components/Query.ts (隨你放哪)
import { http } from '@/shared/api/http'
import { LoginModel } from '../../../pages/model/LoginModel'
import { ApiResponse } from '@/app/pages/model/ApiResponse'

// 依後端實際回傳型別調整
export const signin = async (
  login: LoginModel,
  showAlert: (msg: string, type: 'success' | 'danger' | 'warning') => void,
) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await http.post<ApiResponse<any>>('/auth/login', login)
    const user = data.data

    if (!user) {
      showAlert('查無此使用者', 'danger')
      return null
    }
    // if (user.locked) {
    //   showAlert('帳號已被鎖定，請聯絡管理員', 'warning')
    //   return null
    // }
    // if (!user.enabled) {
    //   showAlert('帳號尚未啟用，請聯絡管理員', 'warning')
    //   return null
    // }

    showAlert('登入成功', 'success')
    return user
  } catch (error) {
    console.error('登入 API 錯誤:', error)
    showAlert('登入失敗，請稍後再試', 'danger')
    return null
  }
}
