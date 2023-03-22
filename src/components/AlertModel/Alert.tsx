import { ComponentType } from "react";
import ReactDOM from "react-dom";
import AlertModel from "./AlertModel"; // 引入 AlertModel

const AlertContainer = document.createElement("div");
document.body.appendChild(AlertContainer);

export interface AlertModelData {
  show: boolean;
  type:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  message: string;
  icon?: JSX.Element;
}

/**
 * 顯示警報
 * @param alertData 警報數據
 */
export function showAlert(alertData: AlertModelData) {
  const onClose = () => {
    ReactDOM.unmountComponentAtNode(AlertContainer);
  };

  ReactDOM.render(
    <AlertModel alertData={alertData} onClose={onClose} />, // 修改為 AlertModel
    AlertContainer
  );
}
