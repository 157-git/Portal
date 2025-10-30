import React, { useState, useRef, useEffect } from "react";
import "./LoginPage.css";
import LoginImage from "../assets/bike.png";
import { SyncOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const LoginEmp = () => {
    const { role } = useParams(); 
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState(""); 
    const [captcha, setCaptcha] = useState("");
    const [userCaptcha, setUserCaptcha] = useState("");
    const [captchaError, setCaptchaError] = useState("");
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    // below line not needed since we seperated login page user wise
    // const displayType = role ? role.charAt(0).toUpperCase() + role.slice(1) : "Select Role";

    // CAPTCHA
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
            ctx.font = "20px 'Pacifico', cursive";
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
            // ✅ Call JobPortal backend (userType inside BODY)
            response = await axios.post(
                "http://localhost:8080/jobportal/api/loginEmployee",
                {
                    userName: username,
                    password: password,
                    userType: userType
                }
            );
        } else {
            // ✅ Call RG backend (userType inside URL PARAM)
            response = await axios.post(
                `http://192.168.1.39:9090/api/ats/157industries/user-login-157/${userType}`,
                {
                    userName: username,
                    password: password
                }
            );
        }

        // ✅ Store session info
        localStorage.setItem("username", username);
        localStorage.setItem("userType", userType);

        console.log("Login successful:", response.data);

        // ✅ Redirect
        navigate(`/dashboard/${userType}`);

    } catch (error) {
        console.error("Login failed:", error);
        alert(error.response?.data || "Login failed. Please try again.");
    }
};


    return (
        <div className="login-card">
            <div className="left-panel">
                <img src={LoginImage} alt="Logo" className="login-logo" />
            </div>
            <div className="right-panel">
                <h2 className="user-type">Employee Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="login-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                    />

                   <select
                        className="login-input"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        required
                    >
                        <option value="">Select User Type</option>
                        <option value="Recruiter">Recruiters</option>
                        <option value="TeamLeader">TeamLeader</option>
                        <option value="Manager">Manager</option>
                        <option value="SuperUser">SuperUser</option>
                        <option value="newRecruiter">New Recruiter</option>
                    </select>


                    <div className="captcha-box">
                        <canvas
                            ref={canvasRef}
                            width="150"
                            height="40"
                            onClick={generateCaptcha}
                            className="captcha-canvas"
                        />
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
                    {captchaError && <p className="error">{captchaError}</p>}

                    <button type="submit" className="login-button">Login</button>
                </form>

                <button className="register-btn" onClick={() => navigate(`/registerEmp`)}>
                    New User? Register
                </button>
            </div>
        </div>
    );
};

export default LoginEmp;
