import React from "react";
import EmploymentForm from "./EmploymentForm";
import "./EmploymentForm.css";

const EmploymentModal = ({ onClose, onSave, onDelete, selectedEmployment }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#2563eb",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          Add Employment
        </h2>

        {/* ✅ Pass onSave to EmploymentForm */}
        <EmploymentForm onClose={onClose} onSave={onSave} 
        onDelete={onDelete}
        selectedEmployment={selectedEmployment}
        />
      </div>
    </div>
  );
};

export default EmploymentModal;
