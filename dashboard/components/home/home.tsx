"use client";
import { HeroBackground } from "../ui/hero-background";
import { AnnouncementBanner } from "../ui/announcement-banner";
import { HeroSection } from "../ui/hero-section";
import { Features } from "./features";
import { Footer } from "./footer";

export default function Home() {
  return (
    <div className='relative min-h-screen'>
      <AnnouncementBanner />
      <div className='relative '>
        <HeroBackground />
        <div className='relative z-10'>
          <HeroSection />
        </div>
      </div>
      <Features />
      <Footer />
    </div>
  );
}
