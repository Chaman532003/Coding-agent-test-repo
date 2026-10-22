import SiteHeader from "./landing/SiteHeader.jsx";
import Hero from "./landing/Hero.jsx";
import StatsStrip from "./landing/StatsStrip.jsx";
import Features from "./landing/Features.jsx";
import FeaturedProducts from "./landing/FeaturedProducts.jsx";
import HowItWorks from "./landing/HowItWorks.jsx";
import Testimonials from "./landing/Testimonials.jsx";
import Pricing from "./landing/Pricing.jsx";
import Faq from "./landing/Faq.jsx";
import Newsletter from "./landing/Newsletter.jsx";
import SiteFooter from "./landing/SiteFooter.jsx";

// Shoppers must log in first, so every call to action leads to login.
export default function LandingPage({ onLogin }) {
  return (
    <div className="landing-page">
      <SiteHeader onLogin={onLogin} />
      <main className="landing-main">
        <Hero onStart={onLogin} />
        <StatsStrip />
        <Features />
        <FeaturedProducts onAdd={onLogin} />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <Faq />
        <Newsletter />
      </main>
      <SiteFooter />
    </div>
  );
}
