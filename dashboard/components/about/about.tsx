"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HeroBackground } from "../ui/hero-background";
import { useState } from "react";
import { AboutHeader } from "./about-header";
import { ProjectSummary } from "./project-summary";
import { FullStory } from "./full-story";

export function About() {
  const [showFullStory, setShowFullStory] = useState(false);

  return (
    <>
      <HeroBackground showSpotlight={false} />
      <div className='min-h-screen text-white'>
        {/* Main Content */}
        <div className='relative grid grid-cols-1 lg:grid-cols-2 min-h-screen'>
          {/* Left Section - Our Story */}
          <AboutHeader />

          {/* Vertical Separator */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-800 transform -translate-x-1/2'
          ></motion.div>

          {/* Right Section - Project Details / Full Story */}
          <div className='bg-black/40 px-6 py-16 relative overflow-hidden'>
            <AnimatePresence mode='wait'>
              {!showFullStory ? (
                <ProjectSummary onReadMore={() => setShowFullStory(true)} />
              ) : (
                <FullStory onBack={() => setShowFullStory(false)} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
