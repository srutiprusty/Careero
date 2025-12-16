import React from "react";
import Form from "../../components/Login/Form";
import Navbar from "../../components/Navbar/Navbar";
import "./EmpLog.css";
import Globe from "../../components/Login/Globe/Globe";

const EmpLog = () => {
  return (
    <>
      <div className="log-nav">
        <Navbar />
      </div>
      <div className="emplog-page" id="emplog">
        <div className="yellow-gradient" />
        <div className="emplog-container">
          <div className="sec" id="employersec">
            <Form role="recruiter" />
          </div>
          <div className="sec" id="employersec2">
            <div className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-2 sm:mt-2">
              Welcome to
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-5">
                careero
              </h1>
              <div
                className="text-2xl sm:text-3xl lg:text-4xl text-gray-700 font-medium"
                style={{ fontSize: "26px" }}
              >
                Join us to <span style={{ color: "#543E6C" }}>Connect </span>
                more Talents !
              </div>
            </div>
            {/* globe */}

            <div className="globe-container ">
              <Globe className="globe-wrapper" />
            </div>
          </div>
        </div>
        <div className="violet-gradient" />
      </div>
    </>
  );
};

export default EmpLog;
