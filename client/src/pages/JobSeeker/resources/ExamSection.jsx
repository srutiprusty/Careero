import React from "react";
import { useEffect } from "react";
import { FaDownload } from "react-icons/fa"; // Import the download icon from React Icons

const ExamSection = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top on page load
  }, []);
  return (
    <>

      <div className="flex flex-col md:flex-row items-center bg-gray-100 p-6 rounded-lg shadow-lg">
        {/* Left Side: Image */}
        <div className="flex-1 mb-6 md:mb-0">
          <img
            src="/images/TestHeader.png"
            alt="Test Series Illustration"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 text-center md:text-left">
          {/* Tagline */}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-violet-700">
            Master the Tests, Conquer the Questions
          </h1>
          <p className="mt-4 text-gray-700 text-lg md:text-xl">
            Search and access curated test series and previous year questions
            instantly.
          </p>

          {/* Search Bar */}
          <div className="flex items-center mt-6 justify-center md:justify-start gap-2">
            <input
              type="text"
              placeholder="Search for tests, subjects, or years..."
              className="w-3/4 md:w-2/3 lg:w-1/2 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button className="px-6 py-3 bg-violet-700 text-white font-semibold rounded-full hover:bg-violet-600 transition duration-300 -mt-1">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Popular Test Series Section */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-violet-700 text-center mb-8">
          Popular Test Series
        </h2>

        {/* Cards for Popular Test Series */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Test Series 1"
              className="w-full h-[150px] object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">
              Excel in RPSC Exams
            </h3>
            <p className="text-gray-600 mt-2">
              Your one-stop solution for RPSC
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Test Series 2"
              className="w-full h-[150px] object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">
              Ace Software Exams
            </h3>
            <p className="text-gray-600 mt-2">
              Prepare for coding interviews and certifications with
              expert-curated tests.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Test Series 3"
              className="w-full h-[150px] object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">
              CAT Success Kit
            </h3>
            <p className="text-gray-600 mt-2">
              Crack CAT with targeted practice on quant, reasoning, and DI.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <button className="bg-violet-700 text-white py-2 px-8 rounded-full hover:bg-violet-600 transition duration-300">
            Show All
          </button>
        </div>
      </div>

      {/* Popular PYQs Section */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-violet-700 text-center mb-8">
          Popular PYQs
        </h2>

        {/* Cards for Popular PYQs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <img
              src="https://via.placeholder.com/300x200"
              alt="PYQ 1"
              className="w-full h-[150px] object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">RPSC PYQs</h3>
            <p className="text-gray-600 mt-2">
              Practice RPSC's previous exam questions.
            </p>
            {/* Download Icon */}
            <div className="mt-4 text-center">
              <button>
                <FaDownload size={24} />
              </button>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <img
              src="https://via.placeholder.com/300x200"
              alt="PYQ 2"
              className="w-full h-[150px] object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">GATE PYQs</h3>
            <p className="text-gray-600 mt-2">
              Previous year GATE questions for comprehensive preparation.
            </p>
            {/* Download Icon */}
            <div className="mt-4 text-center">
              <button>
                <FaDownload size={24} />
              </button>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <img
              src="https://via.placeholder.com/300x200"
              alt="PYQ 3"
              className="w-full h-[150px] object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">CAT PYQs</h3>
            <p className="text-gray-600 mt-2">
              Brush up with CAT's quantitative, DI, and verbal PYQs.
            </p>
            {/* Download Icon */}
            <div className="mt-4 text-center">
              <button>
                <FaDownload size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button className="bg-violet-700 text-white py-2 px-8 rounded-full hover:bg-violet-600 transition duration-300">
            Show All
          </button>
        </div>
      </div>
    </>
  );
};

export default ExamSection;
