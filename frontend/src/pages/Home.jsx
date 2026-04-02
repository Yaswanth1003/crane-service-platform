import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import PricingSection from "../components/PricingSection";
import AboutSection from "../components/AboutSection";
import ThemeSwitcher from "../components/ThemeSwitcher";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <AboutSection />
        <ThemeSwitcher />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
