import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";
import JobHeader from "@/components/JobHeader/JobHeader";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [logo, setLogo] = useState(null);
  const [employeeCount, setEmployeeCount] = useState("");
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setLogo(file);
  };

  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      toast.error("Company name is required");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("companyName", companyName);
      formData.append("description", description);
      formData.append("website", website);
      formData.append("location", location);
      formData.append("employeeCount", employeeCount);
      if (logo) {
        formData.append("file", logo);
      }
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res?.data?.company?._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create company");
    }
  };
  return (
    <div>
      <JobHeader />
      <div className="max-w-4xl mx-auto">
        <div className="my-10">
          <h1 className="font-bold text-2xl">Create Your Company</h1>
          <p className="text-gray-500">
            Provide details for your company. You can change this later.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Company Name *</Label>
            <Input
              type="text"
              className="my-2"
              placeholder="JobHunt, Microsoft etc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              type="text"
              className="my-2"
              placeholder="Brief description of the company"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label>Website</Label>
            <Input
              type="url"
              className="my-2"
              placeholder="https://example.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              type="text"
              className="my-2"
              placeholder="City, Country"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <Label>Upload Logo</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={fileChangeHandler}
              className="my-2"
            />
          </div>
          <div>
            <Label>Employee Count</Label>
            <Input
              type="number"
              className="my-2"
              placeholder="Number of employees"
              value={employeeCount}
              onChange={(e) => setEmployeeCount(e.target.value)}
            />
          </div>
        </div>
        <div className="my-10">
          <Button onClick={registerNewCompany}>Continue</Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
