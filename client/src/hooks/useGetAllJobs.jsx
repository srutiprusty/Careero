import { React, useEffect } from "react";
import axios from "axios";
import { setAllJobs } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { JOB_API_END_POINT } from "@/utils/constant";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/get?keyword=${searchedQuery}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
          console.log(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllJobs();
  }, [dispatch, searchedQuery]);
  /*  return { loading: false }; */
};

export default useGetAllJobs;
