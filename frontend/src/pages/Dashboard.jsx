import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";
import UserShell from "../components/user/UserShell";

const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    localStorage.removeItem("user");
    return null;
  }
};

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = useMemo(() => getStoredUser(), []);

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      navigate("/login");
      return;
    }

    let isActive = true;

    const fetchBookings = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/bookings/my-bookings");
        if (isActive) {
          setBookings(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        if (error?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        if (isActive) {
          setError("Could not load your bookings right now.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      isActive = false;
    };
  }, [navigate, token, user?.id]);

  const confirmedCount = bookings.filter(
    (b) => b?.status === "confirmed",
  ).length;
  const pendingCount = bookings.filter(
    (b) => (b?.status || "pending") === "pending",
  ).length;
  const totalAmount = bookings.reduce(
    (sum, b) => sum + Number(b?.totalPrice || 0),
    0,
  );

  if (!user) return null;

  return (
    <UserShell
      title={`Welcome, ${user.name}`}
      subtitle="Track your booking requests and status updates."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
            style={{
              background: "var(--dc-surface, white)",
              borderColor: "var(--dc-border, #e5e7eb)",
            }}
          >
            <p
              className="text-sm text-slate-500"
              style={{ color: "var(--dc-muted, #6b7280)" }}
            >
              Total Bookings
            </p>
            <p
              className="text-2xl font-bold text-slate-900 mt-1"
              style={{ color: "var(--dc-heading, #111827)" }}
            >
              {bookings.length}
            </p>
          </div>
          <div
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
            style={{
              background: "var(--dc-surface, white)",
              borderColor: "var(--dc-border, #e5e7eb)",
            }}
          >
            <p
              className="text-sm text-slate-500"
              style={{ color: "var(--dc-muted, #6b7280)" }}
            >
              Pending
            </p>
            <p
              className="text-2xl font-bold text-amber-600 mt-1"
              style={{ color: "var(--dc-warning, #ca8a04)" }}
            >
              {pendingCount}
            </p>
          </div>
          <div
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
            style={{
              background: "var(--dc-surface, white)",
              borderColor: "var(--dc-border, #e5e7eb)",
            }}
          >
            <p
              className="text-sm text-slate-500"
              style={{ color: "var(--dc-muted, #6b7280)" }}
            >
              Confirmed / Total Value
            </p>
            <p
              className="text-lg font-bold text-green-700 mt-1"
              style={{ color: "var(--dc-success, #15803d)" }}
            >
              {confirmedCount} / ₹{totalAmount.toLocaleString()}
            </p>
          </div>
        </div>

        <div
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200"
          style={{
            background: "var(--dc-surface, white)",
            borderColor: "var(--dc-border, #e5e7eb)",
          }}
        >
          <h3
            className="text-2xl font-bold mb-6 text-slate-800"
            style={{ color: "var(--dc-heading, #1f2937)" }}
          >
            My Bookings
          </h3>
          {loading ? (
            <div
              className="text-center py-12 text-gray-500"
              style={{ color: "var(--dc-muted, #6b7280)" }}
            >
              <p>Loading your bookings...</p>
            </div>
          ) : error ? (
            <div
              className="text-center py-12 text-red-600"
              style={{ color: "var(--dc-text, #dc2626)" }}
            >
              <p>{error}</p>
            </div>
          ) : bookings.length > 0 ? (
            <div
              className="overflow-x-auto rounded-xl border border-slate-200"
              style={{ borderColor: "var(--dc-border, #e5e7eb)" }}
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr
                    className="bg-slate-50 text-slate-700"
                    style={{ background: "var(--dc-surface2, #f3f4f6)" }}
                  >
                    <th
                      className="p-4 border-b"
                      style={{
                        borderColor: "var(--dc-border, #e5e7eb)",
                        color: "var(--dc-heading, #1f2937)",
                      }}
                    >
                      Service
                    </th>
                    <th
                      className="p-4 border-b"
                      style={{
                        borderColor: "var(--dc-border, #e5e7eb)",
                        color: "var(--dc-heading, #1f2937)",
                      }}
                    >
                      Start Date
                    </th>
                    <th
                      className="p-4 border-b"
                      style={{
                        borderColor: "var(--dc-border, #e5e7eb)",
                        color: "var(--dc-heading, #1f2937)",
                      }}
                    >
                      End Date
                    </th>
                    <th
                      className="p-4 border-b"
                      style={{
                        borderColor: "var(--dc-border, #e5e7eb)",
                        color: "var(--dc-heading, #1f2937)",
                      }}
                    >
                      Status
                    </th>
                    <th
                      className="p-4 border-b"
                      style={{
                        borderColor: "var(--dc-border, #e5e7eb)",
                        color: "var(--dc-heading, #1f2937)",
                      }}
                    >
                      Total Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const status = booking?.status || "pending";
                    const statusStyle =
                      status === "confirmed"
                        ? {
                            backgroundColor:
                              "var(--dc-status-confirmed-bg, #dcfce7)",
                            color: "var(--dc-status-confirmed-text, #166534)",
                          }
                        : status === "rejected"
                          ? {
                              backgroundColor:
                                "var(--dc-status-rejected-bg, #fee2e2)",
                              color: "var(--dc-status-rejected-text, #991b1b)",
                            }
                          : {
                              backgroundColor:
                                "var(--dc-status-pending-bg, #fef3c7)",
                              color: "var(--dc-status-pending-text, #b45309)",
                            };

                    return (
                      <tr
                        key={
                          booking?._id ||
                          `${booking?.serviceId || "service"}-${booking?.startDate || "date"}`
                        }
                        className="border-b"
                        style={{ borderColor: "var(--dc-border, #e5e7eb)" }}
                      >
                        <td
                          className="p-4 font-semibold"
                          style={{ color: "var(--dc-text, #1f2937)" }}
                        >
                          {booking?.serviceId?.name || "Service"} -{" "}
                          {booking?.serviceId?.model || "Model"}
                        </td>
                        <td
                          className="p-4"
                          style={{ color: "var(--dc-text, #4b5563)" }}
                        >
                          {booking?.startDate
                            ? new Date(booking.startDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td
                          className="p-4"
                          style={{ color: "var(--dc-text, #4b5563)" }}
                        >
                          {booking?.endDate
                            ? new Date(booking.endDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="p-4">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-bold"
                            style={statusStyle}
                          >
                            {status.toUpperCase()}
                          </span>
                        </td>
                        <td
                          className="p-4 font-bold"
                          style={{ color: "var(--dc-text, #1f2937)" }}
                        >
                          ₹{booking?.totalPrice ?? 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              className="text-center py-12 text-gray-500"
              style={{ color: "var(--dc-muted, #6b7280)" }}
            >
              <p className="mb-4">You have no active bookings right now.</p>
              <Link
                to="/book"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700"
              >
                Book a Crane
              </Link>
            </div>
          )}
        </div>
      </div>
    </UserShell>
  );
};

export default Dashboard;
