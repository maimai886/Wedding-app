import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useLocation } from "react-router-dom";
import LoadingModel from "../components/LoadingModel/LoadingModel";
import Menu from "../components/Menu/Menu";
import { AppContext } from "../context/AppContext";
import Information from "./Information/Information";
import MyPicture from "./MyPicture/MyPicture";
import Present from "./Present/Present";
import Rank from "./Rank/Rank";
import Schedule from "./Schedule/Schedule";
import User from "./User/User";

const Home = () => {
  /**
   * 状態定義
   */
  //Router
  const path = useLocation();
  //メニュー状態
  const [menuSelector, setMenuSelector] = useState<string>("");

  //Header状態
  const [showHeader, setShowHeader] = useState<boolean>(true);

  //User状態
  const [openUser, setOpenUser] = useState<boolean>(false);

  const context = useContext(AppContext);

  /**
   * 関数定義
   */

  /**
   * 監視
   */
  //初期化
  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name == null) {
      setOpenUser(true);
    }
  }, []);
  //メニュー監視
  useEffect(() => {
    menuSelector == "rank" ? setShowHeader(false) : setShowHeader(true);
  }, [menuSelector]);

  useEffect(() => {}, [context]);

  return (
    <>
      <LoadingModel show={context.showLoading} />
      <Menu
        handleMenu={(value: string) => setMenuSelector(value)}
        showHeader={showHeader}
        handleUser={(value: boolean) => setOpenUser(value)}
      >
        {path.pathname == "/admin" && <Outlet />}
        {menuSelector == "" && <Information handleMenu={setMenuSelector} />}
        {menuSelector == "mypicture" && <MyPicture />}
        {menuSelector == "rank" && <Rank />}
        {menuSelector == "schedule" && <Schedule />}
        {menuSelector == "present" && <Present />}

        <User openUser={openUser} setOpenUser={setOpenUser} />
      </Menu>
    </>
  );
};

export default Home;
