/**
 * Main App Component
 * Central routing component that coordinates all user and admin routes
 *
 * Functionality:
 * - Combines user routes and admin routes into a single route configuration
 * - Sets up React Router for navigation between pages
 * - Provides routing structure for the entire application
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { userRoutes } from "./routes/userRoutes"; // Customer-facing routes
import { adminRoutes } from "./routes/adminRoutes"; // Admin panel routes

/**
 * App Component - Main application structure
 *
 * Route Structure:
 * - User Routes: Public pages, service browsing, user dashboard, booking
 * - Admin Routes: Admin dashboard, user management, booking management, reports
 *
 * @returns {JSX.Element} Router with all routes configured
 */
function App() {
  // Combine all user and admin routes into a single array
  const allRoutes = [...userRoutes, ...adminRoutes];

  return (
    <Router>
      <div>
        <Routes>
          {/* Map through all routes and create Route components */}
          {allRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element} // Component to render for this route
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
