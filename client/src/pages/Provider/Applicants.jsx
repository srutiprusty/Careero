import React, { useEffect, useState } from "react";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "@/redux/applicationSlice";
import JobHeader from "@/components/JobHeader/JobHeader";

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);

  // Local state to handle loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch applicants when the component mounts or when job ID changes
  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        setLoading(true); // Start loading
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
          { withCredentials: true }
        );
        dispatch(setAllApplicants(res.data.job)); // Dispatch applicants data to store
        setLoading(false); // Stop loading
      } catch (err) {
        setError("Failed to fetch applicants. Please try again later.");
        setLoading(false); // Stop loading
      }
    };

    if (params.id) {
      fetchAllApplicants();
    }
  }, [params.id, dispatch]); // Depend on params.id to refetch when job ID changes

  return (
    <div>
      <JobHeader />
      <div className="max-w-7xl mx-auto">
        <h1 className="font-bold text-xl my-5 ">
          Applicants : {applicants?.applications?.length}
        </h1>

        {/* Loading or error state handling */}
        {loading && (
          <div className="flex items-center justify-center h-[400px]">
            Loading...
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-[400px] text-red-500">
            {error}
          </div>
        )}

        {/* Render ApplicantsTable only if applicants data is available */}
        {!loading && !error && <ApplicantsTable />}
      </div>
    </div>
  );
};

export default Applicants;
