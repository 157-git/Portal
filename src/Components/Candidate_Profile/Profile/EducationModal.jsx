import React, { useState, useEffect } from "react";
import "./EducationModal.css";

const EducationModal = ({ onClose, onSave, educationData }) => {
  const [education, setEducation] = useState({
    university: "",
    course: "",
    specialization: "",
    courseType: "",
    startYear: "",
    endYear: "",
    gradingSystem: "",
    marks: "",
  });

   useEffect(() => {
    if (educationData) {
      setEducation(educationData); 
    }
  }, [educationData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEducation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(education); 
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>

      <div className="modal-content" style={{ color: "black" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#2563eb",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          Add Education
        </h2>

        <form onSubmit={handleSubmit}>
          <label>
            University/Institute:
            <input
              type="text"
              name="university"
              value={education.university}
              onChange={handleChange}
              placeholder="Enter university/institute"
            />
          </label>

          <label>
            Course:
            <select name="course" value={education.course} onChange={handleChange}>
              <option value="">Select course</option>
              <option value="B.Tech">B.Tech</option>
              <option value="MBA">MBA</option>
              <option value="B.Sc">B.Sc</option>
            </select>
          </label>

          <label>
            Specialization:
            <select
              name="specialization"
              value={education.specialization}
              onChange={handleChange}
            >
              <option value="">Select specialization</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Finance">Finance</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </label>

          <label>
            Course Type:
            <input
              type="text"
              name="courseType"
              value={education.courseType}
              onChange={handleChange}
              placeholder="Full-time / Part-time"
            />
          </label>

          <label>
            Starting Year:
            <input
              type="number"
              name="startYear"
              value={education.startYear}
              onChange={handleChange}
              placeholder="YYYY"
            />
          </label>

          <label>
            Ending Year:
            <input
              type="number"
              name="endYear"
              value={education.endYear}
              onChange={handleChange}
              placeholder="YYYY"
            />
          </label>

          <label>
            Grading System:
            <select
              name="gradingSystem"
              value={education.gradingSystem}
              onChange={handleChange}
            >
              <option value="">Select grading system</option>
              <option value="Percentage">Percentage</option>
              <option value="CGPA">CGPA</option>
            </select>
          </label>

          <label>
            Marks:
            <input
              type="number"
              name="marks"
              value={education.marks}
              onChange={handleChange}
              placeholder="eg. 90% / 9.00"
            />
          </label>
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EducationModal;
