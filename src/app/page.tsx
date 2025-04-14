import LandingLayout from './landing/layouts/LandingLayout';
import Hero from './landing/sections/Hero';
import InformationSection from './landing/sections/InformationSection';
import CompanyCards from './landing/sections/CompanyCards';
export default function Home() {
  return (
    <LandingLayout>
      <Hero />
      <CompanyCards />
      <InformationSection />
    </LandingLayout>
  );
}
