import React, { useState, useRef } from "react";
// import html2pdf from "html2pdf.js";
import "./template1Resume.css";

const Template1Resume = ({
  ResumeFromApplicantForm = false,
  onClose,
  onCVDownload,
  onSetCV,
  onBack,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const [profile, setProfile] = useState({
    title: {
      name: "AHMDD SAAH",
      designation: "Marketing Manager",
    },
    profileText: `"Neimo ensiont est atem Aham ipsum, finifam imbo sido. Intum lumina parco regia Aham extra mola idis. Commodo Aham antepor yumo finiam carius, domus serim lacur Aham. Mauris solitudo Aham in albaidis, ceras vita Aham elit exidio leo, adipisci sector elit."`,
    contact: {
      phone: "+124-4236-7894",
      email: "hello@ahmedd saaahh.com",
      address: "123fdfdgdg., Any City",
      website: "www.ahmedd saaahh.com",
      phone2: "+124-4236-7894",
      email2: "hello@ahmedd saaahh.com",
    },
    reference: {
      name: "Estelle Darcy",
      phoneLabel: "Phone:",
      emailLabel: "Email :",
      companyAndRole: "Wardiere Inc. / CTO",
    },
    skills: [
      "Strategic Planning",
      "Problem Solving",
      "Crisis Management",
      "Creative Thinking",
      "Data Analysis",
      "Brand Development",
      "Negotiation",
      "Customer Orientation",
      "Adaptability to Change",
    ],
    languages: ["English (Fluent)"],
    experience: [
      {
        dates: "2030 - Present",
        company: "Borcelle Studio",
        title: "Marketing Manager & Specialist",
        description:
          "Formulate and implement detailed marketing strategies and initiatives that support the company's mission and objectives. Guide, inspire, and oversee a dynamic marketing team, promoting a collaborative and performance-oriented culture. Ensure uniformity of the brand across all marketing platforms and materials.",
      },
      {
        dates: "2025 - 2029",
        company: "Fauget Studio",
        title: "Marketing Manager & Specialist",
        description:
          "Formulate and implement detailed marketing strategies and initiatives that support the company's mission and objectives. Guide, inspire, and oversee a dynamic marketing team, promoting a collaborative and performance-oriented culture.",
      },
      {
        dates: "2024 - 2025",
        company: "Studio Shodwe",
        title: "Marketing Manager & Specialist",
        description:
          "Formulate and implement detailed marketing strategies and initiatives that support the company's mission and objectives.",
      },
    ],
    education: [
      {
        dates: "2029 - 2031",
        degree: "Master of Business Management",
        institute: "School of Business | Wardiere University",
      },
    ],
  });

  const formRef = useRef(null);

  // ---------- Helper Functions ----------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "skills" || name === "languages") {
      setProfile((prev) => ({
        ...prev,
        [name]: value.split(",").map((s) => s.trim()).filter(Boolean),
      }));
      return;
    }
    if (name.includes(".")) {
      const [section, key] = name.split(".");
      setProfile((prev) => ({
        ...prev,
        [section]: { ...prev[section], [key]: value },
      }));
      return;
    }
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, arrayName, index, field) => {
    const { value } = e.target;
    setProfile((prev) => {
      const arr = [...prev[arrayName]];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [arrayName]: arr };
    });
  };

  const addArrayItem = (arrayName, template = {}) => {
    setProfile((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], template],
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setProfile((prev) => {
      const arr = [...prev[arrayName]];
      arr.splice(index, 1);
      return { ...prev, [arrayName]: arr };
    });
  };

  const downloadPDF = () => {
    const element = document.querySelector(".template1-preview-container");
    if (!element) return;

    const options = {
      filename: `${profile.title.name.replace(/\s+/g, "_")}_Resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(options).save();
  };

  const handleSetCV = () => {
    const element = document.querySelector(".template1-preview-container");
    if (!element) return;

    const options = {
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .from(element)
      .set(options)
      .outputPdf("datauristring")
      .then((pdfData) => {
        if (typeof onSetCV === "function") onSetCV(pdfData);
      });
  };

  const arrayToInputValue = (arr) =>
    arr && arr.length ? arr.join(", ") : "";

  // ---------- Render ----------
  return (
    <div className="template1-wrapper">
      <div className="template1-top-controls">
        {isPreviewMode ? (
          <div className="template1-control-row">
            <button
              className="template1-btn template1-back"
              onClick={() => {
                setIsPreviewMode(false);
                setShowForm(true);
              }}
            >
              Back
            </button>
            <button className="template1-btn" onClick={downloadPDF}>
              Download PDF
            </button>
            <button className="template1-btn" onClick={handleSetCV}>
              Set Resume
            </button>
            {typeof onBack === "function" && (
              <button className="template1-btn" onClick={onBack}>
                Close
              </button>
            )}
          </div>
        ) : (
          <div className="template1-control-row">
            <button
              className="template1-btn"
              onClick={() => setIsPreviewMode(true)}
            >
              Preview
            </button>
            <button
              className="template1-btn"
              onClick={() => typeof onBack === "function" && onBack()}
            >
              Back
            </button>
          </div>
        )}
      </div>

      <div className="template1-main">
  {/* SIDE-BY-SIDE: Form (left) + Preview (right) */}
  <div className="template1-side-by-side">
    {/* ===== Left Side — Form ===== */}
    <div className="template1-form" ref={formRef}>
      <h2 className="template1-form-heading">Resume Form</h2>

      {/* Name & Designation */}
      <div className="trow">
        <label>Name</label>
        <input
          type="text"
          name="title.name"
          value={profile.title.name}
          onChange={handleInputChange}
        />
      </div>
      <div className="trow">
        <label>Designation</label>
        <input
          type="text"
          name="title.designation"
          value={profile.title.designation}
          onChange={handleInputChange}
        />
      </div>

      {/* Profile */}
      <div className="trow">
        <label>Profile (About)</label>
        <textarea
          name="profileText"
          value={profile.profileText}
          onChange={handleInputChange}
          rows={4}
        />
      </div>

      {/* Contact Info */}
      <div className="tsection">
        <h3>Contact Info</h3>
        <input
          placeholder="Phone"
          name="contact.phone"
          value={profile.contact.phone}
          onChange={handleInputChange}
        />
        <input
          placeholder="Email"
          name="contact.email"
          value={profile.contact.email}
          onChange={handleInputChange}
        />
        <input
          placeholder="Address"
          name="contact.address"
          value={profile.contact.address}
          onChange={handleInputChange}
        />
        <input
          placeholder="Website"
          name="contact.website"
          value={profile.contact.website}
          onChange={handleInputChange}
        />
      </div>

      {/* Skills & Languages */}
      <div className="tsection">
        <h3>Skills & Languages</h3>
        <input
          placeholder="Skills (comma separated)"
          name="skills"
          value={arrayToInputValue(profile.skills)}
          onChange={handleInputChange}
        />
        <input
          placeholder="Languages (comma separated)"
          name="languages"
          value={arrayToInputValue(profile.languages)}
          onChange={handleInputChange}
        />
      </div>

      {/* Reference */}
      <div className="tsection">
        <h3>Reference</h3>
        <input
          placeholder="Name"
          name="reference.name"
          value={profile.reference.name}
          onChange={handleInputChange}
        />
        <input
          placeholder="Company / Role"
          name="reference.companyAndRole"
          value={profile.reference.companyAndRole}
          onChange={handleInputChange}
        />
        <input
          placeholder="Phone Label"
          name="reference.phoneLabel"
          value={profile.reference.phoneLabel}
          onChange={handleInputChange}
        />
        <input
          placeholder="Email Label"
          name="reference.emailLabel"
          value={profile.reference.emailLabel}
          onChange={handleInputChange}
        />
      </div>

      {/* Work Experience */}
      <div className="tsection">
        <h3>Work Experience</h3>
        {profile.experience.map((exp, i) => (
          <div key={i} className="texp">
            <input
              placeholder="Dates"
              value={exp.dates}
              onChange={(e) =>
                handleArrayChange(e, "experience", i, "dates")
              }
            />
            <input
              placeholder="Company"
              value={exp.company}
              onChange={(e) =>
                handleArrayChange(e, "experience", i, "company")
              }
            />
            <input
              placeholder="Title"
              value={exp.title}
              onChange={(e) =>
                handleArrayChange(e, "experience", i, "title")
              }
            />
            <textarea
              placeholder="Description"
              value={exp.description}
              onChange={(e) =>
                handleArrayChange(e, "experience", i, "description")
              }
            />
            <button
              onClick={() => removeArrayItem("experience", i)}
              className="small-btn"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            addArrayItem("experience", {
              dates: "",
              company: "",
              title: "",
              description: "",
            })
          }
        >
          + Add Experience
        </button>
      </div>

      {/* Education */}
      <div className="tsection">
        <h3>Education</h3>
        {profile.education.map((edu, i) => (
          <div key={i} className="tedu">
            <input
              placeholder="Dates"
              value={edu.dates}
              onChange={(e) =>
                handleArrayChange(e, "education", i, "dates")
              }
            />
            <input
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) =>
                handleArrayChange(e, "education", i, "degree")
              }
            />
            <input
              placeholder="Institute"
              value={edu.institute}
              onChange={(e) =>
                handleArrayChange(e, "education", i, "institute")
              }
            />
            <button
              onClick={() => removeArrayItem("education", i)}
              className="small-btn"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            addArrayItem("education", {
              dates: "",
              degree: "",
              institute: "",
            })
          }
        >
          + Add Education
        </button>
      </div>
    </div>

    {/* ===== Right Side — Live Resume Preview ===== */}
    <div className="template1-preview-area">
      <div className="template1-preview-container" id="template1-preview">
        {/* Header */}
        <div className="template1-header">
          <h1 className="template1-name">{profile.title.name}</h1>
          <h3 className="template1-designation">{profile.title.designation}</h3>
        </div>

        <div className="template1-columns">
          {/* Left Column */}
          <div className="template1-left-column">
            <div className="block contact-block">
              <h4>Contact</h4>
              <p>{profile.contact.phone}</p>
              <p>{profile.contact.email}</p>
              <p>{profile.contact.address}</p>
              <p>{profile.contact.website}</p>
            </div>

            <div className="block skills-block">
              <h4>Skills</h4>
              <ul>
                {profile.skills.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="block languages-block">
              <h4>Languages</h4>
              <ul>
                {profile.languages.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </div>

            <div className="block reference-block">
              <h4>Reference</h4>
              <p>{profile.reference.name}</p>
              <p>{profile.reference.companyAndRole}</p>
              <p>
                {profile.reference.phoneLabel} {profile.contact.phone2}
              </p>
              <p>
                {profile.reference.emailLabel} {profile.contact.email2}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="template1-right-column">
            <div className="block profile-block">
              <h4>Profile</h4>
              <p>{profile.profileText}</p>
            </div>

            <div className="block experience-block">
              <h4>Work Experience</h4>
              {profile.experience.map((exp, i) => (
                <div key={i} className="experience-item">
                  <div className="exp-top">
                    <div className="exp-company">
                      <strong>{exp.company}</strong> — <em>{exp.title}</em>
                    </div>
                    <div className="exp-dates">{exp.dates}</div>
                  </div>
                  <p className="exp-desc">{exp.description}</p>
                </div>
              ))}
            </div>

            <div className="block education-block">
              <h4>Education</h4>
              {profile.education.map((edu, i) => (
                <div key={i} className="education-item">
                  <div className="edu-top">
                    <div className="edu-degree">
                      <strong>{edu.degree}</strong>
                    </div>
                    <div className="edu-dates">{edu.dates}</div>
                  </div>
                  <div className="edu-institute">{edu.institute}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default Template1Resume;
