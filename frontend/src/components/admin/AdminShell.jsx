import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const AdminShell = ({ title, subtitle, children }) => {
  const navigate = useNavigate();

  const tabBaseClass =
    "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border";

  const tabStyle = ({ isActive }) =>
    isActive
      ? {
          backgroundColor: "#ffffff",
          borderColor: "#ffffff",
          color: "#1e3a8a",
          boxShadow: "0 6px 16px rgba(2,6,23,0.25)",
        }
      : {
          backgroundColor: "rgba(255,255,255,0.12)",
          borderColor: "rgba(255,255,255,0.28)",
          color: "#eaf2ff",
        };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--dc-bg, #f9fafb)" }}
    >
      <Navbar mode="dashboard" onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full"
          style={{ background: "transparent" }}
        >
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg rounded-2xl border border-blue-500/40 p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src="/company_logo.png"
                    alt="Dutta Cranes"
                    className="w-8 h-8 rounded-full object-cover shadow-md"
                  />
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-100">
                    Dutta Cranes Admin
                  </p>
                </div>
                <h1 className="text-3xl font-bold">{title}</h1>
                {subtitle && <p className="text-blue-100 mt-1">{subtitle}</p>}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <NavLink
                  to="/admin/users"
                  className={tabBaseClass}
                  style={tabStyle}
                >
                  Users
                </NavLink>
                <NavLink
                  to="/admin/bookings"
                  className={tabBaseClass}
                  style={tabStyle}
                >
                  Bookings
                </NavLink>
                <NavLink
                  to="/admin/services"
                  className={tabBaseClass}
                  style={tabStyle}
                >
                  Services
                </NavLink>
                <NavLink
                  to="/admin/reports"
                  className={tabBaseClass}
                  style={tabStyle}
                >
                  Reports
                </NavLink>
              </div>
            </div>
          </div>
        </div>
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 w-full flex-1">
          {children}
        </main>
      </div>
      <Footer mode="dashboard" />
    </div>
  );
};

export default AdminShell;
