import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import AdminShell from "../../components/admin/AdminShell";

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusUpdatingId, setStatusUpdatingId] = useState("");
  const [statusUpdatingAction, setStatusUpdatingAction] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/admin/bookings");
      setBookings(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (bookingId, status) => {
    // Lock action buttons for the current row while status update is in-flight.
    setStatusUpdatingId(bookingId);
    setStatusUpdatingAction(status);
    try {
      await api.patch(`/admin/bookings/${bookingId}/status`, { status });
      await fetchBookings();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update booking status",
      );
    } finally {
      setStatusUpdatingId("");
      setStatusUpdatingAction("");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const query = searchTerm.trim().toLowerCase();
    const locationText = booking.workLocation
      ? `${booking.workLocation.area} ${booking.workLocation.district} ${booking.workLocation.state} ${booking.workLocation.pincode}`.toLowerCase()
      : "";

    const matchesQuery =
      !query ||
      booking.userId?.name?.toLowerCase().includes(query) ||
      booking.userId?.email?.toLowerCase().includes(query) ||
      booking.serviceId?.name?.toLowerCase().includes(query) ||
      booking.serviceId?.model?.toLowerCase().includes(query) ||
      locationText.includes(query);

    const matchesStatus =
      statusFilter === "all" ||
      (booking.status || "pending").toLowerCase() === statusFilter;

    return matchesQuery && matchesStatus;
  });

  const hasActiveFilters = searchTerm.trim() !== "" || statusFilter !== "all";

  return (
    <AdminShell
      title="Manage Bookings"
      subtitle="Review user requests and accept or reject bookings."
    >
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
              placeholder="Search by user, crane or location..."
              className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-48 px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
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

      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
        style={{
          background: "var(--dc-surface, white)",
          borderColor: "var(--dc-border, #e5e7eb)",
        }}
      >
        {loading ? (
          <p
            className="text-slate-500"
            style={{ color: "var(--dc-muted, #6b7280)" }}
          >
            Loading booking requests...
          </p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead
                className="bg-slate-100 text-slate-700 uppercase tracking-wide text-xs"
                style={{
                  background: "var(--dc-surface2, #f3f4f6)",
                  color: "var(--dc-heading, #374151)",
                }}
              >
                <tr>
                  <th
                    className="p-3 border-b"
                    style={{
                      borderColor: "var(--dc-border, #e5e7eb)",
                      color: "var(--dc-heading, #374151)",
                    }}
                  >
                    User
                  </th>
                  <th
                    className="p-3 border-b"
                    style={{
                      borderColor: "var(--dc-border, #e5e7eb)",
                      color: "var(--dc-heading, #374151)",
                    }}
                  >
                    Crane
                  </th>
                  <th
                    className="p-3 border-b"
                    style={{
                      borderColor: "var(--dc-border, #e5e7eb)",
                      color: "var(--dc-heading, #374151)",
                    }}
                  >
                    Work Location
                  </th>
                  <th
                    className="p-3 border-b"
                    style={{
                      borderColor: "var(--dc-border, #e5e7eb)",
                      color: "var(--dc-heading, #374151)",
                    }}
                  >
                    Period
                  </th>
                  <th
                    className="p-3 border-b"
                    style={{
                      borderColor: "var(--dc-border, #e5e7eb)",
                      color: "var(--dc-heading, #374151)",
                    }}
                  >
                    Amount
                  </th>
                  <th
                    className="p-3 border-b"
                    style={{
                      borderColor: "var(--dc-border, #e5e7eb)",
                      color: "var(--dc-heading, #374151)",
                    }}
                  >
                    Status
                  </th>
                  <th
                    className="p-3 border-b"
                    style={{
                      borderColor: "var(--dc-border, #e5e7eb)",
                      color: "var(--dc-heading, #374151)",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, idx) => (
                  <tr
                    key={booking._id}
                    className="border-b"
                    style={{
                      borderColor: "var(--dc-border, #e5e7eb)",
                      background:
                        idx % 2 === 0
                          ? "var(--dc-surface, white)"
                          : "var(--dc-surface2, #f3f4f6)",
                    }}
                  >
                    <td className="p-3">
                      <p
                        className="font-medium text-slate-900"
                        style={{ color: "var(--dc-heading, #111827)" }}
                      >
                        {booking.userId?.name || "User"}
                      </p>
                      <p
                        className="text-xs text-slate-500"
                        style={{ color: "var(--dc-muted, #6b7280)" }}
                      >
                        {booking.userId?.email || "-"}
                      </p>
                      <p
                        className="text-xs text-slate-500"
                        style={{ color: "var(--dc-muted, #6b7280)" }}
                      >
                        {booking.userId?.contactNumber || "-"}
                      </p>
                    </td>
                    <td
                      className="p-3 text-slate-700"
                      style={{ color: "var(--dc-text, #374151)" }}
                    >
                      {booking.serviceId?.name} - {booking.serviceId?.model}
                    </td>
                    <td
                      className="p-3 text-slate-700 leading-relaxed"
                      style={{ color: "var(--dc-text, #374151)" }}
                    >
                      {booking.workLocation
                        ? `${booking.workLocation.area}, ${booking.workLocation.district}, ${booking.workLocation.state} - ${booking.workLocation.pincode}`
                        : "Location not provided"}
                    </td>
                    <td
                      className="p-3 text-slate-700"
                      style={{ color: "var(--dc-text, #374151)" }}
                    >
                      {booking.startDate
                        ? new Date(booking.startDate).toLocaleDateString()
                        : "-"}{" "}
                      to{" "}
                      {booking.endDate
                        ? new Date(booking.endDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td
                      className="p-3 text-slate-900 font-semibold"
                      style={{ color: "var(--dc-heading, #111827)" }}
                    >
                      ₹{Number(booking.totalPrice || 0).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span
                        className="px-2 py-1 text-xs rounded-full font-semibold"
                        style={
                          booking.status === "confirmed"
                            ? {
                                backgroundColor:
                                  "var(--dc-status-confirmed-bg, #dcfce7)",
                                color:
                                  "var(--dc-status-confirmed-text, #15803d)",
                              }
                            : booking.status === "rejected"
                              ? {
                                  backgroundColor:
                                    "var(--dc-status-rejected-bg, #fee2e2)",
                                  color:
                                    "var(--dc-status-rejected-text, #991b1b)",
                                }
                              : {
                                  backgroundColor:
                                    "var(--dc-status-pending-bg, #fef3c7)",
                                  color:
                                    "var(--dc-status-pending-text, #b45309)",
                                }
                        }
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {(booking.status || "pending") === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              updateStatus(booking._id, "confirmed")
                            }
                            disabled={statusUpdatingId === booking._id}
                            className="px-3 py-1.5 rounded-lg text-sm bg-green-600 text-white disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {statusUpdatingId === booking._id &&
                            statusUpdatingAction === "confirmed"
                              ? "Accepting..."
                              : "Accept"}
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(booking._id, "rejected")
                            }
                            disabled={statusUpdatingId === booking._id}
                            className="px-3 py-1.5 rounded-lg text-sm bg-red-600 text-white disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {statusUpdatingId === booking._id &&
                            statusUpdatingAction === "rejected"
                              ? "Rejecting..."
                              : "Reject"}
                          </button>
                        </div>
                      ) : (
                        <span
                          className="text-xs text-slate-500"
                          style={{ color: "var(--dc-muted, #6b7280)" }}
                        >
                          Action completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
};

export default AdminBookingsPage;
