import React, { useState } from "react";
import axios from "axios";
import "./RegisterPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterEmp = () => {

   const [formData, setFormData] = useState({
      employeeName: "",
      userName: "",
      employeePassword: "",
      employeeEmail: "",
      officialContactNumber: "",
      userType: "",
    });
  
    const [showPassword, setShowPassword] = useState(false); // 👁️ toggle state
  
    // handle input change
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/jobportal/api/addEmployee",
        formData
      );

      toast.success(response.data || "Employee registered successfully!");

      // clear form after success
      setFormData({
        employeeName: "",
        userName: "",
        employeePassword: "",
        employeeEmail: "",
        officialContactNumber: "",
        userType: "",
      });
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data || "Registration failed!");
      } else {
        toast.error("Server error. Please try again.");
      }
    }
  };
  return (
    <div className="register-page">
      <div className="register-container">
        {/* LEFT INFO SIDE */}
        <div className="register-info">
          <h2>
            Join <span className="highlight">RG Job Portal</span>
          </h2>
          <ul>
            <li>Build your profile and get noticed by recruiters</li>
            <li>Receive personalized job recommendations</li>
            <li>Apply to top companies instantly</li>
          </ul>
          <p>Your dream job is just a click away 🚀</p>
        </div>

        {/* RIGHT FORM SIDE */}
        <div className="register-form-side" >
          <h2>Create your RG Profile</h2>

          <form className="register-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="employeeName"
                placeholder="Employee Name"
                value={formData.employeeName}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="userName"
                placeholder="Username"
                value={formData.userName}
                onChange={handleChange}
                required
              />

              {/* 👁️ Password Field with Eye Icon */}
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="employeePassword"
                  value={formData.employeePassword}
                  onChange={handleChange}
                  placeholder="Password (min 6 characters)"
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <input
                type="email"
                name="employeeEmail"
                placeholder="Email ID"
                value={formData.employeeEmail}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="officialContactNumber"
                placeholder="Mobile Number"
                value={formData.officialContactNumber}
                onChange={handleChange}
                required
              />

              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                required
              >
                <option value="">Select UserType</option>
                <option value="newRecruiter">New Recruiter</option>
              </select>

              <button type="submit" className="btn-register">
                Register
              </button>
          </form>


          <p className="login-link">
            Already registered?{" "}
            <a href="/loginEmp">Login here</a>
          </p>

          <button type="button" className="btn-google">
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
            />
            Continue with Google
          </button>
        </div>
      </div>
      {/* Toast Container */}
            <ToastContainer
           
              position="top-center"
              autoClose={2500}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              pauseOnHover={false}
              draggable
            
            />
    </div>
  );
};

export default RegisterEmp;
