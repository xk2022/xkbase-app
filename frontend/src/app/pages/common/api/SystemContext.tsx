import React, { createContext, useContext, useEffect, useState } from "react";

interface System {
  id: string;
  code: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface SystemContextType {
  systems: System[];
  refreshSystems: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systems, setSystems] = useState<System[]>([]);

  // 取得系統清單
  const fetchSystems = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/adm/system`);
      const responseData = await response.json();
      if (response.ok) {
        setSystems(responseData.data);
      } else {
        console.error("獲取系統清單失敗:", responseData.errorDetails);
      }
    } catch (error) {
      console.error("API 錯誤:", error);
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
