import { useNavigate } from "react-router-dom";
const Admin = () => {
  /**
   * 状態定義
   */
  //Router
  const navigate = useNavigate();

  return (
    <div className="main">
      <div>Admin</div>
      <button onClick={() => navigate("/home")}>回使用者</button>
    </div>
  );
};

export default Admin;
