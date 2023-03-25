import { createContext, useState, ReactNode, useEffect } from "react";
import { AppContextType, UserData } from "./appContext.interface";

export const AppContext = createContext<AppContextType>({
  userInfo: { userName: null, sqlNo: null },
  setUserInfo: () => {},
  showLoading: false,
  setShowLoading: () => {},
});

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  /**
   * 状態定義
   */
  const [showLoading, setShowLoading] = useState<boolean>(false);

  const [userInfo, setUserInfo] = useState<UserData>({
    userName: null,
    sqlNo: null,
  });
  return (
    <AppContext.Provider
      value={{
        userInfo,
        setUserInfo,
        showLoading,
        setShowLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
