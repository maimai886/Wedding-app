import { createContext, useState, ReactNode, useEffect } from "react";
import { AppContextType, UserData } from "./appContext.interface";

/**
 * アプリケーションのグローバルコンテキスト
 * ユーザー情報とローディング状態を管理
 */
export const AppContext = createContext<AppContextType>({
  userInfo: { userName: null, sqlNo: null }, // ユーザー情報の初期値
  setUserInfo: () => {}, // ユーザー情報更新関数
  showLoading: false, // ローディング表示状態
  setShowLoading: () => {}, // ローディング表示状態更新関数
});

/**
 * アプリケーションコンテキストプロバイダー
 * 子コンポーネントにコンテキストを提供
 * @param {Object} props - コンポーネントのプロパティ
 * @param {ReactNode} props.children - 子コンポーネント
 * @returns {JSX.Element} コンテキストプロバイダー
 */
export const AppContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  /**
   * 状態定義
   */
  const [showLoading, setShowLoading] = useState<boolean>(false); // ローディング表示状態
  const [userInfo, setUserInfo] = useState<UserData>({ // ユーザー情報状態
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
      {children} {/* 子コンポーネントのレンダリング */}
    </AppContext.Provider>
  );
};
