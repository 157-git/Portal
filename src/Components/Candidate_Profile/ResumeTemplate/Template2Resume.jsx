// Template2Resume.jsx
import React, { useState, useRef } from "react";
// import html2pdf from "html2pdf.js";
import "./Template2Resume.css";

const Template2Resume = ({ onBack }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const pdfRef = useRef();

  const [profile, setProfile] = useState({
    name: "Jonathan Smith",
    title: "Product Manager",
    summary:
      "Dedicated and results-driven professional with over 6 years of experience in managing product lifecycles, improving customer satisfaction, and delivering innovative solutions.",
    contact: {
      phone: "+1 234-567-8901",
      email: "jonathan.smith@email.com",
      location: "New York, USA",
    },
    experience: [
      {
        years: "2021 - Present",
        company: "Tech Innovators Inc.",
        role: "Senior Product Manager",
        details:
          "Overseeing product strategy and development for SaaS products. Collaborating with cross-functional teams to ensure product success and customer satisfaction.",
      },
      {
        years: "2018 - 2021",
        company: "BrightApps Co.",
        role: "Product Manager",
        details:
          "Led the redesign of the company’s flagship mobile app, increasing user engagement by 40%. Worked closely with developers and designers to improve UX.",
      },
    ],
    education: [
      {
        years: "2014 - 2018",
        degree: "Bachelor of Business Administration",
        school: "Stanford University",
      },
    ],
    skills: [
      "Leadership",
      "Strategic Planning",
      "Agile Development",
      "Team Collaboration",
      "Market Analysis",
    ],
    languages: ["English", "Spanish"],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [section, key] = name.split(".");
      setProfile((prev) => ({
        ...prev,
        [section]: { ...prev[section], [key]: value },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (e, arrayName, index, field) => {
    const { value } = e.target;
    setProfile((prev) => {
      const arr = [...prev[arrayName]];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [arrayName]: arr };
    });
  };

  const downloadPDF = () => {
    const element = pdfRef.current;
    const options = {
      filename: `${profile.name.replace(/\s+/g, "_")}_Resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(options).from(element).save();
  };

  return (
    <div className="template2-wrapper">
      <div className="template2-controls">
        {isPreviewMode ? (
          <>
            <button className="t2-btn" onClick={() => setIsPreviewMode(false)}>
              Edit
            </button>
            <button className="t2-btn" onClick={downloadPDF}>
              Download PDF
            </button>
            <button className="t2-btn" onClick={onBack}>
              Back
            </button>
          </>
        ) : (
          <>
            <button className="t2-btn" onClick={() => setIsPreviewMode(true)}>
              Preview
            </button>
            <button className="t2-btn" onClick={onBack}>
              Back
            </button>
          </>
        )}
      </div>

      <div className="template2-side-by-side">
        {!isPreviewMode && (
          <div className="template2-form">
            <h2>Edit Resume</h2>

            <div className="t2-field">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </div>

            <div className="t2-field">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={profile.title}
                onChange={handleChange}
              />
            </div>

            <div className="t2-field">
              <label>Profile Summary</label>
              <textarea
                name="summary"
                rows="3"
                value={profile.summary}
                onChange={handleChange}
              />
            </div>

            <h3>Contact</h3>
            <div className="t2-field">
              <label>Phone</label>
              <input
                type="text"
                name="contact.phone"
                value={profile.contact.phone}
                onChange={handleChange}
              />
            </div>
            <div className="t2-field">
              <label>Email</label>
              <input
                type="text"
                name="contact.email"
                value={profile.contact.email}
                onChange={handleChange}
              />
            </div>
            <div className="t2-field">
              <label>Location</label>
              <input
                type="text"
                name="contact.location"
                value={profile.contact.location}
                onChange={handleChange}
              />
            </div>

            <h3>Experience</h3>
            {profile.experience.map((exp, i) => (
              <div key={i} className="t2-exp-item">
                <input
                  type="text"
                  value={exp.years}
                  onChange={(e) => handleArrayChange(e, "experience", i, "years")}
                  placeholder="Years"
                />
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) =>
                    handleArrayChange(e, "experience", i, "company")
                  }
                  placeholder="Company"
                />
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => handleArrayChange(e, "experience", i, "role")}
                  placeholder="Role"
                />
                <textarea
                  value={exp.details}
                  onChange={(e) =>
                    handleArrayChange(e, "experience", i, "details")
                  }
                  rows="2"
                  placeholder="Description"
                />
              </div>
            ))}

            <h3>Education</h3>
            {profile.education.map((edu, i) => (
              <div key={i} className="t2-edu-item">
                <input
                  type="text"
                  value={edu.years}
                  onChange={(e) => handleArrayChange(e, "education", i, "years")}
                  placeholder="Years"
                />
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) =>
                    handleArrayChange(e, "education", i, "degree")
                  }
                  placeholder="Degree"
                />
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) =>
                    handleArrayChange(e, "education", i, "school")
                  }
                  placeholder="School"
                />
              </div>
            ))}

            <h3>Skills</h3>
            <input
              type="text"
              name="skills"
              value={profile.skills.join(", ")}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  skills: e.target.value.split(",").map((s) => s.trim()),
                }))
              }
            />

            <h3>Languages</h3>
            <input
              type="text"
              name="languages"
              value={profile.languages.join(", ")}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  languages: e.target.value.split(",").map((l) => l.trim()),
                }))
              }
            />
          </div>
        )}

        <div className="template2-preview" ref={pdfRef}>
          <div className="t2-header">
            <h1>{profile.name}</h1>
            <h3>{profile.title}</h3>
            <p>
              {profile.contact.phone} | {profile.contact.email} |{" "}
              {profile.contact.location}
            </p>
          </div>

          <div className="t2-section">
            <h4>Profile Summary</h4>
            <p>{profile.summary}</p>
          </div>

          <div className="t2-section">
            <h4>Experience</h4>
            {profile.experience.map((exp, i) => (
              <div key={i} className="t2-exp">
                <p className="t2-years">{exp.years}</p>
                <p className="t2-role">
                  <strong>{exp.role}</strong> — {exp.company}
                </p>
                <p className="t2-details">{exp.details}</p>
              </div>
            ))}
          </div>

          <div className="t2-section">
            <h4>Education</h4>
            {profile.education.map((edu, i) => (
              <div key={i} className="t2-edu">
                <p className="t2-years">{edu.years}</p>
                <p className="t2-degree">
                  <strong>{edu.degree}</strong> — {edu.school}
                </p>
              </div>
            ))}
          </div>

          <div className="t2-section">
            <h4>Additional Information</h4>
            <p>
              <strong>Skills:</strong> {profile.skills.join(", ")}
            </p>
            <p>
              <strong>Languages:</strong> {profile.languages.join(", ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template2Resume;
