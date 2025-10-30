import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./JobApplicationForm.css";

const JobApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobDetails, setJobDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    resume: null,
    coverLetter: "",
  });

  // ===== Fetch Job Details + Questions =====
  useEffect(() => {
    const fetchJobData = async () => {
      console.log("🔎 Requirement ID being fetched:", id);

      try {
        const [jobRes, questionRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/requirements/${id}`),
          axios.get(`http://localhost:8080/api/questions/requirement/${id}`),
        ]);

        console.log("✅ Job Data:", jobRes.data);
        console.log("📦 Full Question Response:", questionRes);
        console.log("✅ Question Data:", questionRes.data);

        setJobDetails(jobRes.data);
        setQuestions(questionRes.data || []);
      } catch (error) {
        console.error("❌ Error fetching job/questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id]);

  // ===== Handle Input Changes =====
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleAnswerChange = (qid, value) => {
    setAnswers({ ...answers, [qid]: value });
  };

  // ===== Submit Application =====
  const handleSubmit = async (e) => {
  e.preventDefault();

  // ===== FRONTEND VALIDATION: check duplicate by jobId + email + phone =====
  const { email, phone } = formData;
  const appliedList = JSON.parse(localStorage.getItem("submittedApplications")) || [];

  const alreadyApplied = appliedList.some(
    (app) => app.jobId === id && app.email === email && app.phone === phone
  );

  if (alreadyApplied) {
    alert("❗You have already applied for this job using this email and phone number.");
    return; // stop submission
  }

  // ===== Prepare data for backend submission =====
  const formDataToSend = new FormData();
  formDataToSend.append(
    "application",
    new Blob(
      [
        JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          coverLetter: formData.coverLetter,
          requirementId: id,
          answers: answers,
        }),
      ],
      { type: "application/json" }
    )
  );

  if (formData.resume) {
    formDataToSend.append("resume", formData.resume);
  }

  try {
    const res = await axios.post(
      "http://localhost:8080/api/applications/submit",
      formDataToSend,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log("✅ Submitted successfully:", res.data);
    alert("Application submitted successfully!");

    // ===== FRONTEND counter update =====
    const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || {};
    appliedJobs[id] = (appliedJobs[id] || 0) + 1;
    localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));

    // ===== Save this submission so duplicate can't happen =====
    const newEntry = { jobId: id, email, phone };
    localStorage.setItem(
      "submittedApplications",
      JSON.stringify([...appliedList, newEntry])
    );

    navigate("/");
  } catch (error) {
    console.error("❌ Error submitting application:", error);
    alert("Failed to submit application. Please try again.");
  }
};

  // ===== Render =====
  if (loading) return <p>Loading form...</p>;

  return (
    <div className="application-form-container">
      <h2>Apply for {jobDetails?.designation}</h2>
      <p>
        <strong>Company:</strong> {jobDetails?.companyName}
      </p>
      <p>
        <strong>Location:</strong> {jobDetails?.location}
      </p>

      <form onSubmit={handleSubmit} className="application-form">
        {/* ===== Basic Info ===== */}
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleFormChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleFormChange}
          required
        />

        <label>Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleFormChange}
          required
        />

        <label>Upload Resume (PDF/DOC)</label>
        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          onChange={handleFormChange}
          required
        />

        <label>Cover Letter</label>
        <textarea
          name="coverLetter"
          rows="4"
          value={formData.coverLetter}
          onChange={handleFormChange}
        ></textarea>

        {/* ===== Dynamic Questions ===== */}
        <h3>Job-Specific Questions</h3>
        {questions.length > 0 ? (
          questions.map((q) => (
            <div key={q.questionId} className="question-block">
              <label>{q.question}</label>
              <textarea
                rows="3"
                value={answers[q.questionId] || ""}
                onChange={(e) => handleAnswerChange(q.questionId, e.target.value)}
                required
              ></textarea>
            </div>
          ))
        ) : (
          <p>No specific questions for this job.</p>
        )}

        <button type="submit" className="submit-btn">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default JobApplicationForm;
