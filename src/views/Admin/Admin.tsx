import { useNavigate } from "react-router";

/**
 * 管理画面コンポーネント
 * 管理者用の機能を提供するページ
 * @returns {JSX.Element} 管理画面のUI
 */
const Admin = () => {
  /**
   * ルーティング関連の状態
   */
  const navigate = useNavigate(); // ページ遷移用のフック

  return (
    <div className="main">
      <div>Admin</div>
      {/* ホームページに戻るボタン */}
      <button onClick={() => navigate("/home")}>ホームに戻る</button>
    </div>
  );
};

export default Admin;
