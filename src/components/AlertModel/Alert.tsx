import { ComponentType, ReactElement } from "react";
import { createRoot } from "react-dom/client";
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
  icon?: ReactElement;
}

let root: ReturnType<typeof createRoot>;

/**
 * 顯示警報
 * @param alertData 警報數據
 */
export function showAlert(alertData: AlertModelData) {
  const onClose = () => {
    root?.unmount();
  };

  root = createRoot(AlertContainer);
  root.render(
    <AlertModel alertData={alertData} onClose={onClose} />
  );
}
