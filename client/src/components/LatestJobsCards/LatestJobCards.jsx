import React from "react";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  // Add console log to debug
  console.log("Job data received:", job);

  // Add null check
  if (!job) {
    return <div>No job data available</div>;
  }

  return (
    <div
      onClick={() => navigate(`/jobs/${job._id}`)}
      className="p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer max-w-md w-full"
    >
      {/* Company Info */}
      <div>
        <h1 className="font-medium text-lg truncate">{job?.company?.name}</h1>
        <p className="text-sm text-gray-500 truncate">India</p>
      </div>

      {/* Job Title and Description */}
      <div className="mt-2">
        <h1 className="font-bold text-lg my-2 truncate">{job?.title}</h1>
        <p className="text-sm text-gray-600 line-clamp-2">{job?.description}</p>
      </div>

      {/* Job Details */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <Badge className="text-blue-700 font-bold" variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className="text-[#F83002] font-bold" variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className="text-[#7209b7] font-bold" variant="ghost">
          {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
