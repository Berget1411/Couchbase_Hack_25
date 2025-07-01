"use client";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export function AboutHeader() {
  return (
    <div className='flex flex-col justify-center items-center px-6 py-16 h-full '>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='w-full max-w-md'
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='text-4xl font-bold mb-2 text-foreground'
        >
          Our Story
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='text-muted-foreground'
        >
          Built in under two weeks during the Couchbase x AWS x Cillers
          hackathon
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Separator className='mt-4 mb-8' />
        </motion.div>
        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center'
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant='link' className='px-0 text-foreground'>
              <BookOpen className='w-4 h-4 rounded' />
              Documentation
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant='link' className='px-0 text-foreground'>
              <FaGithub className='w-4 h-4 rounded-full' />
              GitHub
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant='link' className='px-0 text-foreground'>
              <FaDiscord className='w-4 h-4 rounded' />
              Community
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
