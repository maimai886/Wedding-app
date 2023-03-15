import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useLocation } from "react-router-dom";
import Menu from "../components/Menu/Menu";
import Information from "./Information/Information";
import MyPicture from "./MyPicture/MyPicture";
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

  /**
   * 関数定義
   */

  /**
   * 監視
   */
  //メニュー監視
  useEffect(() => {
    menuSelector == "mypicture" ? setShowHeader(false) : setShowHeader(true);
  }, [menuSelector]);

  return (
    <Menu
      handleMenu={(value: string) => setMenuSelector(value)}
      showHeader={showHeader}
    >
      {path.pathname == "/admin" && <Outlet />}
      {menuSelector == "" && <Information handleMenu={setMenuSelector} />}
      {menuSelector == "mypicture" && <MyPicture />}
      {menuSelector == "schedule" && <Schedule />}
      {menuSelector == "user" && <User />}
    </Menu>
  );
};

export default Home;
