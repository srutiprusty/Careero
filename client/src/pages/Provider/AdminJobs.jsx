import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { useDispatch } from "react-redux";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "@/redux/jobSlice";
import JobHeader from "@/components/JobHeader/JobHeader";

const AdminJobs = () => {
  const { id } = useParams(); // Get jobId from URL parameters
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useGetAllAdminJobs(); // Call the hook to get jobs data

  // Dispatch action whenever input changes
  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div>
      <JobHeader />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-fit"
            placeholder="Filter by name, role"
            onChange={(e) => setInput(e.target.value)} // Update input value
          />
          <Button onClick={() => navigate("/admin/jobs/create")}>
            New Jobs
          </Button>
        </div>

        {/* Show loading or error message */}
        {loading && (
          <div className="flex items-center justify-center h-[400px]">
            Loading...
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-[400px] text-red-500">
            Error: {error.message}
          </div>
        )}

        {/* Render jobs table only when loading is false and error is not present */}
        {!loading && !error && <AdminJobsTable />}
      </div>
    </div>
  );
};

export default AdminJobs;
