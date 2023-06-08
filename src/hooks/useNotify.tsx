import { notification } from "antd";
export interface INotify {
  type: "success" | "error" | "info" | "warning";
  message: string;
  description?: string;
  ttl?: number;
}

// a custom hook to show notification with antd
export const useNotify = ({ type, message, description, ttl }: INotify) => {
  return () => {
    notification[type]({
      message,
      description,
      duration: ttl,
    });
  };
};
