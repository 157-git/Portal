import React, { useState, useEffect } from "react";
import "./CertificationModal.css";

const CertificationModal = ({ onClose, onSave, certificationData }) => {
  const [certification, setCertification] = useState({
    id: null, // ✅ add id to state
    name: "",
    month: "",
    year: "",
    doesNotExpire: false,
  });

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 40 }, (_, i) => 2025 - i);

  // ✅ Prefill data when editing
  useEffect(() => {
    if (certificationData) {
      setCertification(certificationData);
    }
  }, [certificationData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCertification((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!certification.name.trim()) {
      alert("Certification name is required!");
      return;
    }
    onSave(certification); // ✅ Pass complete data including id
  };

  return (
    <div className="modal-overlay">
      <div className="cert-modal">
        <div className="modal-header">
          <h3>{certification.id ? "Edit Certification" : "Add Certification"}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <label>Certification Name<span className="required">*</span></label>
          <input
            type="text"
            name="name"
            value={certification.name}
            onChange={handleChange}
            placeholder="e.g., AWS Certified Developer"
          />

          <label>Expiration Date</label>
          <div className="expiration-row">
            <select
              name="month"
              value={certification.month}
              onChange={handleChange}
              disabled={certification.doesNotExpire}
            >
              <option value="">Month</option>
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select
              name="year"
              value={certification.year}
              onChange={handleChange}
              disabled={certification.doesNotExpire}
            >
              <option value="">Year</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="checkbox-row">
            <input
              type="checkbox"
              name="doesNotExpire"
              checked={certification.doesNotExpire}
              onChange={handleChange}
            />
            <label>Does not expire</label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default CertificationModal;
