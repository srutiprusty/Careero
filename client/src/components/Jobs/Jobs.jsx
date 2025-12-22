import React, { useEffect, useState } from "react";
import FilterCard from "./FilterCard";
import Job from "./../job/Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import JobHeader from "./../JobHeader/JobHeader";

const Jobs = () => {
  const { allJobs = [], searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  useEffect(() => {
    if (searchedQuery && Object.keys(searchedQuery).length > 0) {
      const filteredJobs = allJobs.filter((job) => {
        return Object.keys(searchedQuery).every((filterType) => {
          const selectedValues = searchedQuery[filterType];
          if (!selectedValues || selectedValues.length === 0) return true;

          switch (filterType) {
            case "Job Type":
              return selectedValues.some((value) =>
                job?.jobType?.toLowerCase().includes(value.toLowerCase())
              );
            case "Location":
              return selectedValues.some((value) =>
                job?.location?.toLowerCase().includes(value.toLowerCase())
              );
            case "Title":
              return selectedValues.some((value) =>
                job?.title?.toLowerCase().includes(value.toLowerCase())
              );
            case "Work Mode":
              return selectedValues.some((value) =>
                job?.workMode?.toLowerCase().includes(value.toLowerCase())
              );
            case "Job Level":
              return selectedValues.some((value) =>
                job?.jobLevel?.toLowerCase().includes(value.toLowerCase())
              );
            case "Duration":
              return selectedValues.some((value) =>
                job?.duration?.toLowerCase().includes(value.toLowerCase())
              );
            case "Salary":
              return selectedValues.some((value) => {
                const [min, max] = value
                  .replace(/[^\d-]/g, "")
                  .split("-")
                  .map((v) => parseInt(v));
                return job?.salaryMin >= min && job?.salaryMax <= max;
              });
            case "Experience Level":
              return selectedValues.some((value) =>
                job?.experienceLevel
                  ?.toLowerCase()
                  .includes(value.toLowerCase())
              );
            default:
              return true;
          }
        });
      });
      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filterJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filterJobs.length / jobsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <JobHeader />

      <div className="max-w-7xl mx-auto mt-5 px-4 lg:px-0">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Filter Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterCard />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Mobile Horizontal Filters */}
            <div className="lg:hidden mb-4 bg-white rounded-md p-3">
              <FilterCard />
            </div>

            {/* Jobs Section */}
            {filterJobs.length <= 0 ? (
              <div className="flex items-center justify-center py-20 bg-white rounded-md">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No jobs found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              </div>
            ) : (
              <div className="pb-5">
                {/* Results count */}
                <div className="mb-4 text-sm text-gray-600">
                  Showing {indexOfFirstJob + 1}-
                  {Math.min(indexOfLastJob, filterJobs.length)} of{" "}
                  {filterJobs.length} jobs
                </div>

                {/* Jobs Grid - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {currentJobs.map((job) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      key={job?._id}
                    >
                      <Job job={job} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    {/* Page numbers */}
                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        // Show first, last, current, and adjacent pages
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 &&
                            pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => paginate(pageNumber)}
                              className={`px-3 py-2 rounded-md transition-colors ${
                                currentPage === pageNumber
                                  ? "bg-blue-600 text-white"
                                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <span key={pageNumber} className="px-2 py-2">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
