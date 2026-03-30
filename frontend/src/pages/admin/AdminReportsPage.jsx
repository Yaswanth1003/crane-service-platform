import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import AdminShell from "../../components/admin/AdminShell";

const AdminReportsPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/admin/reports/summary");
        setReport(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, []);

  const totals = report?.totals || {
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    rejectedBookings: 0,
    totalRevenue: 0,
  };

  return (
    <AdminShell
      title="Reports"
      subtitle="Track bookings and revenue over time."
    >
      {loading ? (
        <div
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 text-slate-500"
          style={{
            background: "var(--dc-surface, white)",
            borderColor: "var(--dc-border, #e5e7eb)",
            color: "var(--dc-muted, #6b7280)",
          }}
        >
          Loading reports...
        </div>
      ) : error ? (
        <div
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 text-red-600"
          style={{
            background: "var(--dc-surface, white)",
            borderColor: "var(--dc-border, #e5e7eb)",
          }}
        >
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                Total
              </p>
              <p
                className="text-2xl font-bold text-slate-900"
                style={{ color: "var(--dc-heading, #111827)" }}
              >
                {totals.totalBookings}
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
                Confirmed
              </p>
              <p className="text-2xl font-bold text-green-700">
                {totals.confirmedBookings}
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
              <p className="text-2xl font-bold text-amber-600">
                {totals.pendingBookings}
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
                Rejected
              </p>
              <p className="text-2xl font-bold text-red-700">
                {totals.rejectedBookings}
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
                Revenue
              </p>
              <p className="text-2xl font-bold text-blue-700">
                ₹{Number(totals.totalRevenue || 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div
            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
            style={{
              background: "var(--dc-surface, white)",
              borderColor: "var(--dc-border, #e5e7eb)",
            }}
          >
            <h3
              className="text-xl font-bold text-slate-900 mb-4"
              style={{ color: "var(--dc-heading, #111827)" }}
            >
              Monthly Trend
            </h3>
            <div
              className="overflow-x-auto rounded-xl border border-slate-200"
              style={{ borderColor: "var(--dc-border, #e5e7eb)" }}
            >
              <table className="w-full text-left">
                <thead
                  className="bg-slate-50 text-slate-700"
                  style={{
                    background: "var(--dc-surface2, #f8fafc)",
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
                      Year
                    </th>
                    <th
                      className="p-3 border-b"
                      style={{
                        borderColor: "var(--dc-border, #e5e7eb)",
                        color: "var(--dc-heading, #374151)",
                      }}
                    >
                      Month
                    </th>
                    <th
                      className="p-3 border-b"
                      style={{
                        borderColor: "var(--dc-border, #e5e7eb)",
                        color: "var(--dc-heading, #374151)",
                      }}
                    >
                      Bookings
                    </th>
                    <th
                      className="p-3 border-b"
                      style={{
                        borderColor: "var(--dc-border, #e5e7eb)",
                        color: "var(--dc-heading, #374151)",
                      }}
                    >
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(report?.monthly || []).map((entry, index) => (
                    <tr
                      key={`${entry._id?.year}-${entry._id?.month}-${index}`}
                      className="border-b"
                      style={{ borderColor: "var(--dc-border, #e5e7eb)" }}
                    >
                      <td
                        className="p-3"
                        style={{ color: "var(--dc-text, #374151)" }}
                      >
                        {entry._id?.year}
                      </td>
                      <td
                        className="p-3"
                        style={{ color: "var(--dc-text, #374151)" }}
                      >
                        {entry._id?.month}
                      </td>
                      <td
                        className="p-3"
                        style={{ color: "var(--dc-text, #374151)" }}
                      >
                        {entry.bookings}
                      </td>
                      <td
                        className="p-3 font-semibold text-blue-700"
                        style={{ color: "var(--dc-accent-text, #2563eb)" }}
                      >
                        ₹{Number(entry.revenue || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
};

export default AdminReportsPage;
