import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Users,
  Building2,
  Globe,
  Calendar,
  TrendingUp,
  CheckCircle2,
  ArrowLeft,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobHeader from "./JobHeader/JobHeader";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const applyJobHandler = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  const formatSalary = (min, max, currency = "INR") => {
    const formatNumber = (num) => {
      if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
      return num;
    };

    if (min && max) {
      return `${formatNumber(min)} - ${formatNumber(max)} ${currency}`;
    }
    return "Not disclosed";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <JobHeader />

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    {singleJob?.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">
                        {singleJob?.company?.companyName || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-purple-600" />
                      <span>{singleJob?.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      <span>
                        Posted{" "}
                        {singleJob?.createdAt
                          ? new Date(singleJob.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      className="bg-blue-50 text-blue-700 border-blue-200 font-semibold"
                      variant="outline"
                    >
                      <Users className="h-3 w-3 mr-1" />
                      {singleJob?.position} Position
                      {singleJob?.position !== 1 ? "s" : ""}
                    </Badge>
                    <Badge
                      className="bg-orange-50 text-orange-700 border-orange-200 font-semibold"
                      variant="outline"
                    >
                      <Briefcase className="h-3 w-3 mr-1" />
                      {singleJob?.jobType}
                    </Badge>
                    <Badge
                      className="bg-purple-50 text-purple-700 border-purple-200 font-semibold"
                      variant="outline"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {singleJob?.workMode}
                    </Badge>
                    <Badge
                      className="bg-green-50 text-green-700 border-green-200 font-semibold"
                      variant="outline"
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {singleJob?.jobLevel}
                    </Badge>
                  </div>
                </div>

                {/* Apply Button - Desktop */}
                <button
                  onClick={isApplied ? null : applyJobHandler}
                  disabled={isApplied || isLoading}
                  className={`hidden sm:flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
                    isApplied
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Applied
                    </>
                  ) : isLoading ? (
                    "Applying..."
                  ) : (
                    "Apply Now"
                  )}
                </button>
              </div>
            </div>

            {/* Job Description with All Job Details */}
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="h-1 w-8 bg-purple-600 rounded"></div>
                Job Description
              </h2>

              {/* Description Text */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {singleJob?.description || "No description available."}
                </p>
              </div>

              {/* Job Details Grid */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Job Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Role */}
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Role</p>
                      <p className="font-semibold text-gray-900">
                        {singleJob?.title || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Location
                      </p>
                      <p className="font-semibold text-gray-900">
                        {singleJob?.location || "Work from Home"}
                      </p>
                    </div>
                  </div>

                  {/* Salary */}
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Salary
                      </p>
                      <p className="font-semibold text-gray-900">
                        {formatSalary(
                          singleJob?.salaryMin,
                          singleJob?.salaryMax,
                          singleJob?.salaryCurrency
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Experience Level
                      </p>
                      <p className="font-semibold text-gray-900">
                        {singleJob?.experienceLevel || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-start gap-3">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Duration
                      </p>
                      <p className="font-semibold text-gray-900">
                        {singleJob?.duration || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Total Applicants */}
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Total Applicants
                      </p>
                      <p className="font-semibold text-gray-900">
                        {singleJob?.applications?.length || 0} applied
                      </p>
                    </div>
                  </div>

                  {/* Job Type */}
                  <div className="flex items-start gap-3">
                    <div className="bg-pink-100 p-2 rounded-lg">
                      <Briefcase className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Job Type
                      </p>
                      <p className="font-semibold text-gray-900">
                        {singleJob?.jobType || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Work Mode */}
                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-100 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Work Mode
                      </p>
                      <p className="font-semibold text-gray-900">
                        {singleJob?.workMode || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              {singleJob?.requirements && singleJob.requirements.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Requirements
                  </h3>
                  <ul className="space-y-2">
                    {singleJob.requirements.map((req, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-700"
                      >
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Posted Date */}
              <div className="flex items-center gap-2 pt-6 border-t border-gray-200">
                <Calendar className="h-4 w-4 text-gray-500" />
                <p className="text-sm text-gray-600">
                  Posted on{" "}
                  <span className="font-semibold">
                    {singleJob?.createdAt
                      ? new Date(singleJob.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "N/A"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Company Details */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Company Info Card */}
              {singleJob?.company && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-purple-600" />
                    About the Company
                  </h3>

                  {/* Company Name */}
                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {singleJob.company.companyName || "N/A"}
                    </h4>
                    {singleJob.company.description && (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {singleJob.company.description}
                      </p>
                    )}
                  </div>

                  {/* Company Details */}
                  <div className="space-y-4">
                    {/* Company Location */}
                    {singleJob.company.location && (
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <MapPin className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Location
                          </p>
                          <p className="font-semibold text-gray-900">
                            {singleJob.company.location}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Employee Count */}
                    {singleJob.company.employeeCount && (
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Company Size
                          </p>
                          <p className="font-semibold text-gray-900">
                            {singleJob.company.employeeCount}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Company Website */}
                    {singleJob.company.website && (
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Globe className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Website
                          </p>
                          <a
                            href={singleJob.company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-600 hover:underline text-sm break-all"
                          >
                            Visit Website
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Company Rating */}
                    {singleJob.company.ratings && (
                      <div className="flex items-start gap-3">
                        <div className="bg-yellow-100 p-2 rounded-lg">
                          <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Rating
                          </p>
                          <p className="font-semibold text-gray-900">
                            {singleJob.company.ratings}/5
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Apply Button - Sidebar */}
              <div className="sm:hidden lg:block">
                <button
                  onClick={isApplied ? null : applyJobHandler}
                  disabled={isApplied || isLoading}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold transition-all duration-300 ${
                    isApplied
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Applied Successfully
                    </>
                  ) : isLoading ? (
                    "Applying..."
                  ) : (
                    "Apply for this Position"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Apply Button - Fixed Bottom */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
        <button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied || isLoading}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            isApplied
              ? "bg-green-100 text-green-700 cursor-default"
              : "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-md"
          }`}
        >
          {isApplied ? (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Applied
            </>
          ) : isLoading ? (
            "Applying..."
          ) : (
            "Apply Now"
          )}
        </button>
      </div>
    </div>
  );
};

export default JobDescription;
