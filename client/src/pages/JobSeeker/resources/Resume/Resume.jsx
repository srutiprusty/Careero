import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./Resume.css";
import { FaPhone, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";

function Resume() {
  const [resumeData, setResumeData] = useState({
    name: "Your Name",
    objective: "I am passionate about building solutions and solving problems.",
    phone: "123-456-7890",
    email: "youremail@example.com",
    address: "123 Main Street, City, Country",
    github: "https://github.com/yourprofile",
    skills: "JavaScript, React, Node.js",
    education: [{ school: "", degree: "", year: "" }],
    experience: [{ company: "", role: "", duration: "", details: "" }],
    summary: "A brief summary of your background and achievements.",
    hobbies: "Reading, Travelling, Playing Guitar",
    projects: [],
    certifications: [],
  });

  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResumeData({ ...resumeData, [name]: value });
  };
  // const handleSkillsChange = (field, value) => {
  //   setResumeData({
  //     ...resumeData,
  //     skills: {
  //       ...resumeData.skills,
  //       [field]: value,
  //     },
  //   });
  // };
  const handleArrayChange = (type, index, field, value) => {
    const updatedArray = [...resumeData[type]];
    updatedArray[index][field] = value;
    setResumeData({ ...resumeData, [type]: updatedArray });
  };

  const handleAddItem = (type, newItem) => {
    setResumeData({ ...resumeData, [type]: [...resumeData[type], newItem] });
  };

  const handleRemoveItem = (type, index) => {
    const updatedArray = [...resumeData[type]];
    updatedArray.splice(index, 1);
    setResumeData({ ...resumeData, [type]: updatedArray });
  };

  const handleEducationChange = (level, field, value) => {
    setResumeData((prevData) => ({
      ...prevData,
      education: {
        ...prevData.education,
        [level]: {
          ...prevData.education[level],
          [field]: value,
        },
      },
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectsChange = (index, field, value) => {
    const updatedProjects = [...resumeData.projects];
    updatedProjects[index][field] = value;
    setResumeData({ ...resumeData, projects: updatedProjects });
  };

  const handleAddProject = () => {
    setResumeData({
      ...resumeData,
      projects: [...resumeData.projects, { name: "", summary: "", link: "" }],
    });
  };

  const handleRemoveProject = (index) => {
    const updatedProjects = resumeData.projects.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, projects: updatedProjects });
  };

  const handleCertificationsChange = (index, field, value) => {
    const updatedCertifications = [...resumeData.certifications];
    updatedCertifications[index][field] = value;
    setResumeData({ ...resumeData, certifications: updatedCertifications });
  };

  const handleAddCertification = () => {
    setResumeData({
      ...resumeData,
      certifications: [...resumeData.certifications, { name: "", link: "" }],
    });
  };

  const handleRemoveCertification = (index) => {
    const updatedCertifications = resumeData.certifications.filter(
      (_, i) => i !== index
    );
    setResumeData({ ...resumeData, certifications: updatedCertifications });
  };
  // const handleDownload = () => {
  //   const doc = new jsPDF("p", "pt", "a4");
  //   const content = document.querySelector(".download-resume-Section");

  //   if (content) {
  //     doc.html(content, {
  //       callback: function (doc) {
  //         doc.save("Resume.pdf");
  //       },
  //       html2canvas: {
  //         scale: 0.7, // Adjust scaling if needed
  //       },
  //     });
  //   } else {
  //     console.error("No content found for the preview section.");
  //   }
  // };

  const handleDownload = () => {
    const doc = new jsPDF("p", "mm", "a4"); // 'p' for portrait, 'mm' for millimeters, and 'a4' for the page size

    // Select the content you want to convert into the PDF
    const content = document.querySelector(".download-resume-Section");

    if (content) {
      // Use html2canvas to capture the content as an image
      html2canvas(content, {
        scale: 2, // Higher scale for better quality
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png"); // Convert canvas to image
        const imgWidth = 190; // Width of the PDF (keeping margins in mind)
        const pageHeight = 297; // Height of A4 page in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
        let position = 10; // Starting position on the PDF

        // Add the image to the PDF
        doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);

        // Save the PDF
        doc.save("Resume.pdf");
      });
    } else {
      console.error("No content found for the preview section.");
    }
  };

  return (
    <div className="res-container">
      <div className="res-input-section">
        <h2>Resume Input</h2>
        <form className="res-form">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={resumeData.name}
            onChange={handleInputChange}
          />

          <label>Objective:</label>
          <textarea
            name="objective"
            value={resumeData.objective}
            onChange={handleInputChange}
          ></textarea>

          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={resumeData.phone}
            onChange={handleInputChange}
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={resumeData.email}
            onChange={handleInputChange}
          />

          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={resumeData.address}
            onChange={handleInputChange}
          />

          <label>GitHub Profile URL:</label>
          <input
            type="text"
            name="github"
            value={resumeData.github}
            onChange={handleInputChange}
          />

          <label>Summary:</label>
          <textarea
            name="summary"
            value={resumeData.summary}
            onChange={handleInputChange}
          ></textarea>

          <label>Skills</label>
          <label>Programming Languages:</label>
          <textarea
            name="programmingLanguages"
            placeholder="e.g., HTML, CSS, JavaScript, C++"
            value={resumeData.programmingLanguages || ""}
            onChange={handleInputChange}
          />

          <label>Libraries/Frameworks:</label>
          <textarea
            name="libraries"
            placeholder="e.g., React, Express.js"
            value={resumeData.libraries || ""}
            onChange={handleInputChange}
          />

          <label>Tools:</label>
          <textarea
            name="tools"
            placeholder="e.g., VS Code, GitHub"
            value={resumeData.tools || ""}
            onChange={handleInputChange}
          />

          <label>Technologies:</label>
          <textarea
            name="technologies"
            placeholder="e.g., MongoDB, Node.js"
            value={resumeData.technologies || ""}
            onChange={handleInputChange}
          />

          <label>Soft Skills:</label>
          <textarea
            name="softSkills"
            placeholder="e.g., Communication, Leadership"
            value={resumeData.softSkills || ""}
            onChange={handleInputChange}
          />

          {/* Education */}
          <div className="res-section">
            <h3>Education</h3>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="res-education-input">
                <input
                  type="text"
                  placeholder="School"
                  value={edu.school}
                  onChange={(e) =>
                    handleArrayChange(
                      "education",
                      index,
                      "school",
                      e.target.value
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    handleArrayChange(
                      "education",
                      index,
                      "degree",
                      e.target.value
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={edu.year}
                  onChange={(e) =>
                    handleArrayChange(
                      "education",
                      index,
                      "year",
                      e.target.value
                    )
                  }
                />
                <button
                  type="button"
                  className="res-remove-btn"
                  onClick={() => handleRemoveItem("education", index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="res-add-btn"
              onClick={() =>
                handleAddItem("education", { school: "", degree: "", year: "" })
              }
            >
              Add Education
            </button>
          </div>

          {/* Experience */}
          <div className="res-section">
            <h3>Experience</h3>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="experience-input">
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      index,
                      "company",
                      e.target.value
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={exp.role}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      index,
                      "role",
                      e.target.value
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={exp.duration}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      index,
                      "duration",
                      e.target.value
                    )
                  }
                />
                <textarea
                  placeholder="Details"
                  value={exp.details}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      index,
                      "details",
                      e.target.value
                    )
                  }
                />
                <button
                  type="button"
                  className="res-remove-btn"
                  onClick={() => handleRemoveItem("experience", index)}
                >
                  Remove Experience
                </button>
              </div>
            ))}
            <button
              type="button"
              className="res-add-btn"
              onClick={() =>
                handleAddItem("experience", {
                  company: "",
                  role: "",
                  duration: "",
                  details: "",
                })
              }
            >
              Add Experience
            </button>
          </div>

          <label>Projects:</label>
          {resumeData.projects.map((project, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Project Name"
                value={project.name}
                onChange={(e) =>
                  handleProjectsChange(index, "name", e.target.value)
                }
              />
              <textarea
                placeholder="Project Summary"
                value={project.summary}
                onChange={(e) =>
                  handleProjectsChange(index, "summary", e.target.value)
                }
              ></textarea>
              <input
                type="url"
                placeholder="Project Link"
                value={project.link}
                onChange={(e) =>
                  handleProjectsChange(index, "link", e.target.value)
                }
              />
              <button
                className="res-remove-btn"
                type="button"
                onClick={() => handleRemoveProject(index)}
              >
                Remove Project
              </button>
            </div>
          ))}

          {/* Add Project button outside the map */}
          <button
            type="button"
            className="res-add-project-button"
            onClick={handleAddProject}
          >
            Add Project
          </button>

          <label>Certifications:</label>
          {resumeData.certifications.map((certification, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Certification Name"
                value={certification.name}
                onChange={(e) =>
                  handleCertificationsChange(index, "name", e.target.value)
                }
              />
              <input
                type="url"
                placeholder="Certification Link"
                value={certification.link}
                onChange={(e) =>
                  handleCertificationsChange(index, "link", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => handleRemoveCertification(index)}
              >
                Remove Certification
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddCertification}>
            Add Certification
          </button>

          <label>Achievements:</label>
          <textarea
            name="hobbies"
            value={resumeData.hobbies}
            onChange={handleInputChange}
          ></textarea>

          <label>Upload Profile Photo:</label>
          <input type="file" onChange={handlePhotoUpload} />
        </form>
        <button className="resume-downdload" onClick={handleDownload}>
          Download Resume
        </button>
      </div>
      {/* preview section */}

      <div className="res-preview-section">
        <div className="download-resume-Section">
          <div className="res-resume-top-section">
            <div className="res-header">
              <div className="res-header-name">
                <h1 style={{ fontSize: "40px" }}>{resumeData.name}</h1>
                <p className="res-objective">{resumeData.objective}</p>
                <div className="res-contact-grid">
                  {/* First Row */}
                  <div className="contact-row">
                    <div className="contact-item">
                      <FaPhone className="contact-icon" />
                      <span style={{ marginTop: "-20px" }}>
                        {resumeData.phone}
                      </span>
                    </div>
                    <div className="contact-item">
                      <MdEmail className="contact-icon" />
                      <span style={{ marginTop: "-20px" }}>
                        {resumeData.email}
                      </span>
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="contact-row">
                    <div className="contact-item">
                      <FaLocationDot className="contact-icon" />
                      <span style={{ marginTop: "-20px" }}>
                        {resumeData.address}
                      </span>
                    </div>
                    <div className="contact-item">
                      <FaGithub className="contact-icon" />
                      <a
                        style={{ marginTop: "-20px" }}
                        href={resumeData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {resumeData.github}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {profilePhoto && (
                <div className="res-header-right">
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="res-profile-photo"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="res-additional-info">
            <div className="res-summary section">
              <h3 className="res-heading-resume">SUMMARY</h3>
              <hr className="res-section-divider" />
              <p>{resumeData.summary}</p>
            </div>
            <div className="res-skills section">
              <div className="res-section-header">
                <h3>SKILLS</h3>
              </div>
              <hr className="res-section-divider" />{" "}
              {/* The bar now directly under the heading */}
              <div className="res-skills-columns">
                <div className="res-skills-column">
                  {resumeData.programmingLanguages && (
                    <p>
                      <b>Languages:</b> {resumeData.programmingLanguages}
                    </p>
                  )}
                  {resumeData.libraries && (
                    <p>
                      <b>Libraries/Frameworks:</b> {resumeData.libraries}
                    </p>
                  )}
                  {resumeData.tools && (
                    <p>
                      <b>Tools:</b> {resumeData.tools}
                    </p>
                  )}
                </div>
                <div className="res-skills-column">
                  {resumeData.technologies && (
                    <p>
                      <b>Technologies:</b> {resumeData.technologies}
                    </p>
                  )}
                  {resumeData.softSkills && (
                    <p>
                      <b>Soft Skills:</b> {resumeData.softSkills}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="res-section">
              <h3 className="res-heading-resume">EDUCATION</h3>
              <hr className="res-section-divider" />
              {resumeData.education.map((edu, index) => (
                <div key={index} className="res-education-preview">
                  <p className="left">
                    <strong>{edu.degree}</strong> at {edu.school}
                  </p>
                  <p className="right">{edu.year}</p>
                </div>
              ))}
            </div>

            <h3 className="res-heading-resume">EXPERIENCE</h3>
            <hr className="res-section-divider" />
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="res-experience-preview">
                <p>
                  <strong>{exp.company}</strong> - {exp.role} ({exp.duration})
                </p>
                <p>{exp.details}</p>
              </div>
            ))}

            {resumeData.projects.length > 0 && (
              <div className="res-projects">
                <h3 className="res-heading-resume">PROJECTS</h3>
                <hr className="res-section-divider" />
                {resumeData.projects.map((project, index) => (
                  <p key={index}>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.name}
                    </a>{" "}
                    - {project.summary}
                  </p>
                ))}
              </div>
            )}
            {resumeData.certifications.length > 0 && (
              <div className="res-certifications">
                <h3 className="res-heading-resume">CERTIFICATIONS</h3>
                <hr className="res-section-divider" />
                {resumeData.certifications.map((certification, index) => (
                  <p key={index}>
                    <a
                      href={certification.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {certification.name}
                    </a>
                  </p>
                ))}
              </div>
            )}
            <div className="res-hobbies">
              <h3 className="res-heading-resume">ACHIEVEMENTS</h3>
              <hr className="res-section-divider" />
              <p>{resumeData.hobbies}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resume;
