import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
//CSS 初期化のため　一番の上に書く
import "reset-css";
//gobal CSS
import "./assets/styles/global.scss";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>
);
