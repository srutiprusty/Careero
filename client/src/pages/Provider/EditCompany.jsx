import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";
import JobHeader from "@/components/JobHeader/JobHeader";
import {
  Loader2,
  Building2,
  Globe,
  MapPin,
  Users,
  FileText,
  Upload,
  ArrowLeft,
  Save,
} from "lucide-react";

const EditCompany = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    companyName: "",
    description: "",
    website: "",
    location: "",
    logo: null,
    employeeCount: "",
  });
  const [loading, setLoading] = useState(false);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [previewLogo, setPreviewLogo] = useState(null);

  // Fetch company data
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          const company = res.data.company;
          setInput({
            companyName: company.companyName || "",
            description: company.description || "",
            website: company.website || "",
            location: company.location || "",
            logo: company.logo || "",
            employeeCount: company.employeeCount || "",
          });
          if (company.logo) {
            setPreviewLogo(company.logo);
          }
        }
      } catch (error) {
        console.error("Error fetching company:", error);
        toast.error("Failed to load company data");
      } finally {
        setCompanyLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, logo: file });
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // Add validation
    if (!input.companyName.trim()) {
      toast.error("Company name is required");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("companyName", input.companyName);
      formData.append("description", input.description);
      formData.append("website", input.website);
      formData.append("location", input.location);
      formData.append("employeeCount", input.employeeCount);
      if (input.logo && typeof input.logo !== "string") {
        formData.append("file", input.logo);
      }
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        navigate(`/admin/companies/${id}`);
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error(error.response?.data?.message || "Failed to update company");
    } finally {
      setLoading(false);
    }
  };

  if (companyLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20">
        <JobHeader />
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Loading company data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20">
      <JobHeader />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/admin/companies/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Company</span>
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Edit Company
          </h1>
          <p className="text-gray-600">
            Update the details for your company profile
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
          <form onSubmit={submitHandler}>
            {/* Logo Preview Section */}
            {previewLogo && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 sm:p-8 border-b border-purple-100">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={previewLogo}
                      alt="Company Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Logo</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {input.companyName || "Company Name"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Company Name & Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    Company Name *
                  </Label>
                  <Input
                    type="text"
                    name="companyName"
                    value={input.companyName}
                    onChange={changeEventHandler}
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="e.g., JobHunt, Microsoft"
                    required
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    Description
                  </Label>
                  <Input
                    type="text"
                    name="description"
                    value={input.description}
                    onChange={changeEventHandler}
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Brief description"
                  />
                </div>
              </div>

              {/* Website & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Globe className="w-4 h-4 text-purple-600" />
                    Website
                  </Label>
                  <Input
                    type="url"
                    name="website"
                    value={input.website}
                    onChange={changeEventHandler}
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    Location
                  </Label>
                  <Input
                    type="text"
                    name="location"
                    value={input.location}
                    onChange={changeEventHandler}
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* Logo Upload & Employee Count */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Upload className="w-4 h-4 text-purple-600" />
                    Upload Logo
                  </Label>
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={fileChangeHandler}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG or WEBP (max 5MB)
                  </p>
                </div>

                <div>
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    Employee Count
                  </Label>
                  <Input
                    type="number"
                    name="employeeCount"
                    value={input.employeeCount}
                    onChange={changeEventHandler}
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Number of employees"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-6 sm:px-8 py-4 sm:py-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                * Required fields must be filled
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/admin/companies/${id}`)}
                  className="flex-1 sm:flex-initial border-gray-300 hover:bg-gray-100"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 sm:flex-initial bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Company
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCompany;
