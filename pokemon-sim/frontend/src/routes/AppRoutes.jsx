import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";

import authContext from "../../context/AuthContext";

import HomePage from "../Pages/HomePage";
import TeamPage from "../Pages/TeamPage";
import BattlePage from "../Pages/BattlePage";
import TeamBuildPage from "../Pages/TeamBuildPage";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import axios from "axios";
import { useContext } from "react";
import ProtectRoute from "./ProtectRoute";
import PublicRoutes from "./PublicRoutes";
import TeamEditPage from "../Pages/TeamEditPage";

export default function AppRoutes() {
  const { authInfo, setAuthInfo } = useContext(authContext);

  const handleClick = async () => {
    const res = await axios.get("http://localhost:3000/logout", {
      withCredentials: true,
    });
    setAuthInfo({
      auth: false,
      user: null,
    });
  };

  if (authInfo.auth === null) return null;
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        {authInfo.auth ? <Link to="/team">Team Builder</Link> : null}
        {authInfo.auth ? <Link to="/battle">Battle!</Link> : null}
        {!authInfo.auth ? <Link to="/login">Login</Link> : null}
        {!authInfo.auth ? <Link to="/register">Register</Link> : null}
        {authInfo.auth ? (
          <button id="logoutBtn" onClick={handleClick}>
            Logout
          </button>
        ) : null}
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<ProtectRoute />}>
          <Route path="/team" element={<TeamPage />} />
          <Route path="/build" element={<TeamBuildPage />} />
          <Route path="/edit" element={<TeamEditPage />} />
          <Route path="/battle" element={<BattlePage />} />
        </Route>
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
