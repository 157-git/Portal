import React, { useState, useRef, useEffect } from "react";
import "./LoginPage.css";
import LoginImage from "../.././assets/candidate.png"; // replace with your logo path
import { SyncOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../API/api";
import axios from "axios";

const LoginCard = () => {

    const { userType, role } = useParams();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [captcha, setCaptcha] = useState("");
    const [userCaptcha, setUserCaptcha] = useState("");
    const [captchaError, setCaptchaError] = useState("");
    const canvasRef = useRef(null);
    const navigate = useNavigate();


    // Determine display type
    // below code not needed since we seperated login page user wise
    // let displayType = "";
    // if (userType === "candidate") {
    //     displayType = "Candidate";
    // } else if (userType === "employee") {
    //     displayType = role
    //         ? role.charAt(0).toUpperCase() + role.slice(1) // e.g., recruiter → Recruiter
    //         : "Select Role";
    // }

    // Generate random CAPTCHA
    const generateCaptcha = () => {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        setCaptcha(randomString);
        setCaptchaError("");
    };

    // Draw CAPTCHA on canvas
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

    useEffect(() => {
        generateCaptcha();
    }, []);

    useEffect(() => {
        drawCaptcha();
    }, [captcha]);

    const handleRefreshCaptcha = () => {
        generateCaptcha();
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (userCaptcha !== captcha) {
            setCaptchaError("Incorrect CAPTCHA!");
            return;
        }

        try {
            const loginResponse = await axios.post(
                `${API_BASE_URL}/user-login-157/${userType}`,
                {
                    userName: 1, // or employeeId if you have that field
                    employeePassword: password,
                    tlPassword: password,
                    managerPassword: password,
                    superUserPassword: password,
                    // candidatePassword: password, // optional for candidate
                }
            );

            console.log("Login success:", loginResponse.data);

            // Example: Save session details
            localStorage.setItem("userType", userType);
            if (role) localStorage.setItem("role", role);
            localStorage.setItem("username", username);

            // Navigate to next page (you can customize this)
            navigate(`/dashboard/${userType}${role ? `/${role}` : ""}`);

        } catch (error) {
            console.error("Login failed:", error);
            if (error.response && error.response.status === 401) {
                alert("Invalid credentials! Please try again.");
            } else {
                alert("Login failed. Please check your network or try again later.");
            }
        }
    };


    return (
        <div className="login-card">
            <div className="left-panel">
                <img src={LoginImage} alt="Logo" className="login-logo" />
            </div>
            <div className="right-panel">
                <div className="user-type">Candidate Login</div>
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
                    <div className="captcha-box">
                        <canvas
                            ref={canvasRef}
                            width="150"
                            height="40"
                            onClick={handleRefreshCaptcha}
                            className="captcha-canvas"
                        />
                        <SyncOutlined onClick={handleRefreshCaptcha} className="captcha-refresh" />
                    </div>

                    <input
                        type="text"
                        placeholder="Enter Captcha"
                        value={userCaptcha}
                        onChange={(e) => setUserCaptcha(e.target.value)}
                        className="login-input"
                        required
                    />
                    {captchaError && <p className="error">{captchaError}</p>}
                    <button className="forgot-password-btn">Forgot Password?</button>

                    <button
                        type="submit" className="login-button"
                        onClick={()=>navigate(`/navbar`)}>
                        Login
                    </button>
                </form>
                <button className="register-btn" onClick={() => navigate(`/registerCandidate`)}>
                    New User? Register
                </button>
            </div>
        </div>
    );
};

export default LoginCard;
