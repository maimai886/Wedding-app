import { useRoutes } from "react-router-dom";
import router from "./rotuer";

function App() {
  const outlet = useRoutes(router);
  return <>{outlet}</>;
}

export default App;
