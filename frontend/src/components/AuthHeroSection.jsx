import React from "react";
import { motion } from "framer-motion";

const AuthHeroSection = () => {
  const headlineTop = "Book Heavy Lifts,";
  const headlineBottom = "Without the Stress";

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
    <div className="flex-1 px-8 lg:px-14 py-10 lg:py-16 flex flex-col justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
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
        className="text-4xl md:text-5xl font-extrabold tracking-tight mt-1 text-blue-600"
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
        Dutta Crane Service helps you schedule hydra cranes, farana cranes, and
        emergency towing quickly with transparent pricing and reliable
        operations.
      </p>

      <div className="mt-8 grid gap-3 max-w-lg">
        {[
          "Hydra cranes: 12 Ton, 14 Ton",
          "Farana cranes: F15, F17",
          "Emergency towing and accident recovery",
          "Fast booking with dashboard tracking",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 text-sm text-slate-700"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-7 border-t border-slate-200 text-sm text-slate-600 max-w-xl">
        <p className="font-semibold text-slate-900">Dutta Crane Service</p>
        <p>Owner: Omkar Chalkapure | Since 2010</p>
        <p>
          RTO Check Post, Near KSRTC Bus Depot, Industrial Area, Humnabad -
          585330
        </p>
        <p>9008493555 | 8329672834 | craneservicesdurga@gmail.com</p>
      </div>
    </div>
  );
};

export default AuthHeroSection;
