// Samruddhi Patole 29/10/25

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
import HomePage from "./HomePage";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";

const Navbar = () => {
  // ===== Navbar States =====
  const [menuOpen, setMenuOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);
  const jobsRef = useRef(null);
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");
  const [showFAQ, setShowFAQ] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showDropdown, setShowDropdown] = useState();
  const [showInterviewSubmenu, setShowInterviewSubmenu] = useState();

  // ===== Job Dashboard States =====
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);
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
  const companyDropdownRef = useRef(null);

  // ===== Chat Popup States =====
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "recruiter", text: "Hi Samruddhi! We have a great job for you!" },
    { sender: "candidate", text: "Hello! I’m interested, please tell me more." },
  ]);
  const [companyNames, setCompanyNames] = useState([]);
  const [showCompanies, setShowCompanies] = useState(false);

  const [newMessage, setNewMessage] = useState("");
  // ===== Optional Test States =====
  const [showTestPopup, setShowTestPopup] = useState(false);
  const [showMCQModal, setShowMCQModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loadingTest, setLoadingTest] = useState(false);
  const [answers, setAnswers] = useState({});
  const [appliedRole, setAppliedRole] = useState("");

  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState(
    JSON.parse(localStorage.getItem("savedJobs")) || []
  );
  const toggleSave = async (jobId) => {
    const candidateId = 1; // ✅ replace with logged-in user ID from localStorage/session

    try {
      let updated;
      if (savedJobs.includes(jobId)) {
        await axios.delete(
          `http://localhost:8080/api/saved-jobs/unsave?candidateId=${candidateId}&requirementId=${jobId}`
        );
        updated = savedJobs.filter((id) => id !== jobId);
      } else {
        await axios.post(
          `http://localhost:8080/api/saved-jobs/save?candidateId=${candidateId}&requirementId=${jobId}`
        );
        updated = [...savedJobs, jobId];
      }

      localStorage.setItem("savedJobs", JSON.stringify(updated));
      setSavedJobs(updated);
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Failed to update saved job status.");
    }
  };
  // ===== Notification Panel =====
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New job posted at TCS for Frontend Developer", time: "2h ago" },
    { id: 2, message: "Your application at Infosys was viewed by recruiter", time: "5h ago" },
    { id: 3, message: "Wipro HR shortlisted your profile for next round", time: "1d ago" },
  ]);


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
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/requirements/companies");
        setCompanyNames(res.data || []);
      } catch (error) {
        console.error("Error fetching company names:", error);
      }
    };
    fetchCompanies();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        companyDropdownRef.current &&
        !companyDropdownRef.current.contains(event.target)
      ) {
        setShowCompanies(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    const fetchSavedJobs = async () => {
      const candidateId = 1;

      try {
        const res = await axios.get(
          `http://localhost:8080/api/saved-jobs/candidate/${candidateId}`
        );

        // ✅ Extract only requirement IDs
        const savedIds = res.data.map(job => job.requirementId);

        setSavedJobs(savedIds);
        localStorage.setItem("savedJobs", JSON.stringify(savedIds));
      } catch (err) {
        console.error("Error fetching saved jobs", err);
      }
    };

    fetchSavedJobs();
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
          <div
            className="logo-container"
            onClick={() => setActiveSection("home")}
            style={{ cursor: "pointer" }}
          >
            <img src="/jobportal.jpg" alt="Logo" className="logo-img" />
            <h2 className="logo-text">RG Portal</h2>
          </div>


          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            <li onClick={() => setActiveSection("jobs")}>Jobs</li>

            <li
              className="nav-item-companies"
              onClick={() => setShowCompanies(!showCompanies)}
              ref={companyDropdownRef}
            >
              Companies
              {showCompanies && (
                <div className="company-dropdown">
                  <div
                    className={`company-item ${selectedCompany === "All Companies" ? "active-company" : ""
                      }`}
                    onClick={() => {
                      setSelectedCompany("All Companies");
                      setShowCompanies(false);
                    }}
                  >
                    All Companies
                  </div>

                  {companyNames.length > 0 ? (
                    companyNames.map((name, index) => (
                      <div
                        key={index}
                        className={`company-item ${selectedCompany === name ? "active-company" : ""
                          }`}
                        onClick={() => {
                          setSelectedCompany(name);
                          setShowCompanies(false);
                        }}
                      >
                        {name}
                      </div>
                    ))
                  ) : (
                    <div className="company-item">No companies found</div>
                  )}
                </div>
              )}
            </li>

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
          {activeSection !== "home" && (
            <div className="search-bar">
              <input type="text" placeholder="Search jobs, companies..." />
            </div>
          )}
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
                <div className="job-item" onClick={() => navigate("/saved-jobs")}>
                  Saved
                </div>
              </div>
            )}
          </div>

          {/* === My Network === */}
          {/* <div className="nav-item">
            <FaUsers className="nav-icon-big" />
            <span className="nav-label">My Network</span>
          </div> */}

          {/* === Messaging === */}
          <div
            className="nav-item messaging-item"
            onClick={() => setShowChatPopup(!showChatPopup)}
          >
            <FaEnvelope className="nav-icon-big" />
            <span className="nav-label">Messaging</span>
            {/* <span className="message-badge">3</span> */}
          </div>

          <FaBell
            className="icon"
            title="Notifications"
            onClick={() => setShowNotifications(true)}
          />
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
                  className={`candChat-message ${msg.sender === "candidate" ? "candChat-sent" : "candChat-received"
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
                onClick={() => navigate("/")}
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

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowSettings(true);
                setOpenPanel(null); // close profile panel
              }}
            >
              <FaCog className="quick-icon" /> Settings
            </a>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowFAQ(true);
                setOpenPanel(null); // Close profile
              }}
            >
              <FaQuestionCircle className="quick-icon" /> FAQs
            </a>


            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowLogoutPopup(true);
                setOpenPanel(null);
              }}
            >
              <FaSignOutAlt className="quick-icon" /> Logout
            </a>

          </div>
        </div>
      )}
      {showSettings && (
        <div className="settings-panel">
          <div className="settings-header">
            <h2>Account Settings</h2>
            <button className="close-settings" onClick={() => setShowSettings(false)}>
              ×
            </button>
          </div>

          <div className="settings-content">
            {/* ===== Sidebar ===== */}
            <div className="settings-sidebar">
              {["Profile", "Privacy", "Notifications", "Account", "Password", "Preferences", "Help & Support", "Logout"].map(
                (tab) => (
                  <div
                    key={tab}
                    className={`settings-tab ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </div>
                )
              )}
            </div>

            {/* ===== Main Content ===== */}
            <div className="settings-main fade-in">
              {activeTab === "Profile" && (
                <>
                  <h3>Profile Settings</h3>
                  <p>Manage your personal details and visibility.</p>
                  <form className="settings-form">
                    <label>
                      Full Name
                      <input type="text" value="Samruddhi Shekhar Patole" />
                    </label>
                    <label>
                      Email
                      <input type="email" value="samruddhi@example.com" />
                    </label>
                    <label>
                      Location
                      <input type="text" placeholder="Enter your location" />
                    </label>
                    <label>
                      Bio
                      <textarea placeholder="Write something about yourself..." />
                    </label>
                    <button type="button" className="save-settings">
                      Save Changes
                    </button>
                  </form>
                </>
              )}

              {activeTab === "Privacy" && (
                <>
                  <h3>Privacy Settings</h3>
                  <p>Control who can see your activity, contact info, and profile visibility.</p>
                  <div className="settings-option">
                    <label>
                      <input type="checkbox" defaultChecked /> Show my profile to recruiters
                    </label>
                    <label>
                      <input type="checkbox" /> Allow messages from unknown users
                    </label>
                    <label>
                      <input type="checkbox" defaultChecked /> Show my online status
                    </label>
                  </div>
                </>
              )}

              {activeTab === "Notifications" && (
                <>
                  <h3>Notification Preferences</h3>
                  <p>Choose how you want to be notified about job updates and messages.</p>
                  <div className="settings-option">
                    <label>
                      <input type="checkbox" defaultChecked /> Email notifications
                    </label>
                    <label>
                      <input type="checkbox" /> Push notifications
                    </label>
                    <label>
                      <input type="checkbox" defaultChecked /> Job recommendation alerts
                    </label>
                  </div>
                </>
              )}

              {activeTab === "Account" && (
                <>
                  <h3>Account Settings</h3>
                  <p>Manage account preferences and data.</p>
                  <button className="danger-btn">Deactivate Account</button>
                </>
              )}

              {activeTab === "Password" && (
                <>
                  <h3>Change Password</h3>
                  <form className="settings-form">
                    <label>
                      Current Password
                      <input type="password" />
                    </label>
                    <label>
                      New Password
                      <input type="password" />
                    </label>
                    <label>
                      Confirm Password
                      <input type="password" />
                    </label>
                    <button className="save-settings">Update Password</button>
                  </form>
                </>
              )}

              {activeTab === "Preferences" && (
                <>
                  <h3>Job Preferences</h3>
                  <p>Set your preferred roles, locations, and salary range.</p>
                  <form className="settings-form">
                    <label>
                      Preferred Role
                      <input type="text" placeholder="e.g. Frontend Developer" />
                    </label>
                    <label>
                      Preferred Location
                      <input type="text" placeholder="e.g. Pune, Mumbai" />
                    </label>
                    <label>
                      Expected Salary
                      <input type="text" placeholder="e.g. 5 LPA" />
                    </label>
                    <button className="save-settings">Save Preferences</button>
                  </form>
                </>
              )}

              {activeTab === "Help & Support" && (
                <>
                  <h3>Help & Support</h3>
                  <p>Need assistance? We're here to help.</p>
                  <ul className="help-list">
                    <li>📞 Contact Support: support@rgportal.com</li>
                    <li>📘 FAQ & Help Center</li>
                    <li>💡 Report a Problem</li>
                  </ul>
                </>
              )}

              {activeTab === "Logout" && (
                <>
                  <h3>Logout</h3>
                  <p>Are you sure you want to logout?</p>
                  <button className="danger-btn">Logout</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}



      {/* ===== JOB DASHBOARD (Sidebar + Jobs) ===== */}
      {/* ===== MAIN SECTION BELOW NAVBAR ===== */}
      <div className="main-content-below-navbar">
        {activeSection === "home" && <HomePage />}

        {activeSection === "jobs" && (
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
              <h2 className="navDash-jobContainer-heading">Jobs For You</h2>

              {loading ? (
                <p>Loading jobs...</p>
              ) : jobs.length === 0 ? (
                <p>No jobs found.</p>
              ) : (
                <>
                  {/* ✅ Put job cards in a separate grid div */}
                  <div className="navDash-jobGrid">
                    {jobs
                      .filter(
                        (job) =>
                          selectedCompany === "All Companies" ||
                          job.companyName === selectedCompany
                      )
                      .slice(0, visibleCount)
                      .map((job) => (
                        <div key={job.requirementId} className="navDash-jobCard">
                          <button
                            className="navDash-viewBtn"
                            onClick={() => handleViewJD(job.requirementId)}
                          >
                            View JD
                          </button>

                          <div className="navDash-jobInfo">
                            <p><strong>Company:</strong> {job.companyName}</p>
                            <p><strong>Location:</strong> {job.location}</p>
                            <p><strong>Experience:</strong> {job.experience}</p>
                            <p><strong>Job Role:</strong> {job.jobRole}</p>
                          </div>

                          {/* ✅ Buttons aligned side by side — Save first, Apply next */}
                          <div className="navDash-jobActions">
                            <button
                              className="navDash-saveBtn"
                              onClick={() => toggleSave(job.requirementId)}
                              title={
                                savedJobs.includes(job.requirementId)
                                  ? "Unsave Job"
                                  : "Save Job"
                              }
                            >
                              {savedJobs.includes(job.requirementId) ? (
                                <FaBookmark />
                              ) : (
                                <FaRegBookmark />
                              )}
                            </button>

                            <button
                              className="navDash-applyBtn"
                              onClick={() => handleApplyNow(job)}
                            >
                              Apply Now
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>



                  {/* ✅ Show More Button below grid */}
                  {visibleCount < jobs.length && (
                    <button
                      className="navDash-showMore"
                      onClick={() => setVisibleCount((prev) => prev + 4)}
                    >
                      Show More
                    </button>
                  )}
                </>
              )}



              {/* ✅ "No CV? No Problem" Highlight */}
              <div className="no-cv-highlight">
                <div className="no-cv-text">
                  <h3>No CV? No Problem 🚀</h3>
                  <p>Create your professional resume instantly in minutes.</p>
                </div>

                <button
                  className="no-cv-create-btn"
                  onClick={() => navigate("/resume-templates")}
                >
                  Create Resume
                </button>
              </div>
            </div>
          </div>
        )}
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
      {showFAQ && (
        <div className="faq-overlay">
          <div className="faq-container">
            <div className="faq-header">
              <h2>Help & Support</h2>
              <button className="faq-close" onClick={() => setShowFAQ(false)}>×</button>
            </div>

            <div className="faq-content">
              <details>
                <summary>How do I apply for a job?</summary>
                <p>Browse jobs → Click "Apply" → Fill details → Submit application.</p>
              </details>

              <details>
                <summary>Can I edit my profile after submission?</summary>
                <p>Yes, go to Profile → Edit, and update details anytime.</p>
              </details>

              <details>
                <summary>How do I upload a resume?</summary>
                <p>Visit Resume section → Upload PDF/DOCX → Save.</p>
              </details>

              <details>
                <summary>How do recruiters contact me?</summary>
                <p>You will receive notification & email from company HR.</p>
              </details>

              <details>
                <summary>Is this platform free for job seekers?</summary>
                <p>Yes, applying and creating resume is 100% free.</p>
              </details>
            </div>
          </div>
        </div>
      )}
      {showLogoutPopup && (
        <div
          className="logout-overlay"
          onClick={() => setShowLogoutPopup(false)} // clicking outside closes
        >
          <div
            className="logout-sheet"
            onClick={(e) => e.stopPropagation()} // ✅ buttons work now
          >
            <h2>Logout?</h2>
            <p>Are you sure you want to logout from your account?</p>

            <button
              className="logout-btn"
              onClick={() => {
                localStorage.clear();
                setShowLogoutPopup(false);
                navigate("/login");
              }}
            >
              Yes, Logout
            </button>

            <button
              className="cancel-btn"
              onClick={() => setShowLogoutPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showNotifications && (
        <div className="notif-overlay" onClick={() => setShowNotifications(false)}>
          <div
            className="notif-panel"
            onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside
          >
            <div className="notif-header">
              <h3>Notifications</h3>
              <button className="notif-close" onClick={() => setShowNotifications(false)}>
                ×
              </button>
            </div>

            <div className="notif-list">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n.id} className="notif-item">
                    <p>{n.message}</p>
                    <span>{n.time}</span>
                  </div>
                ))
              ) : (
                <p className="no-notifs">No new notifications</p>
              )}
            </div>

            <button className="clear-btn" onClick={() => setNotifications([])}>
              Clear All
            </button>
          </div>
        </div>
      )}


    </>
  );
};

export default Navbar;
