import { lazy } from "react"; // 遅延ロード用のReact機能
import { createBrowserRouter, Navigate } from "react-router"; // ルーター関連のコンポーネント
import Home from "../views/Home"; // ホームページコンポーネント

// 管理画面コンポーネントの遅延ロード
const Admin = lazy(() => import("../views/Admin/Admin"));

/**
 * ルーター設定の作成
 * 以下のルートを定義：
 * - /: ホームページにリダイレクト
 * - /home: ホームページ
 * - /admin: 管理画面（子ルート）
 * - その他: ホームページにリダイレクト
 */
const router = createBrowserRouter([
  {
    path: "/", // ルートパス
    element: <Navigate to="home" />, // ホームページにリダイレクト
  },
  {
    path: "home", // ホームページパス
    element: <Home />, // ホームページコンポーネント
  },
  {
    path: "/", // 親ルート
    element: <Home />, // 親コンポーネント
    children: [ // 子ルート
      {
        path: "admin", // 管理画面パス
        element: <Admin />, // 管理画面コンポーネント
      },
    ],
  },
  {
    path: "*", // ワイルドカードパス
    element: <Navigate to="home" />, // ホームページにリダイレクト
  },
]);

export default router;
