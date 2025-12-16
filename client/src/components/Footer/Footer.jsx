import React, { useState } from "react";
import "./Footer.css";
import { FaFacebook, FaDribbble, FaLinkedin } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email) {
      console.log(`Subscribed with: ${email}`);
      setEmail(""); // Clear input after subscribing
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="newsletter-section">
          <h2>
            Subscribe to our <br /> Newsletter
          </h2>
          <div className="newsletter-input">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSubscribe}>Subscribe</button>
          </div>
        </div>
        <div className="links-section">
          <div>
            <h3>Navigation</h3>
            <ul>
              <li>
                <a href="./jobs">Jobs</a>
              </li>
              <li>
                <a href="/mentorship">Mentorship</a>
              </li>
              <li>
                <a href="/resources">Resources</a>
              </li>
            </ul>
          </div>
          <div>
            <h3>About</h3>
            <ul>
              <li>
                <a href="./home">Home</a>
              </li>
              <li>
                <a href="./about">About</a>
              </li>
              <li>
                <a href="./faq">FAQ</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="social-media-section">
        <h1>
          GET IN <br />
          TOUCH
        </h1>
        <div className="social-icons">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook />
          </a>
          <a
            href="https://dribbble.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDribbble />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsTwitterX />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright @ careero 2024. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
