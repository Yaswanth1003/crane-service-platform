import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const THEMES = [
  // ── DEFAULT — zero overrides, app renders exactly as designed
  {
    id: "default",
    name: "Default",
    emoji: "☀️",
    bg: "#f9fafb",
    header: "#ffffff",
    text: "#1a1a1a",
  },
  // ── ARCTIC COMMAND — deep navy + ice blue
  {
    id: "arctic",
    name: "Arctic Command",
    emoji: "🌊",
    mode: "dark",
    bg: "#050d1a",
    sidebar: "#070f1e",
    header: "#070f1e",
    surface: "#0a1628",
    surface2: "#0f1f38",
    text: "#e2eaf6",
    textMuted: "#6b8cbe",
    textHeading: "#ffffff",
    accent: "#3b82f6",
    accentHover: "#2563eb",
    accentLight: "rgba(59,130,246,0.12)",
    accentText: "#60a5fa",
    border: "rgba(59,130,246,0.15)",
    shadow: "0 4px 24px rgba(0,0,0,0.5)",
    inputBg: "#0a1628",
  },
];

function buildCSS(t) {
  if (t.id === "default") {
    return `
      html, body { background: #f9fafb !important; color: #1a1a1a !important; color-scheme: light; }
    `;
  }
  return `
    :root {
      --dc-bg:          ${t.bg};
      --dc-header:      ${t.header};
      --dc-surface:     ${t.surface};
      --dc-surface2:    ${t.surface2};
      --dc-text:        ${t.text};
      --dc-muted:       ${t.textMuted};
      --dc-heading:     ${t.textHeading};
      --dc-accent:      ${t.accent};
      --dc-accent-l:    ${t.accentLight};
      --dc-accent-text: ${t.accentText};
      --dc-border:      ${t.border};
      --dc-shadow:      ${t.shadow};
      --dc-input-bg:    ${t.inputBg};
      --dc-success:     #22c55e;
      --dc-warning:     #f59e0b;
      --dc-danger:      #ef4444;
      --dc-role-admin-bg: rgba(59,130,246,0.22);
      --dc-role-admin-text: #93c5fd;
      --dc-role-user-bg: rgba(148,163,184,0.28);
      --dc-role-user-text: #e2e8f0;
      --dc-status-confirmed-bg: rgba(34,197,94,0.2);
      --dc-status-confirmed-text: #86efac;
      --dc-status-rejected-bg: rgba(239,68,68,0.2);
      --dc-status-rejected-text: #fca5a5;
      --dc-status-pending-bg: rgba(245,158,11,0.22);
      --dc-status-pending-text: #fcd34d;
      --hero-kicker-bg: rgba(15,31,56,0.9);
      --hero-kicker-border: rgba(96,165,250,0.45);
      --hero-kicker-text: #93c5fd;
      --hero-chip-bg: rgba(15,31,56,0.9);
      --hero-chip-border: rgba(148,163,184,0.45);
      --hero-chip-text: #e2e8f0;
    }

    html, body {
      background: var(--dc-bg) !important;
      color: var(--dc-text) !important;
      color-scheme: dark;
    }

    /* Sections */
    section { background: transparent !important; }

    /* Surfaces: white/gray cards → dark */
    .bg-white:not(footer *) { background: var(--dc-surface) !important; }
    .bg-gray-50:not(footer *), .bg-gray-100:not(footer *) { background: var(--dc-surface2) !important; }
    [class*="from-gray-50"], [class*="via-blue-50"], [class*="to-gray-50"] {
      background: var(--dc-bg) !important;
      background-image: none !important;
    }
    .bg-gradient-to-br, .bg-gradient-to-b, .bg-gradient-to-r {
      background: var(--dc-bg) !important;
      background-image: none !important;
    }

    /* Navbar */
    nav, header, [class*="navbar"] {
      background: var(--dc-header) !important;
      border-bottom-color: var(--dc-border) !important;
    }

    /* Hero gradient override */
    #hero { background: var(--dc-bg) !important; }

    /* Borders */
    .border-gray-200, .border-gray-100, .border { border-color: var(--dc-border) !important; }
    .divide-y > * + * { border-color: var(--dc-border) !important; }

    /* Typography */
    h1:not(footer *), h2:not(footer *), h3:not(footer *), h4:not(footer *) {
      color: var(--dc-heading) !important;
    }
    p:not(footer *), li:not(footer *), label:not(footer *),
    td:not(footer *), th:not(footer *) { color: var(--dc-text) !important; }
    .text-gray-500:not(footer *), .text-gray-400:not(footer *), .text-gray-600:not(footer *) {
      color: var(--dc-muted) !important;
    }
    .text-gray-900:not(footer *), .text-gray-800:not(footer *), .text-gray-700:not(footer *) {
      color: var(--dc-text) !important;
    }
    .text-blue-600:not(footer *) { color: var(--dc-accent-text) !important; }
    .text-blue-700:not(footer *) { color: var(--dc-accent-text) !important; }

    /* Keep white text on solid colored buttons */
    .bg-blue-700, .bg-blue-800, .bg-blue-600, .bg-indigo-700 { color: #fff !important; }
    .text-white:not(footer *) { color: #ffffff !important; }

    /* Inputs */
    input:not([type="checkbox"]):not(footer *), select:not(footer *), textarea:not(footer *) {
      background: var(--dc-input-bg) !important;
      border-color: var(--dc-border) !important;
      color: var(--dc-text) !important;
    }
    input::placeholder, textarea::placeholder { color: var(--dc-muted) !important; }
    input:focus, select:focus, textarea:focus {
      border-color: var(--dc-accent) !important;
      box-shadow: 0 0 0 3px var(--dc-accent-l) !important;
    }

    /* Cards with rounded corners */
    .rounded-xl:not(footer *):not(nav *):not(header *),
    .rounded-2xl:not(footer *):not(nav *):not(header *),
    .rounded-\\[14px\\]:not(footer *) {
      background: var(--dc-surface) !important;
      border-color: var(--dc-border) !important;
    }

    /* Gradient card header (e.g. PricingSection card header) */
    .bg-gradient-to-r.from-blue-600 { background: #1e3a6e !important; background-image: none !important; }

    /* Accent light backgrounds */
    .bg-blue-50:not(footer *) { background: var(--dc-accent-l) !important; }
    .bg-orange-50, .bg-amber-50, .bg-yellow-50, .bg-cyan-50 {
      background: var(--dc-surface2) !important;
    }

    /* Footer stays dark */
    footer { background: #050d1a !important; }
    footer *, footer p, footer span, footer li, footer a, footer h3 { color: #e2eaf6 !important; }
  `;
}

function applyTheme(theme) {
  let tag = document.getElementById("dc-theme");
  if (!tag) {
    tag = document.createElement("style");
    tag.id = "dc-theme";
    document.head.appendChild(tag);
  }
  tag.textContent = buildCSS(theme);
}

export const ThemeProvider = ({ children }) => {
  const saved = localStorage.getItem("dc_theme_id") || "default";
  const initial = THEMES.find((t) => t.id === saved) || THEMES[0];
  const [activeTheme, setActiveThemeState] = useState(initial.id);

  useEffect(() => {
    applyTheme(initial);
  }, []);

  const setTheme = (theme) => {
    setActiveThemeState(theme.id);
    localStorage.setItem("dc_theme_id", theme.id);
    applyTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
