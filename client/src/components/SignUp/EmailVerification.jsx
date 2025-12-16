import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "../../utils/constant";
import axios from "axios";

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const { token } = useParams();
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // Helper function to get login path based on role
  const getLoginPath = (role) => {
    if (role === "student") return "/stdlogin";
    if (role === "recruiter") return "/emplogin";
    if (role === "mentor") return "/mentorlogin";
    return "/login"; // default
  };

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        //console.log("Verifying token:", token);
        const response = await axios.get(
          `${USER_API_END_POINT}/verify/${token}`
        );
        if (response.data.success) {
          setVerificationStatus("success");
          const role = response.data.user?.role;
          setUserRole(role);
          // Redirect to role-specific login page after 3 seconds
          setTimeout(() => {
            navigate(getLoginPath(role));
          }, 3000);
        } else {
          setVerificationStatus("error");
        }
      } catch (error) {
        // console.error("Verification error:", error.response || error); // Debug log
        setError(error.response?.data?.message);
        setVerificationStatus("error");
        //  console.log(error);
      }
    };
    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {verificationStatus === "verifying" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold">Verifying your email...</h2>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          </div>
        )}

        {verificationStatus === "success" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600">
              Email Verified Successfully!
            </h2>
            <p className="mt-2">Redirecting to login page...</p>
          </div>
        )}

        {verificationStatus === "error" && (
          <div className="text-center">
            <p className="mt-2">
              {error || "The verification link is invalid or expired."}
            </p>
            <button
              onClick={() => navigate(getLoginPath(userRole))}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
