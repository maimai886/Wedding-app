import style from "./loadingModel.module.scss";
import Spinner from "react-bootstrap/Spinner";
import { useEffect, useState } from "react";

export interface LoadingModelData {
  show: boolean;
}

/**
 * 顯示加載
 * @param LoadingModel 加載數據
 */
const LoadingModel = (props: LoadingModelData) => {
  const [show, setShow] = useState<boolean>(true);
  useEffect(() => {}, [props.show]);
  return (
    <>
      {props.show && (
        <div className={style.main}>
          <div className={`${style.loadingBox} ${props.show && style.show}`}>
            <Spinner
              className={style.loadingMark}
              animation="border"
              role="status"
            />
            <span className={style.loadingText}>玩命加載中... (屮゜Д゜)屮</span>
          </div>
          <span
            className={`${style.loadingBack} ${props.show && style.show}`}
          />
        </div>
      )}
    </>
  );
};
export default LoadingModel;
