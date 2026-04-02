import React from "react";
import { useTheme, THEMES } from "../contexts/ThemeContext";
import { motion } from "framer-motion";

const title = "Choose Your Theme";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};
const letter = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

// SVG icons for theme cards
const SunIcon = () => (
  <svg
    className="w-4 h-4 text-amber-500 mr-1.5 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);
const WaveIcon = () => (
  <svg
    className="w-4 h-4 text-red-400 mr-1.5 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M2 12c1.5-2 3-3 5-3s3.5 1 5 3 3.5 3 5 3 3.5-1 5-3" />
    <path d="M2 18c1.5-2 3-3 5-3s3.5 1 5 3 3.5 3 5 3 3.5-1 5-3" />
    <path d="M2 6c1.5-2 3-3 5-3s3.5 1 5 3 3.5 3 5 3 3.5-1 5-3" />
  </svg>
);

const themeIcons = { default: SunIcon, arctic: WaveIcon };

// Preview palette for each theme (gradient swatch)
const themePreviews = {
  default: {
    swatch: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 45%, #fff 100%)",
    dot1: "#ea580c",
    dot2: "#9a3412",
    accent: "from-orange-500 to-red-500",
    chip: "Warm light",
    description: "Light mode",
  },
  arctic: {
    swatch: "linear-gradient(135deg, #0f172a 0%, #111827 45%, #020617 100%)",
    dot1: "#fb7185",
    dot2: "#f8fafc",
    accent: "from-slate-700 to-slate-950",
    chip: "Deep dark",
    description: "Dark mode",
  },
};

const ThemeCard = ({ theme, isActive, preview, onClick }) => (
  <motion.button
    initial={{ opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    whileHover={{ y: -4 }}
    onClick={onClick}
    className={`group overflow-hidden rounded-[1.75rem] border text-left transition-all duration-300 bg-white dark:bg-slate-900 ${
      isActive
        ? "border-orange-300 ring-2 ring-orange-500/30 shadow-xl shadow-orange-200/20 scale-[1.01] dark:ring-orange-400/25"
        : "border-gray-200 hover:border-orange-200 hover:shadow-lg dark:border-white/10 dark:hover:border-orange-400/30"
    }`}
  >
    <div className="p-4 sm:p-5">
      <div
        className="relative h-32 overflow-hidden rounded-2xl border border-white/70 shadow-inner dark:border-white/10"
        style={{ background: preview.swatch }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.55),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.12),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(251,113,133,0.10),transparent_30%)]" />

        <div className="absolute top-4 left-4 right-4 space-y-2">
          <div
            className="h-3.5 rounded-full w-2/3 opacity-90"
            style={{ backgroundColor: preview.dot1 }}
          />
          <div
            className="h-3 rounded-full w-1/2 opacity-40"
            style={{ backgroundColor: preview.dot2 }}
          />
          <div
            className="h-3 rounded-full w-4/5 opacity-18"
            style={{ backgroundColor: preview.dot2 }}
          />
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-700 shadow-sm backdrop-blur-sm dark:bg-slate-950/70 dark:text-gray-200">
          <span
            className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${preview.accent}`}
          />
          {preview.chip}
        </div>

        {isActive && (
          <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-white shadow-lg ring-2 ring-white/70">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${preview.accent} text-white shadow-md`}
            >
              {themeIcons[theme.id]
                ? React.createElement(themeIcons[theme.id])
                : null}
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {theme.name}
            </p>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            {preview.description}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 pt-1">
          <div className="flex gap-1.5">
            <div
              className="h-3.5 w-3.5 rounded-full border border-white shadow-sm"
              style={{ background: preview.dot1 }}
            />
            <div
              className="h-3.5 w-3.5 rounded-full border border-white shadow-sm"
              style={{ background: preview.dot2 }}
            />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
            {isActive ? "Selected" : "Preview"}
          </span>
        </div>
      </div>
    </div>
  </motion.button>
);

const ThemeSwitcher = () => {
  const { activeTheme, setTheme } = useTheme();

  return (
    <section
      id="themes"
      className="w-full pt-8 pb-20 px-4 bg-gradient-to-b from-white via-orange-50/40 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 bg-orange-50 text-orange-700 border border-orange-200 shadow-sm dark:bg-orange-500/10 dark:text-orange-200 dark:border-orange-400/30">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Personalization
          </span>
          <motion.h2
            className="text-4xl font-black text-gray-900 dark:text-white mb-3"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {title.split("").map((char, i) => (
              <motion.span key={i} variants={letter}>
                {char}
              </motion.span>
            ))}
          </motion.h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm max-w-md mx-auto">
            Pick a visual style that matches your taste.
          </p>
        </div>

        {/* Theme Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {THEMES.map((theme) => {
            const isActive = activeTheme === theme.id;
            const preview = themePreviews[theme.id] || themePreviews.default;
            return (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isActive={isActive}
                preview={preview}
                onClick={() => setTheme(theme)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ThemeSwitcher;
