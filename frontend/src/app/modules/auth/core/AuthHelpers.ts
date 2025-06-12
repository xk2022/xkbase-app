/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserModel, SystemDTO } from './_models'

const AUTH_USER_STORAGE_KEY = 'AUTH_USER';
const AUTH_TOKEN_STORAGE_KEY = 'AUTH_TOKEN';
const CURRENT_SYSTEM_KEY = 'CURRENT_SYSTEM';

const setAuth = (auth: UserModel) => {
  if (!localStorage) {
    return
  }

  try {
    const value = JSON.stringify(auth);
    localStorage.setItem(AUTH_USER_STORAGE_KEY, value); // 儲存使用者資料
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, auth.token); // 儲存 token
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
  }
}

const getAuth = (): UserModel | undefined => {
  if (!localStorage) {
    return
  }

  const value: string | null = localStorage.getItem(AUTH_USER_STORAGE_KEY)
  if (!value) {
    return
  }

  try {
    const auth: UserModel = JSON.parse(value) as UserModel
    if (auth) {
      return auth
    }
  } catch (error) {
    console.error('AUTH USER STORAGE PARSE ERROR', error)
  }
}

const getToken = (): string | undefined => {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ?? undefined;
}

const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(CURRENT_SYSTEM_KEY);
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

export const processUserLogin = (user: UserModel) => {
  setAuth(user)
  console.log(user.systemDTOs?.[0]);
  const defaultSystem = user.systemDTOs?.[0]
  if (defaultSystem) {
    setCurrentSystem(defaultSystem)
  }
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
