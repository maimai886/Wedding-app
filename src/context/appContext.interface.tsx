export interface UserData {
  userName: string | null;
  sqlNo: string | null;
}

export interface AppContextType {
  userInfo: UserData;
  setUserInfo: (userData: UserData) => void;
  showLoading: boolean;
  setShowLoading: (show: boolean) => void;
}
