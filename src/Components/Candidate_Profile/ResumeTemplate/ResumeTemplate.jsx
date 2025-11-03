// Samruddhi Patole 29/10/25

import React, { useState } from "react";
import "./ResumeTemplate.css";
import Template1Resume from "./Template1Resume";
import Template2Resume from "./Template2Resume";
import Template3Resume from "./Template3Resume";

// 👇 Import local images from src/photos
import template1 from "./photos/template1.jpg";
import template2 from "./photos/template2.jpg";
import template3 from "./photos/template3.jpg";

const ResumeTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    { id: 1, name: "Modern Resume", thumbnail: template1 },
    { id: 2, name: "Classic Resume", thumbnail: template2 },
    { id: 3, name: "Creative Resume", thumbnail: template3 },
  ];

  return (
    <div className="templates-page">
      <h1 className="templates-title">Choose Your Resume Template</h1>

      {/* Template Thumbnails */}
      <div className="templates-grid">
        {templates.map((template) => (
          <div
            key={template.id}
            className="template-card"
            onClick={() => setSelectedTemplate(template.id)} // 👈 open component instead of navigate
          >
            <img
              src={template.thumbnail}
              alt={template.name}
              className="template-img"
            />
            <h3>{template.name}</h3>
          </div>
        ))}
      </div>

      {/* Conditional rendering when a template is selected */}
    {/* Conditional rendering when a template is selected */}
{selectedTemplate === 1 && (
  <div className="modal-overlay">
    <div className="modal-content">
      <Template1Resume onBack={() => setSelectedTemplate(null)} />
    </div>
  </div>
)}

{selectedTemplate === 2 && (
  <div className="modal-overlay">
    <div className="modal-content">
      <Template2Resume onBack={() => setSelectedTemplate(null)} />
    </div>
  </div>
)}


{selectedTemplate === 3 && (
  <div className="modal-overlay"><div className="modal-content">
    <Template3Resume onBack={() => setSelectedTemplate(null)} />
  </div></div>
)}

    </div>
  );
};

export default ResumeTemplates;
