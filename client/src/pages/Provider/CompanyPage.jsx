import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import JobHeader from "@/components/JobHeader/JobHeader";
import {
  Building2,
  MapPin,
  Globe,
  Users,
  Edit,
  ArrowLeft,
  Briefcase,
  Calendar,
} from "lucide-react";

const CompanyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        if (res?.data?.success) {
          setCompany(res.data.company);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch company details");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20">
        <JobHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">
                Loading company details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20">
        <JobHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Building2 className="w-20 h-20 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Company Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The company you're looking for doesn't exist.
            </p>
            <Button
              onClick={() => navigate("/admin/companies")}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Companies
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20">
      <JobHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Company Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden mb-6">
          {/* Cover Image / Gradient Header */}
          <div className="h-32 sm:h-40 bg-gradient-to-r from-purple-600 to-purple-700 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Company Info */}
          <div className="px-6 sm:px-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20">
              {/* Logo */}
              <div className="relative mb-4 sm:mb-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white shadow-xl border-4 border-white overflow-hidden">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.companyName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="w-full h-full items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200"
                    style={{ display: company.logo ? "none" : "flex" }}
                  >
                    <span className="text-4xl sm:text-5xl font-bold text-purple-600">
                      {company.companyName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <Button
                onClick={() => navigate(`/admin/companies/${id}/edit`)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white self-start sm:self-auto"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Company
              </Button>
            </div>

            {/* Company Name & Basic Info */}
            <div className="mt-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {company.companyName}
              </h1>
              {company.location && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <span>{company.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info - Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-purple-600" />
                About Company
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {company.description || (
                  <span className="text-gray-400 italic">
                    No description available
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Sidebar - Right Column (1/3) */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Company Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/20">
                  <span className="text-purple-100">Location</span>
                  <span className="font-semibold">
                    {company.location || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/20">
                  <span className="text-purple-100">Employees</span>
                  <span className="font-semibold">
                    {company.employeeCount
                      ? company.employeeCount.toLocaleString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-100">Website</span>

                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-black font-medium break-all hover:underline text-right"
                    >
                      {company.website}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">Not provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
