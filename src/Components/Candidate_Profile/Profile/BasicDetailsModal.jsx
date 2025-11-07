import React, { useState } from "react";
import "./Profile.css";
import "./BasicDetailsModal.css"



const BasicDetailsModal = ({ onClose, details, onSave }) => {
  const [formData, setFormData] = useState(details);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const placeholderValues = {
  name: "e.g., Nikita Janardan Shirsath",
  designation: "e.g., Java Full Stack Developer",
  company: "e.g., 157 Industries LLP",
  location: "e.g., Pune, India",
  experience: "e.g., 0 Year 9 Months",
  salary: "e.g., ₹ 1,00,000",
  phone: "e.g., 9373824550",
  email: "e.g., nikitajshirsath252@gmail.com",
  noticePeriod: "e.g., 15 Days or less",
  linkedin: "https://www.linkedin.com/in/john-sharma-a0b712/",
};


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Personal Details</h3>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={placeholderValues.name}
            className={formData.name === "" ? "blur-placeholder" : ""}
          />

          <label>Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder={placeholderValues.designation}
            className={formData.designation === "" ? "blur-placeholder" : ""}
          />

          <label>Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder={placeholderValues.company}
            className={formData.company === "" ? "blur-placeholder" : ""}
          />

          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder={placeholderValues.location}
            className={formData.location === "" ? "blur-placeholder" : ""}
          />

          <label>Experience</label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder={placeholderValues.experience}
            className={formData.experience === "" ? "blur-placeholder" : ""}
          />

          <label>Salary</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder={placeholderValues.salary}
            className={formData.salary === "" ? "blur-placeholder" : ""}

          />

          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={placeholderValues.phone}
            className={formData.phone === "" ? "blur-placeholder" : ""}
          />

          <label>Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={placeholderValues.email}
            className={formData.email === "" ? "blur-placeholder" : ""}
          />

          <label>LinkedIn Profile</label>
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="e.g., https://www.linkedin.com/in/john-sharma/"
            className={formData.linkedin === "" ? "blur-placeholder" : ""}
          />

          <label>Notice Period</label>
          <input
            type="text"
            name="noticePeriod"
            value={formData.noticePeriod}
            onChange={handleChange}
            placeholder={placeholderValues.noticePeriod}
            className={formData.noticePeriod === "" ? "blur-placeholder" : ""}
          />

          <div className="modal-buttons">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BasicDetailsModal;
