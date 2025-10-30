import { useState, useEffect } from "react";
import faqsData from "../interviewQuestions.js";
import "./InterviewFAQ.css";
import { useNavigate } from "react-router-dom";

const InterviewFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setFaqs(faqsData);
  }, []);

  const filteredFaqs = faqs.filter((f) => {
    return (
      (!selectedCompany || f.companyName === selectedCompany) &&
      (!selectedRole || f.role === selectedRole) &&
      (!selectedDifficulty || f.difficulty === selectedDifficulty) &&
      f.question.toLowerCase().includes(search.toLowerCase())
    );
  });

  const uniqueCompanies = [...new Set(faqs.map((f) => f.companyName))];
  const uniqueRoles = [...new Set(faqs.map((f) => f.role))];
  const uniqueDifficulty = [...new Set(faqs.map((f) => f.difficulty))];

  return (
    <div className="faq-page">
      <h1 className="faq-title">Interview Questions & Experiences</h1>

      {/* Filters */}
      <div className="faq-filters">
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="">All Companies</option>
          {uniqueCompanies.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">All Roles</option>
          {uniqueRoles.map((r, i) => (
            <option key={i} value={r}>{r}</option>
          ))}
        </select>

        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        >
          <option value="">All Difficulty</option>
          {uniqueDifficulty.map((d, i) => (
            <option key={i} value={d}>{d}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FAQ Cards */}
      <div className="faq-cards">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, i) => (
            <div key={i} className="faq-card">
              <div className="faq-header">
                {faq.companyLogo && <img src={faq.companyLogo} alt={faq.companyName} className="company-logo" />}
                <div className="faq-title-role">
                  <h3>{faq.companyName}</h3>
                  <span className="role-badge">{faq.role}</span>
                </div>
                <span className={`difficulty-badge ${faq.difficulty?.toLowerCase()}`}>
                  {faq.difficulty}
                </span>
              </div>

              <details className="faq-question">
                <summary>{faq.question}</summary>
                <p>{faq.answer || "No answer provided yet."}</p>
                {faq.year && <p className="faq-meta">Asked in {faq.year}</p>}
              </details>

              <div className="faq-actions">
                <button>👍 Useful</button>
                <button>💬 Comment</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No matching questions found.</p>
        )}
      </div>

      <button 
        className="share-btn" 
        onClick={() => navigate("/share-experience")}
      >
        Share Your Interview Experience
      </button>
    </div>
  );
};

export default InterviewFAQ;
