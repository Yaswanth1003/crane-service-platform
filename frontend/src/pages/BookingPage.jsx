import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import UserShell from "../components/user/UserShell";

const BookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    area: "",
    district: "",
    state: "",
    pincode: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get("/services");
        const selectedService = response.data.find((s) => s._id === serviceId);
        if (selectedService) {
          setService(selectedService);
        }
      } catch (err) {
        console.error("Error fetching service:", err);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to book a service");
      navigate("/login");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError("Please select both start and end date/time.");
      return;
    }

    if (
      !formData.area ||
      !formData.district ||
      !formData.state ||
      !formData.pincode
    ) {
      setError("Please provide complete work location details.");
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (end <= start) {
      setError("End date/time must be after start date/time.");
      return;
    }

    const hours = Math.abs(end - start) / 36e5;
    const days = Math.ceil(hours / 24);

    if (days < 180) {
      setError("Minimum booking period is 6 months (180 days).");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/bookings", {
        serviceId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        workLocation: {
          area: formData.area,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode,
        },
      });
      alert("Booking created successfully! Check your dashboard.");
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "ECONNABORTED" || !err.response) {
        setError(
          "Server is waking up or unreachable. Please wait a few seconds and try again.",
        );
      } else {
        setError(err.response?.data?.message || "Error creating booking");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const start = formData.startDate ? new Date(formData.startDate) : null;
  const end = formData.endDate ? new Date(formData.endDate) : null;
  const previewHours = start && end && end > start ? (end - start) / 36e5 : 0;
  const previewDays = previewHours > 0 ? Math.ceil(previewHours / 24) : 0;
  const previewBasePrice = service ? previewDays * service.pricePerDay : 0;
  const previewPrice = previewBasePrice;

  if (!service) {
    return <div className="text-center py-20">Loading service details...</div>;
  }

  return (
    <UserShell
      title="Book Service"
      subtitle="Select your date range and confirm availability."
    >
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-2xl mx-auto">
        <h3 className="text-xl text-blue-600 font-semibold mb-6">
          {service.name} - {service.model}
        </h3>

        <p
          className="mb-4 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3"
          style={{
            color: "var(--dc-text, #475569)",
            background: "var(--dc-surface2, #f8fafc)",
            borderColor: "var(--dc-border, #e5e7eb)",
          }}
        >
          Minimum booking period is{" "}
          <span
            className="font-semibold text-blue-700"
            style={{ color: "var(--dc-accent-text, #3b82f6)" }}
          >
            6 months (180 days)
          </span>
          .
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Work Area
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                District
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                value={formData.district}
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                State
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Pincode
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                value={formData.pincode}
                onChange={(e) =>
                  setFormData({ ...formData, pincode: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-800 font-medium">
              Pricing: INR {service.pricePerHour}/hour or INR{" "}
              {service.pricePerDay}/day
            </p>
            <p className="text-sm text-slate-700 mt-1">
              Booking days: <span className="font-semibold">{previewDays}</span>
            </p>
            <p className="text-sm text-slate-800 mt-1">
              Total Price:{" "}
              <span className="font-bold">
                INR {previewPrice.toLocaleString()}
              </span>
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
          >
            {submitting ? "Confirming..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </UserShell>
  );
};

export default BookingPage;
