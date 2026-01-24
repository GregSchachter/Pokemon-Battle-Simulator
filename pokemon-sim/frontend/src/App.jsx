import AppRoutes from "./routes/AppRoutes";

import "./App.css";
import { useState } from "react";
import authContext from "../context/AuthContext.js";
import { useEffect } from "react";
import axios from "axios";

function App() {
  const [authInfo, setAuthInfo] = useState({
    auth: null,
    user: null,
  });

  const url = import.meta.env.VITE_URL;
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${url}/me`, {
          withCredentials: true,
        });
        setAuthInfo({
          auth: res.data.auth,
          user: res.data.user || null,
        });
      } catch (error) {
        setAuthInfo({
          auth: false,
          user: null,
        });
      }
    };

    checkAuth();
  }, []);
  const contextValue = { authInfo, setAuthInfo };

  return (
    <authContext.Provider value={contextValue}>
      <AppRoutes />
    </authContext.Provider>
  );
}

export default App;
