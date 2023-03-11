import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Home from "../views/Home";

//Reactのlazy loading（遅延読み込み）実装する
const Admin = lazy(() => import("../views/Admin/Admin"));

const routes = [
  {
    path: "/",
    element: <Navigate to="home" />,
  },
  {
    path: "home",
    element: <Home />,
  },
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "admin",
        element: <Admin />,
      },
    ],
  },
  {
    //例外ページ
    path: "*",
    element: <Navigate to="home" />,
  },
];
export default routes;
