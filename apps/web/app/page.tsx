import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import FeaturesPost from '@/components/FeaturesPost';

import NfcCardSection from '@/components/NfcCardSection';
import UseCasesSection from '@/components/UseCasesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import SampleProfilesSection from '@/components/SampleProfilesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PricingSection from '@/components/PricingSection';

import FooterSection from '@/components/FooterSection';
import MediaPreviewToggle from '@/components/MediaPreviewToggle';
import StickyNav from '@/components/StickyNav';

export default function HomePage() {
  return (
    <>
      
      <MediaPreviewToggle>
        <main className="pt-2">
          <HeroSection />
                  <FeaturesSection />
                  <FeaturesPost />
          <UseCasesSection />
          <HowItWorksSection />
                  <SampleProfilesSection />
                  
          <TestimonialsSection />
                  <PricingSection />
                  <NfcCardSection />
                  
        </main>
      </MediaPreviewToggle>
    </>
  );
}