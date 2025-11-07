import React, { useState, useEffect } from "react";
import "./ProjectModal.css";

const ProjectModal = ({ onClose, onSave, projectData }) => {
  const [formData, setFormData] = useState({
    title: "",
    tag: "",
    client: "",
    status: "",
    year: "",
    month: "",
    details: "",
  });

    useEffect(() => {
    if (projectData) {
      setFormData(projectData); // ✅ prefill existing project data
    }
  }, [projectData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // ✅ send data to parent
    onClose();
  };

  return (
    <div className="overlay">
      <div className="modal-box" style={{ color: "black" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#2563eb",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          Add Project
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter project title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Tag this project with your employment/education</label>
            <select name="tag" value={formData.tag} onChange={handleChange}>
              <option value="">Select employment/education</option>
              <option value="Internship">Internship</option>
              <option value="College">College</option>
              <option value="Work">Work</option>
            </select>
          </div>

          <div className="form-group">
            <label>Client</label>
            <input
              type="text"
              name="client"
              placeholder="Enter client name"
              value={formData.client}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Project Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="">Select status</option>
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Paused">Paused</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Worked from (Year)</label>
              <select name="year" value={formData.year} onChange={handleChange}>
                <option value="">Select year</option>
                {[2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Month</label>
              <select name="month" value={formData.month} onChange={handleChange}>
                <option value="">Select month</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Details of Project</label>
            <textarea
              name="details"
              placeholder="Type here..."
              value={formData.details}
              onChange={handleChange}
              maxLength="1000"
            />
            <div className="char-limit">
              {1000 - formData.details.length} character(s) left
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
