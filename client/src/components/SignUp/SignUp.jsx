import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/authSlice";
import Navbar from "../Navbar/Navbar";
import { USER_API_END_POINT } from "@/utils/constant";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const response = await fetch(`${USER_API_END_POINT}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, role }),
      });

      const result = await response.json();

      setFullName("");
      setEmail("");
      setPassword("");
      setRole("");

      if (response.ok) {
        toast.success(result.message);
        if (role === "student") {
          navigate("/stdlogin");
        } else {
          navigate("/emplogin");
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      {/*    <Navbar /> */}
      <div className="min-h-screen w-full relative flex items-center justify-center px-4 py-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-yellow-50">
        {/* Decorative gradients */}
        <div className="yellow-gradient"></div>
        {/* Form Container */}
        <div className="relative w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-100">
            <form className="space-y-5" onSubmit={handleSignup}>
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Welcome
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Register to get full access now :)
                </p>
              </div>

              {/* Name Input */}
              <div>
                <input
                  type="text"
                  className="w-full px-4 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <input
                  type="email"
                  className="w-full px-4 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <input
                  type="password"
                  className="w-full px-4 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Role Select */}
              <div>
                <select
                  className="w-full px-4 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base text-gray-700"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="">Select User Type</option>
                  <option value="student">Student</option>
                  <option value="recruiter">Employer</option>
                </select>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-sm sm:text-base text-gray-600">
                  Already have an account?{" "}
                  <NavLink
                    to="/login"
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    Sign in
                  </NavLink>
                </p>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 uppercase text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing up...
                    </span>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="violet-gradient"></div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
};

export default SignUp;
