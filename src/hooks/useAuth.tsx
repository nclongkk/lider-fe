import { getStorage, removeStorage } from "../utils";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();
  const isAuth = !!getStorage("token");

  const logout = () => {
    removeStorage("token");
    navigate("/login");
  };

  return {
    isAuth,
    logout,
  };
};
