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
  icon?: JSX.Element | null;
}

export const MessageModelDefault: MessageModelData = {
  type: "primary",
  message: "",
};
