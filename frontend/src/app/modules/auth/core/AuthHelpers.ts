/* eslint-disable @typescript-eslint/no-explicit-any */
import { Auth } from '@/app/pages/model/AuthModel';
import { UserModel, SystemDTO } from './_models'

const AUTH_USER_STORAGE_KEY = 'AUTH_USER';
const AUTH_TOKEN_STORAGE_KEY = 'AUTH_TOKEN';
const CURRENT_SYSTEM_KEY = 'CURRENT_SYSTEM';

/**
 * 設置認證信息
 * 支持 Auth 類型（accessToken）和 UserModel 類型（token）
 */
const setAuth = (auth: Auth | UserModel) => {
  if (!localStorage) {
    return
  }

  try {
    const value = JSON.stringify(auth);
    localStorage.setItem(AUTH_USER_STORAGE_KEY, value); // 儲存使用者資料
    
    // 支持兩種類型：Auth 有 accessToken，UserModel 有 token
    const token = 'accessToken' in auth ? auth.accessToken : auth.token;
    if (token) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token); // 儲存 token
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
  }
}

const getAuth = (): UserModel | undefined => {
  if (!localStorage) {
    return
  }

  // 優先讀取大寫 key（標準格式），如果沒有則嘗試小寫 key（兼容舊格式）
  let value: string | null = localStorage.getItem(AUTH_USER_STORAGE_KEY)
  if (!value) {
    value = localStorage.getItem('authUser') // 兼容舊格式
  }
  
  if (!value) {
    return
  }

  try {
    const auth: UserModel = JSON.parse(value) as UserModel
    if (auth) {
      // 如果讀取的是小寫 key，遷移到標準格式
      if (localStorage.getItem(AUTH_USER_STORAGE_KEY) !== value) {
        localStorage.setItem(AUTH_USER_STORAGE_KEY, value)
        localStorage.removeItem('authUser') // 清理舊 key
      }
      return auth
    }
  } catch (error) {
    console.error('AUTH USER STORAGE PARSE ERROR', error)
  }
}

const getToken = (): string | undefined => {
  // 優先讀取大寫 key（標準格式），如果沒有則嘗試小寫 key（兼容舊格式）
  let token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  if (!token) {
    token = localStorage.getItem('authToken') // 兼容舊格式
    // 如果讀取到小寫 key，遷移到標準格式
    if (token) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
      localStorage.removeItem('authToken') // 清理舊 key
    }
  }
  return token ?? undefined
}

const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    // 清理標準格式的 key
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(CURRENT_SYSTEM_KEY);
    // 清理舊格式的 key（兼容性清理）
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    // 清理 Metronic 模板的舊 key
    localStorage.removeItem('kt-auth-react-v');
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error)
  }
}

export const setCurrentSystem = (system: SystemDTO) => {
  localStorage.setItem(CURRENT_SYSTEM_KEY, JSON.stringify(system))
}

export const getCurrentSystem = (): SystemDTO | null => {
  const data = localStorage.getItem(CURRENT_SYSTEM_KEY)
  return data ? JSON.parse(data) : null
}

/**
 * 處理用戶登入
 * 支持 Auth 類型（accessToken）和 UserModel 類型（token）
 */
export const processUserLogin = (user: Auth | UserModel) => {
  setAuth(user)
  // console.log(user.systemDTOs?.[0]);
  // const defaultSystem = user.systemDTOs?.[0]
  // if (defaultSystem) {
  //   setCurrentSystem(defaultSystem)
  // }
}

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json'
  axios.interceptors.request.use(
    (config: {headers: {Authorization: string}}) => {
      const auth = getAuth()
      if (auth && auth.token) {
        config.headers.Authorization = `Bearer ${auth.token}`
      }

      return config
    },
    (err: any) => Promise.reject(err)
  )
}

export {setAuth, getAuth, getToken, removeAuth, AUTH_USER_STORAGE_KEY}
