import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FaBell,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUsers,
  FaEnvelope,
} from "react-icons/fa";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  // ===== Navbar States =====
  const [menuOpen, setMenuOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);
  const jobsRef = useRef(null);

  // ===== Job Dashboard States =====
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [filters, setFilters] = useState({
    keyword: "",
    location: "All Locations",
    experience: "All Experience Levels",
    salary: "All Salary Ranges",
  });
  const [selectedJD, setSelectedJD] = useState(null);
  const [showJDModal, setShowJDModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
   // ===== Chat Popup States =====
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "recruiter", text: "Hi Samruddhi! We have a great job for you!" },
    { sender: "candidate", text: "Hello! I’m interested, please tell me more." },
  ]);
  const [newMessage, setNewMessage] = useState("");
  // ===== Optional Test States =====
const [showTestPopup, setShowTestPopup] = useState(false);
const [showMCQModal, setShowMCQModal] = useState(false);
const [questions, setQuestions] = useState([]);
const [loadingTest, setLoadingTest] = useState(false);
const [answers, setAnswers] = useState({});
const [appliedRole, setAppliedRole] = useState("");
const [showDropdown,setShowDropdown]=useState();
const [showInterviewSubmenu, setShowInterviewSubmenu ]=useState();

  const navigate = useNavigate();

  // ===== Handle click outside =====
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openPanel === "jobs" &&
        jobsRef.current &&
        !jobsRef.current.contains(event.target)
      ) {
        setOpenPanel(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openPanel]);

  const togglePanel = (panel) =>
    setOpenPanel((prev) => (prev === panel ? null : panel));

  // ===== Fetch jobs =====
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/requirements/all");
        const data = res.data || [];
        setJobs(data);
        localStorage.setItem("jobsList", JSON.stringify(data)); // ✅ store globally
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleViewJD = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/requirements/${id}`
      );
      setSelectedJD(response.data);
      setShowJDModal(true);
    } catch (error) {
      console.error("Error fetching JD:", error);
      alert("Failed to fetch JD details.");
    }
  };

 const handleApplyNow = (job) => {
  // ✅ Get applied jobs from localStorage
  const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || {};

  // ✅ Increment the count for this requirement
  const currentCount = appliedJobs[job.requirementId] || 0;
  appliedJobs[job.requirementId] = currentCount + 1;

  // ✅ Save back to localStorage
  localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));

  // ✅ Also update jobsList (for RecruiterNavbar’s reference)
  const jobsList = JSON.parse(localStorage.getItem("jobsList")) || [];
  const updatedList = jobsList.map((j) =>
    j.requirementId === job.requirementId
      ? { ...j, applications: (j.applications || 0) + 1 }
      : j
  );
  localStorage.setItem("jobsList", JSON.stringify(updatedList));

  // ✅ Trigger update event so RecruiterNavbar refreshes instantly
  const event = new CustomEvent("applicationUpdated", {
    detail: { requirementId: job.requirementId },
  });
  window.dispatchEvent(event);

  // ✅ Finally navigate to application page
  navigate(`/apply/${job.requirementId}`, { state: { jobDetails: job } });
};


  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedJob(null);
  };
    const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    setMessages((prev) => [...prev, { sender: "candidate", text: newMessage }]);
    setNewMessage("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "recruiter", text: "Thanks for your message! We’ll get back soon." },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* ===== NAVBAR TOP ===== */}
      <nav className="navbar">
        <div className="navbar-left">
          <div className="logo-container">
            <img src="/jobportal.jpg" alt="Logo" className="logo-img" />
            <h2 className="logo-text">RG Portal</h2>
          </div>

          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            <li>Jobs</li>
            <li>Companies</li>
                        <li className="more-item" onClick={() => setShowDropdown((prev) => !prev)}>
              More ▾
              {showDropdown && (
                <ul className="more-dropdown">
                  <li>Communities</li>
                  <li>Reviews</li>
                  <li onClick={() => navigate("/salary-hike-calculator")}>Salary Hike Calculator</li>

                  <li
                    className="interview-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowInterviewSubmenu((prev) => !prev);
                    }}
                  >
                    Interview ▸
                    {showInterviewSubmenu && (
                      <ul className="interview-submenu">
                        <li onClick={() => navigate("/interview-faqs")}>Interview FAQs</li>
                        <li onClick={() => navigate("/share-experience")}>Share your interview questions</li>
                      </ul>
                    )}
                  </li>
                </ul>
              )}
            </li>
          </ul>

          <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>

        <div className="navbar-center">
          <div className="search-bar">
            <input type="text" placeholder="Search jobs, companies..." />
          </div>
        </div>

        <div className="navbar-right">
          <div className="jobs-click-container" ref={jobsRef}>
            <span className="jobs-label" onClick={() => togglePanel("jobs")}>
              My Jobs
            </span>

            {openPanel === "jobs" && (
              <div className="jobs-click-box">
                <div className="job-item">Recommended</div>
                <div
                  className="job-item"
                  onClick={() => navigate("/applied-jobs")}
                >
                  Applied
                </div>
              </div>
            )}
          </div>

          {/* === My Network === */}
          <div className="nav-item">
            <FaUsers className="nav-icon-big" />
            <span className="nav-label">My Network</span>
          </div>

         {/* === Messaging === */}
          <div
            className="nav-item messaging-item"
            onClick={() => setShowChatPopup(!showChatPopup)}
          >
            <FaEnvelope className="nav-icon-big" />
            <span className="nav-label">Messaging</span>
            {/* <span className="message-badge">3</span> */}
          </div>

          <FaBell className="icon" title="Notifications" />
          <div className="profile-section">
            <FaUserCircle
              className="icon"
              onClick={() => togglePanel("profile")}
            />
          </div>
        </div>
      </nav>
   {/* ===== CHAT POPUP ===== */}
     {/* ===== CHAT POPUP ===== */}
{showChatPopup && (
  <div className="candChat-popup-overlay">
    <div className="candChat-popup-box">
      <div className="candChat-popup-header">
        <h3>Messages</h3>
        <button
          className="candChat-popup-close"
          onClick={() => setShowChatPopup(false)}
        >
          ×
        </button>
      </div>

      <div className="candChat-popup-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`candChat-message ${
              msg.sender === "candidate" ? "candChat-sent" : "candChat-received"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="candChat-popup-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={() => handleSendMessage()}>Send</button>
      </div>
    </div>
  </div>
)}

      {/* ===== PROFILE PANEL ===== */}
      {openPanel === "profile" && (
        <div className="profile-panel open">
          <button className="close-btn" onClick={() => setOpenPanel(null)}>
            X
          </button>
          <div className="profile-top">
            <img src="icon.png" alt="Profile" className="profile-pic" />
            <div className="profile-info">
              <h3>Samruddhi Shekhar Patole</h3>
              <p>B.Sc Computer Science at Dr D Y Patil Law College, Pune</p>
              <button
                className="btn-update"
                onClick={() => navigate("/resume-templates")}
              >
                View & Update Profile
              </button>
            </div>
          </div>

          <div className="performance-block">
            <p className="performance-text">
              Your Profile Performance - Last 90 days
            </p>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">107</span>
                <span className="stat-label">Search Appearances</span>
                <button className="view-btn">View All</button>
              </div>
              <div className="stat-item">
                <span className="stat-number">7</span>
                <span className="stat-label">Recruiter Actions</span>
                <button className="view-btn">View All</button>
              </div>
            </div>
          </div>

          <div className="quick-links">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/resume-templates");
                setOpenPanel(null);
              }}
            >
              <FaUsers className="quick-icon" /> Create Resume
            </a>

            <a href="#">
              <FaCog className="quick-icon" /> Settings
            </a>

            <a href="#">
              <FaQuestionCircle className="quick-icon" /> FAQs
            </a>

            <a href="#">
              <FaSignOutAlt className="quick-icon" /> Logout
            </a>
          </div>
        </div>
      )}

      {/* ===== JOB DASHBOARD (Sidebar + Jobs) ===== */}
      <div className="navDash-container">
        {/* Sidebar */}
        <div className="navDash-sidebar">
          <input
            type="text"
            name="keyword"
            value={filters.keyword}
            onChange={handleChange}
            placeholder="Search by keyword..."
          />

          <label>
            Location
            <select
              name="location"
              value={filters.location}
              onChange={handleChange}
            >
              <option>All Locations</option>
              <option>Pune</option>
              <option>Mumbai</option>
              <option>Bangalore</option>
            </select>
          </label>
          <label>
            Experience
            <select
              name="experience"
              value={filters.experience}
              onChange={handleChange}
            >
              <option>All Experience Levels</option>
              <option>0-1 Years</option>
              <option>1-3 Years</option>
              <option>3-5 Years</option>
            </select>
          </label>
          <label>
            Salary
            <select
              name="salary"
              value={filters.salary}
              onChange={handleChange}
            >
              <option>All Salary Ranges</option>
              <option>0-3 LPA</option>
              <option>3-5 LPA</option>
              <option>5-10 LPA</option>
            </select>
          </label>
          <label>
            Designation
            <select
              name="designation"
              value={filters.designation}
              onChange={handleChange}
            >
              <option>All Job Designations</option>
              <option>Software Engineer</option>
              <option>Team Lead</option>
              <option>Project Manager</option>
            </select>
          </label>
          <label>
            Qualification
            <select
              name="qualification"
              value={filters.qualification}
              onChange={handleChange}
            >
              <option>All Qualifications</option>
              <option>B.Sc</option>
              <option>B.Tech</option>
              <option>MBA</option>
            </select>
          </label>
          <label>
            Company
            <select
              name="company"
              value={filters.company}
              onChange={handleChange}
            >
              <option>All Companies</option>
              <option>ABC Pvt Ltd</option>
              <option>XYZ Corp</option>
            </select>
          </label>
        </div>

        {/* Job Cards */}
        <div className="navDash-jobContainer">
          <h2>Jobs for You</h2>
          {loading ? (
            <p>Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            <>
              {jobs.slice(0, visibleCount).map((job) => (
                <div key={job.requirementId} className="navDash-jobCard">
                  <button
                    className="navDash-viewBtn"
                    onClick={() => handleViewJD(job.requirementId)}
                  >
                    View JD
                  </button>

                  <div className="navDash-jobInfo">
                    <p>
                      <strong>Company:</strong> {job.companyName}
                    </p>
                    <p>
                      <strong>Location:</strong> {job.location}
                    </p>
                    <p>
                      <strong>Experience:</strong> {job.experience}
                    </p>
                    <p>
                      <strong>Job Role:</strong> {job.jobRole}
                    </p>
                  </div>

                  <button
                    className="navDash-applyBtn"
                    onClick={() => handleApplyNow(job)}
                  >
                    Apply Now
                  </button>
                </div>
              ))}

              {visibleCount < jobs.length && (
                <button
                  className="navDash-showMore"
                  onClick={() => setVisibleCount((prev) => prev + 3)}
                >
                  Show More
                </button>
              )}
            </>
          )}

          {/* ✅ "No CV? No Problem" Highlight */}
          <div
            className="no-cv-highlight"
            onClick={() => navigate("/resume-templates")}
          >
            <div className="no-cv-text">
              <h3>No CV? No Problem 🚀</h3>
              <p>Create your professional resume instantly in minutes.</p>
            </div>
            <button className="no-cv-create-btn">Create Resume</button>
          </div>
        </div>
      </div>

      {/* ===== JD MODAL ===== */}
      {showJDModal && selectedJD && (
        <div className="navDash-modalOverlay">
          <div className="navDash-modalBox">
            <button
              className="navDash-closeModal"
              onClick={() => setShowJDModal(false)}
            >
              ×
            </button>

            <h2 className="navDash-modalTitle">Job Description Details</h2>

            <div className="navDash-modalScroll">
              <section className="navDash-section">
                <h3>Overview</h3>
                <div className="navDash-grid">
                  <p>
                    <strong>Requirement ID:</strong> {selectedJD.requirementId}
                  </p>
                  <p>
                    <strong>Company Name:</strong> {selectedJD.companyName}
                  </p>
                  <p>
                    <strong>Designation:</strong> {selectedJD.designation}
                  </p>
                  <p>
                    <strong>Location:</strong> {selectedJD.location}
                  </p>
                  <p>
                    <strong>Job Type:</strong> {selectedJD.jobType}
                  </p>
                  <p>
                    <strong>Salary:</strong> {selectedJD.salary}
                  </p>
                  <p>
                    <strong>Experience:</strong> {selectedJD.experience}
                  </p>
                  <p>
                    <strong>Shift:</strong> {selectedJD.shift}
                  </p>
                  <p>
                    <strong>Week Off:</strong> {selectedJD.weekOff}
                  </p>
                  <p>
                    <strong>Notice Period:</strong> {selectedJD.noticePeriod}
                  </p>
                </div>
              </section>

              <section className="navDash-section">
                <h3>Qualification & Skills</h3>
                <div className="navDash-grid">
                  <p>
                    <strong>Qualification:</strong> {selectedJD.qualification}
                  </p>
                  <p>
                    <strong>Field:</strong> {selectedJD.field}
                  </p>
                  <p>
                    <strong>Stream:</strong> {selectedJD.stream}
                  </p>
                  <p>
                    <strong>Percentage:</strong> {selectedJD.percentage}
                  </p>
                  <p>
                    <strong>Skills:</strong> {selectedJD.skills}
                  </p>
                </div>
              </section>

              <section className="navDash-section">
                <h3>Perks & Other Details</h3>
                <div className="navDash-grid">
                  <p>
                    <strong>Perks:</strong> {selectedJD.perks}
                  </p>
                  <p>
                    <strong>Incentive:</strong> {selectedJD.incentive}
                  </p>
                  <p>
                    <strong>Reporting Hierarchy:</strong>{" "}
                    {selectedJD.reportingHierarchy}
                  </p>
                  <p>
                    <strong>Bond:</strong> {selectedJD.bond}
                  </p>
                  <p>
                    <strong>Documentation:</strong> {selectedJD.documentation}
                  </p>
                  <p>
                    <strong>Age Criteria:</strong> {selectedJD.ageCriteria}
                  </p>
                </div>
              </section>

              <section className="navDash-section">
                <h3>Responsibilities</h3>
                {selectedJD.responsibilities?.length > 0 ? (
                  <ul>
                    {selectedJD.responsibilities.map((r, i) => (
                      <li key={i}>{r.responsibilitiesMsg}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No responsibilities provided.</p>
                )}
              </section>

              <section className="navDash-section">
                <h3>Job Requirements</h3>
                {selectedJD.jobRequirements?.length > 0 ? (
                  <ul>
                    {selectedJD.jobRequirements.map((r, i) => (
                      <li key={i}>{r.jobRequirementMsg}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No job requirements provided.</p>
                )}
              </section>

              <section className="navDash-section">
                <h3>Preferred Qualifications</h3>
                {selectedJD.preferredQualifications?.length > 0 ? (
                  <ul>
                    {selectedJD.preferredQualifications.map((r, i) => (
                      <li key={i}>{r.preferredQualificationMsg}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No preferred qualifications provided.</p>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
