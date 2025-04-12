import LandingLayout from './public/layouts/LandingLayout';
import Hero from './public/sections/Hero';
import InformationSection from './public/sections/InformationSection';
import CompanyCards from './public/sections/CompanyCards';
export default function Home() {
  return (
    <LandingLayout>
      <Hero />
      <CompanyCards />
      <InformationSection />
    </LandingLayout>
  );
}
