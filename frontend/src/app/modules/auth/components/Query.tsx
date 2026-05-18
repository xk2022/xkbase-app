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
    const response = data.data

    if (!response || !response.me) {
      showAlert('查無此使用者', 'danger')
      return null
    }

    // 後端返回格式：{ accessToken, me: { userId, username, permissionCodes, ... } }
    // 轉換為前端期望的 UserModel 格式
    const me = response.me
    const user = {
      uuid: me.userId || me.uuid || '',
      account: me.username || '',
      name: me.name || me.username || '',
      username: me.username || '',
      fullname: me.name || me.username || '',
      email: me.email || '',
      cellPhone: me.phone || '',
      roleUuid: me.roleCodes?.[0] || '', // 使用第一個角色作為 roleUuid
      enabled: me.enabled ?? true,
      locked: me.locked ?? false,
      token: response.accessToken || '', // 使用 accessToken 作為 token
      systemDTOs: null, // 後端沒有返回 systemDTOs，使用 null
      permissionCodes: Array.isArray(me.permissionCodes) ? me.permissionCodes : [], // 轉換 Set 為 Array
      roleCodes: Array.isArray(me.roleCodes) ? me.roleCodes : [], // 轉換 Set 為 Array
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
