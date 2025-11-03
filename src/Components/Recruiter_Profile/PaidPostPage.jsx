import React, { useState } from "react";
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

  const plans = {
    basic: { price: 499, title: "Basic Plan", posts: "1 Job Posting" },
    standard: { price: 999, title: "Standard Plan", posts: "3 Job Postings" },
    premium: { price: 1999, title: "Premium Plan", posts: "10 Job Postings" },
  };

  const handlePayment = () => setShowPopup(true);

  const confirmPayment = () => {
    setShowPopup(false);
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

      <button className="proceed-btn" onClick={handlePayment}>
        Proceed to Pay ₹{plans[selectedPlan].price}
      </button>

      {/* Payment Popup */}
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

            {/* Dynamic content */}
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

              {method === "card" && (
                <div className="card-details">
                  <input type="text" placeholder="Card Number" />
                  <div className="card-row">
                    <input type="text" placeholder="MM/YY" />
                    <input type="text" placeholder="CVV" />
                  </div>
                  <input type="text" placeholder="Cardholder Name" />
                </div>
              )}

              {method === "netbanking" && (
                <div className="bank-list">
                  <p>Select Your Bank:</p>
                  <div className="banks">
                    {["SBI", "HDFC", "ICICI", "Axis", "Kotak"].map((b) => (
                      <div
                        key={b}
                        className={`bank ${bank === b ? "selected" : ""}`}
                        onClick={() => setBank(b)}
                      >
                        🏦 {b}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {method === "wallet" && (
                <div className="wallets">
                  {["Amazon Pay", "Mobikwik", "Freecharge"].map((w) => (
                    <div key={w} className="wallet">
                      💼 {w}
                    </div>
                  ))}
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

      {/* Success Modal */}
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
