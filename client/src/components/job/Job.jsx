import React from "react";
import { Button } from "../ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

const Job = ({ job }) => {
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  const daysAgo = daysAgoFunction(job?.createdAt);

  return (
    <div className="p-5 rounded-lg shadow-md bg-white border border-gray-200 hover:shadow-xl hover:border-purple-300 transition-all duration-300">
      {/* Header with timestamp */}
      <div className="flex  justify-between  mb-1">
        <p
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            daysAgo === 0
              ? "bg-green-100 text-green-700"
              : daysAgo <= 7
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {daysAgo === 0 ? "Today" : `${daysAgo} days ago`}
        </p>
      </div>

      {/* Company info */}
      <div className="flex items-center gap-3 mb-1">
        <div className="flex-shrink-0">
          <Avatar className="h-12 w-12 border-2 border-gray-100">
            <AvatarImage
              src={job?.company?.logo}
              alt={job?.company?.companyName}
            />
          </Avatar>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-base text-gray-900 truncate">
            {job?.company?.companyName}
          </h2>
          <p className="text-sm text-gray-500">{job?.company?.location}</p>
        </div>
      </div>

      {/* Job title and description */}
      <div className="mb-4">
        <h1 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
          {job?.title}
        </h1>
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {job?.description?.split(" ").slice(0, 29).join(" ")}
          {job?.description?.split(" ").length > 29 ? "..." : ""}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge
          className="text-xs font-semibold bg-blue-50 text-blue-700 border-blue-200"
          variant="outline"
        >
          {job?.position} Position{job?.position !== 1 ? "s" : ""}
        </Badge>
        <Badge
          className="text-xs font-semibold bg-orange-50 text-orange-700 border-orange-200"
          variant="outline"
        >
          {job?.jobType}
        </Badge>
        <Badge
          className="text-xs font-semibold bg-purple-50 text-purple-700 border-purple-200"
          variant="outline"
        >
          {/*  {job?.salaryMin} - {job?.salaryMax} {job?.salaryCurrency} */}
          {job?.workMode}
        </Badge>
      </div>

      {/* Action button */}
      <div className="pt-3 border-t border-gray-100">
        <Button
          onClick={() => navigate(`/jobs/${job?._id}`)}
          className="w-full bg-[#7209b7] text-white hover:bg-[#5f32ad] transition-colors font-medium"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default Job;
