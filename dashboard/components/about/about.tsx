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
        <div className='relative min-h-screen overflow-hidden'>
          {/* Left Section - Our Story (only shown when not in full story mode) */}
          <AnimatePresence>
            {!showFullStory && (
              <motion.div
                initial={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -400 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className='absolute left-0 top-0 w-1/2 h-full z-10'
              >
                <AboutHeader />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vertical Separator (only shown when not in full story mode) */}
          <AnimatePresence>
            {!showFullStory && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className='hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-800 transform -translate-x-1/2 z-20'
              />
            )}
          </AnimatePresence>

          {/* Right Section - Expands to full width */}
          <motion.div
            initial={{ x: showFullStory ? 0 : "50%" }}
            animate={{
              x: 0,
              width: showFullStory ? "100%" : "50%",
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className='absolute right-0 top-0 h-full bg-black/40'
            style={{ width: showFullStory ? "100%" : "50%" }}
          >
            <div className='px-6 py-16 h-full overflow-hidden'>
              <AnimatePresence mode='wait'>
                {!showFullStory ? (
                  <ProjectSummary onReadMore={() => setShowFullStory(true)} />
                ) : (
                  <FullStory onBack={() => setShowFullStory(false)} />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
