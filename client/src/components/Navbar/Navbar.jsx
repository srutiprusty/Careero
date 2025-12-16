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
          className={`flex items-center justify-between px-4 sm:px-6    rounded-full border transition-all duration-500 ${
            sticky
              ? "bg-gradient-to-r from-[#fff6b3] via-white to-[#f4f1f7] backdrop-blur-2xl shadow-xl border-white/60"
              : "bg-white/5 backdrop-blur-md shadow-lg border-white/40"
          }`}
        >
          {/* ===== LOGO ===== */}
          <div className="flex-shrink-0">
            <NavLink to="/">
              <img
                src="./images/logo.png"
                alt="Careero Logo"
                className="w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px] transition-transform duration-300 hover:scale-105"
              />
            </NavLink>
          </div>

          {/* ===== DESKTOP NAV LINKS (CENTERED) ===== */}
          <div className="hidden lg:flex flex-1 justify-center">
            <ul className="flex items-center gap-6 xl:gap-10">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    to={link.to}
                    spy
                    smooth
                    offset={-100}
                    duration={800}
                    onSetActive={() => setActiveSection(link.id)}
                    className={`relative cursor-pointer font-semibold text-base xl:text-lg transition-colors duration-300 ${
                      activeSection === link.id
                        ? "text-purple-700"
                        : "text-gray-700 hover:text-purple-700"
                    } group`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-purple-700 to-purple-900 transition-all duration-300 ${
                        activeSection === link.id
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== DESKTOP AUTH BUTTONS ===== */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            <button
              onClick={handleLoginClick}
              className="px-6 xl:px-8 py-2.5 rounded-full bg-gradient-to-r from-purple-700 to-purple-900 text-white font-bold text-sm xl:text-base hover:shadow-lg hover:shadow-purple-300 transition-all duration-300"
            >
              LOGIN
            </button>
            <button
              onClick={handleRegisterClick}
              className="px-6 xl:px-8 py-2.5 rounded-full bg-gradient-to-r from-purple-700 to-purple-900 text-white font-bold text-sm xl:text-base hover:shadow-lg hover:shadow-purple-300 transition-all duration-300"
            >
              SIGNUP
            </button>
          </div>

          {/* ===== MOBILE MENU BUTTON ===== */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-800 transition-transform duration-300 rotate-90" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`lg:hidden fixed top-[calc(2%+70px)] sm:top-[calc(2%+80px)] left-[3%] right-[3%] sm:left-[5%] sm:right-[5%] z-[99] transition-all duration-500 ease-in-out ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Mobile Nav Links */}
          <ul className="p-4 space-y-1">
            {navLinks.map((link, index) => (
              <li
                key={link.id}
                className="transform transition-all duration-300"
                style={{
                  transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
                }}
              >
                <Link
                  to={link.to}
                  spy
                  smooth
                  offset={-100}
                  duration={800}
                  onClick={() => setIsMobileMenuOpen(false)}
                  onSetActive={() => setActiveSection(link.id)}
                  className={`block px-4 py-3 rounded-xl font-semibold text-base transition-all duration-300 ${
                    activeSection === link.id
                      ? "bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-lg scale-[1.02]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Auth Buttons */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
            <button
              onClick={handleLoginClick}
              className="w-full py-3 rounded-full bg-gradient-to-r from-purple-700 to-purple-900 text-white font-bold hover:shadow-lg hover:shadow-purple-300 transition-all duration-300 transform hover:scale-[1.02]"
            >
              LOGIN
            </button>
            <button
              onClick={handleRegisterClick}
              className="w-full py-3 rounded-full border-2 border-purple-700 text-purple-700 font-bold hover:bg-purple-700 hover:text-white transition-all duration-300 transform hover:scale-[1.02]"
            >
              SIGNUP
            </button>
          </div>
        </div>
      </div>

      {/* ===== OVERLAY ===== */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[98] transition-opacity duration-500"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
