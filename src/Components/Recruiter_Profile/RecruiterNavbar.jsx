// Samruddhi Patole 29/10/25
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
import "./RecruiterNavbar.css";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

const RecruiterNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);
  const [allJobs, setAllJobs] = useState([]);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedJD, setSelectedJD] = useState(null);
  const [showJDModal, setShowJDModal] = useState(false);
  const [showTestPopup, setShowTestPopup] = useState(false);
  //  const [companies, setCompanies] = useState([]);
  //   const [showCompanies, setShowCompanies] = useState(false);
const [filteredJobs, setFilteredJobs] = useState([]);

  const [filters, setFilters] = useState({
    keyword: "",
    location: "All Locations",
    experience: "All Experience Levels",
    salary: "All Salary Ranges",
    designation: "All Job Designations",
    qualification: "All Qualifications",
    company: "All Companies",
  });

   const params = new URLSearchParams(location.search);
  const userType = params.get("userType");

  // 💬 Chat Popup States
  // const [showChatPopup, setShowChatPopup] = useState(false);
  // const [messages, setMessages] = useState([
  //   { sender: "Candidate", text: "Hello, is this position still open?" },
  //   { sender: "You", text: "Yes, it is! Please share your updated resume." },
  // ]);
  // const [newMessage, setNewMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const jobsRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  const [designationSuggestions, setDesignationSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  const [showApplicantsPopup, setShowApplicantsPopup] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Close profile panel on outside click
  //   useEffect(() => {
  //     const handleClickOutside = (event) => {
  //       if (
  //         openPanel === "profile" &&
  //         jobsRef.current &&
  //         !jobsRef.current.contains(event.target)
  //       ) {
  //         setOpenPanel(null);
  //       }
  //     };
  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => document.removeEventListener("mousedown", handleClickOutside);
  //   }, [openPanel]);
  //  const handleCompaniesClick = async () => {
  //     try {
  //       if (!showCompanies) {
  //         const response = await axios.get("http://localhost:8080/api/requirements/companies");
  //         setCompanies(response.data);
  //       }
  //       setShowCompanies((prev) => !prev); // toggle modal open/close
  //     } catch (error) {
  //       console.error("Error fetching companies:", error);
  //       alert("Failed to fetch company list.");
  //     }
  //   };
  const API_BASE_URL = "http://localhost:8080";

const handleDelete = async (requirementId) => {
  if (!window.confirm("Are you sure you want to delete this job description?")) return;

  try {
    const response = await fetch(
      `http://localhost:8080/api/requirements/delete/${requirementId}`,
      { method: "DELETE" }
    );

    if (response.ok) {
      toast.success("Job deleted successfully!");
      setJobs((prevJobs) =>
        prevJobs.filter((job) => job.requirementId !== requirementId)
      );
    } else {
      toast.error("Failed to delete job!");
    }
  } catch (error) {
    console.error("Error deleting job:", error);
    toast.error("Error connecting to backend!");
  }
};



  const handleViewApplicants = async (requirementId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/applications/requirement/${requirementId}`);

      setApplicants(response.data);
      setSelectedJobId(requirementId);
      setShowApplicantsPopup(true);
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };


 const handleEdit = (requirementId) => {
  navigate(`/add-job-description/${requirementId}`);
};


  // ✅ Fetch jobs and listen to Apply count updates
  // ✅ Fetch jobs only once from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/requirements/all`);

        let jobList = response.data.map(job => ({
          ...job,
          applications: 0 // initialize
        }));

        // ✅ GET LIVE APPLICATION COUNT FOR EACH JOB
        for (const job of jobList) {
          const res = await axios.get(`${API_BASE_URL}/api/applications/requirement/${job.requirementId}`);
          job.applications = res.data.length; // real-time count
        }

       setAllJobs(jobList);
       setJobs(jobList);
       setFilteredJobs(jobList); 

      } catch (error) {
        console.error("❌ Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);



  const togglePanel = (panel) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
useEffect(() => {
  let updated = jobs;

  if (filters.keyword) {
    updated = updated.filter(
      (job) =>
        job.designation?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.companyName?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.location?.toLowerCase().includes(filters.keyword.toLowerCase())
    );
  }

  if (filters.location && filters.location !== "All Locations") {
    updated = updated.filter((job) => job.location === filters.location);
  }

  if (filters.experience && filters.experience !== "All Experience Levels") {
    updated = updated.filter((job) => job.experience === filters.experience);
  }

  if (filters.salary && filters.salary !== "All Salary Ranges") {
    updated = updated.filter((job) => job.salary === filters.salary);
  }

  if (filters.designation && filters.designation !== "All Job Designations") {
    updated = updated.filter((job) => job.designation === filters.designation);
  }

  if (filters.qualification && filters.qualification !== "All Qualifications") {
    updated = updated.filter((job) => job.qualification === filters.qualification);
  }

  if (filters.company && filters.company !== "All Companies") {
    updated = updated.filter((job) => job.companyName === filters.company);
  }

  setFilteredJobs(updated);
}, [filters, jobs]);

  const handleAddJD = () => {
    navigate("/paid-post");
  };

  const handleViewJD = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/requirements/${id}`);
      setSelectedJD(response.data);
      setShowJDModal(true);
    } catch (error) {
      console.error("Error fetching JD:", error);
      alert("Failed to fetch JD details.");
    }
  };

  const handleAddTest = () => {
    setShowTestPopup(true);
  };

  const handleTestType = (type) => {
    setShowTestPopup(false);
    if (type === "technical") {
      navigate("/add-technical-test");
    } else {
      navigate("/add-non-technical-test");
    }
  };
  const normalizeText = (text = "") => {
    return String(text)
      .toLowerCase()
      .replace(/\s+/g, "")   // remove spaces
      .replace(/\./g, "")   // remove dots
      .replace(/[^a-z0-9]/g, ""); // optionally remove other punctuation
  };
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (!value || !value.trim()) {
      setSuggestions([]);
      setJobs(allJobs); // reset to full list
      return;
    }

    // gather unique suggestions from designation and location
    const designations = [...new Set(allJobs.map((j) => j.designation || ""))];
    const locations = [...new Set(allJobs.map((j) => j.location || ""))];

    const allSuggestions = [...designations.filter(Boolean), ...locations.filter(Boolean)];

    const filtered = allSuggestions.filter((item) =>
      normalizeText(item).includes(normalizeText(value))
    );

    // limit suggestions and dedupe
    const uniqueFiltered = [...new Set(filtered)].slice(0, 8);
    setSuggestions(uniqueFiltered);
  };
  const handleSuggestionClick = (selected) => {
    setSearchQuery(selected);
    setSuggestions([]);
    const norm = normalizeText(selected);
    const filtered = allJobs.filter((job) =>
      normalizeText(job.designation || "").includes(norm) ||
      normalizeText(job.location || "").includes(norm)
    );

    setJobs(filtered);
  };
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSuggestions([]);

      if (!searchQuery.trim()) {
        setJobs(allJobs);
        return;
      }

      // Split by comma and normalize each keyword
      const keywords = searchQuery
        .split(",")
        .map((k) => normalizeText(k))
        .filter((k) => k.length > 0);

      const filtered = allJobs.filter((job) => {
        const jobDesignation = normalizeText(job.designation || "");
        const jobLocation = normalizeText(job.location || "");
        const jobCompany = normalizeText(job.companyName || "");
        const jobSkills = normalizeText(job.skills || "");

        // ✅ check if any keyword matches any field
        return keywords.some(
          (kw) =>
            jobDesignation.includes(kw) ||
            jobLocation.includes(kw) ||
            jobCompany.includes(kw) ||
            jobSkills.includes(kw)
        );
      });

      setJobs(filtered);
    }
  };
  const handleDesignationChange = (value) => {
    setFilters((prev) => ({ ...prev, designation: value }));

    if (!value.trim()) {
      setDesignationSuggestions([]);
      return;
    }

    const designations = [...new Set(allJobs.map((j) => j.designation || ""))];
    const filtered = designations.filter((d) =>
      d.toLowerCase().includes(value.toLowerCase())
    );
    setDesignationSuggestions(filtered.slice(0, 6));
  };

  const handleSelectDesignation = (selected) => {
    setFilters((prev) => ({ ...prev, designation: selected }));
    setDesignationSuggestions([]);
  };

  // --- Handle experience ---
  const handleExperienceChange = (value) => {
    setFilters((prev) => ({ ...prev, experience: value }));
  };

  // --- Handle location typing ---
  const handleLocationChange = (value) => {
    setFilters((prev) => ({ ...prev, location: value }));

    if (!value.trim()) {
      setLocationSuggestions([]);
      return;
    }

    const locations = [...new Set(allJobs.map((j) => j.location || ""))];
    const filtered = locations.filter((loc) =>
      loc.toLowerCase().includes(value.toLowerCase())
    );
    setLocationSuggestions(filtered.slice(0, 6));
  };

  const handleSelectLocation = (selected) => {
    setFilters((prev) => ({ ...prev, location: selected }));
    setLocationSuggestions([]);
  };

  // --- Combined Search ---
  const handleCombinedSearch = () => {
    const { designation, experience, location } = filters;

    const filtered = allJobs.filter((job) => {
      const matchDesignation = designation
        ? job.designation?.toLowerCase().includes(designation.toLowerCase())
        : true;
      const matchLocation = location
        ? job.location?.toLowerCase().includes(location.toLowerCase())
        : true;
      const matchExperience = experience
        ? job.experience?.toLowerCase().includes(experience.toLowerCase())
        : true;

      return matchDesignation && matchLocation && matchExperience;
    });

    setJobs(filtered);
  };


  const toggleChatPopup = () => {
    setShowChatPopup((prev) => !prev);
  };

  return (
    <>
      {/* ===== Navbar ===== */}
      <nav className="recNav-navbar">
        <div className="recNav-left">
          <div className="recNav-logo-container">
            <img src="/jobportal.jpg" alt="Logo" className="recNav-logo-img" />
            <h2 className="recNav-logo-text">RG Portal</h2>
          </div>

          <ul className={`recNav-links ${menuOpen ? "recNav-open" : ""}`}>
            <li>Jobs</li>
            {/* <li onClick={handleCompaniesClick}>Companies</li> */}
            <li>Companies</li>

          </ul>

          <div className="recNav-menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>

        <div className="recNav-center">
          <div className="recNav-search-bar-group" ref={searchContainerRef}>
            {/* Designation Input */}
            <div className="recNav-search-input">
              <input
                type="text"
                placeholder="Enter Designation..."
                value={filters.designation}
                onChange={(e) => handleDesignationChange(e.target.value)}
              />
              {designationSuggestions.length > 0 && (
                <ul className="suggestion-dropdown">
                  {designationSuggestions.map((sug, idx) => (
                    <li key={idx} onClick={() => handleSelectDesignation(sug)}>
                      {sug}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Experience Dropdown */}
            <div className="recNav-search-input">
              <select value={filters.experience} onChange={(e) => handleExperienceChange(e.target.value)}>
                <option value="">Select Experience</option>
                <option value="0">Fresher</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="4">4 years</option>
                <option value="5">5 years</option>
                <option value="6">6 years</option>
                <option value="7">7 years</option>
                <option value="8">8 years</option>
                <option value="9">9 years</option>
                <option value="10">10 years</option>
                <option value="11">11 years</option>
                <option value="12">12 years</option>
                <option value="13">13 years</option>
                <option value="14">14 years</option>
                <option value="15">15 years</option>
                <option value="16">16 years</option>
                <option value="17">17 years</option>
                <option value="18">18 years</option>
                <option value="19">19 years</option>
                <option value="20 +">20 + years</option>
              </select>
            </div>

            {/* Location Input */}
            <div className="recNav-search-input">
              <input
                type="text"
                placeholder="Enter Location..."
                value={filters.location}
                onChange={(e) => handleLocationChange(e.target.value)}
              />
              {locationSuggestions.length > 0 && (
                <ul className="suggestion-dropdown">
                  {locationSuggestions.map((sug, idx) => (
                    <li key={idx} onClick={() => handleSelectLocation(sug)}>
                      {sug}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button className="recNav-search-btn" onClick={handleCombinedSearch} style={{ "marginTop": " 5px" }}>
              Search
            </button>
          </div>

        </div>

        <div className="recNav-right">
          {/* <div className="recNav-item">
            <FaUsers className="recNav-icon-big" />
            <span className="recNav-label">My Network</span>
          </div> */}
          {/* <div className="recNav-item" onClick={toggleChatPopup}>
            <FaEnvelope className="recNav-icon-big" />
            <span className="recNav-label">Messaging</span>
          </div> */}
          <div className="recNav-item">
            <FaUserCircle
              className="recNav-icon-big"
              onClick={() => togglePanel("profile")}
            />
            <span className="recNav-label">Profile</span>
          </div>
        </div>
      </nav>

      {/* ===== Profile Panel ===== */}
      {openPanel === "profile" && (
        <div className="recNav-profile-panel recNav-open">
          <button className="recNav-close-btn" onClick={() => setOpenPanel(null)}>
            X
          </button>
          <div className="recNav-profile-top">
            <img src="icon.png" alt="Profile" className="recNav-profile-pic" />
            <div className="recNav-profile-info">
              <h3>Samruddhi Shekhar Patole</h3>
              <p>B.Sc Computer Science at Dr D Y Patil Law College, Pune</p>
              <button className="recNav-btn-update">View & Update Profile</button>
            </div>
          </div>

          <div className="recNav-performance-block">
            <p className="recNav-performance-text">Your Profile Performance</p>
            <div className="recNav-stats">
              <div className="recNav-stat-item">
                <span className="recNav-stat-number">107</span>
                <span className="recNav-stat-label">Search Appearances</span>
                <button className="recNav-view-btn">View All</button>
              </div>
              <div className="recNav-stat-item">
                <span className="recNav-stat-number">7</span>
                <span className="recNav-stat-label">Recruiter Actions</span>
                <button className="recNav-view-btn">View All</button>
              </div>
            </div>
          </div>

          <div className="recNav-quick-links">
            <a href="#">
              <FaCog className="recNav-quick-icon" /> Settings
            </a>
            <a href="#">
              <FaQuestionCircle className="recNav-quick-icon" /> FAQs
            </a>
            <a href="#">
              <FaSignOutAlt className="recNav-quick-icon" /> Logout
            </a>
          </div>
        </div>
      )}

      {/* ===== Main Dashboard ===== */}
      <div className="recMainContainer">
        {/* Sidebar */}
        <div className="recSidebar">
          <div className="recSidebar-search">
            {/* <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleChange}
              placeholder="Search by keyword..."
            /> */}
          </div>

          <div className="recSidebar-filters">
          <label>
  Location
  <select name="location" value={filters.location} onChange={handleChange}>
    <option>All Locations</option>
    {[...new Set(jobs.map((job) => job.location))].map((loc) => (
      <option key={loc}>{loc}</option>
    ))}
  </select>
</label>

<label>
  Experience
  <select name="experience" value={filters.experience} onChange={handleChange}>
    <option>All Experience Levels</option>
    {[...new Set(jobs.map((job) => job.experience))].map((exp) => (
      <option key={exp}>{exp}</option>
    ))}
  </select>
</label>

<label>
  Salary
  <select name="salary" value={filters.salary} onChange={handleChange}>
    <option>All Salary Ranges</option>
    {[...new Set(jobs.map((job) => job.salary))].map((sal) => (
      <option key={sal}>{sal}</option>
    ))}
  </select>
</label>

<label>
  Designation
  <select name="designation" value={filters.designation} onChange={handleChange}>
    <option>All Job Designations</option>
    {[...new Set(jobs.map((job) => job.designation))].map((role) => (
      <option key={role}>{role}</option>
    ))}
  </select>
</label>

<label>
  Qualification
  <select name="qualification" value={filters.qualification} onChange={handleChange}>
    <option>All Qualifications</option>
    {[...new Set(jobs.map((job) => job.qualification))].map((q) => (
      <option key={q}>{q}</option>
    ))}
  </select>
</label>

<label>
  Company
  <select name="company" value={filters.company} onChange={handleChange}>
    <option>All Companies</option>
    {[...new Set(jobs.map((job) => job.companyName))].map((c) => (
      <option key={c}>{c}</option>
    ))}
  </select>
</label>

          </div>

          <div className="recSidebar-actions">
            <button className="recSidebar-addJD-btn" onClick={handleAddJD}>
              Add JD
            </button>
            <button className="recSidebar-addTest-btn" onClick={handleAddTest}>
              Add Test
            </button>
          </div>
        </div>

        {/* Job Cards */}
        <div className="recJobContainer">
          {loading ? (
            <p>Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            <>
            {filteredJobs.slice(0, visibleCount).map((job) => (
                <div key={job.requirementId} className="recJobCard">
                  <div className="recJobCard-left">
                    <p><strong>Requirement ID:</strong> {job.requirementId}</p>
                    <p><strong>Company Name :</strong> {job.companyName}</p>
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Experience:</strong> {job.experience}</p>
                    <p><strong>Designation:</strong> {job.designation}</p>
                  </div>
                  <div className="recJobCard-right">
                    <p>
                      <strong>Applications:</strong>{" "}
                      <button
                        className="app-count-btn"
                        onClick={() => handleViewApplicants(job.requirementId)}
                      >
                        {job.applications}
                      </button>
                    </p>

                  </div>

                 <div
  style={{
    width: "100%",
    marginTop: "10px",
    textAlign: "right",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px", // spacing between buttons
  }}
>
                    {/* {userType === "PortalEmp" && ( */}
<div style={{ display: "flex", alignItems: "center" }}>
  <button
    className="recJobCard-edit-btn"
    onClick={() => handleEdit(job.requirementId)}
    title="Edit Job"
  >
    <FaPencilAlt />
  </button>

  <button
    className="recJobCard-delete-btn"
    onClick={() => handleDelete(job.requirementId)}
    title="Delete Job"
  >
    <FaTrashAlt />
  </button>
</div>


                    <button
                      className="recJobCard-view-btn"
                      onClick={() => handleViewJD(job.requirementId)}
                    >
                      View JD
                    </button>
                  </div>
                </div>
              ))}

              {visibleCount < jobs.length && (
                <button
                  className="recJobCard-showmore-btn"
                  onClick={() => setVisibleCount((prev) => prev + 3)}
                  style={{ marginTop: "20px" }}
                >
                  Show More
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ===== TEST TYPE POPUP ===== */}
      {showTestPopup && (
        <div className="test-popup-overlay">
          <div className="test-popup-box">
            <h3>Select Test Type</h3>
            <div className="test-popup-buttons">
              <button
                className="popup-btn-technical"
                onClick={() => handleTestType("technical")}
              >
                Technical
              </button>
              <button
                className="popup-btn-nontechnical"
                onClick={() => handleTestType("nontechnical")}
              >
                Non-Technical
              </button>
            </div>
            <button
              className="popup-close-btn"
              onClick={() => setShowTestPopup(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ===== JD DETAILS MODAL ===== */}
      {showJDModal && selectedJD && (
        <div className="jd-modal-overlay">
          <div className="jd-modal-box">
            <button className="jd-modal-close" onClick={() => setShowJDModal(false)}>
              ×
            </button>

            <h2 className="jd-modal-title">Job Description Details</h2>
            <div className="jd-modal-scroll">
              <section className="jd-section">
                <h3>Overview</h3>
                <div className="jd-grid">
                  <p><strong>Requirement ID:</strong> {selectedJD.requirementId}</p>
                  <p><strong>Company Name:</strong> {selectedJD.companyName}</p>
                  <p><strong>Designation:</strong> {selectedJD.designation}</p>
                  <p><strong>Location:</strong> {selectedJD.location}</p>
                  <p><strong>Job Type:</strong> {selectedJD.jobType}</p>
                  <p><strong>Salary:</strong> {selectedJD.salary}</p>
                  <p><strong>Experience:</strong> {selectedJD.experience}</p>
                  <p><strong>Shift:</strong> {selectedJD.shift}</p>
                  <p><strong>Week Off:</strong> {selectedJD.weekOff}</p>
                  <p><strong>Notice Period:</strong> {selectedJD.noticePeriod}</p>
                </div>
              </section>
              <section className="jd-section">
                <h3>Qualification & Skills</h3>
                <div className="jd-grid">
                  <p><strong>Qualification:</strong> {selectedJD.qualification}</p>
                  <p><strong>Field:</strong> {selectedJD.field}</p>
                  <p><strong>Stream:</strong> {selectedJD.stream}</p>
                  <p><strong>Percentage:</strong> {selectedJD.percentage}</p>
                  <p><strong>Skills:</strong> {selectedJD.skills}</p>
                </div>
              </section>
              <section className="jd-section">
                <h3>Perks & Other Details</h3>
                <div className="jd-grid">
                  <p><strong>Perks:</strong> {selectedJD.perks}</p>
                  <p><strong>Incentive:</strong> {selectedJD.incentive}</p>
                  <p><strong>Reporting Hierarchy:</strong> {selectedJD.reportingHierarchy}</p>
                  <p><strong>Bond:</strong> {selectedJD.bond}</p>
                  <p><strong>Documentation:</strong> {selectedJD.documentation}</p>
                  <p><strong>Age Criteria:</strong> {selectedJD.ageCriteria}</p>
                </div>
              </section>
              <section className="jd-section">
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
              <section className="jd-section">
                <h3>Job Requirements</h3>
                {selectedJD.jobRequirements?.length > 0 ? (
                  <ul>
                    {selectedJD.jobRequirements.map((r, i) => (
                      <li key={i}>{r.jobRequirementMsg}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No requirements provided.</p>
                )}
              </section>
              <section className="jd-section">
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

      {/* ===== CHAT POPUP ===== */}
      {/* {showChatPopup && (
        <div className="chat-popup-overlay">
          <div className="chat-popup-box">
            <div className="chat-popup-header">
              <h3>Messages</h3>
              <button className="chat-popup-close" onClick={() => setShowChatPopup(false)}>×</button>
            </div>

            <div className="chat-popup-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${msg.sender === "You" ? "chat-sent" : "chat-received"}`}
                >
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              ))}
            </div>

            <div className="chat-popup-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button
                onClick={() => {
                  if (newMessage.trim() !== "") {
                    setMessages([...messages, { sender: "You", text: newMessage }]);
                    setNewMessage("");
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )} */}
      {showApplicantsPopup && (
        <div className="applicant-popup-overlay">
          <div className="applicant-popup-box new-applicant-box">

            <div className="applicant-header">
              <h3>Applicants ({applicants.length})</h3>
              <button className="popup-close-btn" onClick={() => setShowApplicantsPopup(false)}>×</button>
            </div>

            {applicants.length === 0 ? (
              <p className="no-applicants">No applicants yet.</p>
            ) : (
              <div className="applicant-table-container">
                <table className="applicant-table modern-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Education</th>
                      <th>Applied</th>
                      <th>Test Score</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {applicants
                      .slice()
                      .sort((a, b) => {
                        // If both have scores → sort descending
                        if (a.testScore != null && b.testScore != null) {
                          return b.testScore - a.testScore;
                        }
                        // If only a has score → a first
                        if (a.testScore != null && b.testScore == null) {
                          return -1;
                        }
                        // If only b has score → b first
                        if (a.testScore == null && b.testScore != null) {
                          return 1;
                        }
                        // Both no score → keep original order
                        return 0;
                      })
                      .map((c, i) => (
                        <tr key={i}>
                          <td>{c.fullName}</td>
                          <td>{c.contactNumber}</td>
                          <td>{c.educationalQualification}</td>
                          <td>{new Date(c.submittedAt).toLocaleDateString()}</td>
                          <td>
                            {c.testScore != null ? c.testScore : "Test not given"}
                          </td>
                          <td>
                            <button className="btn-small view-btn">View Resume</button>
                            <button className="btn-small primary-btn">Shortlist</button>
                            <button className="btn-small danger-btn">Reject</button>
                          </td>
                        </tr>
                      ))}

                  </tbody>


                </table>
              </div>
            )}
          </div>
        </div>
      )}


    </>
  );
};

export default RecruiterNavbar;
