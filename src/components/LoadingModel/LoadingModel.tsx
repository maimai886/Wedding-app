import style from "./loadingModel.module.scss";
import Spinner from "react-bootstrap/Spinner";
import { useEffect, useState } from "react";

/**
 * ローディングモデルのインターフェース
 * 表示状態を管理
 */
export interface LoadingModelData {
  show: boolean; // 表示/非表示の状態
}

/**
 * ローディング表示コンポーネント
 * データ読み込み中に表示されるローディング画面
 * @param {LoadingModelData} props - コンポーネントのプロパティ
 * @returns {JSX.Element} ローディング画面のUI
 */
const LoadingModel = (props: LoadingModelData) => {
  const [show, setShow] = useState<boolean>(true); // 表示状態の管理

  // 表示状態の変更を監視
  useEffect(() => {}, [props.show]);

  return (
    <>
      {props.show && (
        <div className={style.main}>
          {/* ローディングボックス */}
          <div className={`${style.loadingBox} ${props.show && style.show}`}>
            {/* スピナーアニメーション */}
            <Spinner
              className={style.loadingMark}
              animation="border"
              role="status"
            />
            {/* ローディングテキスト */}
            <span className={style.loadingText}>玩命加載中... (屮゜Д゜)屮</span>
          </div>
          {/* 背景オーバーレイ */}
          <span
            className={`${style.loadingBack} ${props.show && style.show}`}
          />
        </div>
      )}
    </>
  );
};

export default LoadingModel;
