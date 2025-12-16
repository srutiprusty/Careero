import React from "react";
import { FaArrowRight } from "react-icons/fa";
import {useNavigate} from "react-router-dom";


const Roadmap = () => {
  
const navigate=useNavigate()
const handleFrontendRoadmap = () =>{
  navigate("/frontend");
}
  return (
    <>
      <>
        <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-6xl font-bold text-violet-700 text-center mb-8">
            Roadmaps
          </h2>

          {/* Cards for Roadmaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Frontend Development Roadmap Card */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <img
                src="https://via.placeholder.com/300x200"
                alt="Frontend Development Roadmap"
                className="w-full h-[150px] object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                Frontend Development Roadmap
              </h3>
              <p className="text-gray-600 mt-2">
                Step-by-step guide to mastering frontend technologies like HTML,
                CSS, JS, React, etc.
              </p>
              <div className="text-center mt-4">
                <button
                  onClick={handleFrontendRoadmap}
                 className="bg-violet-700 text-white py-2 px-6 rounded-full hover:bg-violet-600 transition duration-300 flex items-center justify-center">
                  Open <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>

            {/* Fullstack Development Roadmap Card */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <img
                src="https://via.placeholder.com/300x200"
                alt="Fullstack Development Roadmap"
                className="w-full h-[150px] object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                Fullstack Development Roadmap
              </h3>
              <p className="text-gray-600 mt-2">
                A comprehensive roadmap to becoming a full-stack developer,
                including frontend and backend technologies.
              </p>
              <div className="text-center mt-4">
                <button className="bg-violet-700 text-white py-2 px-6 rounded-full hover:bg-violet-600 transition duration-300 flex items-center justify-center">
                  Open <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>

            {/* UI/UX Roadmap Card */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <img
                src="https://via.placeholder.com/300x200"
                alt="UI/UX Roadmap"
                className="w-full h-[150px] object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                UI/UX Roadmap
              </h3>
              <p className="text-gray-600 mt-2">
                A roadmap to mastering the design process and tools for creating
                exceptional user experiences.
              </p>
              <div className="text-center mt-4">
                <button className="bg-violet-700 text-white py-2 px-6 rounded-full hover:bg-violet-600 transition duration-300 flex items-center justify-center">
                  Open <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Show All Button */}
          <div className="text-center mt-8">
            <button className="bg-violet-700 text-white py-2 px-8 rounded-full hover:bg-violet-600 transition duration-300">
              Show All
            </button>
          </div>
        </div>
      </>
    </>
  );
};

export default Roadmap;
