import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();

  /* ================= SCROLL (STICKY) ================= */
  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSticky(window.scrollY > 50);
      }, 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  /* ================= RESIZE ================= */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= BODY SCROLL LOCK ================= */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isMobileMenuOpen]);

  /* ================= HANDLERS ================= */
  const handleLoginClick = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleRegisterClick = () => {
    navigate("/register");
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { id: "home", label: "HOME", to: "home" },
    { id: "about", label: "ABOUT", to: "about" },
    { id: "faq", label: "FAQ", to: "faq" },
  ];

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-[2%] left-[3%] right-[3%] sm:left-[5%] sm:right-[5%] lg:left-[6%] lg:right-[6%] z-[100]">
        <div
          className={`grid grid-cols-3 items-center px-4 sm:px-6  rounded-full border transition-all duration-500 ${
            sticky
              ? "bg-gradient-to-r from-[#fff6b3] via-white to-[#f4f1f7] backdrop-blur-2xl shadow-xl border-white/60"
              : "bg-white/5 backdrop-blur-md shadow-lg border-white/40"
          }`}
        >
          {/* ===== LOGO ===== */}
          <div className="flex justify-start">
            <NavLink to="/">
              <img
                src="./images/logo.png"
                alt="Careero Logo"
                className="w-[120px] md:w-[150px] transition-transform duration-300 hover:scale-105"
              />
            </NavLink>
          </div>

          {/* ===== DESKTOP NAV LINKS ===== */}
          <ul className="hidden lg:flex justify-center items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  to={link.to}
                  spy
                  smooth
                  offset={-100}
                  duration={800}
                  onSetActive={() => setActiveSection(link.id)}
                  className={`relative cursor-pointer font-semibold text-base xl:text-lg transition hover:no-underline ${
                    activeSection === link.id ? "text-purple-700" : "text-black"
                  } group`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-purple-700 to-purple-900 transition-all ${
                      activeSection === link.id
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* ===== DESKTOP AUTH ===== */}
          <div className="hidden lg:flex justify-end items-center gap-4">
            <button
              onClick={handleLoginClick}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-700 to-purple-800 text-white font-bold hover:shadow-lg transition"
            >
              LOGIN
            </button>
            <button
              onClick={handleRegisterClick}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-700 to-purple-800 text-white font-bold hover:shadow-lg transition"
            >
              SIGNUP
            </button>
          </div>

          {/* ===== MOBILE MENU BUTTON ===== */}
          <button
            className="lg:hidden flex justify-end"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`lg:hidden fixed top-[90px] left-[5%] right-[5%] z-[99] transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-5 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <ul className="p-4 space-y-2">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  to={link.to}
                  smooth
                  offset={-100}
                  duration={800}
                  onClick={() => setIsMobileMenuOpen(false)}
                  onSetActive={() => setActiveSection(link.id)}
                  className={`block px-4 py-3 rounded-xl font-semibold ${
                    activeSection === link.id
                      ? "bg-purple-800 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="p-4 border-t space-y-3">
            <button
              onClick={handleLoginClick}
              className="w-full py-3 rounded-full bg-purple-800 text-white font-bold"
            >
              LOGIN
            </button>
            <button
              onClick={handleRegisterClick}
              className="w-full py-3 rounded-full border-2 border-purple-800 text-purple-800 font-bold hover:bg-purple-800 hover:text-white transition"
            >
              SIGNUP
            </button>
          </div>
        </div>
      </div>

      {/* ===== OVERLAY ===== */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[98]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
