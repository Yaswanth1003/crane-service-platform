import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const title1 = "Reliable Crane &";
const title2 = "Towing Services";

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

const highlights = [
  "Hydra Cranes - 12 & 14 Ton",
  "Farana Cranes - F15 & F17",
  "Emergency Towing 24/7",
  "6-Month Contract Available",
];

const quickStats = [
  { value: "15+", label: "Years of Service" },
  { value: "200+", label: "Businesses Served" },
  { value: "24/7", label: "Emergency Support" },
];

const HeroSection = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/book" : "/login");
  };

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden min-h-[88vh] bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center pt-24 pb-20"
    >
      <div className="pointer-events-none absolute -left-16 top-10 h-52 w-52 rounded-full bg-cyan-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 bottom-10 h-56 w-56 rounded-full bg-blue-200/45 blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex rounded-full border border-blue-200 bg-white/80 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700"
            style={{
              backgroundColor: "var(--hero-kicker-bg, rgba(255,255,255,0.85))",
              borderColor: "var(--hero-kicker-border, #bfdbfe)",
              color: "var(--hero-kicker-text, #1d4ed8)",
            }}
          >
            Est. 2010 | Humnabad Heavy Lift Partner
          </motion.span>

          <div className="mt-6 max-w-4xl">
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.08] tracking-tight"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              {title1.split("").map((char, i) => (
                <motion.span key={i} variants={letter}>
                  {char}
                </motion.span>
              ))}
            </motion.h1>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-600 leading-[1.08] tracking-tight mt-1"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              {title2.split("").map((char, i) => (
                <motion.span key={i} variants={letter}>
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl"
          >
            Dutta Crane Service — serving industrial and commercial clients
            since 2010. Hydra Cranes, Farana Cranes, and Emergency Towing in
            Humnabad and beyond.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-8 flex flex-wrap justify-center gap-2.5 sm:gap-3"
          >
            {highlights.map((f, i) => (
              <div
                key={i}
                className="group inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3.5 py-2 text-xs sm:text-sm text-slate-700"
                style={{
                  backgroundColor:
                    "var(--hero-chip-bg, rgba(255,255,255,0.82))",
                  borderColor: "var(--hero-chip-border, #dbeafe)",
                  color: "var(--hero-chip-text, #334155)",
                }}
              >
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors duration-200">
                  <svg
                    className="w-3 h-3 text-blue-600 group-hover:text-white transition-colors duration-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>{f}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="mt-9 flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
          >
            <button
              type="button"
              onClick={handleBookNow}
              className="text-center px-6 py-3.5 bg-blue-700 text-white text-sm font-extrabold rounded-xl hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Book a Service Now
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="mt-10 w-full"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {quickStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-blue-100 bg-white px-4 py-4 hover:-translate-y-1 hover:border-blue-200 transition-all duration-300"
                >
                  <p className="text-2xl font-extrabold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-center items-center gap-2 text-slate-600 text-xs sm:text-sm">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    className="w-4 h-4 text-amber-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p>Trusted by 200+ businesses since 2010</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
