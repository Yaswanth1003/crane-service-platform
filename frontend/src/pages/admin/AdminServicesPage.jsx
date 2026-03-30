import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import AdminShell from "../../components/admin/AdminShell";

const initialForm = {
  name: "",
  model: "",
  category: "Hydra",
  pricePerHour: "",
  pricePerDay: "",
  description: "",
  imageUrl: "",
};

// Return null for all images - no fallback defaults
const getImageForService = (name, model) => {
  // Only return image if explicitly provided in service.imageUrl
  return null;
};

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tonsFilter, setTonsFilter] = useState("all");

  const fetchServices = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/admin/services");
      setServices(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.name ||
      !form.model ||
      !form.category ||
      !form.pricePerHour ||
      !form.pricePerDay
    ) {
      setError("Please fill all required fields.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        pricePerHour: Number(form.pricePerHour),
        pricePerDay: Number(form.pricePerDay),
      };

      if (editingServiceId) {
        await api.patch(`/admin/services/${editingServiceId}`, payload);
        setSuccess("Service updated successfully.");
      } else {
        await api.post("/admin/services", payload);
        setSuccess("Service added successfully.");
      }

      setEditingServiceId(null);
      setForm(initialForm);
      fetchServices();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editingServiceId
            ? "Failed to update service"
            : "Failed to create service"),
      );
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (service) => {
    setError("");
    setSuccess("");
    setEditingServiceId(service._id);
    setForm({
      name: service.name || "",
      model: service.model || "",
      category: service.category || "Hydra",
      pricePerHour: String(service.pricePerHour ?? ""),
      pricePerDay: String(service.pricePerDay ?? ""),
      description: service.description || "",
      imageUrl: service.imageUrl || "",
    });
  };

  const cancelEdit = () => {
    setEditingServiceId(null);
    setForm(initialForm);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (service) => {
    const confirmed = window.confirm(
      `Delete ${service.name} ${service.model}? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(service._id);
    setError("");
    setSuccess("");
    try {
      await api.delete(`/admin/services/${service._id}`);
      if (editingServiceId === service._id) {
        cancelEdit();
      }
      setSuccess("Service deleted successfully.");
      fetchServices();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete service");
    } finally {
      setDeletingId("");
    }
  };

  const filteredServices = services.filter((service) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesQuery =
      !query ||
      service.name?.toLowerCase().includes(query) ||
      service.model?.toLowerCase().includes(query);

    const matchesCategory =
      categoryFilter === "all" || service.category === categoryFilter;

    // Extract tons from model
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
    <AdminShell
      title="Add Services"
      subtitle="Create crane services that appear in user booking."
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div
          className="xl:col-span-1 rounded-2xl border p-5 sm:p-6 shadow-sm"
          style={{
            background: "var(--dc-surface, #fff)",
            borderColor: "var(--dc-border, #e5e7eb)",
          }}
        >
          <h3
            className="text-xl font-bold mb-4"
            style={{ color: "var(--dc-heading, #0f172a)" }}
          >
            {editingServiceId ? "Edit Crane Service" : "Add New Crane Service"}
          </h3>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                value={form.name}
                onChange={(e) => onChange("name", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-200"
                style={{
                  background: "var(--dc-input-bg, #fff)",
                  borderColor: "var(--dc-border, #d1d5db)",
                  color: "var(--dc-text, #0f172a)",
                }}
                placeholder="Hydra Cranes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Model *</label>
              <input
                value={form.model}
                onChange={(e) => onChange("model", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-200"
                style={{
                  background: "var(--dc-input-bg, #fff)",
                  borderColor: "var(--dc-border, #d1d5db)",
                  color: "var(--dc-text, #0f172a)",
                }}
                placeholder="16 Ton"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => onChange("category", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-200"
                style={{
                  background: "var(--dc-input-bg, #fff)",
                  borderColor: "var(--dc-border, #d1d5db)",
                  color: "var(--dc-text, #0f172a)",
                }}
              >
                <option value="Hydra">Hydra</option>
                <option value="Farana">Farana</option>
                <option value="Crane">Crane</option>
                <option value="Towing">Towing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price / Hour *
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.pricePerHour}
                  onChange={(e) => onChange("pricePerHour", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-200"
                  style={{
                    background: "var(--dc-input-bg, #fff)",
                    borderColor: "var(--dc-border, #d1d5db)",
                    color: "var(--dc-text, #0f172a)",
                  }}
                  placeholder="1600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price / Day *
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.pricePerDay}
                  onChange={(e) => onChange("pricePerDay", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-200"
                  style={{
                    background: "var(--dc-input-bg, #fff)",
                    borderColor: "var(--dc-border, #d1d5db)",
                    color: "var(--dc-text, #0f172a)",
                  }}
                  placeholder="8000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => onChange("description", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-200"
                style={{
                  background: "var(--dc-input-bg, #fff)",
                  borderColor: "var(--dc-border, #d1d5db)",
                  color: "var(--dc-text, #0f172a)",
                }}
                placeholder="Optional description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Image URL
              </label>
              <input
                value={form.imageUrl}
                onChange={(e) => onChange("imageUrl", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-200"
                style={{
                  background: "var(--dc-input-bg, #fff)",
                  borderColor: "var(--dc-border, #d1d5db)",
                  color: "var(--dc-text, #0f172a)",
                }}
                placeholder="/hydra_12ton.png"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-70"
            >
              {saving
                ? editingServiceId
                  ? "Updating..."
                  : "Saving..."
                : editingServiceId
                  ? "Update Service"
                  : "Add Service"}
            </button>
            {editingServiceId ? (
              <button
                type="button"
                onClick={cancelEdit}
                className="w-full py-2.5 rounded-lg border border-slate-300 font-semibold hover:bg-slate-50 transition"
                style={{
                  borderColor: "var(--dc-border, #d1d5db)",
                  color: "var(--dc-text, #334155)",
                }}
              >
                Cancel Edit
              </button>
            ) : null}
          </form>
        </div>

        <div
          className="xl:col-span-2 rounded-2xl border p-5 sm:p-6 shadow-sm"
          style={{
            background: "var(--dc-surface, #fff)",
            borderColor: "var(--dc-border, #e5e7eb)",
          }}
        >
          <h3
            className="text-xl font-bold mb-4"
            style={{ color: "var(--dc-heading, #0f172a)" }}
          >
            Available Services
          </h3>

          <div
            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5 mb-4"
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
                  placeholder="Search by service name or model..."
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
            <p style={{ color: "var(--dc-muted, #64748b)" }}>
              Loading services...
            </p>
          ) : filteredServices.length === 0 ? (
            <p style={{ color: "var(--dc-muted, #64748b)" }}>
              No services found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredServices.map((service) => {
                const displayImage =
                  service.imageUrl ||
                  getImageForService(service.name, service.model);

                return (
                  <div
                    key={service._id}
                    className="group relative rounded-xl border p-4 shadow-md transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg hover:border-blue-400 overflow-hidden flex flex-col h-full"
                    style={{
                      background: "var(--dc-surface2, #f8fafc)",
                      borderColor: "var(--dc-border, #e5e7eb)",
                    }}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_44%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    {displayImage ? (
                      <div
                        className="relative rounded-lg border mb-3 h-32 flex items-center justify-center overflow-hidden"
                        style={{
                          borderColor: "var(--dc-border, #e5e7eb)",
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <img
                          src={displayImage}
                          alt={`${service.name} ${service.model}`}
                          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          style={{ mixBlendMode: "multiply" }}
                        />
                      </div>
                    ) : null}
                    <div className="relative z-10 flex flex-col flex-grow">
                      <div className="flex items-center justify-between gap-3">
                        <p
                          className="font-semibold"
                          style={{ color: "var(--dc-heading, #0f172a)" }}
                        >
                          {service.name}
                        </p>
                        <span
                          className="px-2 py-0.5 text-xs rounded-full"
                          style={{
                            background: "var(--dc-accent-l, #dbeafe)",
                            color: "var(--dc-accent-text, #1d4ed8)",
                          }}
                        >
                          {service.category}
                        </span>
                      </div>
                      <p
                        className="text-sm mt-1"
                        style={{ color: "var(--dc-text, #334155)" }}
                      >
                        Model: {service.model}
                      </p>
                      <p
                        className="text-sm mt-1"
                        style={{ color: "var(--dc-text, #334155)" }}
                      >
                        INR {service.pricePerHour}/hr | INR{" "}
                        {service.pricePerDay}/day
                      </p>
                      <div className="mt-auto pt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(service)}
                          className="w-24 px-3 py-1.5 text-xs rounded-lg border transition-all duration-150 hover:bg-slate-100 dark:hover:bg-slate-700/70 hover:scale-105"
                          style={{
                            borderColor: "var(--dc-border, #d1d5db)",
                            color: "var(--dc-text, #374151)",
                            background: "var(--dc-surface, white)",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(service)}
                          disabled={deletingId === service._id}
                          className="w-24 px-3 py-1.5 text-xs rounded-lg border transition-all duration-150 hover:bg-slate-100 dark:hover:bg-slate-700/70 hover:scale-105 disabled:opacity-70"
                          style={{
                            borderColor: "var(--dc-border, #d1d5db)",
                            color: "var(--dc-text, #374151)",
                            background: "var(--dc-surface, white)",
                          }}
                        >
                          {deletingId === service._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
};

export default AdminServicesPage;
