import React from "react";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminBookingsPage from "../pages/admin/AdminBookingsPage";
import AdminReportsPage from "../pages/admin/AdminReportsPage";
import AdminServicesPage from "../pages/admin/AdminServicesPage";
import AdminRoute from "../components/AdminRoute";

export const adminRoutes = [
  {
    path: "/admin/users",
    element: (
      <AdminRoute>
        <AdminUsersPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/bookings",
    element: (
      <AdminRoute>
        <AdminBookingsPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/services",
    element: (
      <AdminRoute>
        <AdminServicesPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/reports",
    element: (
      <AdminRoute>
        <AdminReportsPage />
      </AdminRoute>
    ),
  },
];
