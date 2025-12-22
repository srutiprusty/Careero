import { React, useEffect } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import JobHeader from "../../../components/JobHeader/JobHeader";
import CategoryCarousel from "../../../components/CategoryCarousel/CategoryCarousel";
import LatestJobs from "@/components/LatestJobs/LatestJobs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer/Footer";

const JobPg = () => {
  const navigate = useNavigate();
  useGetAllJobs();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/admin/companies");
    }
  }, []);

  const handleResources = () => {
    navigate("/resources"); // Use navigate to redirect to login page
  };

  return (
    <div className="w-full">
      {/* Header */}
      <JobHeader />

      {/* Full width banner image */}
      <div className="w-full mt-[2%]">
        <img
          src="./images/jobpage.png"
          alt="FullWidthImage"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Centered explore image */}
      <div className="flex justify-center">
        <img
          src="./images/jobExplore.png"
          alt="CenteredImage"
          className="w-[70%] h-auto mx-auto"
        />
      </div>

      {/* Search */}
      <SearchBar />

      {/* Categories */}
      <CategoryCarousel />

      {/* Featured jobs header */}
      <div className="relative flex flex-col gap-2 md:flex-row items-center w-full px-12 mt-8">
        <h2 className="flex-1 text-center text-2xl font-bold text-gray-700">
          Latest Job Openings
        </h2>

        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center justify-center
                     w-20 h-10 bg-white text-black rounded-[20px]
                     shadow-lg transition-all duration-300 hover:bg-gray-200"
        >
          <FaArrowAltCircleRight className="text-2xl" />
        </button>
      </div>

      {/* Job cards grid */}
      <div
        className="
          grid gap-6 justify-center mt-12 px-4
          grid-cols-[repeat(auto-fill,minmax(300px,1fr))]
          sm:gap-3 sm:mt-4
          md:gap-4 md:mt-8 md:px-6
          lg:grid-cols-4 lg:gap-6 lg:px-8
        "
      >
        {/* Cards rendered inside LatestJobs */}
      </div>
      <LatestJobs />

      <div className="relative px-6 md:px-8  max-w-[1460px] pt-[100px]">
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

      {/* Footer wrapper */}
      <div className="jobpg">
        <Footer />
      </div>
    </div>
  );
};

export default JobPg;
