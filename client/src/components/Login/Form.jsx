import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { setLoading, setUser } from "@/redux/authSlice";
import { USER_API_END_POINT, COMPANY_API_END_POINT } from "@/utils/constant";

const Form = ({ role }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password || !role) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      dispatch(setLoading(true));
      const response = await fetch(`${USER_API_END_POINT}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
        credentials: "include",
      });

      const data = await response.json();

      if (!data.success) {
        if (data.message === "Please verify your email first") {
          toast.error(data.message);
          return;
        }
        throw new Error(data.message);
      }

      dispatch(setUser(data.user));
      toast.success(data.message);

      // Navigate based on role
      if (data.user.role === "student") {
        navigate("/jobpg");
      } else {
        // Check if user has a company
        try {
          const companyRes = await fetch(`${COMPANY_API_END_POINT}/get`, {
            method: "GET",
            credentials: "include",
          });
          const companyData = await companyRes.json();
          if (companyData.success && companyData.companies.length > 0) {
            navigate(`/admin/companies/${companyData.companies[0]._id}`);
          } else {
            navigate("/admin/companies/create");
          }
        } catch (error) {
          navigate("/admin/companies/create");
        }
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen lg:px-4">
      <form
        className="flex flex-col gap-2.5 border border-gray-200 shadow-md py-8 px-4 w-full max-w-md rounded-3xl z-10 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
        onSubmit={handleLogin}
      >
        {/* Email Field */}
        <div className="flex flex-col mb-2 text-left">
          <label className="text-gray-800 font-semibold mb-2">Email</label>
        </div>
        <div className="flex items-center bg-gray-100 px-4 py-2 rounded-md mb-4">
          <svg
            height="20"
            viewBox="0 0 32 32"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0 mr-2"
          >
            <g id="Layer_3" data-name="Layer 3">
              <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
            </g>
          </svg>
          <input
            type="email"
            className="flex-1 border-none bg-transparent outline-none text-base py-2 placeholder-gray-400"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col mb-2 text-left">
          <label className="text-gray-800 font-semibold mb-2">Password</label>
        </div>
        <div className="flex items-center bg-gray-100 px-4 py-2 rounded-md mb-4">
          <svg
            height="20"
            viewBox="-64 0 512 512"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0 mr-2"
          >
            <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
            <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
          </svg>
          <input
            type="password"
            className="flex-1 border-none bg-transparent outline-none text-base py-2 placeholder-gray-400"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" className="cursor-pointer" />
            <label className="text-sm text-gray-800">Remember me</label>
          </div>
          <div>
            <NavLink
              to="/forgot-password"
              className="text-sm text-purple-600 font-bold hover:underline"
            >
              Forgot Password?
            </NavLink>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white font-bold border-none rounded-md text-base cursor-pointer transition-transform duration-300 hover:bg-purple-700 hover:scale-[1.01] disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Please wait...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </button>

        {/* Sign Up Link */}
        <p className="text-center mt-4 text-sm text-gray-800">
          Don't have an account?{" "}
          <NavLink
            to="/register"
            className="text-purple-600 font-bold cursor-pointer hover:underline"
          >
            Sign Up
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default Form;
