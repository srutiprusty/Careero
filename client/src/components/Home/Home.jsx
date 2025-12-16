import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Briefcase,
  Users,
  GraduationCap,
  Lightbulb,
} from "lucide-react";
import Navbar from "./../Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    id: 1,
    question: "What is Careero?",
    answer:
      "Careero is a comprehensive career platform designed to bridge the gap between students and employers, offering tools for job discovery, career development, and skill-building.",
  },
  {
    id: 2,
    question: "How does the AI Interview Preparation work?",
    answer:
      "Our AI-powered interview prep uses speech recognition to simulate real interviews, providing instant feedback and personalized tips to improve your performance.",
  },
  {
    id: 3,
    question: "What types of job opportunities are available?",
    answer:
      "We offer internships, full-time positions, and freelance opportunities across various industries and experience levels.",
  },
  {
    id: 4,
    question: "How can I access career roadmaps?",
    answer:
      "Career roadmaps are available in your dashboard, providing role-based guidance on skills to learn, projects to build, and career progression paths.",
  },
  {
    id: 5,
    question: "What should I do if I encounter a technical issue?",
    answer:
      "If you experience any technical issues, please contact our support team or use the contact form on our website. We'll assist you as soon as possible.",
  },
  {
    id: 6,
    question: "How does the ATS Resume Analyzer work?",
    answer:
      "Our ATS analyzer scans your resume and provides a score based on how well it matches job requirements, along with suggestions for improvement.",
  },
  {
    id: 7,
    question: "Is the platform free for students?",
    answer:
      "Yes, students can access most features for free, including job applications, career roadmaps, and basic resume building.",
  },
  {
    id: 8,
    question: "How can recruiters benefit from Careero?",
    answer:
      "Recruiters can post jobs, manage applications, and access a pool of qualified candidates through our centralized dashboard.",
  },
];

const Home = () => {
  const [selected, setSelected] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [locked, setLocked] = useState(null);
  const navigate = useNavigate();
  const features = [
    {
      title: "JOB OPPORTUNITIES & HIRING",
      icon: Briefcase,
      color: "bg-blue-500",
      image: "./images/jobs image.png",
      details: [
        "Explore internships and full-time job opportunities",
        "Apply seamlessly to multiple positions",
        "Recruiters can post and manage job listings",
        "Track applications and hiring progress in real time",
      ],
    },
    {
      title: "AI INTERVIEW PREP",
      icon: Lightbulb,
      color: "bg-purple-500",
      image: "./images/internship image.png",
      details: [
        "Practice mock interviews powered by AI",
        "Speech recognition with real-time feedback",
        "Instant performance analysis and improvement tips",
        "Build confidence before real interviews",
      ],
    },
    {
      title: "CAREER ROADMAPS",
      icon: GraduationCap,
      color: "bg-green-500",
      image: "./images/ResourceRoadmap.png",
      details: [
        "Role-based roadmaps for career guidance",
        "Learn industry-relevant skills step by step",
        "Discover projects to build strong portfolios",
        "Track learning progress and milestones",
      ],
    },
    {
      title: "RESUME BUILDER & ATS",
      icon: Users,
      color: "bg-orange-500",
      image: "./images/resources 1image.png",
      details: [
        "Create professional resumes with templates",
        "ATS scoring to improve shortlisting chances",
        "Upload and analyze existing resumes",
        "Get personalized improvement suggestions",
      ],
    },
  ];

  const toggle = (i) => {
    setSelected(selected === i ? null : i);
  };

  const handleHover = (index, value) => {
    if (locked !== index) {
      setActiveIndex(value ? index : null);
    }
  };

  const handleLockToggle = (index) => {
    if (locked === index) {
      setLocked(null);
      setActiveIndex(null);
    } else {
      setLocked(index);
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <div className="bg-white text-[#333]">
        <Navbar />
      </div>

      <div className="relative min-h-screen bg-white overflow-hidden" id="home">
        {/* Gradient blobs */}
        <div
          className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] opacity-70 
               rounded-[100px] blur-[100px] bg-gradient-to-r 
               from-[#ffe60000] to-[#ffeb3b]
               max-[768px]:w-[300px] max-[768px]:h-[300px]"
        />
        <div
          className="absolute top-[20%] left-[50%] w-[500px] h-[500px] opacity-70 
               rounded-[100px] blur-[100px] bg-gradient-to-b 
               from-[#6a5acd6b] to-[#29153d]
               max-[768px]:w-[320px] max-[768px]:h-[320px]"
        />

        {/* Hero Section */}
        <div className="relative flex flex-col md:flex-row items-center min-h-screen">
          {/* Left Content */}
          <div
            className="w-full md:w-1/2 px-6 md:px-16 py-0 z-10 mt-20 md:mt-0
                 flex flex-col justify-center
                 min-h-[50vh] md:min-h-screen"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Build Your Career
              <br />
              With AI-Powered Guidance
              <br />& Smart Opportunities
            </h1>

            <p className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base">
              Discover jobs and internships, prepare with AI interviews,
              <br className="hidden md:block" />
              create ATS-friendly resumes, and follow guided career
              <br className="hidden md:block" />
              roadmaps — all in one powerful platform.
            </p>

            <button
              className="px-8 py-3 bg-purple-700 text-white rounded-full w-fit
                   hover:bg-purple-900 transition shadow-lg"
              onClick={() => navigate("/register")}
            >
              Explore Careero
            </button>
          </div>

          {/* Right Image */}
          <div
            className="w-full md:w-1/2 px-6 md:px-16 py-12 z-10
                 flex justify-center items-center
                 min-h-[50vh] md:min-h-screen"
          >
            <img
              src="/images/hhhh.png"
              alt="hero"
              className="w-full max-w-[500px] object-contain"
            />
          </div>

          {/* Purple SVG Background */}
          <div className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            <div
              className="absolute inset-0 bg-no-repeat bg-right bg-cover opacity-80"
              style={{
                backgroundImage: "url('/images/hhh.svg')",
              }}
            />

            {/* Decorative elements */}
            <div className="absolute inset-0">
              <div className="absolute top-20 right-32 text-white text-2xl opacity-70">
                ✦
              </div>
              <div className="absolute top-40 right-48 text-white text-xl opacity-50">
                ✦
              </div>
              <div className="absolute bottom-32 right-24 text-white text-xl opacity-60">
                ✦
              </div>

              <div className="absolute top-32 right-64 w-12 h-12 rounded-full border-2 border-white opacity-30" />
              <div className="absolute top-16 right-20 w-8 h-8 rounded-full border-2 border-white opacity-20" />
              <div className="absolute bottom-40 right-40 w-16 h-16 rounded-full border-2 border-white opacity-25" />
            </div>
          </div>
        </div>

        {/* Bottom decorative circles */}
        <div className="absolute bottom-8 left-8 w-6 h-6 rounded-full border-2 border-gray-300 opacity-50" />
        <div className="absolute bottom-8 right-1/3 w-6 h-6 rounded-full border-2 border-gray-300 opacity-50" />
      </div>

      {/* ABOUT SECTION WITH FLIP CARDS */}
      <div
        className="bg-gradient-to-br from-gray-50 via-white to-purple-50/20 py-8 lg:py-4"
        id="about"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Main Content - Cards Left, Image & Text Right */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Left Side - Feature Cards (55%) */}
            <div className="w-full lg:w-[55%]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => {
                  const isFlipped = activeIndex === index;
                  const staggerClass =
                    index === 1 || index === 3 ? "sm:mt-8" : "";
                  const IconComponent = feature.icon;

                  return (
                    <div
                      key={index}
                      className={`relative cursor-pointer perspective ${staggerClass}`}
                      onMouseEnter={() => handleHover(index, true)}
                      onMouseLeave={() => handleHover(index, false)}
                    >
                      <motion.div
                        className="relative w-full h-[240px] sm:h-[260px]"
                        style={{ transformStyle: "preserve-3d" }}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      >
                        {/* Front Side */}
                        <div
                          className="absolute w-full h-full rounded-3xl overflow-hidden shadow-lg"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <img
                            src={feature.image}
                            alt={feature.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                          <div
                            className={`absolute bottom-0 left-0 w-full ${feature.color} text-white text-center py-3 sm:py-4 rounded-b-3xl backdrop-blur-sm bg-opacity-95`}
                          >
                            {/* <div className="flex items-center justify-center gap-2 mb-1">
                              <IconComponent size={20} />
                            </div> */}
                            <h3 className="text-base sm:text-lg font-bold px-2">
                              {feature.title}
                            </h3>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLockToggle(index);
                            }}
                            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 z-10"
                          >
                            {locked === index ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>

                        {/* Back Side */}
                        <div
                          className="absolute w-full h-full bg-white rounded-3xl shadow-lg flex flex-col items-start justify-center p-5 sm:p-6"
                          style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`${feature.color} p-2 rounded-lg`}>
                              <IconComponent size={20} className="text-white" />
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-gray-900">
                              {feature.title}
                            </h3>
                          </div>

                          <ul className="space-y-2 w-full">
                            {feature.details.map((detail, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-xs sm:text-sm text-gray-700"
                              >
                                <div
                                  className={`${feature.color} w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0`}
                                ></div>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLockToggle(index);
                            }}
                            className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                          >
                            {locked === index ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side - Image & Description (45%) */}
            <div className="w-full lg:w-[45%] flex flex-col items-center">
              <div className="w-full">
                <img
                  src="./images/aboutimage24.png"
                  alt="About Careero"
                  className="w-full h-auto rounded-2xl"
                />
              </div>

              <div className="w-full sm:px-6 lg:px-4 bg-white rounded-2xl border-purple-100 text-center">
                <p className="text-base sm:text-md text-gray-700 leading-relaxed">
                  <span className="font-semibold text-purple-600">Careero</span>{" "}
                  is an AI-powered career development and hiring platform that
                  bridges the gap between education and employment. We help
                  students build skills, prepare confidently, and secure the
                  right opportunities—while enabling recruiters to find and hire
                  the right talent efficiently.
                </p>

                <p className="text-base sm:text-md text-gray-700 leading-relaxed">
                  From job discovery and career roadmaps to interview
                  preparation and ATS-optimized resumes, Careero brings the
                  entire career journey into one unified platform.
                </p>

                <p className="text-base sm:text-md text-gray-700 leading-relaxed">
                  Trusted by students and recruiters alike, Careero makes career
                  growth and hiring smarter, faster, and more effective.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div
        id="faq"
        className="relative z-[1] bg-[#fcfcfc] py-8 px-4 sm:px-6 lg:px-8 lg:py-4"
      >
        <div className="text-right mx-auto mt-[2%] ml-[65%] max-[768px]:text-[1rem] max-[480px]:text-[1.6rem] max-[480px]:mb-2">
          <img src="./images/Group 24 (1).png" alt="faq" />
        </div>

        <div className="flex justify-between items-start mt-[-5.5%] z-[2] max-[1024px]:flex-col max-[1024px]:items-center max-[1024px]:mt-0 max-[480px]:px-2">
          {/* ACCORDION */}
          <div className="w-[40%] ml-[5%] mt-[3%] max-[1024px]:w-[75%] max-[768px]:w-[90%] max-[480px]:w-full">
            {questions.map((item, i) => (
              <div
                key={i}
                className="bg-[#d9d9d9] mb-2 p-2 rounded-lg shadow-md max-[480px]:px-4 max-[480px]:py-3"
              >
                <div
                  className="text-[#333] flex items-center justify-between cursor-pointer"
                  onClick={() => toggle(i)}
                >
                  <h3 className="text-[16px] font-[Cambria] max-[768px]:text-[14px]">
                    {item.question}
                  </h3>
                  <span className="text-xl mr-2">
                    {selected === i ? "-" : "+"}
                  </span>
                </div>

                <div
                  className={`text-[#8b7f75] overflow-hidden font-[Cambria] transition-all duration-300 ${
                    selected === i ? "max-h-[900px] mt-2" : "max-h-0"
                  } max-[480px]:mt-1`}
                >
                  {item.answer}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ IMAGE */}
          {/* FAQ IMAGE */}
          <div className="flex justify-center items-center w-full max-w-[900px] mx-auto max-[1024px]:mt-8">
            <img
              src="./images/hhhhh.gif"
              alt="faqimg"
              className="mt-10 w-[600px] max-[768px]:w-[400px] max-[480px]:w-[300px]"
            />
          </div>
        </div>
      </div>

      {/* Perspective Style */}
      <style>{`
        .perspective {
          perspective: 1000px;
        }
      `}</style>

      {/* Footer wrapper */}
      <div className="jobpg">
        <Footer />
      </div>
    </>
  );
};

export default Home;
