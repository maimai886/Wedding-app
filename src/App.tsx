import React from 'react';
import { RouterProvider } from 'react-router'; // ルーターのプロバイダー
import "./App.scss"; // アプリケーションのスタイル
import router from './rotuer'; // ルーター設定

/**
 * アプリケーションのメインコンポーネント
 * @returns {JSX.Element} ルーターを提供するルート要素
 */
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
