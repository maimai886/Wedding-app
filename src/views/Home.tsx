import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useLocation } from "react-router";
import LoadingModel from "../components/LoadingModel/LoadingModel";
import Menu from "../components/Menu/Menu";
import { AppContext } from "../context/AppContext";
import Information from "./Information/Information";
import MyPicture from "./MyPicture/MyPicture";
import Present from "./Present/Present";
import Rank from "./Rank/Rank";
import Schedule from "./Schedule/Schedule";
import User from "./User/User";

/**
 * ホームページコンポーネント
 * アプリケーションのメインページを提供
 * @returns {JSX.Element} ホームページのUI
 */
const Home = () => {
  /**
   * 状態定義
   */
  const path = useLocation(); // 現在のパス情報を取得
  const [menuSelector, setMenuSelector] = useState<string>(""); // メニュー選択状態
  const [showHeader, setShowHeader] = useState<boolean>(true); // ヘッダー表示状態
  const [openUser, setOpenUser] = useState<boolean>(false); // ユーザー情報表示状態
  const context = useContext(AppContext); // アプリケーションコンテキスト

  /**
   * 副作用フック
   */
  // 初期化処理
  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name == null) {
      setOpenUser(true); // ユーザー名が未設定の場合はユーザー情報を表示
    }
  }, []);

  // メニュー選択に応じたヘッダー表示制御
  useEffect(() => {
    menuSelector == "rank" ? setShowHeader(false) : setShowHeader(true);
  }, [menuSelector]);

  // コンテキスト変更の監視
  useEffect(() => {}, [context]);

  return (
    <>
      {/* ローディング表示 */}
      <LoadingModel show={context.showLoading} />
      {/* メインメニュー */}
      <Menu
        handleMenu={(value: string) => setMenuSelector(value)}
        showHeader={showHeader}
        handleUser={(value: boolean) => setOpenUser(value)}
      >
        {/* 管理画面のルーティング */}
        {path.pathname == "/admin" && <Outlet />}
        {/* メニュー選択に応じたコンポーネント表示 */}
        {menuSelector == "" && <Information handleMenu={setMenuSelector} />}
        {menuSelector == "mypicture" && <MyPicture />}
        {menuSelector == "rank" && <Rank />}
        {menuSelector == "schedule" && <Schedule />}
        {menuSelector == "present" && <Present />}
        {/* ユーザー情報コンポーネント */}
        <User openUser={openUser} setOpenUser={setOpenUser} />
      </Menu>
    </>
  );
};

export default Home;
