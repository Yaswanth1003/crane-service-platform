/**
 * Frontend Entry Point
 * Initializes React application and renders to DOM
 */

import { createRoot } from "react-dom/client";
import "./index.css"; // Global CSS styles
import App from "./App.jsx"; // Main App component
import { ThemeProvider } from "./contexts/ThemeContext.jsx"; // Theme context for dark/light mode

// Create React root and render App with theme provider
// ThemeProvider wraps the entire app to provide theme context to all components
createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);
