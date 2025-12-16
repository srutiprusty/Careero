import React from "react";
import LatestJobCards from "../LatestJobsCards/LatestJobCards";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

const selectJobs = createSelector(
  (state) => state.job?.allJobs,
  (allJobs) => allJobs || []
);

const LatestJobs = () => {
  const allJobs = useSelector(selectJobs);
  const jobsToDisplay = allJobs.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto my-5 px-4">
      <div
        className="
          grid gap-6 my-5
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        {jobsToDisplay.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-10">
            No Jobs Available
          </div>
        ) : (
          jobsToDisplay.map((job) => (
            <LatestJobCards key={job._id} job={job} />
          ))
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
