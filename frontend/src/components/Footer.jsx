import React from "react";
import { useNavigate } from "react-router-dom";

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
        footer a:hover, footer a:focus { color: #60a5fa !important; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 md:gap-y-12 lg:gap-y-8 lg:gap-x-16 xl:gap-x-20">
          {/* Brand */}
          <div className="lg:col-span-2 lg:pr-6 xl:pr-10">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="/company_logo.png"
                alt="Dutta Cranes Logo"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  DUTTA CRANES
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
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.148-.173.198-.297.297-.495.099-.198.05-.371-.025-.52-.075-.148-.67-1.611-.916-2.206-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.075-.793.371-.273.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.877 1.213 3.075.148.198 2.095 3.2 5.077 4.487.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347" />
                </svg>
              </a>
              <a
                href="tel:9008493555"
                className="text-white hover:text-blue-400 transition duration-300"
              >
                <span className="sr-only">Phone</span>
                <svg
                  className="w-6 h-6"
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
                      className="inline-block text-white hover:text-blue-400 transition duration-300 text-left md:text-center"
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
                  className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
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
                <span className="break-all">duttacraneservices@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
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
                  className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
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
                © {new Date().getFullYear()} Dutta Crane Service. All rights
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
