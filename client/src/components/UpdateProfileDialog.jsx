import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Loader2, Upload } from "lucide-react"; // Import the Upload icon
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    fullname: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: Array.isArray(user?.profile?.skills)
      ? user.profile.skills.join(", ")
      : "",
    file: null,
    resumeLink: user?.profile?.resume || "",
    useFile: true,
  });

  const dispatch = useDispatch();

  // Event handler to update input state on change
  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input changes
  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        return;
      }
      setInput((prev) => ({ ...prev, file }));
    }
  };

  // Toggle between file upload and link
  const toggleInputType = () => {
    setInput((prev) => ({
      ...prev,
      useFile: !prev.useFile,
      file: null,
      resumeLink: "",
    }));
  };

  // Submit handler for updating profile
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.file && !input.resumeLink) {
      toast.error("Please provide a resume file or link.");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", input.fullname.trim());
    formData.append("email", input.email.trim());
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio.trim());
    formData.append("skills", input.skills.trim());

    if (input.useFile && input.file) {
      formData.append("file", input.file);
    } else if (!input.useFile && input.resumeLink) {
      formData.append("resume", input.resumeLink.trim());
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false); // Close dialog after successful update
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "An error occurred while updating profile";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={() => setOpen(false)}
        aria-describedby="update-profile-description"
      >
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={submitHandler}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullname" className="text-right">
                Name
              </Label>
              <Input
                id="fullname"
                name="fullname"
                type="text"
                value={input.fullname}
                onChange={changeEventHandler}
                className="col-span-3"
                placeholder="Enter your full name"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={input.email}
                onChange={changeEventHandler}
                className="col-span-3"
                placeholder="Enter your email"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className="col-span-3"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Input
                id="bio"
                name="bio"
                value={input.bio}
                onChange={changeEventHandler}
                className="col-span-3"
                placeholder="Enter a short bio"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skills" className="text-right">
                Skills
              </Label>
              <Input
                id="skills"
                name="skills"
                value={input.skills}
                onChange={changeEventHandler}
                className="col-span-3"
                placeholder="Enter skills (comma-separated)"
              />
            </div>

            {/* Toggle for Resume Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resumeType" className="text-right">
                Resume
              </Label>
              <button
                type="button"
                onClick={toggleInputType}
                className="col-span-3 text-sm text-blue-600 underline"
              >
                {input.useFile ? "Use Link Instead" : "Upload File Instead"}
              </button>
            </div>

            {input.useFile ? (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">
                  Upload File
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept="application/pdf"
                    onChange={fileChangeHandler}
                    className="w-full"
                  />
                  <Upload size={20} className="text-blue-500" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="resumeLink" className="text-right">
                  Resume Link
                </Label>
                <Input
                  id="resumeLink"
                  name="resumeLink"
                  type="url"
                  value={input.resumeLink}
                  onChange={changeEventHandler}
                  className="col-span-3"
                  placeholder="Enter a link to your resume"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            {loading ? (
              <button className="w-full my-4" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </button>
            ) : (
              <button type="submit" className="w-full my-4">
                Update
              </button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
