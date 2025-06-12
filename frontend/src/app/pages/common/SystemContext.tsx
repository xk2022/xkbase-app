import React, { createContext, useContext, useEffect, useState } from "react";
import { System } from '../model/SystemModel';
import { getAuth } from "../../modules/auth/core/AuthHelpers";

interface SystemContextType {
  systems: System[];
  refreshSystems: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systems, setSystems] = useState<System[]>([]);

  // 取得系統清單
  const fetchSystems = async () => {
    const user = getAuth();
    if (user && Array.isArray(user.systemDTOs)) {
      // 如果你需要轉換成 System 型別，可做 mapping
      const parsed: System[] = user.systemDTOs.map(dto => ({
        uuid: dto.systemUuid,
        code: dto.name, // 假設沒有對應就重複 name
        name: dto.name,
        description: '',     // 沒有描述就預設空字串
        enabled: true        // 預設 true，可依需要更精細處理
      }))
      console.log(parsed);
      setSystems(parsed);
    } else {
      setSystems([])
      console.warn('尚未登入或無 systemDTOs')
    }
  };

  useEffect(() => {
    fetchSystems(); // 在應用啟動時執行
  }, []);

  return (
    <SystemContext.Provider value={{ systems, refreshSystems: fetchSystems }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error("useSystem 必須在 SystemProvider 內使用");
  }
  return context;
};
