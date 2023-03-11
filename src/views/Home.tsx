import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useLocation } from "react-router-dom";
import Menu from "../components/Menu/Menu";
import Information from "./Information/Information";
import MyPicture from "./MyPicture/MyPicture";
import User from "./User/User";

const Home = () => {
  /**
   * 状態定義
   */
  //Router
  const path = useLocation();
  //メニュー状態
  const [menuSelector, setMenuSelector] = useState<string>("");

  /**
   * 関数定義
   */

  /**
   * 監視
   */
  useEffect(() => {
    console.log("t", path.pathname);
  }, []);
  return (
    <Menu handleMenu={(value: string) => setMenuSelector(value)}>
      {path.pathname == "/admin" && <Outlet />}
      {menuSelector == "" && <Information />}
      {menuSelector == "mypicture" && <MyPicture />}
      {menuSelector == "user" && <User />}
    </Menu>
  );
};

export default Home;
