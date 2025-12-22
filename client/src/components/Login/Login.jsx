import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const Login = () => {
  const navigate = useNavigate();

  const handleEmpLogClick = () => {
    navigate("/emplogin");
  };

  const handleStdLogClick = () => {
    navigate("/stdlogin");
  };

  return (
    <>
      {/* Navbar */}
      <div className="log-nav">
        <Navbar />
      </div>

      {/* Main Login Page */}
      <div className="min-h-screen flex flex-col justify-center bg-white relative overflow-hidden pt-28 sm:pt-24 md:pt-32 px-4 sm:px-5 pb-5">
        {/* Left Yellow Gradient */}
        <div className="yellow-gradient" />

        {/* Content Container */}
        <div className="flex flex-col lg:flex-row justify-around items-center z-[2] max-w-[1400px] mx-auto w-full gap-3 sm:gap-4 md:gap-5 lg:gap-8 xl:gap-10 py-8 sm:py-6 md:py-8 lg:py-10">
          {/* For Recruiters Section */}
          <div className="w-full sm:w-[95%] md:w-[90%] lg:w-[48%] text-center p-5 sm:p-6 md:p-7 lg:p-8 xl:p-10 rounded-2xl transition-transform duration-300 hover:-translate-y-1.5">
            <h1 className="font-inter font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[50px] 2xl:text-[56px] leading-tight text-[#6d6655] mb-4 sm:mb-5">
              For Recruiters
            </h1>
            <h5 className="text-base sm:text-lg md:text-xl lg:text-[1.3rem] xl:text-[1.4rem] 2xl:text-[1.6rem] my-4 sm:my-5 text-[#4a3f2b] font-inter leading-relaxed">
              Discover tomorrow's talent by hiring{" "}
              <br className="hidden sm:block" />
              <span className="text-purple-600">
                interns to experienced professionals.
              </span>
            </h5>
            <button
              className="px-8 sm:px-10 py-2.5 sm:py-3 border-none rounded-[25px] bg-purple-900  text-white text-base sm:text-lg lg:text-[1.1rem] cursor-pointer font-bold transition-all duration-300 mt-5 sm:mt-6 lg:mt-8 shadow-[0_4px_15px_rgba(41,21,61,0.2)] hover:scale-105 hover:bg-purple-800 hover:shadow-[0_6px_20px_rgba(41,21,61,0.3)]"
              onClick={handleEmpLogClick}
            >
              Login
            </button>
            <div className="mt-4 sm:mt-5 lg:mt-6">
              <span className="text-sm sm:text-base text-[#6d6655]">
                New to careero?{" "}
              </span>
              <NavLink
                to="/register"
                className="underline text-black hover:text-purple-800"
              >
                Register
              </NavLink>
            </div>
          </div>

          {/* Divider - Hidden on mobile/tablet */}
          <div className="hidden lg:block border-l border-[#e0e0e0] h-[400px] self-center" />

          {/* For Students Section */}
          <div className="w-full sm:w-[95%] md:w-[90%] lg:w-[48%] text-center p-5 sm:p-6 md:p-7 lg:p-8 xl:p-10 rounded-2xl transition-transform duration-300 hover:-translate-y-1.5">
            <h1 className="font-inter font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[50px] 2xl:text-[56px] leading-tight text-[#6d6655] mb-4 sm:mb-5">
              For Students
            </h1>
            <h5 className="text-base sm:text-lg md:text-xl lg:text-[1.3rem] xl:text-[1.4rem] 2xl:text-[1.6rem] my-4 sm:my-5 text-[#4a3f2b] font-inter leading-relaxed">
              Unlock Your Future: Find the Perfect{" "}
              <br className="hidden sm:block" />
              <span className="text-purple-600">
                Navigation to Kickstart Your Career!
              </span>
            </h5>
            <button
              className="px-8 sm:px-10 py-2.5 sm:py-3 border-none rounded-[25px] bg-purple-900 text-white text-base sm:text-lg lg:text-[1.1rem] cursor-pointer font-bold transition-all duration-300 mt-5 sm:mt-6 lg:mt-8 shadow-[0_4px_15px_rgba(41,21,61,0.2)] hover:scale-105 hover:bg-purple-800 hover:shadow-[0_6px_20px_rgba(41,21,61,0.3)]"
              onClick={handleStdLogClick}
            >
              Login
            </button>
            <div className="mt-4 sm:mt-5 lg:mt-6">
              <span className="text-sm sm:text-base text-[#6d6655]">
                New to careero?{" "}
              </span>
              <NavLink
                to="/register"
                className="underline text-black hover:text-purple-800"
              >
                Register
              </NavLink>
            </div>
          </div>
        </div>

        {/* Right Violet Gradient */}
        <div className="violet-gradient" />
      </div>
    </>
  );
};

export default Login;
