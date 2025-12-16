import React from "react";
import { FaLaptopCode, FaArrowAltCircleRight } from "react-icons/fa";
import { MdDraw } from "react-icons/md";
import { VscGraphLine } from "react-icons/vsc";

const CategoryCarousel = () => {
  return (
    <div className="w-full flex justify-center mt-8">
      <div className="grid grid-cols-3 gap-4 w-[90%] max-w-[500px]">
        
        {/* Graphic Designer */}
        <div className="flex items-center justify-center bg-white text-black rounded-3xl p-4 
                        shadow-md transition-all duration-300 ease-in-out 
                        border-2 border-transparent hover:bg-gray-200">
          <MdDraw className="mr-2 text-2xl" />
          <span>Graphic Designer</span>
        </div>

        {/* Data Analyst */}
        <div className="flex items-center justify-center bg-white text-black rounded-3xl p-4 
                        shadow-md transition-all duration-300 ease-in-out 
                        border-2 border-transparent hover:bg-gray-200">
          <VscGraphLine className="mr-2 text-2xl" />
          <span>Data Analyst</span>
        </div>

        {/* FullStack Developer */}
        <div className="flex items-center justify-center bg-white text-black rounded-3xl p-4 
                        shadow-md transition-all duration-300 ease-in-out 
                        border-2 border-transparent hover:bg-gray-200">
          <FaLaptopCode className="mr-2 text-2xl" />
          <span>FullStack Developer</span>
        </div>

        {/* Software Developer (col-span-2) */}
        <div className="col-span-2 flex items-center justify-center bg-white text-black rounded-3xl p-4 
                        shadow-md transition-all duration-300 ease-in-out 
                        border-2 border-transparent hover:bg-gray-200">
          <FaLaptopCode className="mr-2 text-2xl" />
          <span>Software Developer</span>
        </div>

        {/* Explore */}
        <div className="flex items-center justify-center bg-white text-black rounded-3xl p-4 
                        shadow-md transition-all duration-300 ease-in-out 
                        border-2 border-transparent hover:bg-gray-200">
          <FaArrowAltCircleRight className="text-2xl" />
          <span className="ml-2">Explore</span>
        </div>

      </div>
    </div>
  );
};

export default CategoryCarousel;
