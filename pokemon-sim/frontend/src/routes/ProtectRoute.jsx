import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import authContext from "../../context/AuthContext";

export default function ProtectRoute({ route }) {
  const { authInfo, setAuthInfo } = useContext(authContext);
  if (authInfo.auth === null) return null;

  return authInfo.auth ? <Outlet /> : <Navigate to="/login" replace />;
}
