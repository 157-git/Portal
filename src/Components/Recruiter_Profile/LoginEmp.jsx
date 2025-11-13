import React, { useState, useRef, useEffect } from "react";
import "./LoginEmp.css";
import LoginImage from "../.././assets/recruiter.png";
import { SyncOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons"; // 👈 Added icons
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const LoginEmp = () => {
  const { role } = useParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 Added for toggle
  const [userType, setUserType] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCaptcha(randomString);
    setCaptchaError("");
  };

  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#d9d9d9";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "20px 'Poppins', sans-serif";
      ctx.fillStyle = "#000";
      const textWidth = ctx.measureText(captcha).width;
      ctx.fillText(captcha, (canvas.width - textWidth) / 2, canvas.height / 2 + 7);
    }
  };

  useEffect(() => { generateCaptcha(); }, []);
  useEffect(() => { drawCaptcha(); }, [captcha]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (userCaptcha !== captcha) {
      setCaptchaError("Incorrect CAPTCHA!");
      return;
    }

    if (!userType) {
      alert("Please select a user type!");
      return;
    }

    try {
      let response;
      if (userType === "newRecruiter") {
        response = await axios.post("http://localhost:8080/jobportal/api/loginEmployee", {
          userName: username,
          password,
          userType
        });
      } else {
        response = await axios.post(
          `http://192.168.1.39:9090/api/ats/157industries/user-login-157/${userType}`,
          { userName: username, password }
        );
      }

      localStorage.setItem("username", username);
      localStorage.setItem("userType", userType);
      navigate(`/recruiter-navbar/${userType}`);
    } catch (error) {
      alert(error.response?.data || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card modern-card">
        <div className="login-left">
          <img src={LoginImage} alt="Logo" className="login-logo" />
        </div>
        <div className="login-right">
          <div className="login-title">Employee Login</div>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              required
            />

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input password-input"
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </span>
            </div>

            <select
              className="login-input"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
            >
              <option value="">Select User Type</option>
              <option value="Recruiter">Recruiter</option>
              <option value="TeamLeader">Team Leader</option>
              <option value="Manager">Manager</option>
              <option value="SuperUser">Super User</option>
              <option value="newRecruiter">New Recruiter</option>
            </select>

            <div className="captcha-container">
              <canvas ref={canvasRef} width="150" height="40" className="captcha-canvas" />
              <SyncOutlined onClick={generateCaptcha} className="captcha-refresh" />
            </div>

            <input
              type="text"
              placeholder="Enter CAPTCHA"
              value={userCaptcha}
              onChange={(e) => setUserCaptcha(e.target.value)}
              className="login-input"
              required
            />
            {captchaError && <p className="error-text">{captchaError}</p>}

            <button type="submit" className="login-button">Login</button>
          </form>

          <button className="register-link" onClick={() => navigate(`/registerEmp`)}>
            New User? Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginEmp;
