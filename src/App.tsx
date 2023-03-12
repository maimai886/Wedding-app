import { useRoutes } from "react-router-dom";
import router from "./rotuer";
import "./App.scss";
import "swiper/css/bundle";

function App() {
  const outlet = useRoutes(router);
  return <>{outlet}</>;
}

export default App;
