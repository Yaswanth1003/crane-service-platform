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
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: "easeOut" } },
};

// SVG icons for theme cards
const SunIcon = () => (
  <svg className="w-4 h-4 text-amber-500 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);
const WaveIcon = () => (
  <svg className="w-4 h-4 text-blue-400 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M2 12c1.5-2 3-3 5-3s3.5 1 5 3 3.5 3 5 3 3.5-1 5-3" />
    <path d="M2 18c1.5-2 3-3 5-3s3.5 1 5 3 3.5 3 5 3 3.5-1 5-3" />
    <path d="M2 6c1.5-2 3-3 5-3s3.5 1 5 3 3.5 3 5 3 3.5-1 5-3" />
  </svg>
);

const themeIcons = { default: SunIcon, arctic: WaveIcon };

// Preview palette for each theme (gradient swatch)
const themePreviews = {
  default: {
    swatch: "linear-gradient(135deg, #f9fafb 0%, #dbeafe 50%, #eff6ff 100%)",
    dot1: "#1d4ed8",
    dot2: "#6b7280",
  },
  arctic: {
    swatch: "linear-gradient(135deg, #050d1a 0%, #0a1628 50%, #0f1f38 100%)",
    dot1: "#3b82f6",
    dot2: "#e2eaf6",
  },
};

const ThemeSwitcher = () => {
  const { activeTheme, setTheme } = useTheme();

  return (
    <section id="themes" className="w-full py-20 px-4" style={{ background: "transparent" }}>
      <div className="max-w-3xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 bg-blue-50 text-blue-700 border border-blue-200">
            Personalization
          </span>
          <motion.h2
            className="text-4xl font-extrabold text-gray-900 mb-3"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {title.split("").map((char, i) => (
              <motion.span key={i} variants={letter}>{char}</motion.span>
            ))}
          </motion.h2>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Pick a visual style that matches your taste. Applied instantly across the entire platform.
          </p>
        </div>

        {/* Theme Cards */}
        <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
          {THEMES.map((theme) => {
            const isActive = activeTheme === theme.id;
            const preview = themePreviews[theme.id] || themePreviews.default;
            return (
              <motion.button
                key={theme.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -5 }}
                onClick={() => setTheme(theme)}
                className={`group relative rounded-3xl overflow-hidden transition-all duration-300 text-left ${
                  isActive
                    ? "ring-2 ring-blue-500 ring-offset-2 shadow-2xl scale-[1.04]"
                    : "hover:shadow-xl hover:scale-[1.02] shadow-md"
                }`}
              >
                {/* Gradient preview swatch */}
                <div
                  className="h-32 w-full relative"
                  style={{ background: preview.swatch }}
                >
                  {/* Mock UI bars */}
                  <div className="absolute top-4 left-4 right-4">
                    <div className="h-4 rounded-full w-2/3 mb-2 opacity-60" style={{ backgroundColor: preview.dot1 }} />
                    <div className="h-3 rounded-full w-1/2 opacity-40" style={{ backgroundColor: preview.dot2 }} />
                    <div className="h-3 rounded-full w-3/4 mt-1.5 opacity-25" style={{ backgroundColor: preview.dot2 }} />
                  </div>

                  {/* Active checkmark */}
                  {isActive && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Label */}
                <div className="bg-white px-4 py-3 flex items-center justify-between" style={{ backgroundColor: "#ffffff" }}>
                  <div className="flex items-center">
                    {themeIcons[theme.id] ? React.createElement(themeIcons[theme.id]) : null}
                    <span className="text-sm font-semibold text-gray-800">{theme.name}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-4 h-4 rounded-full border border-gray-200 shadow-sm" style={{ background: preview.dot1 }} />
                    <div className="w-4 h-4 rounded-full border border-gray-200 shadow-sm" style={{ background: preview.dot2 }} />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          ✓ Saved automatically · ✓ Stays after refresh · ✓ No reload needed
        </p>
      </div>
    </section>
  );
};

export default ThemeSwitcher;
