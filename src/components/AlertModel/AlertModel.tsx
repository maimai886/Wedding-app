import style from "./alertModel.module.scss";
import { ReactComponent as Error } from "../../assets/svgs/errorMark.svg";
import { ReactComponent as Check } from "../../assets/svgs/checkMark.svg";
import Alert from "react-bootstrap/Alert";
import { useEffect, useState } from "react";
import { AlertModelData } from "./alertModel.interface";

interface AlertModelProps {
  alertData: AlertModelData;
  onClose: () => void;
}

const AlertModel = (props: AlertModelProps) => {
  /**
   * 状態定義
   */
  const [showAlert, setShowAlert] = useState<boolean>(true);

  /**
   * 監視定義
   */
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
        props.onClose(); // 增加關閉方法的調用
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert, props]);

  return (
    <div className={style.main}>
      {props.alertData.show && (
        <Alert
          variant={props.alertData.type}
          onClose={props.onClose}
          className={style.alertStyle}
        >
          <span className={style.iconStyle}>
            {props.alertData.icon
              ? props.alertData.icon
              : (props.alertData.type == "error" && <Error />,
                props.alertData.type == "success" && <Check />)}
          </span>
          {props.alertData.message}
        </Alert>
      )}
    </div>
  );
};

export default AlertModel;
