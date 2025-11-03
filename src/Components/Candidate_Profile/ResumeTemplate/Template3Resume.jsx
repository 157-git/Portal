// Template3Resume.jsx
import React, { useState, useRef } from "react";
// import html2pdf from "html2pdf.js";
import "./Template3Resume.css";

/**
 * Template3Resume
 * - Left: editable form (including file upload for photo)
 * - Right: live preview that matches the dark-left / light-right design
 * - PDF download using html2pdf.js
 */
const defaultPhotoDataUrl =
  "defalutProfile";

export default function Template3Resume({ onBack }) {
  const pdfRef = useRef();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // initial state roughly reflecting your screenshot layout
  const [profile, setProfile] = useState({
    name: "Cia Rodriguez",
    title: "Marketing Manager",
    about:
      "Hello my name is Cia Rodriguez. I am a passionate person and love to meet new people. I love traveling and trying something new. I have been working in this industry professionally for more than 5 years.",
    photo: defaultPhotoDataUrl, // will be replaced by uploaded image
    contact: {
      phone: "123-456-7890",
      email: "hello@reallygreatsite.com",
    },
    education: [
      { id: 1, years: "2023 - 2027", institute: "Borcelle University", degree: "Bachelor of Marketing Management" },
      { id: 2, years: "2027 - 2029", institute: "Fauget University", degree: "Master of Marketing Research" },
    ],
    experience: [
      { id: 1, years: "2027 - 2028", title: "Intern HR Manager", company: "Aldaware & Partners", details: "" },
      { id: 2, years: "2028 - 2031", title: "Junior Operation Manager", company: "Ingoods Company", details: "" },
      { id: 3, years: "2031 - 2035", title: "General Operator Manager", company: "Ingoods Company", details: "" },
      { id: 4, years: "2035 - 2039", title: "General Manager", company: "Salford & Co.", details: "" },
    ],
    traits: [
      { id: 1, label: "Passionate", value: 85 },
      { id: 2, label: "Curious", value: 70 },
      { id: 3, label: "Friendly", value: 80 },
      { id: 4, label: "Cheerful", value: 60 },
    ],
  });

  // general handler for simple fields and nested contact fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, key] = name.split(".");
      setProfile((p) => ({ ...p, [parent]: { ...p[parent], [key]: value } }));
    } else {
      setProfile((p) => ({ ...p, [name]: value }));
    }
  };

  // arrays (education, experience, traits) handlers
  const handleArrayChange = (arrayName, id, field, value) => {
    setProfile((p) => {
      const arr = p[arrayName].map((it) => (it.id === id ? { ...it, [field]: value } : it));
      return { ...p, [arrayName]: arr };
    });
  };

  const addArrayItem = (arrayName, template) => {
    setProfile((p) => ({ ...p, [arrayName]: [...p[arrayName], { ...template, id: Date.now() }] }));
  };

  const removeArrayItem = (arrayName, id) => {
    setProfile((p) => ({ ...p, [arrayName]: p[arrayName].filter((it) => it.id !== id) }));
  };

  // image upload from computer
  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfile((p) => ({ ...p, photo: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  // export to PDF
  const downloadPDF = () => {
    const element = pdfRef.current;
    if (!element) return;
    const options = {
      filename: `${profile.name.replace(/\s+/g, "_")}_resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };
    html2pdf().set(options).from(element).save();
  };

  return (
    <div className="t3-root">
      <div className="t3-controls">
        {isPreviewMode ? (
          <>
            <button className="t3-btn" onClick={() => setIsPreviewMode(false)}>Edit</button>
            <button className="t3-btn" onClick={downloadPDF}>Download PDF</button>
            <button className="t3-btn" onClick={() => onBack && onBack()}>Back</button>
          </>
        ) : (
          <>
            <button className="t3-btn" onClick={() => setIsPreviewMode(true)}>Preview</button>
            <button className="t3-btn" onClick={() => onBack && onBack()}>Back</button>
          </>
        )}
      </div>

      <div className="t3-side-by-side">
        {/* LEFT: Form */}
        {!isPreviewMode && (
          <aside className="t3-form">
            <h2>Edit Resume</h2>

            <label>Upload Photo</label>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} />

            <label>Name</label>
            <input name="name" value={profile.name} onChange={handleChange} />

            <label>Title</label>
            <input name="title" value={profile.title} onChange={handleChange} />

            <label>About Me</label>
            <textarea name="about" rows="5" value={profile.about} onChange={handleChange} />

            <h3>Personal Traits</h3>
            {profile.traits.map((t) => (
              <div key={t.id} className="t3-row">
                <input
                  value={t.label}
                  onChange={(e) => handleArrayChange("traits", t.id, "label", e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={t.value}
                  onChange={(e) => {
                    let v = Number(e.target.value || 0);
                    if (v < 0) v = 0;
                    if (v > 100) v = 100;
                    handleArrayChange("traits", t.id, "value", v);
                  }}
                />
                <button className="t3-small" onClick={() => removeArrayItem("traits", t.id)}>Remove</button>
              </div>
            ))}
            <button className="t3-small" onClick={() => addArrayItem("traits", { label: "New Trait", value: 50 })}>+ Add Trait</button>

            <h3>Contact</h3>
            <label>Phone</label>
            <input name="contact.phone" value={profile.contact.phone} onChange={handleChange} />
            <label>Email</label>
            <input name="contact.email" value={profile.contact.email} onChange={handleChange} />

            <h3>Education</h3>
            {profile.education.map((ed) => (
              <div key={ed.id} className="t3-row">
                <input
                  placeholder="Years"
                  value={ed.years}
                  onChange={(e) => handleArrayChange("education", ed.id, "years", e.target.value)}
                />
                <input
                  placeholder="Institute"
                  value={ed.institute}
                  onChange={(e) => handleArrayChange("education", ed.id, "institute", e.target.value)}
                />
                <input
                  placeholder="Degree"
                  value={ed.degree}
                  onChange={(e) => handleArrayChange("education", ed.id, "degree", e.target.value)}
                />
                <button className="t3-small" onClick={() => removeArrayItem("education", ed.id)}>Remove</button>
              </div>
            ))}
            <button className="t3-small" onClick={() => addArrayItem("education", { years: "", institute: "", degree: "" })}>+ Add Education</button>

            <h3>Experience</h3>
            {profile.experience.map((ex) => (
              <div key={ex.id} className="t3-row">
                <input
                  placeholder="Years"
                  value={ex.years}
                  onChange={(e) => handleArrayChange("experience", ex.id, "years", e.target.value)}
                />
                <input
                  placeholder="Title"
                  value={ex.title}
                  onChange={(e) => handleArrayChange("experience", ex.id, "title", e.target.value)}
                />
                <input
                  placeholder="Company"
                  value={ex.company}
                  onChange={(e) => handleArrayChange("experience", ex.id, "company", e.target.value)}
                />
                <button className="t3-small" onClick={() => removeArrayItem("experience", ex.id)}>Remove</button>
                <textarea
                  placeholder="Details"
                  rows="2"
                  value={ex.details}
                  onChange={(e) => handleArrayChange("experience", ex.id, "details", e.target.value)}
                />
              </div>
            ))}
            <button className="t3-small" onClick={() => addArrayItem("experience", { years: "", title: "", company: "", details: "" })}>+ Add Experience</button>
          </aside>
        )}

        {/* RIGHT: Preview */}
        <main className="t3-preview" ref={pdfRef}>
          <div className="t3-preview-inner">
            {/* Left dark column */}
            <div className="t3-left-col">
              <div className="t3-decor top-left" />
              <div className="t3-photo-wrap">
                <img src={profile.photo} alt="profile" />
              </div>

              <section className="t3-block about">
                <h5>ABOUT ME</h5>
                <p>{profile.about}</p>
              </section>

              <section className="t3-block traits">
                <h5>PERSONAL TRAITS</h5>
                <ul>
                  {profile.traits.map((t) => (
                    <li key={t.id}>{t.label}</li>
                  ))}
                </ul>
              </section>

              <section className="t3-block contact">
                <h5>CONTACT</h5>
                <p>{profile.contact.phone}</p>
                <p>{profile.contact.email}</p>
              </section>

              <div className="t3-decor bottom-left" />
            </div>

            {/* Right white column */}
            <div className="t3-right-col">
              <header className="t3-name">
                <div className="t3-title-large">{profile.name.split(" ")[0]}</div>
                <div className="t3-title-small">{profile.name.split(" ").slice(1).join(" ")}</div>
                <div className="t3-role">{profile.title}</div>
              </header>

              <section className="t3-block education">
                <h5>EDUCATIONS</h5>
                <ul className="t3-list-vertical">
                  {profile.education.map((ed) => (
                    <li key={ed.id} className="t3-edu-item">
                      <div className="t3-edu-left">{ed.years}</div>
                      <div className="t3-edu-right">
                        <strong>{ed.institute}</strong>
                        <div className="t3-sub">{ed.degree}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="t3-block experience">
                <h5>EXPERIENCE</h5>
                <ul className="t3-list-vertical">
                  {profile.experience.map((ex) => (
                    <li key={ex.id} className="t3-exp-item">
                      <div className="t3-exp-left">{ex.years}</div>
                      <div className="t3-exp-right">
                        <strong>{ex.title}</strong>
                        <div className="t3-sub">{ex.company}</div>
                        {ex.details && <div className="t3-desc">{ex.details}</div>}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="t3-block trait-bars">
                <h5>PERSONAL TRAITS</h5>
                <div className="t3-trait-bars">
                  {profile.traits.map((t) => (
                    <div className="t3-trait-row" key={t.id}>
                      <div className="t3-trait-label">{t.label}</div>
                      <div className="t3-trait-bar">
                        <div className="t3-trait-fill" style={{ width: `${t.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
