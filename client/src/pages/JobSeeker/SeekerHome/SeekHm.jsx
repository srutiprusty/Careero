import JobHeader from "@/components/JobHeader/JobHeader";
import React from "react";
import SearchBar from "@/components/SearchBar";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer/Footer";

const SeekHm = () => {
  const navigate = useNavigate();
  const handleMentor = () => {
    navigate("/mentorship");
  };
  const handleResources = () => {
    navigate("/resources");
  };
  return (
    <>
      <div className="bg-neutral-200">
        <JobHeader />
      </div>

      <div className="w-full aspect-[1728/1076] bg-gray-200 flex items-center justify-center">
        {/* Replace the image src with your actual image URL */}
        <img
          src="./images/jobSeekhmHead.png"
          alt="Responsive"
          className="w-full h-full object-cover "
        />
        {/* SearchBar component in the center */}
      </div>
      <div className="flex flex-wrap lg:flex-nowrap min-h-screen lg:ml-56">
        {/* Left Section */}
        <div className="w-full lg:w-[60%] p-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="relative bg-gray-300 w-full h-[250px] sm:h-[270px] rounded-3xl">
            <img
              src="./images/internship image.png"
              alt="Image 1"
              className="w-full h-full rounded-3xl object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full bg-blue-500 text-white text-center py-2 rounded-b-3xl text-lg sm:text-2xl font-bold">
              INTERNSHIP
            </div>
          </div>
          {/* Card 2 */}
          <div className="relative bg-gray-300 w-full h-[250px] sm:h-[270px] rounded-3xl mt-8">
            <img
              src="./images/jobs image.png"
              alt="Image 2"
              className="w-full h-full rounded-3xl object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full bg-green-500 text-white text-center py-2 rounded-b-3xl text-lg sm:text-2xl font-bold">
              JOBS
            </div>
          </div>
          {/* Card 3 */}
          <div className="relative bg-gray-300 w-full h-[250px] sm:h-[270px] rounded-3xl">
            <img
              src="./images/mentorship image.png"
              alt="Image 3"
              className="w-full h-full rounded-3xl object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full bg-red-500 text-white text-center py-2 rounded-b-3xl text-lg sm:text-2xl font-bold">
              MENTORSHIP
            </div>
          </div>
          {/* Card 4 */}
          <div className="relative bg-gray-300 w-full h-[250px] sm:h-[270px] rounded-3xl mt-8">
            <img
              src="./images/resources 1image.png"
              alt="Image 4"
              className="w-full h-full rounded-3xl object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full bg-yellow-500 text-white text-center py-2 rounded-b-3xl text-lg sm:text-2xl font-bold">
              RESOURCES
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-[33%] p-2 flex justify-center">
          <img
            src="./images/Group 45.png"
            alt="Tall Image"
            className="w-[75%] sm:w-[50%] max-w-[300px] h-auto object-contain"
          />
        </div>
      </div>

      {/* Full-width container */}
      <div className="w-full flex justify-center">
        <div className="relative w-full max-w-[1400px] h-[239px] sm:h-[500px] md:h-[600px] lg:h-[650px]">
          <img
            src="./images/homeM[1].png"
            alt="Sample Image"
            className="w-[100%] h-[90] object-cover p-4 sm:p-6 lg:p-8"
          />
          <button
            onClick={handleMentor}
            className="
    absolute 
    top-8 right-16 
    bg-blue-500 text-white 
    px-8 py-3 
    rounded-3xl shadow-2xl border-2 
    text-base 
    sm:right-12 sm:px-10 sm:py-3 sm:text-lg 
    md:right-16 md:px-12 md:py-4 md:text-xl 
    lg:top-12 lg:right-24 lg:text-2xl 
    xl:top-16 xl:right-28 xl:text-3xl 
    font-bold 
    hover:bg-gray-400
  "
          >
            FIND MENTOR
          </button>
        </div>
      </div>

      {/* Parent Container */}
      <div className="relative px-6 md:px-8  max-w-[1460px]">
        {/* Background Image */}
        <img
          src="./images/homeResources.png"
          alt="Background"
          className="w-full h-auto object-cover"
        />
        <div
          className="bg-white p-4 sm:p-5 md:p-6 rounded shadow-lg border max-w-[1400px] md:max-w-sm lg:max-w-md 
                      text-center mt-4 md:mt-0 md:absolute md:bottom-16 md:right-12 lg:bottom-24 lg:right-32"
        >
          <p className="text-gray-800 mb-4 font-sans font-bold text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
            Includes resources for resume building and interview preparation to
            enhance job applications.
          </p>
          <button
            onClick={handleResources}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-md border-2 text-sm sm:text-base md:text-lg lg:text-xl font-bold hover:bg-yellow-500 transition-all"
          >
            FIND RESOURCES
          </button>
        </div>
      </div>
      {/* Full-width Image Section */}
      <div className="w-full">
        <img
          src="./images/Untitled design 3.png" // Add your full-width image here
          alt="Full Width Image"
          className="w-full h-auto object-cover"
        />
      </div>
      <Footer />
    </>
  );
};

export default SeekHm;
