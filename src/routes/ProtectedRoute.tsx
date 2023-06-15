import { Navigate } from "react-router-dom";

interface Props {
  isProtected?: boolean;
  children: React.ReactElement;
}

export const ProtectedRoute = ({ children, isProtected }: Props) => {
  const token = getAccessTokenFromCookies();
  if (token) {
    localStorage.setItem("token", token || "");
    deleteAccessTokenFromCookies();
  }

  const isAuth = localStorage.getItem("token");
  if (isProtected && !isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (!isProtected && isAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function getAccessTokenFromCookies() {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const accessTokenCookie = cookies.find((cookie) =>
    cookie.startsWith("accessToken=")
  );

  if (accessTokenCookie) {
    const accessToken = accessTokenCookie.split("=")[1];
    return accessToken;
  }

  return null;
}

function deleteAccessTokenFromCookies() {
  document.cookie =
    "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
