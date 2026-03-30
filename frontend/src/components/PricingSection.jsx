import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: index * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

// SVG tag badge icons
const HydraIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 mr-1.5"
  >
    <path d="M3 18h18M3 18V9l9-6 9 6v9M10 18v-5h4v5" />
  </svg>
);
const FaranaIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 mr-1.5"
  >
    <path d="M4 20h16M4 20l2-8h12l2 8M12 4v8M8 8l4-4 4 4" />
  </svg>
);
const TowingIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 mr-1.5"
  >
    <rect x="1" y="11" width="14" height="8" rx="1" />
    <path d="M15 15h4l3-4v4h-3" />
    <circle cx="5.5" cy="19.5" r="1.5" />
    <circle cx="18.5" cy="19.5" r="1.5" />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-teal-500 mr-2 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const plans = [
  {
    name: "Hydra Crane",
    model: "12 Ton",
    tagType: "hydra",
    image: "/hydra_12ton.png",
    hourly: "₹1,600",
    daily: "₹8,000",
    description: "Ideal for medium-weight construction lifts",
    features: [
      "12 Ton lifting capacity",
      "Compact & highly mobile",
      "Ideal for industrial sites",
      "Hourly & daily booking",
      "Certified operator included",
    ],
  },
  {
    name: "Hydra Crane",
    model: "14 Ton",
    tagType: "hydra",
    image: "/hydra_14ton.png",
    hourly: "₹1,600",
    daily: "₹8,000",
    description: "Heavier capacity with same hourly flexibility",
    features: [
      "14 Ton lifting capacity",
      "Heavy construction grade",
      "Versatile boom reach",
      "Hourly & daily booking",
      "Certified operator included",
    ],
  },
  {
    name: "Farana Crane",
    model: "F15",
    tagType: "farana",
    image: "/farana_f15.png",
    hourly: "₹2,000",
    daily: "₹15,000",
    description: "Powerful F15 model for large industrial operations",
    features: [
      "F15 industrial model",
      "High lifting performance",
      "Suitable for steel & infra",
      "Hourly & daily booking",
      "Certified operator included",
    ],
  },
  {
    name: "Farana Crane",
    model: "F17",
    tagType: "farana",
    image: "/farana_f17.png",
    hourly: "₹2,000",
    daily: "₹15,000",
    description: "High-capacity lifts for heavy industrial projects",
    features: [
      "F17 high-capacity model",
      "Heavy industrial grade",
      "Wide reach & stability",
      "Hourly & daily booking",
      "Certified operator included",
      "Long-term contract available",
    ],
  },
];

const TagBadge = ({ type }) => {
  const config = {
    hydra: {
      label: "Hydra",
      cls: "bg-orange-100 text-orange-700 border-orange-200",
      Icon: HydraIcon,
    },
    farana: {
      label: "Farana",
      cls: "bg-blue-50 text-blue-700 border-blue-200",
      Icon: FaranaIcon,
    },
    towing: {
      label: "Towing",
      cls: "bg-gray-100 text-gray-700 border-gray-200",
      Icon: TowingIcon,
    },
  };
  const { label, cls, Icon } = config[type] || config.towing;
  return (
    <span
      className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${cls}`}
    >
      <Icon />
      {label}
    </span>
  );
};

const PricingSection = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/book");
      return;
    }
    navigate("/login");
  };

  return (
    <section
      id="fleet"
      className="relative isolate overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-cyan-50/30 py-20"
    >
      <div className="pointer-events-none absolute -top-20 right-10 h-52 w-52 rounded-full bg-sky-200/35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-56 w-56 rounded-full bg-cyan-200/25 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <span className="inline-flex rounded-full border border-blue-200 bg-white/80 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700 shadow-sm">
            Our Fleet &amp; Pricing
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            Available Models.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Clear Pricing.
            </span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-base sm:text-lg">
            All cranes come with a certified operator. Book by the hour or
            secure a daily/long-term rate. No hidden charges.
          </p>
        </motion.div>

        {/* Cards — uniform 4-column grid, all equal styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="group relative bg-white rounded-2xl shadow-md border border-gray-200 hover:scale-105 hover:shadow-xl hover:-translate-y-1 hover:border-blue-400 transition-all duration-300 flex flex-col cursor-pointer overflow-hidden"
            >
              {/* Hover shimmer overlay */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_44%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10" />

              {/* Crane Image — white bg forced via inline style so Arctic theme can't darken it */}
              <div
                className="relative w-full flex items-center justify-center overflow-hidden"
                style={{ height: "190px", backgroundColor: "#f8fafc" }}
              >
                <img
                  src={plan.image}
                  alt={`${plan.name} ${plan.model}`}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  style={{ mixBlendMode: "multiply" }}
                />
                <div className="absolute top-3 right-3 z-20">
                  <TagBadge type={plan.tagType} />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-base font-bold text-gray-900">
                  {plan.name}
                </h3>
                <p className="text-sm font-semibold text-blue-600 mt-0.5">
                  Model: {plan.model}
                </p>
                <p className="mt-2 text-gray-500 text-xs leading-relaxed">
                  {plan.description}
                </p>

                {/* Pricing row */}
                <div className="mt-4 flex items-end gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
                      Per Hour
                    </p>
                    <span className="text-xl font-extrabold text-blue-700">
                      {plan.hourly}
                    </span>
                  </div>
                  <div className="border-l border-gray-200 pl-4">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
                      Per Day
                    </p>
                    <span className="text-xl font-extrabold text-gray-700">
                      {plan.daily}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="mt-4 space-y-1.5 grow">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center text-gray-600 text-xs"
                    >
                      <CheckIcon />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={handleBookNow}
                  className="relative z-10 mt-6 w-full py-2.5 rounded-xl font-semibold text-sm border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white hover:shadow-lg transition-all duration-300"
                >
                  Book {plan.model} Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          className="text-center text-sm text-gray-400 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          All bookings include a certified operator. Contact us for 6-month
          contract rates.{" "}
          <a
            href="tel:9008493555"
            className="text-blue-600 font-medium hover:underline"
          >
            Call: 9008493555
          </a>
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
