import React from "react";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Contact from "../pages/Contact";
import Dashboard from "../pages/Dashboard";
import BookCranePage from "../pages/BookCranePage";
import BookingPage from "../pages/BookingPage";

export const userRoutes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/signup", element: <Register /> },
  { path: "/contact", element: <Contact /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/book", element: <BookCranePage /> },
  { path: "/book/:serviceId", element: <BookingPage /> },
];
