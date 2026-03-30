import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-white via-blue-50/60 to-cyan-50/70">
      <div className="pointer-events-none absolute left-12 top-10 h-52 w-52 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute right-8 bottom-0 h-52 w-52 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="border border-blue-100 bg-white rounded-2xl px-6 sm:px-8 py-12 sm:py-14 text-center shadow-xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
            Book a Crane Today.
            <br />
            24/7 Support.
          </h3>

          <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto mb-8">
            Join businesses that trust Dutta Crane Service for reliable,
            professional heavy lifting and towing. Available for short-term and
            long-term contracts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button
              onClick={() => navigate("/register")}
              className="px-7 py-3 bg-blue-700 text-white font-extrabold rounded-lg hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Register & Book Now
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("fleet")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="px-7 py-3 border border-blue-300 text-blue-700 font-bold rounded-lg hover:bg-blue-50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              View Our Fleet
            </button>
          </div>

          <hr className="border-blue-100 mb-6" />
          <p className="text-slate-500 text-sm tracking-wide">
            Established 2010 &nbsp;|&nbsp; Humnabad – 585330 &nbsp;|&nbsp; 24/7
            Emergency Service
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
