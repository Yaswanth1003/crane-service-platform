import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import api from "../lib/api";
import AuthHeroSection from "../components/AuthHeroSection";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/register", formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      if (response.data.user?.role === "admin") {
        navigate("/admin/bookings");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="hidden lg:flex lg:w-1/2">
          <AuthHeroSection />
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-10 sm:px-8 bg-white">
          <div className="w-full max-w-md flex flex-col items-center">
            <Link
              to="/"
              className="inline-flex items-center gap-3 mb-5 group"
              title="Go to home"
            >
              <img
                src="/company_logo.png"
                alt="DATTA Cranes"
                className="h-11 w-11 rounded-full object-cover ring-1 ring-slate-200 transition-transform duration-150 group-hover:scale-105"
              />
              <span className="text-lg font-extrabold tracking-wide text-blue-700 group-hover:text-blue-600 transition-colors">
                DATTA CRANES
              </span>
            </Link>

            <div className="w-full rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <h2 className="text-3xl font-bold text-slate-900">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Start booking cranes with transparent pricing and tracking.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 mt-7">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contact Number
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="tel"
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                      value={formData.contactNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full pl-10 pr-11 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              {error && (
                <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
              )}

              <p className="mt-5 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
