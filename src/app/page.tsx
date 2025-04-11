import LandingLayout from './public/layouts/LandingLayout';
import Hero from './public/sections/Hero';
import InformationSection from './public/sections/InformationSection';
export default function Home() {
  return (
    <LandingLayout>
      <Hero />
      <InformationSection />
    </LandingLayout>
  );
}
