import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Timeline Icons
const YearIcon = () => (
  <svg
    className="w-6 h-6 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M8 7V3m8 4V3m4 6h-1v2h1v12a2 2 0 01-2 2H5a2 2 0 01-2-2V9h1V7a1 1 0 011-1h2a1 1 0 011-1h2a1 1 0 011 1h2a1 1 0 011 1h1a1 1 0 011 1z" />
  </svg>
);

const BusinessIcon = () => (
  <svg
    className="w-6 h-6 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const CraneIcon = () => (
  <svg
    className="w-6 h-6 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
  </svg>
);

const SupportIcon = () => (
  <svg
    className="w-6 h-6 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

const StoryBadgeIcon = () => (
  <svg
    className="h-3.5 w-3.5 text-white"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M4 20h16M6 20V9l6-4 6 4v11M9 20v-8h6v8" />
  </svg>
);

const timelineData = [
  {
    year: "2010",
    title: "Founded",
    desc: "Started with vision to provide reliable crane services to Humnabad",
    Icon: YearIcon,
    color: "from-orange-500 to-orange-600",
  },
  {
    year: "200+",
    title: "Clients Served",
    desc: "Trusted by businesses across construction, infrastructure & industrial sectors",
    Icon: BusinessIcon,
    color: "from-red-500 to-red-600",
  },
  {
    year: "4",
    title: "Crane Models",
    desc: "Hydra 12T, Hydra 14T, Farana F15 & F17 available 24/7",
    Icon: CraneIcon,
    color: "from-orange-400 to-orange-500",
  },
  {
    year: "24/7",
    title: "Emergency Support",
    desc: "Always ready for emergency towing and urgent lifting requirements",
    Icon: SupportIcon,
    color: "from-orange-600 to-red-600",
  },
];

const TimelineCard = ({ year, title, desc, Icon, color, index, started }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="relative group"
  >
    <div className="flex gap-4">
      {/* Connector line */}
      {index < timelineData.length - 1 && (
        <motion.div
          className="absolute left-6 top-16 w-0.5 h-20 bg-gradient-to-b from-orange-400 via-orange-300 to-transparent dark:via-orange-400"
          initial={{ height: 0 }}
          whileInView={{ height: 80 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        />
      )}

      {/* Icon circle */}
      <motion.div
        className={`flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-lg ring-2 ring-white/80 dark:ring-slate-950/70 z-10`}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <Icon />
      </motion.div>

      {/* Content */}
      <motion.div
        className="flex-grow pt-1 rounded-2xl p-4 sm:p-5 border border-orange-100/70 bg-white/95 shadow-sm shadow-orange-100/30 backdrop-blur-sm hover:border-orange-200 hover:shadow-lg transition-all duration-300 dark:bg-slate-900/80 dark:border-white/10 dark:shadow-none"
        whileHover={{ y: -4 }}
      >
        <div className="flex items-baseline gap-2 mb-1">
          <p
            className={`text-2xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent dark:text-white`}
          >
            {year}
          </p>
          <h4 className="font-bold text-gray-900 dark:text-white">{title}</h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {desc}
        </p>
      </motion.div>
    </div>
  </motion.div>
);

const AboutSection = () => {
  const [started, setStarted] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      className="relative overflow-hidden pt-6 pb-14 sm:pt-10 sm:pb-20 bg-gradient-to-b from-white via-orange-50/30 to-white scroll-mt-20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
      ref={sectionRef}
    >
      {/* Animated bg elements */}
      <motion.div
        className="pointer-events-none absolute -top-32 left-5 w-72 h-72 rounded-full bg-orange-200/20 blur-3xl"
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 right-10 w-80 h-80 rounded-full bg-red-200/15 blur-3xl"
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700 shadow-sm dark:border-orange-400/30 dark:bg-orange-500/10"
            whileHover={{ scale: 1.05 }}
          >
            <span>Our Story</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Built on
            <br />
            <span className="text-orange-600 dark:text-white">
              Trust & Experience
            </span>
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Since 2010, DATTA Crane Service has been the trusted partner for
            heavy lifting and emergency towing across Humnabad and beyond.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="mb-10 space-y-6">
          {timelineData.map((item, idx) => (
            <TimelineCard key={idx} {...item} index={idx} started={started} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
