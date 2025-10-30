import { useState } from "react";
import "./ShareInterviewQuestions.css";

export default function ShareInterviewQuestions() {
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    difficulty: "",
    experience: "",
    questions: [{ question: "", answer: "" }],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][e.target.name] = e.target.value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const addQuestion = () => {
    if (formData.questions.length < 5) {
      setFormData({
        ...formData,
        questions: [...formData.questions, { question: "", answer: "" }],
      });
    } else {
      alert("You can add up to 5 questions only.");
    }
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:8080/api/interview-experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Interview experience submitted successfully!");
      setFormData({
        companyName: "",
        position: "",
        difficulty: "",
        experience: "",
        questions: [{ question: "", answer: "" }],
      });
    } else {
      alert("Failed to submit experience.");
    }
  } catch (err) {
    console.error("Error submitting experience:", err);
  }
};


  return (
    <div className="share-experience-container">
      <h2>Share Your Interview Experience</h2>
      <form onSubmit={handleSubmit} className="experience-form">
        <label>Company Name</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Enter company name"
          required
        />

        <label>Position</label>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Enter position"
          required
        />

        <label>Difficulty Level</label>
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
        >
          <option value="">Select difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Moderate">Moderate</option>
          <option value="Hard">Hard</option>
        </select>

        <label>Describe Your Experience</label>
        <textarea
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Write about your overall experience..."
          rows="5"
        ></textarea>

        {/* Dynamic Questions Section */}
        <div className="questions-section">
          <h3>Interview Questions</h3>
          {formData.questions.map((qa, index) => (
            <div key={index} className="qa-pair">
              <input
                type="text"
                name="question"
                value={qa.question}
                onChange={(e) => handleQuestionChange(index, e)}
                placeholder={`Question ${index + 1}`}
                required
              />
              <textarea
                name="answer"
                value={qa.answer}
                onChange={(e) => handleQuestionChange(index, e)}
                placeholder="Answer"
                rows="2"
                required
              ></textarea>
              {formData.questions.length > 1 && (
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => removeQuestion(index)}
                >
                  ❌
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="add-btn"
            onClick={addQuestion}
            disabled={formData.questions.length >= 5}
          >
            ➕ Add Question
          </button>
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
}
