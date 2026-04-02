import React from "react";
import { motion } from "framer-motion";

// Crane-specific SVG icons with orange/red accent
const CraneIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FF6B35"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2v8M12 10l-4 4M12 10l4 4M4 20h16M8 14v6M16 14v6" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FF6B35"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FF6B35"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const TruckIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FF6B35"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const ZapIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FF6B35"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const features = [
  {
    Icon: CraneIcon,
    title: "Hydra Crane Rental",
    description:
      "12 Ton & 14 Ton Hydra Cranes available for short-term and long-term contracts. ₹1600/hr or ₹8000/day.",
  },
  {
    Icon: ZapIcon,
    title: "Farana Crane Services",
    description:
      "High-capacity F15 & F17 Farana cranes for heavy industrial lifts. ₹2000/hr or ₹15,000/day.",
  },
  {
    Icon: TruckIcon,
    title: "Emergency Towing",
    description:
      "24/7 accident recovery and emergency towing in Humnabad and surrounding industrial areas.",
  },
];

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: index * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const FeatureCard = ({ Icon, title, description, index }) => (
  <motion.div
    custom={index}
    variants={cardVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    whileHover={{ y: -6, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-300 hover:shadow-xl"
  >
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,53,0.16),transparent_42%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div className="pointer-events-none absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r from-orange-500 to-red-400 transition-all duration-300 group-hover:w-full" />
    <div
      className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-orange-100 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
      style={{ backgroundColor: "#FFF7ED" }}
    >
      <Icon />
    </div>
    <h3 className="relative z-10 mb-2 text-base font-bold text-slate-900 transition-colors duration-300 group-hover:text-orange-700">
      {title}
    </h3>
    <p className="relative z-10 text-sm leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-700">
      {description}
    </p>
  </motion.div>
);

const FeaturesSection = () => {
  return (
    <section
      id="services"
      className="relative isolate overflow-hidden bg-gradient-to-b from-orange-50 via-white to-orange-50/60 py-16 sm:py-24"
    >
      <div className="pointer-events-none absolute -top-24 left-12 h-48 w-48 rounded-full bg-orange-200/45 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-12 h-52 w-52 rounded-full bg-red-200/35 blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <span className="inline-flex rounded-full border border-orange-200 bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700 shadow-sm">
            Our Services
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            Everything You Need for
          </h2>
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-orange-700 to-red-600 bg-clip-text text-transparent leading-tight mt-1">
            Heavy Lifting & Towing
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            From Hydra cranes to Farana cranes and emergency towing, DATTA Crane
            Service brings all your heavy equipment needs under one roof.
            Established 2010.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {features.map((f, i) => (
            <FeatureCard key={i} index={i} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
