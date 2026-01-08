/* eslint-disable react-refresh/only-export-components */
import { FC, useState, useEffect, createContext, useContext, Dispatch, SetStateAction } from 'react'
import { LayoutSplashScreen } from '../../../../_metronic/layout/core'
import { UserModel } from './_models'
import * as authHelper from './AuthHelpers'
import { WithChildren } from '../../../../_metronic/helpers'
import { useNavigate } from 'react-router-dom'

type AuthContextProps = {
  currentUser: UserModel | undefined
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
  logout: () => void
}

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => { },
  currentUser: undefined,
  setCurrentUser: () => { },
  logout: () => { },
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider: FC<WithChildren> = ({ children }) => {
  // 從 localStorage 讀取初始狀態，避免閃爍
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>(() => {
    // 嘗試從 localStorage 讀取用戶信息
    try {
      return authHelper.getAuth()
    } catch {
      return undefined
    }
  })
  
  const logout = () => {
    authHelper.removeAuth();
    setCurrentUser(undefined);
  }

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

const AuthInit: FC<WithChildren> = ({ children }) => {
  const { logout, setCurrentUser } = useAuth();
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = authHelper.getToken();
    const user = authHelper.getAuth();
    
    // 檢查是否有認證信息
    if (!token || !user) {
      // 清除可能的殘留數據
      logout();
      // 如果不在登入頁面，才導航到登入頁
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/auth' || currentPath.startsWith('/auth/');
      if (!isAuthPage) {
        navigate('/auth', { replace: true });
      }
      setShowSplashScreen(false);
      return;
    }
    
    try {
      // 設置當前用戶到 Context
      setCurrentUser(user);
    } catch (error) {
      console.error('AuthInit error:', error);
      logout();
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/auth' || currentPath.startsWith('/auth/');
      if (!isAuthPage) {
        navigate('/auth', { replace: true });
      }
    } finally {
      setShowSplashScreen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 只在組件掛載時執行一次

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

export { AuthProvider, AuthInit, useAuth }
