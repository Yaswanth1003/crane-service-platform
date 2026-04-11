import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import AdminShell from "../../components/admin/AdminShell";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [roleUpdatingId, setRoleUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (userId, role) => {
    setRoleUpdatingId(userId);
    try {
      await api.patch(`/admin/users/${userId}/role`, { role });
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update role");
    } finally {
      setRoleUpdatingId("");
    }
  };

  const deleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );
    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(userId);
      await api.delete(`/admin/users/${userId}`);
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingId("");
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesQuery =
      !query ||
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.contactNumber?.toLowerCase().includes(query);

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const hasActiveFilters = searchTerm.trim() !== "" || roleFilter !== "all";

  return (
    <AdminShell
      title="Manage Users"
      subtitle="Update roles and monitor registered users."
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
              placeholder="Search by name, email or contact..."
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
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full md:w-44 px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                style={{
                  background: "var(--dc-surface, white)",
                  borderColor: "var(--dc-border, #d1d5db)",
                  color: "var(--dc-text, #111827)",
                }}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("all");
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
            Loading users...
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
                    Name
                  </th>
                  <th
                    className="p-3 border-b"
                    style={{
                      borderColor: "var(--dc-border, #e5e7eb)",
                      color: "var(--dc-heading, #374151)",
                    }}
                  >
                    Contact
                  </th>
                  <th
                    className="p-3 border-b"
                    style={{
                      borderColor: "var(--dc-border, #e5e7eb)",
                      color: "var(--dc-heading, #374151)",
                    }}
                  >
                    Email
                  </th>
                  <th
                    className="p-3 border-b"
                    style={{
                      borderColor: "var(--dc-border, #e5e7eb)",
                      color: "var(--dc-heading, #374151)",
                    }}
                  >
                    Role
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
                {filteredUsers.map((user, idx) => (
                  <tr
                    key={user._id}
                    className="border-b"
                    style={{
                      borderColor: "var(--dc-border, #e5e7eb)",
                      background:
                        idx % 2 === 0
                          ? "var(--dc-surface, white)"
                          : "var(--dc-surface2, #f3f4f6)",
                    }}
                  >
                    <td
                      className="p-3 font-medium text-slate-900"
                      style={{ color: "var(--dc-heading, #111827)" }}
                    >
                      {user.name}
                    </td>
                    <td
                      className="p-3 text-slate-700"
                      style={{ color: "var(--dc-text, #374151)" }}
                    >
                      {user.contactNumber || "-"}
                    </td>
                    <td
                      className="p-3 text-slate-700"
                      style={{ color: "var(--dc-text, #374151)" }}
                    >
                      {user.email}
                    </td>
                    <td className="p-3">
                      <span
                        className="px-2 py-1 text-xs rounded-full font-semibold"
                        style={
                          user.role === "admin"
                            ? {
                                backgroundColor:
                                  "var(--dc-role-admin-bg, #dbeafe)",
                                color: "var(--dc-role-admin-text, #1e40af)",
                              }
                            : {
                                backgroundColor:
                                  "var(--dc-role-user-bg, #f3f4f6)",
                                color: "var(--dc-role-user-text, #374151)",
                              }
                        }
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      {user.role === "admin" ? (
                        <button
                          onClick={() => updateRole(user._id, "user")}
                          disabled={
                            roleUpdatingId === user._id || deletingId === user._id
                          }
                          className="w-28 px-3 py-1.5 rounded-lg text-sm border transition-all duration-150 hover:bg-slate-100 dark:hover:bg-slate-700/70 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                          style={{
                            borderColor: "var(--dc-border, #d1d5db)",
                            color: "var(--dc-text, #374151)",
                            background: "var(--dc-surface, white)",
                          }}
                        >
                          {roleUpdatingId === user._id
                            ? "Updating..."
                            : "Set User"}
                        </button>
                      ) : (
                        <button
                          onClick={() => updateRole(user._id, "admin")}
                          disabled={
                            roleUpdatingId === user._id || deletingId === user._id
                          }
                          className="w-28 px-3 py-1.5 rounded-lg text-sm border transition-all duration-150 hover:bg-slate-100 dark:hover:bg-slate-700/70 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                          style={{
                            borderColor: "var(--dc-border, #d1d5db)",
                            color: "var(--dc-text, #374151)",
                            background: "var(--dc-surface, white)",
                          }}
                        >
                          {roleUpdatingId === user._id
                            ? "Updating..."
                            : "Set Admin"}
                        </button>
                      )}
                      <button
                        onClick={() => deleteUser(user._id)}
                        disabled={
                          roleUpdatingId === user._id || deletingId === user._id
                        }
                        className="w-28 px-3 py-1.5 rounded-lg text-sm border transition-all duration-150 hover:bg-slate-100 dark:hover:bg-slate-700/70 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{
                          borderColor: "var(--dc-border, #d1d5db)",
                          color: "var(--dc-text, #374151)",
                          background: "var(--dc-surface, white)",
                        }}
                      >
                        {deletingId === user._id ? "Deleting..." : "Delete"}
                      </button>
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

export default AdminUsersPage;
