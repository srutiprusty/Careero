import React from "react";
import Form from "../../components/Login/Form";
import Navbar from "../../components/Navbar/Navbar";
import "./StdLog.css";
import Globe from "../../components/Login/Globe/Globe";

const EmpLog = () => {
  return (
    <>
      <div className="log-nav">
        <Navbar />
      </div>
      <div className="stdlog-page" id="stdlog">
        <div className="yellow-gradient" />
        <div className="stdlog-container">
          <div className="sec" id="studentsec">
            <div className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-2 sm:mt-2">
              Welcome to
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-5">
                careero
              </h1>
              <div
                className="text-2xl sm:text-3xl lg:text-4xl text-gray-700 font-medium"
                style={{ fontSize: "26px" }}
              >
                Join us to <span style={{ color: "#e4c61b" }}>Unlock </span>your
                Potential !
              </div>
            </div>
            {/* globe */}
            <div className="globe-container">
              <Globe className="globe-wrapper" />
            </div>
          </div>
          <div className="sec" id="student">
            <Form role="student" />
          </div>
        </div>
        <div className="violet-gradient" />
      </div>
    </>
  );
};

export default EmpLog;
