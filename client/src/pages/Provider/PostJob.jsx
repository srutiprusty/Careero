import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import JobHeader from "@/components/JobHeader/JobHeader";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";

const companyArray = [];

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "INR",
    location: "",
    workMode: "",
    jobType: "",
    duration: "",
    experienceLevel: "",
    jobLevel: "",
    position: 0,
    companyId: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useGetAllCompanies();
  const { companies } = useSelector((store) => store.company);

  // Automatically set companyId if user has a company
  useEffect(() => {
    if (companies.length > 0) {
      setInput((prev) => ({ ...prev, companyId: companies[0]._id }));
    }
  }, [companies]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (name, value) => {
    setInput({ ...input, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // Add validation
    if (
      !input.title ||
      !input.description ||
      !input.requirements ||
      !input.salaryMin ||
      !input.salaryMax ||
      !input.workMode ||
      !input.jobType ||
      !input.duration ||
      !input.experienceLevel ||
      !input.jobLevel ||
      !input.position ||
      !input.companyId
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    console.log("Submitting job data:", input);
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log("Server response:", res.data);
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      console.error("Error details:", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <JobHeader />
      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md"
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                placeholder="Fullstack Developer"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                placeholder="Enter job description"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                placeholder="Reactjs, Nodejs, MongoDB, etc"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>{" "}
            <div>
              <Label>Salary Currency</Label>
              <Input
                type="text"
                name="salaryCurrency"
                value={input.salaryCurrency}
                onChange={changeEventHandler}
                placeholder="INR/ USD/ EUR"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Salary Min</Label>
              <Input
                type="number"
                name="salaryMin"
                value={input.salaryMin}
                onChange={changeEventHandler}
                placeholder="500000"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Salary Max</Label>
              <Input
                type="number"
                name="salaryMax"
                value={input.salaryMax}
                onChange={changeEventHandler}
                placeholder="1000000"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                placeholder="Enter job location"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Work Mode</Label>
              <Select
                value={input.workMode}
                onValueChange={(value) =>
                  selectChangeHandler("workMode", value)
                }
              >
                <SelectTrigger className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1">
                  <SelectValue placeholder="Select work mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Onsite">Onsite</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Job Type</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                placeholder="Full-time/Internship"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Duration</Label>
              <Input
                type="text"
                name="duration"
                value={input.duration}
                onChange={changeEventHandler}
                placeholder="0-6 months"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Experience Level</Label>
              <Input
                type="text"
                name="experienceLevel"
                value={input.experienceLevel}
                onChange={changeEventHandler}
                placeholder="0-2 years"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Job Level</Label>
              <Select
                value={input.jobLevel}
                onValueChange={(value) =>
                  selectChangeHandler("jobLevel", value)
                }
              >
                <SelectTrigger className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1">
                  <SelectValue placeholder="Select Job Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Intern">Intern</SelectItem>
                  <SelectItem value="Fresher">Fresher</SelectItem>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Mid">Mid</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>No of Position</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                placeholder="1/2/3"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
          </div>
          {loading ? (
            <Button className="w-full my-4">
              {" "}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait{" "}
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Post New Job
            </Button>
          )}
          {companies.length === 0 && (
            <p className="text-xs text-red-600 font-bold text-center my-3">
              *Please create a company first, before posting jobs
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
