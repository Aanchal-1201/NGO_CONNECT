import FeaturesSection from "./FeaturesSection/FeaturesSection";
import HeroSection from "./HeroSection/HeroSection";
import HowItWorksSection from "./HowItWorksSection/HowItWorksSection";
import MapSection from "./MapSection/MapSection";
import AboutSection from "./AboutSection/AboutSection";
import "./HomeResponsive.css"

export default function HomeLayout() {
  return (
    <>
    <HeroSection/>
    <FeaturesSection/>
    <HowItWorksSection/>
    <AboutSection/>
    <MapSection/>
    </>
  )
}