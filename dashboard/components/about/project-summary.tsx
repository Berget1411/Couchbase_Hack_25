"use client";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { motion } from "framer-motion";

interface ProjectSummaryProps {
  onReadMore: () => void;
}

export function ProjectSummary({ onReadMore }: ProjectSummaryProps) {
  return (
    <motion.div
      key='summary'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className='text-sm text-muted-foreground mb-4'
      >
        Stockholm Hackathon // July 1st, 2025
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className='text-2xl font-bold mb-4 text-foreground'
      >
        SmartPyLogger: A Developer Tool Born from Passion
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className='text-foreground/80 mb-4'
      >
        Built by three KTH students during the Couchbase x AWS x Cillers
        hackathon. We believe in &quot;use-case over tech&quot; but we love
        tech, so we built something for devs.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Separator className='my-4' />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className='text-muted-foreground text-sm mb-4'
      >
        SmartPyLogger is a ridiculously simple tool for Python web developers.
        FastAPI request logging with full history, AI-backed analysis, CORS
        middleware with IP blocking, and intelligent censorship of dangerous
        traffic. A pip-installable package that just works - no fluff, real
        value.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant='link'
          className='px-0 text-foreground'
          onClick={onReadMore}
        >
          Read More
        </Button>
      </motion.div>
    </motion.div>
  );
}
