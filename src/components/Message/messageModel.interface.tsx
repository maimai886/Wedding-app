import { ReactElement } from "react";

export interface MessageModelData {
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
  icon?: ReactElement | null;
}

export const MessageModelDefault: MessageModelData = {
  type: "primary",
  message: "",
};
