export interface AlertModelData {
  type: string;
  message: string;
  show: boolean;
  icon?: JSX.Element;
}

export const AlertModelDefault = {
  type: "",
  message: "",
  show: false,
};
