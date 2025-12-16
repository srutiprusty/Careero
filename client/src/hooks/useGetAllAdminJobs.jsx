import { React, useEffect, useState } from "react";
import axios from "axios";
import { setAllAdminJobs } from "@/redux/jobSlice";
import { useDispatch } from "react-redux";
import { JOB_API_END_POINT } from "@/utils/constant";
/*
const useGetAllAdminJobs = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
          withCredentials: true,
        });
        if (res.data.success && Array.isArray(res.data.jobs)) {
          dispatch(setAllJobs(res.data.jobs));
          console.log(res.data);
          // Add a small delay and then check the store
          setTimeout(() => {
            console.log("Checking store after dispatch...");
            // You might want to use useSelector here to verify the store update
          }, 100);
        }
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllJobs();
  }, [dispatch]);
  return { loading, error };
};

export default useGetAllAdminJobs;
 */ const useGetAllAdminJobs = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        setLoading(true);
        console.log("Starting to fetch admin jobs...");

        const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
          withCredentials: true,
        });

        console.log("API Response:", res.data);

        if (res.data.success) {
          console.log("About to dispatch jobs:", res.data.jobs.length, "items");
          dispatch(setAllAdminJobs(res.data.jobs));
        }
      } catch (error) {
        console.error("Error in fetchAllJobs:", error.response || error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllJobs();
  }, [dispatch]);

  return { loading, error };
};
export default useGetAllAdminJobs;
