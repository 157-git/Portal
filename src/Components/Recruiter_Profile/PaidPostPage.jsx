import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PaidPostPage.css";

const PaidPostPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [showPopup, setShowPopup] = useState(false);
  const [method, setMethod] = useState("upi");
  const [upiApp, setUpiApp] = useState("");
  const [bank, setBank] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [remainingDays, setRemainingDays] = useState(0);
  const [planStatus, setPlanStatus] = useState(null);

  const recruiterId = 1; // ✅ static ID for now (no login needed)

  const plans = {
    basic: { price: 499, title: "Basic Plan", posts: "1 Job Posting" },
    standard: { price: 999, title: "Standard Plan", posts: "3 Job Postings" },
    premium: { price: 1999, title: "Premium Plan", posts: "10 Job Postings" },
  };

  // Fetch plan info on load
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/plan/${recruiterId}`);
        if (res.ok) {
          const data = await res.json();
          const today = new Date();
          const expiry = new Date(data.expiryDate);
          const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
          if (diff > 0) setRemainingDays(diff);
        }
      } catch (error) {
        console.error("Error fetching plan:", error);
      }
    };
    fetchPlan();
  }, []);

  // Save or extend plan
  const savePlanToBackend = async () => {
    const days = 30; // all plans last 30 days

    try {
      const response = await fetch("http://localhost:8080/api/plan/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recruiterId,
          planType: selectedPlan,
          days,
        }),
      });

      if (response.ok) {
        console.log("✅ Plan saved/extended successfully!");
      } else {
        console.error("❌ Failed to update plan");
      }
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  };

  // Check plan status
  const checkPlanStatus = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/plan/status/${recruiterId}`);
      const data = await res.json();
      setPlanStatus(data);
    } catch (error) {
      console.error("Error checking plan status:", error);
    }
  };

  const handlePayment = () => setShowPopup(true);

  const confirmPayment = async () => {
    setShowPopup(false);
    await savePlanToBackend();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate("/add-job-description");
    }, 2000);
  };

  return (
    <div className="paidPost-container">
      <h1>Choose a Job Posting Plan</h1>
      <p>Select a plan that fits your hiring needs</p>

      {remainingDays > 0 && (
        <p className="remaining-days">
          You have {remainingDays} days left on your current plan.
        </p>
      )}

      <div className="plans">
        {Object.keys(plans).map((key) => (
          <div
            key={key}
            className={`plan-card ${selectedPlan === key ? "selected" : ""}`}
            onClick={() => setSelectedPlan(key)}
          >
            <h2>{plans[key].title}</h2>
            <p className="price">₹{plans[key].price}</p>
            <p>{plans[key].posts}</p>
            <p>Visible for 30 Days</p>
          </div>
        ))}
      </div>

      {/* === SAME STYLE BUTTONS === */}
      <div className="action-buttons">
        <button className="main-btn" onClick={handlePayment}>
          Proceed to Pay ₹{plans[selectedPlan].price}
        </button>
        <button className="main-btn secondary" onClick={checkPlanStatus}>
          Check My Plan Status
        </button>
      </div>

      {/* === PLAN STATUS DISPLAY === */}
     {planStatus && (
  <div className="plan-status-box animated-status">
    <h3>📊 Plan Status</h3>
    <p><strong>Plan Type:</strong> {planStatus.planType}</p>
    <p><strong>Expiry Date:</strong> {planStatus.expiryDate}</p>
    <p><strong>Remaining Days:</strong> {planStatus.remainingDays}</p>
    <p
      className={`status-message ${planStatus.active ? "active" : "expired"}`}
    >
      {planStatus.message}
    </p>
  </div>
)}


      {/* === PAYMENT POPUP === */}
      {showPopup && (
        <div className="payment-overlay">
          <div className="payment-popup">
            <button className="close-btn" onClick={() => setShowPopup(false)}>
              ✖
            </button>
            <h3>Choose Payment Method</h3>

            <div className="method-tabs">
              {["upi", "card", "netbanking", "wallet"].map((m) => (
                <button
                  key={m}
                  className={method === m ? "active" : ""}
                  onClick={() => setMethod(m)}
                >
                  {m === "upi"
                    ? "UPI"
                    : m === "card"
                    ? "Card"
                    : m === "netbanking"
                    ? "Net Banking"
                    : "Wallet"}
                </button>
              ))}
            </div>

            <div className="method-content">
              {method === "upi" && (
                <div className="upi-options">
                  <p>Select UPI App:</p>
                  <div className="upi-apps">
                    {["Google Pay", "PhonePe", "Paytm", "BharatPe"].map((app) => (
                      <div
                        key={app}
                        className={`upi-app ${upiApp === app ? "selected" : ""}`}
                        onClick={() => setUpiApp(app)}
                      >
                        <img
                          src={`https://logo.clearbit.com/${app
                            .replace(" ", "")
                            .toLowerCase()}.com`}
                          alt={app}
                          onError={(e) => (e.target.style.display = "none")}
                        />
                        <span>{app}</span>
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g. name@okaxis)"
                    className="upi-input"
                  />
                </div>
              )}
            </div>

            <div className="popup-buttons">
              <button className="pay-btn" onClick={confirmPayment}>
                Pay Now ₹{plans[selectedPlan].price}
              </button>
              <button className="cancel-btn" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === SUCCESS POPUP === */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-box">
            <div className="tick-mark">
              <div className="circle"></div>
              <div className="check"></div>
            </div>
            <h3>Payment Successful!</h3>
            <p>Redirecting to job posting page...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaidPostPage;
