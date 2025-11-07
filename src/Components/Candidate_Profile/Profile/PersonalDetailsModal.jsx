// 📁 Components/PersonalDetailsModal.jsx
import React, { useState } from "react";
import "./PersonalDetailsModal.css";

const PersonalDetailsModal = ({ onClose, details, onSave }) => {
  const [filePreview, setFilePreview] = useState(details.documentFile || null);
  const [formData, setFormData] = useState({
  id: details.id || null,
  fullName: details.fullName || "",
  gender: details.gender || "",
  dob: details.dob || "",
  maritalStatus: details.maritalStatus || "",
  address: details.address || "",
  city: details.city || "",
  state: details.state || "",
  pincode: details.pincode || "",
  nationality: details.nationality || "",
  documentName: details.documentName || "",
  documentFile: details.documentFile || null,
});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(",")[1]; // ✅ remove prefix
        setFormData((prev) => ({
          ...prev,
          documentName: file.name,
          documentFile: base64Data, // ✅ store Base64 string
        }));
        setFilePreview(reader.result); // ✅ for preview display
      };
      reader.readAsDataURL(file);
    }
  };


  const handleDeleteFile = () => {
    setFormData((prev) => ({ ...prev, documentName: "", documentFile: null }));
    setFilePreview(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Personal Details</h2>

        <div className="form-grid">
          <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
          <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
            <option value="">Select Marital Status</option>
            <option>Single</option>
            <option>Married</option>
          </select>
          <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
          <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
          <input name="state" placeholder="State" value={formData.state} onChange={handleChange} />
          <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} />
          <input name="nationality" placeholder="Nationality" value={formData.nationality} onChange={handleChange} />
        </div>

         <div className="upload-section">
          <label>Additional Document</label>
          {filePreview ? (
            <div className="file-preview-box">
              <p>📎 {formData.documentName}</p>
              <button className="delete-doc-btn" onClick={handleDeleteFile}>
                <i className="ri-delete-bin-line"></i> Remove
              </button>
            </div>
          ) : (
            <>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                id="docUpload"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <label htmlFor="docUpload" className="upload-btn">
                <i className="ri-upload-cloud-line"></i> Upload Document
              </label>
            </>
          )}
        </div>
        
        <div className="modal-buttons">
          <button onClick={handleSubmit} className="save-btn">Save</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsModal;
