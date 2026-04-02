import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ mode = "public", onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (sectionId) => {
    setIsMenuOpen(false);

    if (sectionId === "contact") {
      navigate("/contact");
      return;
    }

    if (window.location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    navigate(`/#${sectionId}`);
  };

  const isDashboardMode = mode === "dashboard";
  const navItems = isDashboardMode
    ? [
        { name: "Home", path: "hero" },
        { name: "Contact", path: "contact" },
      ]
    : [
        { name: "Home", path: "hero" },
        { name: "Services", path: "services" },
        { name: "About Us", path: "about" },
        { name: "Our Fleet & Pricing", path: "fleet" },
        { name: "Contact", path: "contact" },
      ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/60 border-b border-white/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => handleNavClick("hero")}
            className="flex items-center space-x-2 focus:outline-none"
            aria-label="Go to home section"
          >
            <img
              src="/company_logo.png"
              alt="DATTA Cranes Logo"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-2xl font-bold text-orange-600 transition-colors duration-300">
              DATTA CRANES
            </span>
          </button>
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.path)}
                  className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
                >
                  {item.name}
                </button>
              );
            })}
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            {isDashboardMode ? (
              <button
                onClick={onLogout}
                className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2 text-orange-600 font-medium border border-orange-600 rounded-lg hover:bg-orange-50 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-6 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-orange-600 focus:outline-none rounded"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden border-t border-gray-100 py-4"
          >
            <div className="flex flex-col space-y-4 px-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.path)}
                  className="text-gray-700 hover:text-orange-600 font-medium text-left px-4 py-2 rounded-lg hover:bg-orange-50 transition"
                >
                  {item.name}
                </button>
              ))}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                {isDashboardMode ? (
                  <button
                    onClick={onLogout}
                    className="w-full px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full px-4 py-2 text-orange-600 font-medium border border-orange-600 rounded-lg hover:bg-orange-50"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate("/register")}
                      className="w-full px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
