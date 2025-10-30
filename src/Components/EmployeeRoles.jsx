import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserTypeSelection.css";

const EmployeeRoles = () => {
  const navigate = useNavigate();
  const roles = ["recruiter", "teamleader", "manager", "superuser"];

  return (
    <div className="user-selection-container">
      <header className="header">
        <img src="/bike.png" alt="Company Logo" className="logo" />
        <h1 className="title">Select Employee Role</h1>
      </header>

      <div className="cards-container">
        {roles.map((role) => (
          <div
            key={role}
            className="card"
            onClick={() => navigate(`/login/employee/${role}`)}
          >
            <h2>{role.charAt(0).toUpperCase() + role.slice(1)}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeRoles;
