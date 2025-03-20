/**
 * ユーザーデータのインターフェース
 * ユーザー名とSQL番号を管理
 */
export interface UserData {
  userName: string | null; // ユーザー名（null許容）
  sqlNo: string | null; // SQL番号（null許容）
}

/**
 * アプリケーションコンテキストのインターフェース
 * グローバルな状態管理に必要な型定義
 */
export interface AppContextType {
  userInfo: UserData; // ユーザー情報
  setUserInfo: (userData: UserData) => void; // ユーザー情報更新関数
  showLoading: boolean; // ローディング表示状態
  setShowLoading: (show: boolean) => void; // ローディング表示状態更新関数
}
