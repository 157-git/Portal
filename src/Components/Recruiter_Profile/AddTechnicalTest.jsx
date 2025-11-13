// Samruddhi Patole 29/10/25

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddTechnicalTest.css";
import { API_BASE_PORTAL } from "../../API/api";

const AddTechnicalTest = () => {
  const navigate = useNavigate();

  const [jobRoles, setJobRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [mcqs, setMcqs] = useState([]);
  const [loadingMCQs, setLoadingMCQs] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  // ✅ Fetch job roles from /api/requirements/all
  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        const response = await fetch(`${API_BASE_PORTAL}/getAllRequirements`);
        const data = await response.json();
        const uniqueRoles = [
          ...new Set(
            (data || []).map((jd) => jd.jobRole).filter((r) => r && r.trim() !== "")
          ),
        ];
        setJobRoles(uniqueRoles);
      } catch (error) {
        console.error("❌ Error fetching job roles:", error);
      }
    };
    fetchJobRoles();
  }, []);

  // ✅ Fetch MCQs for selected role from /api/mcq/role/{roleName}
  useEffect(() => {
    const fetchMCQs = async () => {
      if (!selectedRole) return;
      setLoadingMCQs(true);
      try {
        const res = await fetch(
          `${API_BASE_PORTAL}/role/${encodeURIComponent(selectedRole)}`
        );
        if (res.ok) {
          const data = await res.json();
          setMcqs(data?.questions || []);
        } else if (res.status === 404) {
          setMcqs([]);
        } else {
          console.error("❌ Failed to fetch MCQs:", res.statusText);
          setMcqs([]);
        }
      } catch (err) {
        console.error("❌ Error loading MCQs:", err);
        setMcqs([]);
      } finally {
        setLoadingMCQs(false);
      }
    };
    fetchMCQs();
  }, [selectedRole]);

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
    setMcqs([]);
    setIsAdding(false);
  };

  // ✅ Add new MCQ for selected role (append if exists)
  const handleAddQuestion = async () => {
    if (!newQuestion.question.trim()) return alert("Please enter a question!");
    const filledOptions = newQuestion.options.filter((o) => o.trim() !== "");
    if (filledOptions.length < 2) return alert("Enter at least 2 options!");

    const newQ = {
      question: newQuestion.question,
      options: filledOptions,
      correctAnswer: newQuestion.correctAnswer || "",
    };

    try {
      // 1️⃣ Fetch existing MCQs (if any)
      const existingRes = await fetch(
        `${API_BASE_PORTAL}/role/${encodeURIComponent(selectedRole)}`
      );

      let roleData = { roleName: selectedRole, questions: [newQ] };

      if (existingRes.ok) {
        const existing = await existingRes.json();
        roleData.questions = [...(existing.questions || []), newQ];
      }

      // 2️⃣ Save merged role data
      const saveRes = await fetch(`${API_BASE_PORTAL}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roleData),
      });

      if (saveRes.ok) {
        const saved = await saveRes.json();
        setMcqs(saved.questions || []);
        setNewQuestion({ question: "", options: ["", "", "", ""], correctAnswer: "" });
        setIsAdding(false);
        alert("✅ Question added successfully!");
      } else {
        alert("❌ Failed to save question!");
      }
    } catch (err) {
      console.error("❌ Error saving question:", err);
      alert("Error connecting to backend!");
    }
  };

  // 🗑️ Delete selected question
  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    try {
      const res = await fetch(
        `${API_BASE_PORTAL}/role/${encodeURIComponent(selectedRole)}/question/${questionId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        const updated = await res.json();
        setMcqs(updated.questions || []);
        alert("🗑 Question deleted successfully!");
      } else {
        alert("❌ Failed to delete question!");
      }
    } catch (err) {
      console.error("❌ Error deleting question:", err);
      alert("Error connecting to backend!");
    }
  };

  const handleBack = () => navigate(`/recruiter-navbar/${userType}`);

  return (
    <div className="techTest-container">
      <button className="nonTechTest-back-btn" onClick={handleBack}>
        ← Back
      </button>

      <h2 className="techTest-title">Technical Test</h2>
      <p className="techTest-desc">Select a job role to manage its MCQ questions:</p>

      {/* ✅ Roles Grid */}
      {jobRoles.length > 0 ? (
        <div className="techTest-grid">
          {jobRoles.map((role, i) => (
            <div
              key={i}
              className={`techTest-card ${selectedRole === role ? "selected" : ""}`}
              onClick={() => handleRoleClick(role)}
            >
              {role}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "gray" }}>No job roles found. Please add a Job Description first.</p>
      )}

      {/* ✅ Modal for managing MCQs */}
      {isModalOpen && (
        <div className="mcq-modal-overlay">
          <div className="mcq-modal">
            <button className="mcq-close-btn" onClick={handleCloseModal}>
              X
            </button>
            <h3 style={{ textAlign: "center", marginBottom: 10 }}>
              {selectedRole} — Manage MCQs
            </h3>

            {/* ➕ Add Button */}
            {!isAdding && (
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <button
                  className="add-question-btn"
                  onClick={() => setIsAdding(true)}
                  style={{ fontSize: 16, padding: "8px 20px" }}
                >
                  ➕ Add MCQ Question
                </button>
              </div>
            )}

            {/* 🧾 Add Form */}
            {isAdding && (
              <div className="add-question-form">
                <h4>Add New Question for {selectedRole}</h4>
                <input
                  type="text"
                  placeholder="Enter question"
                  value={newQuestion.question}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, question: e.target.value })
                  }
                />
                {newQuestion.options.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const updated = [...newQuestion.options];
                      updated[i] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: updated });
                    }}
                  />
                ))}
                <input
                  type="text"
                  placeholder="Correct Answer"
                  value={newQuestion.correctAnswer}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })
                  }
                />
                <div className="add-form-buttons">
                  <button onClick={handleAddQuestion}>Save Question</button>
                  <button onClick={() => setIsAdding(false)}>Cancel</button>
                </div>
              </div>
            )}

            {/* 🧠 Existing MCQs */}
            <div className="mcq-list">
              <h4 style={{ marginTop: 20 }}>
                Existing Questions:
                {loadingMCQs && (
                  <span style={{ marginLeft: 8, color: "#666" }}>Loading…</span>
                )}
              </h4>
              {mcqs.length === 0 ? (
                <p>No questions added yet for this role.</p>
              ) : (
                mcqs.map((q, idx) => (
                  <div key={q.id ?? idx} className="mcq-item">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong>
                        Q{idx + 1}: {q.question}
                      </strong>
                      <button
                        className="delete-question-btn"
                        style={{
                          backgroundColor: "#ff4d4d",
                          color: "white",
                          border: "none",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDeleteQuestion(q.id)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                    <ul>
                      {(q.options || []).map((opt, i) => (
                        <li key={i}>
                          {opt}{" "}
                          {opt === q.correctAnswer && (
                            <span style={{ color: "green", fontWeight: "bold" }}>✅</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTechnicalTest;
