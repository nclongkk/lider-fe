import { Navigate } from "react-router-dom";

interface Props {
  isProtected?: boolean;
  children: React.ReactElement;
}

export const ProtectedRoute = ({ children, isProtected }: Props) => {
  const isAuth = localStorage.getItem("token");
  if (isProtected && !isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (!isProtected && isAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
};
