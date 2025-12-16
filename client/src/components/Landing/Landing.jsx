import React from "react";
import "./Landing.css";
import Navbar from "../Navbar/Navbar";

const Landing = () => {
  return (
    <>
      <div className="land-nav">
        <Navbar />
      </div>
      <div className="landing-container">
        <div className="yellow-gradient" />
        <div className="content">
          <img
            src="./images/Group 18.png"
            alt="mid"
            width={1100}
            className="mid"
          />
          <p className="low">
            Unlock <span className="l-span">Potential</span> — Connect{" "}
            <span className="l-span">Talent</span> — Grab{" "}
            <span className="l-span">Oppurtunity</span> !
          </p>
        </div>
        <div className="violet-gradient" />
      </div>
    </>
  );
};

export default Landing;
