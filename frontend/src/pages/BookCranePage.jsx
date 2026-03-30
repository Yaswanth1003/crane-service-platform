import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import UserShell from "../components/user/UserShell";

// SVG tag badge icons
const HydraIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 mr-1.5"
  >
    <path d="M3 18h18M3 18V9l9-6 9 6v9M10 18v-5h4v5" />
  </svg>
);

const FaranaIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 mr-1.5"
  >
    <path d="M4 20h16M4 20l2-8h12l2 8M12 4v8M8 8l4-4 4 4" />
  </svg>
);

const TagBadge = ({ category }) => {
  const config = {
    Hydra: {
      label: "HYDRA CRANE",
      cls: "bg-orange-100 text-orange-700 border-orange-200",
      Icon: HydraIcon,
    },
    Farana: {
      label: "FARANA CRANE",
      cls: "bg-blue-50 text-blue-700 border-blue-200",
      Icon: FaranaIcon,
    },
    Crane: {
      label: "CRANE",
      cls: "bg-slate-100 text-slate-700 border-slate-200",
      Icon: HydraIcon,
    },
  };
  const { label, Icon } = config[category] || config.Crane;
  const badgeStyle =
    category === "Hydra"
      ? { backgroundColor: "#fed7aa", borderColor: "#f97316", color: "#ea580c" }
      : category === "Farana"
        ? {
            backgroundColor: "#dbeafe",
            borderColor: "#3b82f6",
            color: "#2563eb",
          }
        : {
            backgroundColor: "#e2e8f0",
            borderColor: "#94a3b8",
            color: "#334155",
          };
  return (
    <span
      className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border`}
      style={badgeStyle}
    >
      <Icon />
      {label}
    </span>
  );
};

// Return null for all images - no fallback defaults, only use explicit imageUrl
const getImageForService = (name, model) => {
  return null;
};

const getDisplayImage = (service) => {
  // Only return imageUrl if explicitly provided, otherwise null for blank white box
  return service?.imageUrl || null;
};

const BookCranePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tonsFilter, setTonsFilter] = useState("all");

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/services");
        const allServices = Array.isArray(response.data) ? response.data : [];
        setServices(allServices);
      } catch (err) {
        setError("Could not load services.");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const filteredServices = services.filter((service) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesQuery =
      !query ||
      service.name?.toLowerCase().includes(query) ||
      service.model?.toLowerCase().includes(query);

    const matchesCategory =
      categoryFilter === "all" || service.category === categoryFilter;

    // Extract tons from model (e.g., "12 Ton", "14 Ton", "F15", "F17", "12", "14")
    const modelLower = service.model?.toLowerCase() || "";
    const tonsMatch = modelLower.match(/(\d+)\s*ton/i);
    const tons = tonsMatch ? tonsMatch[1] : null;

    const matchesTons = tonsFilter === "all" || tons === tonsFilter;

    return matchesQuery && matchesCategory && matchesTons;
  });

  // Extract unique tons values from all services
  const uniqueTons = [
    ...new Set(
      services
        .map((service) => {
          const modelLower = service.model?.toLowerCase() || "";
          const tonsMatch = modelLower.match(/(\d+)\s*ton/i);
          return tonsMatch ? tonsMatch[1] : null;
        })
        .filter(Boolean),
    ),
  ].sort((a, b) => parseInt(a) - parseInt(b));

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    categoryFilter !== "all" ||
    tonsFilter !== "all";

  return (
    <UserShell
      title="Choose Your Service"
      subtitle="Select a service and continue to booking."
    >
      <div className="space-y-6" style={{ background: "transparent" }}>
        <div
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5"
          style={{
            background: "var(--dc-surface, white)",
            borderColor: "var(--dc-border, #e5e7eb)",
          }}
        >
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by crane name or model..."
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                style={{
                  background: "var(--dc-surface, white)",
                  borderColor: "var(--dc-border, #d1d5db)",
                  color: "var(--dc-text, #111827)",
                }}
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <div className="w-full md:w-auto">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full md:w-44 px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                  style={{
                    background: "var(--dc-surface, white)",
                    borderColor: "var(--dc-border, #d1d5db)",
                    color: "var(--dc-text, #111827)",
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="Hydra">Hydra</option>
                  <option value="Farana">Farana</option>
                  <option value="Crane">Crane</option>
                  <option value="Towing">Towing</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="w-full md:w-auto">
                <select
                  value={tonsFilter}
                  onChange={(e) => setTonsFilter(e.target.value)}
                  className="w-full md:w-44 px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                  style={{
                    background: "var(--dc-surface, white)",
                    borderColor: "var(--dc-border, #d1d5db)",
                    color: "var(--dc-text, #111827)",
                  }}
                >
                  <option value="all">All Tonnage</option>
                  {uniqueTons.map((ton) => (
                    <option key={ton} value={ton}>
                      {ton} Ton
                    </option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("all");
                    setTonsFilter("all");
                  }}
                  className="px-3 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-100 transition text-slate-600"
                  style={{
                    borderColor: "var(--dc-border, #d1d5db)",
                    background: "var(--dc-surface, white)",
                  }}
                  title="Clear filters"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-10 text-center text-slate-500 dark:text-slate-400"
            style={{
              background: "var(--dc-surface, white)",
              border: "1px solid var(--dc-border, #e5e7eb)",
              color: "var(--dc-muted, #6b7280)",
            }}
          >
            Loading services...
          </div>
        ) : error ? (
          <div
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-10 text-center text-red-600 dark:text-red-400"
            style={{
              background: "var(--dc-surface, white)",
              border: "1px solid var(--dc-border, #e5e7eb)",
              color: "#ef4444",
            }}
          >
            {error}
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl w-full">
              {filteredServices.map((service) => {
                const displayImage = getDisplayImage(service);
                return (
                  <div
                    key={service._id}
                    className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 hover:scale-105 hover:shadow-lg hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 flex flex-col cursor-pointer overflow-hidden"
                    style={{
                      background: "var(--dc-surface, white)",
                      border: "1px solid var(--dc-border, #e5e7eb)",
                    }}
                    onClick={() => navigate(`/book/${service._id}`)}
                  >
                    {/* Hover shimmer overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_44%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10" />

                    {/* Service Image */}
                    <div
                      className="relative w-full flex items-center justify-center overflow-hidden"
                      style={{ height: "140px", backgroundColor: "#f8fafc" }}
                    >
                      <img
                        src={displayImage}
                        alt={`${service.name} ${service.model}`}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        style={{ mixBlendMode: "multiply" }}
                      />
                      <div className="absolute top-2 right-2 z-20">
                        <TagBadge category={service.category} />
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3
                        className="text-base font-bold text-gray-900 dark:text-white"
                        style={{ color: "var(--dc-heading, #1a1a1a)" }}
                      >
                        {service.name}
                      </h3>
                      <p
                        className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5"
                        style={{ color: "var(--dc-accent-text, #3b82f6)" }}
                      >
                        {service.model}
                      </p>
                      <p
                        className="mt-2 text-gray-600 dark:text-gray-300 text-xs leading-relaxed"
                        style={{ color: "var(--dc-muted, #6b7280)" }}
                      >
                        {service.description ||
                          "Reliable heavy-lift service with certified operator."}
                      </p>

                      {/* Pricing row */}
                      <div
                        className="mt-3 flex items-end gap-4"
                        style={{ color: "var(--dc-text, #1a1a1a)" }}
                      >
                        <div>
                          <p
                            className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5"
                            style={{ color: "var(--dc-muted, #6b7280)" }}
                          >
                            Hourly
                          </p>
                          <span
                            className="text-base font-extrabold text-blue-700"
                            style={{ color: "var(--dc-accent-text, #3b82f6)" }}
                          >
                            ₹{service.pricePerHour}
                          </span>
                        </div>
                        <div
                          className="border-l border-gray-200 pl-4"
                          style={{ borderColor: "var(--dc-border, #e5e7eb)" }}
                        >
                          <p
                            className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5"
                            style={{ color: "var(--dc-muted, #6b7280)" }}
                          >
                            Daily
                          </p>
                          <span
                            className="text-base font-extrabold text-gray-700"
                            style={{ color: "var(--dc-text, #1a1a1a)" }}
                          >
                            ₹{service.pricePerDay}
                          </span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => navigate(`/book/${service._id}`)}
                        className="relative z-10 mt-4 w-full py-2 rounded-lg font-semibold text-xs bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </UserShell>
  );
};

export default BookCranePage;
