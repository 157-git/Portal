import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import UserTypeSelection from "./Components/UserTypeSelection.jsx";
import LoginPage from "./Components/LoginPage.jsx";
import EmployeeRoles from "./Components/EmployeeRoles.jsx";
import RegisterPage from "./Components/RegisterPage.jsx";
import RegisterEmp from "./Components/RegisterEmp.jsx";
import Navbar from "./Components/Candidate_Profile/Navbar.jsx";

// Recruiter-related components
import RecruiterNavbar from "./Components/Recruiter_Profile/RecruiterNavbar.jsx";

// Candidate-related components
import JobApplicationForm from "./Components/Candidate_Profile/JobApplicationForm.jsx";
import InterviewFAQ from "./Components/Candidate_Profile/InterviewFAQ.jsx";
import ShareInterviewQuestions from "./Components/Candidate_Profile/ShareInterviewQuestions.jsx";
import SalaryHikeCalculator from "./Components/Candidate_Profile/SalaryHikeCalculator.jsx";
import AddJobDescription from "./Components/Recruiter_Profile/AddJobDescription.jsx";
import AppliedJobs from "./Components/Candidate_Profile/AppliedJobs.jsx";
import LoginEmp from "../../src/src/Components/LoginEmp.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserTypeSelection />} />
        <Route path="/employee-roles" element={<EmployeeRoles />} />
        <Route path="/login/:userType/:role?" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/loginemp" element={<LoginEmp/>}/>
        <Route path="/registerCandidate" element={<RegisterPage />} />
        <Route path="/registerEmp" element={<RegisterEmp />} />

        {/* Recruiter routes */}
        <Route path="/recruiter-navbar" element={<RecruiterNavbar />} />
        <Route path="/add-job-description" element={<AddJobDescription />} />

        {/* General */}
        <Route path="/navbar" element={<Navbar />} />

        {/* Candidate routes */}
        <Route path="/apply/:id" element={<JobApplicationForm />} />
        <Route path="/interview-faqs" element={<InterviewFAQ />} />
        <Route path="/share-experience" element={<ShareInterviewQuestions />} />
        <Route path="/salary-hike-calculator" element={<SalaryHikeCalculator />} />
        <Route path="/applied-jobs" element={<AppliedJobs/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
