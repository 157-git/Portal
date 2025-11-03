import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SavedJobs.css";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:8080/api/saved-jobs/candidate/1/details");
      setSavedJobs(res.data);
    };
    fetchData();
  }, []);

  return (
    <div className="savedjobs-container">
      <h2 className="savedjobs-title">⭐ Saved Jobs</h2>

      {savedJobs.length === 0 ? (
        <p className="savedjobs-empty">No saved jobs yet.</p>
      ) : (
        <div className="savedjobs-grid">
          {savedJobs.map(job => (
            <div key={job.id} className="savedjobs-card">
              <h3>{job.requirement.companyName}</h3>
              <p><b>Role:</b> {job.requirement.jobRole}</p>
              <p><b>Location:</b> {job.requirement.location}</p>

              <button className="view-btn">View Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
