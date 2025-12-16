import { useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs";
import JobHeader from "./JobHeader/JobHeader";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="bg-gray-50 min-h-screen">
      <JobHeader />

      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                alt="profile"
              />
            </Avatar>
            <div>
              <h1 className="font-semibold text-2xl text-gray-800">
                {user?.fullName || "John Doe"}
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.profile?.bio || "Your bio goes here."}
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
          >
            <Pen size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail size={20} className="text-gray-500" />
            <span>{user?.email || "example@example.com"}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Contact size={20} className="text-gray-500" />
            <span>{user?.phoneNumber || "(123) 456-7890"}</span>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold text-lg text-gray-800 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {user?.profile?.skills?.length ? (
              user?.profile?.skills.map((item, index) => (
                <Badge key={index} className="bg-blue-100 text-blue-800">
                  {item}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500">No skills added.</span>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Label className="text-md font-bold text-gray-800">Resume</Label>
          {user?.profile?.resume ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={user?.profile?.resume}
              className="text-blue-500 hover:underline"
            >
              {user?.profile?.resumeOriginalName || "Download Resume"}
            </a>
          ) : (
            <span className="text-gray-500">No resume available.</span>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl mt-6 p-8 shadow-lg">
        <h1 className="font-bold text-xl text-gray-800 mb-4">Applied Jobs</h1>
        <AppliedJobTable />
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
