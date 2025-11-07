import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const KeySkillsSection = () => {
  const [skills, setSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const API_BASE_URL = "http://localhost:8080/api/profile";

  const suggestedSkills = [
    "Java", "Spring Boot", "Hibernate", "React.js", "Angular", "Node.js",
    "MySQL", "Postman", "CSS", "HTML", "Bootstrap", "JQuery",
    "Python", "Spring MVC", "Maven", "Git", "AWS", "Express.js",
    "MongoDB", "Docker", "Kubernetes", "JDBC", "Eclipse", "IntelliJ IDEA"
  ];

  // ✅ Fetch all key skills from backend
  const fetchAllSkills = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/allKeySkills`);
      if (Array.isArray(res.data)) {
        setSkills(res.data.map((s) => s.skillName)); // only store skill names
      }
    } catch (err) {
      console.error("❌ Failed to fetch skills:", err.message);
    }
  };

  useEffect(() => {
    fetchAllSkills();
  }, []);

  // ✅ Add new skill
  const handleAddSkill = async (skill) => {
    if (!skill || skills.includes(skill)) return;
    try {
      await axios.post(`${API_BASE_URL}/createKeySkill`, { skillName: skill });
      setInputValue("");
      setShowSuggestions(false);
      fetchAllSkills(); // refresh
    } catch (err) {
      alert("❌ Error adding skill: " + err.message);
    }
  };

  // ✅ Delete skill
 const handleRemoveSkill = async (skillToRemove) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/allKeySkills`);
    const skill = res.data.find((s) => s.skillName === skillToRemove);
    if (skill) {
      await axios.delete(`${API_BASE_URL}/deleteKeySkills/${skill.id}`);
    }
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  } catch (err) {
    console.error("❌ Error deleting skill:", err.message);
  }
};



  // ✅ Handle suggestion filtering
  const filteredSuggestions = suggestedSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(inputValue.toLowerCase()) &&
      !skills.includes(skill)
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleAddSkill(inputValue.trim());
    }
  };

  return (
    <div className="keyskills-container">
      <div className="skills-input-box">
        <input
          type="text"
          className="skills-input"
          placeholder="Enter your skills (e.g., Java, React, Spring Boot)"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
        />

        {/* 🔽 Suggestions dropdown */}
        {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
          <ul className="suggestions-list">
            {filteredSuggestions.map((skill, index) => (
              <li
                key={index}
                onClick={() => handleAddSkill(skill)}
                className="suggestion-item"
              >
                {skill}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🏷️ Display added skills */}
      <div className="added-skills">
        {skills.map((skill, index) => (
          <div key={index} className="skill-chip">
            {skill}
            <span
              className="remove-skill"
              onClick={() => handleRemoveSkill(skill)}
            >
              ✕
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeySkillsSection;
