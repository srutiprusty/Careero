import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2, Menu, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import logo from "../../../public/images/logo.png";

const JobHeader = () => {
  const { user } = useSelector((store) => store.auth);
  const { companies } = useSelector((store) => store.company);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to manage the hamburger menu
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <nav className="sticky top-[2%] z-[1000] mx-[5%] sm:mx-[8%] ">
      <div className="flex items-center justify-between h-[55px] px-4 sm:px-5 bg-white rounded-[30px] shadow-[0_10px_5px_rgba(0,0,0,0.1)]">
        {/* Logo */}
        <div className="flex-shrink-0">
          <NavLink to="/">
            <img
              src={logo}
              alt="careero logo"
              className="w-[120px] md:w-[150px] transition-transform duration-300 hover:scale-105"
            />
          </NavLink>
        </div>

        {/* Hamburger Menu - Mobile */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col gap-[5px] cursor-pointer z-[1001]"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-black" />
          ) : (
            <Menu className="w-6 h-6 text-black" />
          )}
        </button>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-5 lg:gap-8 list-none m-0 p-0">
          {user && user.role === "recruiter" ? (
            <>
              <li className="flex items-center">
                <NavLink
                  to={`/admin/companies/${companies[0]?._id}`}
                  className={({ isActive }) =>
                    `no-underline text-black text-lg font-bold font-sans transition-colors duration-300 hover:text-purple-600 ${
                      isActive ? "text-purple-600" : ""
                    }`
                  }
                >
                  Company
                </NavLink>
              </li>
              <li className="flex items-center">
                <NavLink
                  to="/admin/jobs"
                  className={({ isActive }) =>
                    `no-underline text-black text-lg font-bold font-sans transition-colors duration-300 hover:text-purple-600 ${
                      isActive ? "text-purple-600" : ""
                    }`
                  }
                >
                  Jobs
                </NavLink>
              </li>
              <li className="flex items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="cursor-pointer hover:text-purple-600 transition-colors duration-300">
                      <User2 className="w-6 h-6" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto my-2">
                    <div className="flex gap-3">
                      <Avatar className="cursor-pointer">
                        <AvatarImage
                          src={user?.profile?.profilePhoto}
                          alt="Profile"
                        />
                      </Avatar>

                      <div className="flex flex-col justify-center text-gray-600">
                        {user && user.role === "student" && (
                          <div className="flex items-center gap-2 cursor-pointer">
                            <User2 className="w-4 h-4" />
                            <Button variant="link" className="p-0 h-auto">
                              <Link to="/profile">View Profile</Link>
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center gap-2 cursor-pointer">
                          <LogOut className="w-4 h-4" />
                          <Button
                            onClick={logoutHandler}
                            variant="link"
                            className="p-0 h-auto"
                          >
                            Logout
                          </Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </li>
            </>
          ) : (
            <>
              <li className="flex items-center">
                <NavLink
                  to="/jobpg"
                  className={({ isActive }) =>
                    `no-underline text-black text-lg font-bold font-sans transition-colors duration-300 hover:text-purple-600 ${
                      isActive ? "text-purple-600" : ""
                    }`
                  }
                >
                  Jobs
                </NavLink>
              </li>
              <li className="flex items-center">
                <NavLink
                  to="/resources"
                  className={({ isActive }) =>
                    `no-underline text-black text-lg font-bold font-sans transition-colors duration-300 hover:text-purple-600 ${
                      isActive ? "text-purple-600" : ""
                    }`
                  }
                >
                  Resources
                </NavLink>
              </li>
              <li className="flex items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="cursor-pointer hover:text-purple-600 transition-colors duration-300">
                      <User2 className="w-6 h-6" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto my-2">
                    <div className="flex gap-3">
                      {/*  <Avatar className="cursor-pointer">
                        <AvatarImage
                          src={user?.profile?.profilePhoto}
                          alt="Profile"
                        />
                      </Avatar> */}

                      <div className="flex flex-col justify-center text-gray-600">
                        {user && user.role === "student" && (
                          <div className="flex items-center gap-2 cursor-pointer">
                            <User2 className="w-4 h-4" />
                            <Button variant="link" className="p-0 h-auto">
                              <Link to="/profile">View Profile</Link>
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center gap-2 cursor-pointer">
                          <LogOut className="w-4 h-4" />
                          <Button
                            onClick={logoutHandler}
                            variant="link"
                            className="p-0 h-auto"
                          >
                            Logout
                          </Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </li>
            </>
          )}

          {/*   {user && (
            <li className="flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="cursor-pointer hover:text-purple-600 transition-colors duration-300">
                    <User2 className="w-6 h-6" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto my-2">
                  <div className="flex gap-3">
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt="Profile"
                      />
                    </Avatar>

                    <div className="flex flex-col justify-center text-gray-600">
                      {user && user.role === "student" && (
                        <div className="flex items-center gap-2 cursor-pointer">
                          <User2 className="w-4 h-4" />
                          <Button variant="link" className="p-0 h-auto">
                            <Link to="/profile">View Profile</Link>
                          </Button>
                        </div>
                      )}
                      <div className="flex items-center gap-2 cursor-pointer">
                        <LogOut className="w-4 h-4" />
                        <Button
                          onClick={logoutHandler}
                          variant="link"
                          className="p-0 h-auto"
                        >
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </li>
          )} */}
        </ul>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="md:hidden fixed inset-0 bg-black/20 z-[999]"
              onClick={toggleMenu}
            ></div>

            {/* Mobile Menu */}
            <div className="md:hidden fixed top-[80px] right-5 bg-white rounded-xl shadow-lg z-[1000] min-w-[200px]">
              <ul className="flex flex-col gap-2 p-4 list-none m-0">
                {user && user.role === "recruiter" ? (
                  <>
                    <li>
                      <NavLink
                        to={`/admin/companies/${companies[0]?._id}`}
                        onClick={toggleMenu}
                        className={({ isActive }) =>
                          `block no-underline text-black text-base font-bold font-sans transition-colors duration-300 hover:text-purple-600 py-2 ${
                            isActive ? "text-purple-600" : ""
                          }`
                        }
                      >
                        Company
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/admin/jobs"
                        onClick={toggleMenu}
                        className={({ isActive }) =>
                          `block no-underline text-black text-base font-bold font-sans transition-colors duration-300 hover:text-purple-600 py-2 ${
                            isActive ? "text-purple-600" : ""
                          }`
                        }
                      >
                        Jobs
                      </NavLink>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <NavLink
                        to="/jobpg"
                        onClick={toggleMenu}
                        className={({ isActive }) =>
                          `block no-underline text-black text-base font-bold font-sans transition-colors duration-300 hover:text-purple-600 py-2 ${
                            isActive ? "text-purple-600" : ""
                          }`
                        }
                      >
                        Jobs
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/resources"
                        onClick={toggleMenu}
                        className={({ isActive }) =>
                          `block no-underline text-black text-base font-bold font-sans transition-colors duration-300 hover:text-purple-600 py-2 ${
                            isActive ? "text-purple-600" : ""
                          }`
                        }
                      >
                        Resources
                      </NavLink>
                    </li>
                  </>
                )}

                {user && (
                  <>
                    <li className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex items-center gap-3 py-2">
                        <Avatar className="cursor-pointer w-8 h-8">
                          <AvatarImage
                            src={user?.profile?.profilePhoto}
                            alt="Profile"
                          />
                        </Avatar>
                        <span className="text-sm font-semibold text-gray-900">
                          {user?.fullname}
                        </span>
                      </div>
                    </li>
                    {user && user.role === "student" && (
                      <li>
                        <Link
                          to="/profile"
                          onClick={toggleMenu}
                          className="flex items-center gap-2 text-gray-700 hover:text-purple-600 py-2 transition-colors duration-300"
                        >
                          <User2 className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            View Profile
                          </span>
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={() => {
                          logoutHandler();
                          toggleMenu();
                        }}
                        className="flex items-center gap-2 text-gray-700 hover:text-red-600 py-2 transition-colors duration-300 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default JobHeader;
