import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // メインアプリケーションコンポーネント
import reportWebVitals from "./reportWebVitals"; // パフォーマンス測定ツール
// CSSの初期化（最優先で読み込む）
import "reset-css";
// グローバルCSS
import "./assets/styles/global.scss"; // グローバルスタイルシート
import { AppContextProvider } from "./context/AppContext"; // アプリケーションコンテキストプロバイダー

// ルートエレメントを作成
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// アプリケーションをレンダリング
root.render(
    <AppContextProvider>
      <App />
    </AppContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
