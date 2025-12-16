import React from "react";
import "./Login.css";
import { NavLink } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
/* import EmpLog from './Emp-login/EmpLog'; */
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const handleEmpLogClick = () => {
    navigate("/emplogin"); // Use navigate to redirect to login page
  };
  const handleStdLogClick = () => {
    navigate("/stdlogin"); // Use navigate to redirect to login page
  };
  return (
    <>
      <div className="log-nav">
        <Navbar />
      </div>
      <div className="login-page">
        {/* Left Gradient */}
        <div className="yellow-gradient"></div>

        {/* Content Container */}
        <div className="log-container">
          <div className="sec">
            <h1 className="head">For Recruiters</h1>
            <h5>
              Discover tomorrow's talent by hiring <br />
              <span className="highlight" style={{ color: "purple" }}>
                interns to experienced professionals.
              </span>
            </h5>
            <button className="login-btn" onClick={handleEmpLogClick}>
              Login
            </button>
            <br />
            <br />
            New to careero?{" "}
            <NavLink
              to="/register"
              style={{ textDecoration: "underline", color: "blue" }}
            >
              Register
            </NavLink>
          </div>
          <div className="divide" />
          <div className="sec">
            <h1 className="head">For Students</h1>
            <h5>
              Unlock Your Future: Find the Perfect <br />
              <span className="highlight" style={{ color: "purple" }}>
                Navigation to Kickstart Your Career!
              </span>
            </h5>
            <button className="login-btn" onClick={handleStdLogClick}>
              Login
            </button>
            <br />
            <br />
            New to careero?{" "}
            <NavLink
              to="/register"
              style={{ textDecoration: "underline", color: "blue" }}
            >
              Register
            </NavLink>
          </div>
        </div>

        {/* Right Gradient */}
        <div className="violet-gradient"></div>
      </div>
    </>
  );
};

export default Login;
