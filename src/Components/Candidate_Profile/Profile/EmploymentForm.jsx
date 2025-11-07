import React, { useState,  useEffect } from "react";


export default function EmploymentForm({ onClose,onSave, onDelete, selectedEmployment }) {
  const [isCurrent, setIsCurrent] = useState(true);
  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [joiningYear, setJoiningYear] = useState("");
  const [joiningMonth, setJoiningMonth] = useState("");
  
  const maxProfileChars = 4000;

  // ✅ Single source of truth for all form fields
  const [employmentData, setEmploymentData] = useState({
    isCurrent: true,
    employmentType: "",
    years: 0,
    months: 0,
    company: "",
    title: "",
    joiningYear: "",
    joiningMonth: "",
    salary: "",
    skills: [],
    skillInput: "",
    profile: "",
    noticePeriod: "",
  });

  // ✅ Load data when editing
  useEffect(() => {
    if (selectedEmployment) {
      setEmploymentData((prev) => ({
        ...prev,
        ...selectedEmployment,
      }));
    }
  }, [selectedEmployment]);

  // ✅ General input handler
  const handleChange = (key, value) => {
    setEmploymentData((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Add skill
  const addSkill = () => {
    const val = employmentData.skillInput.trim();
    if (!val || employmentData.skills.includes(val)) return;
    setEmploymentData((prev) => ({
      ...prev,
      skills: [...prev.skills, val],
      skillInput: "",
    }));
  };

  // ✅ Remove skill
  const removeSkill = (idx) => {
    setEmploymentData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== idx),
    }));
  };

  // ✅ Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedData = {
      ...employmentData,
      joiningDate: `${employmentData.joiningMonth} ${employmentData.joiningYear}`,
      experience: `${employmentData.years} Year${employmentData.years > 1 ? "s" : ""} ${employmentData.months} Month${employmentData.months > 1 ? "s" : ""}`,
    };

    if (onSave) onSave(formattedData, selectedEmployment?.id || null);
  };

  return (
    <form className="employment-form" onSubmit={handleSubmit} style={{ color: "black" }}>
      <h3>{selectedEmployment ? "Edit Employment" : "Add Employment"}</h3>

      {/* ✅ Current Employment */}
      <div className="form-group">
        <label>Current Employment?</label>
        <div className="radio-row">
          <label>
            <input
              type="radio"
              checked={employmentData.isCurrent === true}
              onChange={() => handleChange("isCurrent", true)}
            />{" "}
            Yes
          </label>
          <label>
            <input
              type="radio"
              checked={employmentData.isCurrent === false}
              onChange={() => handleChange("isCurrent", false)}
            />{" "}
            No
          </label>
        </div>
      </div>

      {/* ✅ Employment Type */}
      <div className="form-group">
        <label>Employment Type</label>
        <select
          value={employmentData.employmentType}
          onChange={(e) => handleChange("employmentType", e.target.value)}
        >
          <option value="">Select</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
          <option value="freelance">Freelance</option>
        </select>
      </div>

      {/* ✅ Total Experience */}
      <div className="form-group">
        <label>Total Experience</label>
        <div className="exp-row">
          <select
            value={employmentData.years}
            onChange={(e) => handleChange("years", Number(e.target.value))}
          >
            {Array.from({ length: 31 }).map((_, i) => (
              <option key={i} value={i}>
                {i} Year{i > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <select
            value={employmentData.months}
            onChange={(e) => handleChange("months", Number(e.target.value))}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i}>
                {i} Month{i > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ✅ Company Name */}
      <div className="form-group">
        <label>Company Name</label>
        <input
          type="text"
          value={employmentData.company}
          onChange={(e) => handleChange("company", e.target.value)}
          placeholder="Type your organization"
        />
      </div>

      {/* ✅ Job Title */}
      <div className="form-group">
        <label>Job Title</label>
        <input
          type="text"
          value={employmentData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Type your designation"
        />
      </div>

      {/* ✅ Joining Date */}
      <div className="form-group">
        <label>Joining Date</label>
        <div className="exp-row">
          <select
            value={employmentData.joiningYear}
            onChange={(e) => handleChange("joiningYear", e.target.value)}
          >
            <option value="">Year</option>
            {Array.from({ length: 30 }).map((_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
          <select
            value={employmentData.joiningMonth}
            onChange={(e) => handleChange("joiningMonth", e.target.value)}
          >
            <option value="">Month</option>
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

      {/* ✅ Salary */}
      <div className="form-group">
        <label>Salary (₹)</label>
        <input
          type="number"
          value={employmentData.salary}
          onChange={(e) => handleChange("salary", e.target.value)}
        />
      </div>

      {/* ✅ Skills */}
      <div className="form-group">
        <label>Skills Used</label>
        <div className="skills-row">
          <input
            type="text"
            value={employmentData.skillInput}
            onChange={(e) => handleChange("skillInput", e.target.value)}
            placeholder="Add skill"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
          />
          <button type="button" onClick={addSkill}>
            Add
          </button>
        </div>
        <div className="chips">
          {employmentData.skills.map((s, i) => (
            <div className="chip" key={i}>
              {s}{" "}
              <button type="button" onClick={() => removeSkill(i)}>
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Job Profile */}
      <div className="form-group">
        <label>Job Profile</label>
        <textarea
          value={employmentData.profile}
          onChange={(e) => handleChange("profile", e.target.value)}
          maxLength={maxProfileChars}
          placeholder="Describe your responsibilities..."
        />
        <small>{maxProfileChars - employmentData.profile.length} characters left</small>
      </div>

      {/* ✅ Notice Period */}
      <div className="form-group">
        <label>Notice Period</label>
        <select
          value={employmentData.noticePeriod}
          onChange={(e) => handleChange("noticePeriod", e.target.value)}
        >
          <option value="">Select</option>
          <option value="immediate">Immediate</option>
          <option value="7days">7 Days</option>
          <option value="15days">15 Days</option>
          <option value="30days">30 Days</option>
          <option value="60days">60 Days</option>
        </select>
      </div>

      {/* ✅ Actions */}
      <div className="form-actions">
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        {selectedEmployment && (
          <button
            type="button"
            className="delete-btn"
            style={{ background: "red", color: "white" }}
            onClick={() => onDelete(selectedEmployment.id)}
          >
            Delete
          </button>
        )}
        <button type="submit">{selectedEmployment ? "Update" : "Save"}</button>
      </div>
    </form>
  );
}