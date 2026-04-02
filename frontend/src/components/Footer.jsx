import React from "react";
import { useNavigate } from "react-router-dom";
import { PhoneCall, MessageCircle } from "lucide-react";

const Footer = ({ mode = "public" }) => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    if (sectionId === "contact") {
      navigate("/contact");
      return;
    }

    if (window.location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: "smooth" });
      return;
    }

    navigate(`/#${sectionId}`);
  };

  const quickLinks =
    mode === "dashboard"
      ? [
          { label: "Home", section: "hero" },
          { label: "Contact", section: "contact" },
        ]
      : [
          { label: "Home", section: "hero" },
          { label: "Services", section: "services" },
          { label: "About Us", section: "about" },
          { label: "Our Fleet & Pricing", section: "fleet" },
          { label: "Contact", section: "contact" },
        ];

  return (
    <footer id="contact" className="bg-gray-900 text-white min-h-[420px]">
      <style>{`
        footer a, footer a:visited { color: #ffffff !important; }
        footer a:hover, footer a:focus { color: #fb923c !important; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 md:gap-y-12 lg:gap-y-8 lg:gap-x-16 xl:gap-x-20">
          {/* Brand */}
          <div className="lg:col-span-2 lg:pr-6 xl:pr-10">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="/company_logo.png"
                alt="DATTA Cranes Logo"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  DATTA CRANES
                </span>
                <p className="text-sm text-gray-400">
                  Professional crane & towing services
                </p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-lg">
              Serving industrial and commercial clients across Humnabad since
              2010. Reliable Hydra cranes, Farana cranes, and emergency towing —
              all available 24/7.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/919008493555"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-green-400 transition duration-300"
              >
                <span className="sr-only">WhatsApp</span>
                <MessageCircle className="w-6 h-6" />
              </a>
              <a
                href="tel:9008493555"
                className="text-white hover:text-red-400 transition duration-300"
              >
                <span className="sr-only">Phone</span>
                <PhoneCall className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex justify-start md:justify-center">
            <div className="w-full max-w-[380px]">
              <h3 className="text-lg font-semibold text-white mb-4 text-left md:text-center">
                Quick Links
              </h3>
              <ul className="space-y-3 text-left md:text-center">
                {quickLinks.map(({ label, section }) => (
                  <li key={section}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(section)}
                      className="inline-block text-white hover:text-red-400 transition duration-300 text-left md:text-center"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="w-full lg:pl-4 xl:pl-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Contact & Support
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="break-all">DATTAcraneservices@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>
                  9008493555 <br /> 8329672834
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  RTO Check Post, Near KSRTC Bus Depot,
                  <br /> Industrial Area, Humnabad – 585330
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              <span className="tabular-nums">
                © {new Date().getFullYear()} DATTA Crane Service. All rights
                reserved. Owner: Omkar Chalkapure.
              </span>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Est. 2010</span>
              <span className="text-gray-400 text-sm">Humnabad – 585330</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
