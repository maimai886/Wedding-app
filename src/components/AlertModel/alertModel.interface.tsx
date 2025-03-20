export interface AlertModelData {
  type: string;
  message: string;
  show: boolean;
  icon?: React.ReactNode;
}

export const AlertModelDefault = {
  type: "",
  message: "",
  show: false,
};
