import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserTypeSelection.css";

const UserTypeSelection = () => {
  const navigate = useNavigate();
  const [showEmployeeRoles, setShowEmployeeRoles] = useState(false);

    const handleEmployeeClick = () => setShowEmployeeRoles(!showEmployeeRoles);
  return (
    <div className="user-selection-container">
      <header className="header">
        <img src="/bike.png" alt="Company Logo" className="logo" />
        <h1 className="title">Welcome to RG Portal</h1>
      </header>

      <div className="cards-container">
        <div
          className="card"
          onClick={()=>navigate("/loginemp")}
        >
          <h2>Employee</h2>
        </div>

        <div
          className="card"
          onClick={() => navigate("/login")}
        >
          <h2>Candidate</h2>
        </div>
      </div>

      {showEmployeeRoles && (
        <div className="employee-role-container">
          {["recruiter", "teamleader", "manager", "superuser"].map((role) => (
            <button
              key={role}
              className="role-btn"
              onClick={() => navigate(`/login/employee/${role}`)}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTypeSelection;
