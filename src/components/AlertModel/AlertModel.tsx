import style from "./alertModel.module.scss";
import Alert from "react-bootstrap/Alert";
import { useEffect, useState } from "react";
import { AlertModelData } from "./alertModel.interface";

interface AlertModelProps {
  alertData: AlertModelData;
  onClose: () => void;
}

const AlertModel = (props: AlertModelProps) => {
  const [showAlert, setShowAlert] = useState<boolean>(true);

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
          <span className={style.iconStyle}>{props.alertData.icon}</span>
          {props.alertData.message}
        </Alert>
      )}
    </div>
  );
};

export default AlertModel;
