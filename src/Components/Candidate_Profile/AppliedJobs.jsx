import React, { useEffect, useState } from "react";
import { FaBuilding, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import "./AppliedJobs.css";

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("appliedJobsList")) || [];
    // show latest first
    setAppliedJobs([...list].reverse());
  }, []);

  return (
    <div className="applied-container">
      <h1>Applied Jobs</h1>

      {appliedJobs.length === 0 ? (
        <p className="no-jobs">You haven’t applied for any jobs yet.</p>
      ) : (
        <div className="applied-list">
          {appliedJobs.map((job, i) => (
            <div className="applied-card" key={i}>
              <div className="applied-header">
                <h2>{job.designation}</h2>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="view-jd-link"
                >
                  View Job Description ↗
                </a>
              </div>

              <div className="applied-info">
                <p><FaBuilding className="icon" /> {job.companyName}</p>
                <p><FaMapMarkerAlt className="icon" /> {job.location}</p>
                <p><FaClock className="icon" /> Applied on {job.appliedOn}</p>
              </div>

              <button className="applied-btn">View Application</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
