/* eslint-disable @typescript-eslint/no-explicit-any */
import {UserModel} from './_models'

const AUTH_USER_STORAGE_KEY = 'authUser'
const AUTH_TOKEN_STORAGE_KEY = 'authToken'

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

const setAuth = (auth: UserModel) => {
  if (!localStorage) {
    return
  }

  try {
    const value = JSON.stringify(auth);
    localStorage.setItem(AUTH_USER_STORAGE_KEY, value);
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, auth.token);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
  }
}

const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error)
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

export {getAuth, getToken, setAuth, removeAuth, AUTH_USER_STORAGE_KEY}
