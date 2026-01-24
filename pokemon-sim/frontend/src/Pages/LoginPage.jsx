import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authContext from "../../context/AuthContext";
import "../Styles/Login.css";
import axios from "axios";
import { useContext } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { authInfo, setAuthInfo } = useContext(authContext);

  const [valid, setValid] = useState(true);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setValid(true);
    const { name, value } = e.target;

    setUser((u) => ({
      ...u,
      [name]: value,
    }));
  };

  const url = import.meta.env.VITE_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = {
      email: user.email,
      password: user.password,
    };
    try {
      const res = await axios.post(`${url}/login`, loginData, {
        withCredentials: true,
        timeout: 120000,
      });
      setAuthInfo({
        auth: true,
        user: res.data,
      });
      navigate("/");
    } catch (error) {
      setValid(false);
    }
  };

  return (
    <div id="loginPage">
      <form id="loginForm" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}></input>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}></input>
        <div className="loginRegBtns">
          <button type="submit" className="buildFormBtn" id="loginBtn">
            Login
          </button>
          <button
            className="buildFormBtn"
            id="registerPageLink"
            onClick={() => {
              navigate("/register");
            }}>
            Register Page
          </button>
        </div>
        <div id="loginError">
          {valid ? null : <p>Incorrect Username or Password</p>}
        </div>
      </form>
    </div>
  );
}
