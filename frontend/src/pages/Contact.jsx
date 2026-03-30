import { useState } from "react";
import { motion } from "framer-motion";
import api from "../lib/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/contact", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Thank you for reaching out
          </h2>
          <p className="text-gray-500 mb-6">
            We will connect with you shortly for your crane requirements.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
          >
            Back to Contact
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <motion.div
        className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="bg-gradient-to-br from-blue-700 to-blue-500 text-white p-10 flex flex-col justify-between"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
            <p className="text-blue-200 mb-8">
              Reach out any time for bookings, contracts, and emergency towing.
            </p>

            <div className="space-y-4 text-sm">
              <a
                href="tel:9008493555"
                className="flex items-center gap-3 hover:underline"
              >
                <span>9008493555</span>
              </a>
              <a
                href="tel:8329672834"
                className="flex items-center gap-3 hover:underline"
              >
                <span>8329672834</span>
              </a>
              <a
                href="mailto:duttacraneservices@gmail.com"
                className="flex items-center gap-3 hover:underline"
              >
                <span>duttacraneservices@gmail.com</span>
              </a>
              <p>
                RTO Check Post, Near KSRTC Bus Depot, Industrial Area, Humnabad
                - 585330
              </p>
            </div>
          </div>
        </motion.div>

        <div className="p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Contact Us</h2>
          <p className="text-gray-500 mb-8 text-sm">
            Share your requirement and our team will get back quickly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none py-2"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none py-2"
                placeholder="Your email"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Phone (optional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none py-2"
                placeholder="Your contact number"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Message</label>
              <textarea
                name="message"
                rows="3"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none py-2 resize-none"
                placeholder="Write your message"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-800 text-white transition"
            >
              Send Message
            </motion.button>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
