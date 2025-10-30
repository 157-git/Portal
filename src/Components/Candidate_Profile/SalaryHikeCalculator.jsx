import { useState } from "react";
import "./SalaryHikeCalculator.css";

export default function SalaryHikeCalculator() {
  const [currentSalary, setCurrentSalary] = useState("");
  const [hikePercent, setHikePercent] = useState("");
  const [newSalary, setNewSalary] = useState(null);

  const calculateHike = (e) => {
    e.preventDefault();
    if (!currentSalary || !hikePercent) return;
    const calculated = parseFloat(currentSalary) * (1 + parseFloat(hikePercent) / 100);
    setNewSalary(calculated.toFixed(2));
  };

  return (
    <div className="calculator-container">
      <h2>Salary Hike Calculator</h2>

      <form onSubmit={calculateHike} className="calculator-form">
        <label>Current Salary (₹)</label>
        <input
          type="number"
          placeholder="Enter your current salary"
          value={currentSalary}
          onChange={(e) => setCurrentSalary(e.target.value)}
          required
        />

        <label>Expected Hike (%)</label>
        <input
          type="number"
          placeholder="Enter expected hike percentage"
          value={hikePercent}
          onChange={(e) => setHikePercent(e.target.value)}
          required
        />

        <button type="submit" className="calc-btn">Calculate</button>
      </form>

      {newSalary && (
        <div className="result-box">
          <h3>Estimated New Salary:</h3>
          <p>₹ {newSalary}</p>
        </div>
      )}
    </div>
  );
}
