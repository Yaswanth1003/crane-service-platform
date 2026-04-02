import React from "react";
import { motion } from "framer-motion";

const AuthHeroSection = () => {
  const headlineTop = "Heavy Crane Booking";
  const headlineBottom = "Made Simple";

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const letter = {
    hidden: {
      opacity: 0,
      y: 12,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.28,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="flex-1 px-8 lg:px-14 py-10 lg:py-16 flex flex-col justify-center bg-gradient-to-br from-slate-50 via-white to-red-50">
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {headlineTop.split("").map((char, idx) => (
          <motion.span key={idx} variants={letter}>
            {char}
          </motion.span>
        ))}
      </motion.h1>

      <motion.h2
        className="text-4xl md:text-5xl font-extrabold tracking-tight mt-1 text-red-600"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {headlineBottom.split("").map((char, idx) => (
          <motion.span key={idx} variants={letter}>
            {char}
          </motion.span>
        ))}
      </motion.h2>

      <p className="mt-5 max-w-xl text-slate-600 leading-relaxed">
        DATTA Crane Service gives you a fast way to book crane support with
        clear pricing and dependable service.
      </p>

      <div className="mt-8 grid gap-3 max-w-lg">
        {[
          "Hydra and Farana crane support",
          "Emergency towing when you need it",
          "Fast booking with transparent pricing",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 text-sm text-slate-700"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-7 border-t border-slate-200 text-sm text-slate-600 max-w-xl">
        <p className="font-semibold text-red-700">DATTA Crane Service</p>
        <p>Trusted since 2010 for bookings, towing, and heavy lifts.</p>
      </div>
    </div>
  );
};

export default AuthHeroSection;
