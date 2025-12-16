import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Edit2,
  Eye,
  MoreHorizontal,
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Award,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { Button } from "@/components/ui/button";

const AdminJobsTable = () => {
  const navigate = useNavigate();
  const { loading, error } = useGetAllAdminJobs();

  // Redux selector to access job-related data
  const { allAdminJobs = [], searchJobByText = "" } = useSelector(
    (store) => store.job
  );

  // State to hold filtered jobs
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Filter jobs based on search text
  useEffect(() => {
    console.log("allAdminJobs updated:", allAdminJobs);
    console.log("searchJobByText:", searchJobByText);

    // Apply filtering logic
    const filtered = allAdminJobs.filter((job) => {
      if (!searchJobByText.trim()) return true;
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name
          ?.toLowerCase()
          .includes(searchJobByText.toLowerCase())
      );
    });

    // Set filtered jobs in state
    setFilteredJobs(filtered);
  }, [allAdminJobs, searchJobByText]);

  // Loading UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading jobs...</p>
        </div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-900 font-semibold mb-2">Error loading jobs</p>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Table View - Hidden on Mobile */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Job Title</TableHead>
              <TableHead className="font-semibold">WorkMode</TableHead>
              <TableHead className="font-semibold">Job Type</TableHead>
              <TableHead className="font-semibold">Salary</TableHead>
              <TableHead className="font-semibold">Experience</TableHead>
              <TableHead className="font-semibold">Positions</TableHead>
              <TableHead className="font-semibold">Posted Date</TableHead>
              <TableHead className="text-right font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center">
                    <Briefcase className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No jobs found</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Try adjusting your search
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow key={job._id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {job?.title || "N/A"}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {job?.workMode || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {job?.jobType || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {job?.salaryMin && job?.salaryMax
                      ? `₹${job.salaryMin} - ₹${job.salaryMax}`
                      : job?.salaryMin
                      ? `₹${job.salaryMin}`
                      : job?.salaryMax
                      ? `₹${job.salaryMax}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>{job?.experienceLevel || "N/A"}</TableCell>
                  <TableCell>{job?.position || "N/A"}</TableCell>
                  <TableCell className="text-gray-600">
                    {job?.createdAt?.split("T")[0] || "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48">
                        <div className="space-y-1">
                          <div
                            onClick={() =>
                              navigate(`/admin/jobs/${job._id}/edit`)
                            }
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-gray-600" />
                            <span className="text-sm">Edit</span>
                          </div>
                          <div
                            onClick={() =>
                              navigate(`/admin/jobs/${job._id}/applicants`)
                            }
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                            <span className="text-sm">View Applicants</span>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View - Hidden on Desktop */}
      <div className="lg:hidden space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Briefcase className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium text-lg mb-1">
              No jobs found
            </p>
            <p className="text-gray-400 text-sm">Try adjusting your search</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-5 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Job Title & Actions */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {job?.title || "N/A"}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {job?.workMode || "N/A"}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {job?.jobType || "N/A"}
                    </span>
                  </div>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <div className="space-y-1">
                      <div
                        onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                        <span className="text-sm">Edit</span>
                      </div>
                      <div
                        onClick={() =>
                          navigate(`/admin/jobs/${job._id}/applicants`)
                        }
                        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                        <span className="text-sm">View Applicants</span>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Job Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-gray-500 text-xs">Salary</p>
                    <p className="text-gray-900 font-medium">
                      {job?.salaryMin && job?.salaryMax
                        ? `₹${job.salaryMin} - ₹${job.salaryMax}`
                        : job?.salaryMin
                        ? `₹${job.salaryMin}`
                        : job?.salaryMax
                        ? `₹${job.salaryMax}`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-gray-500 text-xs">Experience</p>
                    <p className="text-gray-900 font-medium">
                      {job?.experienceLevel || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-gray-500 text-xs">Positions</p>
                    <p className="text-gray-900 font-medium">
                      {job?.position || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-gray-500 text-xs">Posted</p>
                    <p className="text-gray-900 font-medium">
                      {job?.createdAt?.split("T")[0] || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminJobsTable;
