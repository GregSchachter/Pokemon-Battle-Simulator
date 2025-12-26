import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import authContext from "../../context/AuthContext";
import "../Styles/Register.css";
import axios from "axios";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { authInfo, setAuthInfo } = useContext(authContext);

  const [valid, setValid] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    email: "",
    username: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const signupData = {
      email: user.email,
      username: user.username,
      password: user.password,
    };
    try {
      const res = await axios.post("http://localhost:3000/signup", signupData, {
        withCredentials: true,
      });
      setAuthInfo({
        auth: true,
        user: res.data,
      });
      navigate("/");
    } catch (error) {
      setValid(false);
      setError(error.response.data.error);
    }
  };

  return (
    <div id="regPage">
      <form id="regForm" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}></input>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={user.username}
          onChange={handleChange}></input>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}></input>
        <div className="loginRegBtns">
          <button type="submit" className="buildFormBtn" id="regBtn">
            Register
          </button>
          <button
            className="buildFormBtn"
            id="loginPageLink"
            onClick={() => {
              window.location.href = "/login";
            }}>
            Login Page
          </button>
        </div>
        <div id="loginError">{valid ? null : <p>{error}</p>}</div>
      </form>
    </div>
  );
}
