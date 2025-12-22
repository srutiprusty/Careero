import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";

import Login from "./components/Login/Login";
import EditJob from "./pages/Provider/EditJob";
import EmpLog from "./pages/Emp-login/EmpLog";
import StdLog from "./pages/Std-Login/StdLog";
import Landing from "./components/Landing/Landing";
import SignUp from "./components/SignUp/SignUp";
import JobPg from "./pages/JobSeeker/JobPg/JobPg";
import Jobs from "./components/Jobs/Jobs";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import Job from "./components/job/Job";
import CompanyCreate from "./pages/Provider/CompanyCreate";
import EditCompany from "./pages/Provider/EditCompany";
import CompanyPage from "./pages/Provider/CompanyPage";
/* import CompanySetup from "./pages/Provider/CompanySetup";*/
import PostJob from "./pages/Provider/PostJob";
import Applicants from "./pages/Provider/Applicants";
import AdminJobs from "./pages/Provider/AdminJobs";
import Browse from "./components/Browse";
import ProtectedRoute from "./pages/Provider/ProtectedRoute";
/* import ProtectedRoute from "./pages/Provider/ProtectedRoute"; */
import ResourcesHm from "./pages/JobSeeker/resources/ResourcesHm";
import Resume from "./pages/JobSeeker/resources/Resume/Resume";
import Roadmap from "./pages/JobSeeker/resources/Roadmap";
import ResumeAna from "./pages/JobSeeker/resources/ResumeAna";
import FrontedRoadmap from "./pages/JobSeeker/resources/FrontendRoadmap";
import ExamSection from "./pages/JobSeeker/resources/ExamSection";
import EmailVerification from "./components/SignUp/EmailVerification";
import ForgotPassword from "./components/Login/ForgotPassword";
import ResetPassword from "./components/Login/ResetPassword";
import Chatbot from "./components/Chatbot";
// Use the interview flow component (lowercase folder)
import Interview from "./pages/JobSeeker/Interview/Interview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/emplogin" element={<EmpLog />} />
        <Route path="/stdlogin" element={<StdLog />} />
        <Route path="/jobpg" element={<JobPg />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDescription />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/job" element={<Job />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/resources" element={<ResourcesHm />} />
        <Route path="/resume" element={<Resume />} />
        {/*         <Route path="/test-series" element={<ExamSection />} />
         */}{" "}
        <Route path="/roadmaps" element={<Roadmap />} />
        <Route path="/frontend" element={<FrontedRoadmap />} />
        <Route path="/verify/:token" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/resume-analyzer" element={<ResumeAna />} />
        {/* provider */}
        <Route
          path="/admin/companies/create"
          element={
            <ProtectedRoute>
              <CompanyCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies/:id"
          element={
            <ProtectedRoute>
              <CompanyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies/:id/edit"
          element={
            <ProtectedRoute>
              <EditCompany />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute>
              <AdminJobs />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/create"
          element={
            <ProtectedRoute>
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/:id/edit"
          element={
            <ProtectedRoute>
              <EditJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs/:id/applicants"
          element={
            <ProtectedRoute>
              <Applicants />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
