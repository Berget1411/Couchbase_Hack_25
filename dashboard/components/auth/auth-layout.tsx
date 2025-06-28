"use client";

import { Target } from "lucide-react";
import { HeroBackground } from "../ui/hero-background";
import { MatrixAsciiArt } from "../ui/matrix-ascii-art";
import Link from "next/link";
import { motion } from "framer-motion";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeroBackground showSpotlight={false} />
      <div className='grid min-h-svh md:grid-cols-5 lg:grid-cols-2 relative z-20'>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className='flex flex-col gap-4 p-6 md:p-8 lg:p-10 md:col-span-2 lg:col-span-1'
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className='flex justify-center gap-2 md:justify-start'
          >
            <Link
              href='/'
              className='flex items-center gap-2 font-medium text-lg'
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.1 }}
              >
                <Target className='h-6 w-6 text-primary' />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                SmartPyLogger
              </motion.span>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='flex flex-1 items-center justify-center'
          >
            <div className='w-full max-w-sm md:max-w-md lg:max-w-xs'>
              {children}
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className='bg-black/40 relative hidden md:flex md:col-span-3 lg:col-span-1 items-center justify-center p-4 lg:p-2 border-l border-border overflow-hidden'
        >
          <MatrixAsciiArt />
        </motion.div>
      </div>
    </>
  );
}
