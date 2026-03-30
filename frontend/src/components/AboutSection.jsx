import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const title1 = "Built on Trust,";
const title2 = "Powered by Experience";

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

const useCountUp = (target, duration = 1200, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
};

// Professional SVG icons
const CalendarIcon = () => (
  <svg
    className="w-5 h-5 text-teal-700"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const BuildingIcon = () => (
  <svg
    className="w-5 h-5 text-teal-700"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M3 21h18M3 21V7l9-4 9 4v14M10 21V14h4v7" />
  </svg>
);
const CraneIcon = () => (
  <svg
    className="w-5 h-5 text-teal-700"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M4 20h16M4 20l2-8h12l2 8M12 4v8M8 8l4-4 4 4" />
  </svg>
);
const PhoneIcon = () => (
  <svg
    className="w-5 h-5 text-teal-700"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 4.18 2 2 0 015.09 2h3a2 2 0 012 1.72c.13 1 .37 1.97.71 2.9a2 2 0 01-.45 2.11L9.09 9.91a16 16 0 006.99 7l1.17-1.17a2 2 0 012.11-.45c.93.34 1.9.58 2.9.71A2 2 0 0122 16.92z" />
  </svg>
);

const StatCard = ({ Icon, value, label, started, animate = true }) => {
  const numericTarget = parseInt(value.replace(/\D/g, ""));
  const suffix = value.replace(/[0-9]/g, "");
  const skipAnim = !animate || isNaN(numericTarget);
  const count = useCountUp(numericTarget, 1200, started && !skipAnim);
  return (
    <div className="group bg-white rounded-xl px-6 py-4 flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
      <div className="bg-teal-50 p-3 rounded-lg group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
        <Icon />
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
          {skipAnim ? value : started ? `${count}${suffix}` : value}
        </p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
};

const AboutSection = () => {
  const [started, setStarted] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.3 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { Icon: CalendarIcon, value: "2010", label: "Established" },
    { Icon: BuildingIcon, value: "200+", label: "Businesses Served" },
    { Icon: CraneIcon, value: "4", label: "Crane Models Available" },
    {
      Icon: PhoneIcon,
      value: "24/7",
      label: "Emergency Support",
      animate: false,
    },
  ];

  const values = [
    {
      title: "Safety First",
      desc: "All our cranes are regularly inspected and operated by certified professionals with years of site experience.",
    },
    {
      title: "Reliable & On-Time",
      desc: "We understand that delays cost money. Our fleet is always ready and dispatched on schedule across Humnabad.",
    },
    {
      title: "Transparent Pricing",
      desc: "No hidden charges. Fixed hourly and daily rates for all models. Contract rates available for long-term projects.",
    },
  ];

  return (
    <section
      id="about"
      className="relative isolate overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-white via-slate-50 to-white scroll-mt-20"
      ref={sectionRef}
    >
      <div className="pointer-events-none absolute -left-20 top-16 h-56 w-56 rounded-full bg-blue-200/35 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-10 h-56 w-56 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <div>
            <span className="inline-flex rounded-full border border-blue-200 bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700 shadow-sm mb-4">
              About Us
            </span>

            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight"
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {title1.split("").map((char, i) => (
                <motion.span key={i} variants={letter}>
                  {char}
                </motion.span>
              ))}
              <br />
              <span className="text-blue-600">
                {title2.split("").map((char, i) => (
                  <motion.span key={i} variants={letter}>
                    {char}
                  </motion.span>
                ))}
              </span>
            </motion.h2>

            <motion.p
              className="mt-4 text-slate-600 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              DATTA Crane Service has been the backbone of heavy lifting in
              Humnabad and surrounding districts since 2010. Owner{" "}
              <strong>Omkar Chalkapure</strong> built the company on a
              foundation of reliability and affordability — from a single crane
              to a full fleet of Hydra and Farana models. Today, we serve 200+
              businesses across construction, infrastructure, industrial, and
              emergency towing sectors.
            </motion.p>

            <motion.div
              className="mt-8 space-y-5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.15 } },
              }}
            >
              {values.map((item, i) => (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  key={i}
                  className="group flex gap-3 p-4 rounded-xl bg-white/70 hover:bg-white hover:shadow-sm border border-slate-200/80 hover:border-blue-200 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-1 rounded-full bg-blue-700 flex-shrink-0 group-hover:bg-cyan-500 transition-colors duration-300" />
                  <div>
                    <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                      {item.title}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — stat cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, x: 40 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <StatCard {...stat} started={started} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
