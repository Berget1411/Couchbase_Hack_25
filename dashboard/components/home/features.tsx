"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import {
  IconBoxAlignRightFilled,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

export function Features() {
  return (
    <div className='relative mx-auto w-full max-w-7xl'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className='px-4 py-12 sm:px-6 sm:py-16 lg:py-24 lg:px-8'
      >
        <BentoGrid className='mx-auto md:auto-rows-[20rem]'>
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={cn("[&>p:text-lg]", item.className)}
              icon={item.icon}
            />
          ))}
        </BentoGrid>
      </motion.div>
    </div>
  );
}

const SkeletonOne = () => {
  const variants = {
    initial: {
      x: 0,
      scale: 1,
    },
    animate: {
      x: 10,
      scale: 1.02,
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
      scale: 1,
    },
    animate: {
      x: -10,
      scale: 1.02,
    },
  };

  const requestLogs = [
    {
      method: "GET",
      endpoint: "/api/users",
      time: "145ms",
      status: "success",
      color: "green",
    },
    {
      method: "POST",
      endpoint: "/api/auth/login",
      time: "89ms",
      status: "success",
      color: "blue",
    },
    {
      method: "PUT",
      endpoint: "/api/profile",
      time: "203ms",
      status: "success",
      color: "purple",
    },
    {
      method: "DELETE",
      endpoint: "/api/session",
      time: "67ms",
      status: "success",
      color: "red",
    },
    {
      method: "GET",
      endpoint: "/api/analytics",
      time: "412ms",
      status: "warning",
      color: "orange",
    },
  ];

  return (
    <motion.div
      initial='initial'
      whileHover='animate'
      className='flex flex-1 w-full h-full dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col justify-center space-y-2 p-3 relative overflow-hidden'
    >
      {/* Background pulse effect */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-50/50 to-green-50/50 dark:from-blue-950/20 dark:to-green-950/20 animate-pulse opacity-60' />

      {/* Header with live indicator */}
      <div className='relative z-10 flex items-center justify-between mb-2'>
        <div className='flex items-center space-x-2'>
          <div className='h-2 w-2 bg-green-500 rounded-full animate-pulse' />
          <span className='text-xs font-medium text-muted-foreground'>
            Live Request Log
          </span>
        </div>
        <span className='text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full'>
          {requestLogs.length} active
        </span>
      </div>

      {/* Request logs */}
      <div className='relative z-10 space-y-2'>
        {requestLogs.slice(0, 3).map((log, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={index}
              variants={isEven ? variants : variantsSecond}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`flex flex-row rounded-lg border border-neutral-100 dark:border-white/[0.1] p-2 items-center space-x-2 bg-white/60 dark:bg-black/20 backdrop-blur-sm shadow-sm ${
                isEven ? "" : "ml-4"
              }`}
            >
              {/* Method badge */}
              <div
                className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-sm ${
                  log.color === "green"
                    ? "bg-gradient-to-br from-green-500 to-emerald-600"
                    : log.color === "blue"
                    ? "bg-gradient-to-br from-blue-500 to-cyan-600"
                    : log.color === "purple"
                    ? "bg-gradient-to-br from-purple-500 to-pink-600"
                    : log.color === "red"
                    ? "bg-gradient-to-br from-red-500 to-rose-600"
                    : "bg-gradient-to-br from-orange-500 to-yellow-600"
                }`}
              >
                {log.method.charAt(0)}
              </div>

              {/* Endpoint with animated background */}
              <div className='flex-1 relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5 animate-pulse' />
                <div className='relative bg-gray-100 dark:bg-neutral-800 h-4 rounded-md flex items-center px-2'>
                  <span className='text-xs font-mono text-gray-700 dark:text-gray-300 truncate'>
                    {log.endpoint}
                  </span>
                </div>
              </div>

              {/* Response time with color coding */}
              <div className='flex items-center space-x-1'>
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    parseInt(log.time) < 100
                      ? "bg-green-500"
                      : parseInt(log.time) < 200
                      ? "bg-yellow-500"
                      : parseInt(log.time) < 300
                      ? "bg-orange-500"
                      : "bg-red-500"
                  }`}
                />
                <span
                  className={`text-xs font-medium shrink-0 ${
                    parseInt(log.time) < 100
                      ? "text-green-600 dark:text-green-400"
                      : parseInt(log.time) < 200
                      ? "text-yellow-600 dark:text-yellow-400"
                      : parseInt(log.time) < 300
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {log.time}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer stats */}
      <div className='relative z-10 flex justify-between items-center mt-2 pt-2 border-t border-neutral-200/50 dark:border-neutral-700/50'>
        <div className='flex space-x-3 text-xs text-muted-foreground'>
          <span className='flex items-center space-x-1'>
            <div className='h-1 w-1 bg-green-500 rounded-full' />
            <span>Avg: 183ms</span>
          </span>
          <span className='flex items-center space-x-1'>
            <div className='h-1 w-1 bg-blue-500 rounded-full' />
            <span>Success: 98.2%</span>
          </span>
        </div>
        <span className='text-xs text-muted-foreground'>Updated 2s ago</span>
      </div>
    </motion.div>
  );
};
const SkeletonTwo = () => {
  const variants = {
    initial: {
      width: 0,
    },
    animate: {
      width: "100%",
      transition: {
        duration: 0.2,
      },
    },
    hover: {
      width: ["0%", "100%"],
      transition: {
        duration: 2,
      },
    },
  };
  const requests = [
    {
      ip: "192.168.1.100",
      method: "GET",
      flag: 1,
      status: "blocked",
      time: "14:32:15",
    },
    {
      ip: "10.0.0.25",
      method: "POST",
      flag: 0,
      status: "allowed",
      time: "14:32:18",
    },
    {
      ip: "203.0.113.45",
      method: "PUT",
      flag: 1,
      status: "blocked",
      time: "14:32:22",
    },
  ];

  return (
    <motion.div
      initial='initial'
      animate='animate'
      whileHover='hover'
      className='flex flex-1 w-full h-full dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col p-2'
    >
      {/* Header */}
      <div className='flex flex-row items-center space-x-2 px-2 py-1 text-xs font-medium text-muted-foreground border-b border-neutral-200 dark:border-neutral-700 mb-1'>
        <span className='w-16'>Time</span>
        <span className='w-12'>Method</span>
        <span className='flex-1'>IP</span>
        <span className='w-12'>Flag</span>
        <span className='w-16'>Status</span>
      </div>

      <div className='flex-1 flex flex-col justify-center space-y-1'>
        {requests.map((request, i) => (
          <motion.div
            key={"cors-request" + i}
            variants={variants}
            className={`flex flex-row items-center space-x-2 px-2 py-1 text-xs ${
              request.status === "blocked"
                ? "bg-red-50 dark:bg-red-950/20 border-l-2 border-red-500"
                : "bg-green-50 dark:bg-green-950/20 border-l-2 border-green-500"
            }`}
          >
            <span className='w-16 font-mono text-muted-foreground'>
              {request.time}
            </span>
            <span
              className={`w-12 font-mono text-xs px-1 py-0.5 rounded ${
                request.method === "GET"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : request.method === "POST"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : request.method === "PUT"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {request.method}
            </span>
            <span className='flex-1 font-mono text-foreground'>
              {request.ip}
            </span>
            <span
              className={`w-12 font-bold text-center ${
                request.flag === 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {request.flag}
            </span>
            <span
              className={`w-16 text-xs font-medium ${
                request.status === "allowed"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {request.status}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
const SkeletonThree = () => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <motion.div
      initial='initial'
      animate='animate'
      variants={variants}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className='flex flex-1 w-full h-full dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col p-3'
      style={{
        background:
          "linear-gradie1nt(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
        backgroundSize: "400% 400%",
      }}
    >
      {/* Dashboard Header */}
      <div className='flex justify-between items-center mb-3'>
        <div className='flex items-center space-x-2'>
          <span className='text-white text-sm font-semibold'>API Requests</span>
          <div className='flex items-center space-x-1'>
            <div className='h-2 w-2 bg-green-400 rounded-full animate-pulse' />
            <span className='text-white text-xs'>Live</span>
          </div>
        </div>
        <div className='text-white text-xs bg-white/20 px-2 py-1 rounded'>
          1,247 total
        </div>
      </div>

      {/* Table Header */}
      <div className='bg-white/20 rounded-t-lg px-2 py-1 backdrop-blur-sm'>
        <div className='flex items-center space-x-2 text-white text-xs font-medium'>
          <span className='w-12'>Time</span>
          <span className='w-10'>Method</span>
          <span className='flex-1'>Endpoint</span>
          <span className='w-8'>Flag</span>
        </div>
      </div>

      {/* Table Rows */}
      <div className='bg-white/10 rounded-b-lg backdrop-blur-sm flex-1 overflow-hidden flex flex-col justify-center'>
        {[
          { time: "14:32", method: "GET", endpoint: "/api/users", flag: 0 },
          { time: "14:31", method: "POST", endpoint: "/api/auth", flag: 0 },
        ].map((row, i) => (
          <div
            key={i}
            className='flex items-center space-x-2 px-2 py-1 text-white text-xs border-b border-white/10 last:border-b-0'
          >
            <span className='w-12 font-mono'>{row.time}</span>
            <span
              className={`w-10 font-mono text-xs px-1 rounded ${
                row.method === "GET"
                  ? "bg-green-500/30"
                  : row.method === "POST"
                  ? "bg-blue-500/30"
                  : row.method === "PUT"
                  ? "bg-purple-500/30"
                  : "bg-red-500/30"
              }`}
            >
              {row.method}
            </span>
            <span className='flex-1 font-mono truncate'>{row.endpoint}</span>
            <span
              className={`w-8 text-center font-bold ${
                row.flag === 0 ? "text-green-300" : "text-red-300"
              }`}
            >
              {row.flag}
            </span>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className='flex justify-between items-center mt-2 text-white text-xs'>
        <span className='bg-white/20 px-2 py-1 rounded'>Page 1 of 124</span>
        <div className='flex space-x-1'>
          <div className='bg-white/20 px-2 py-1 rounded'>‹</div>
          <div className='bg-white/20 px-2 py-1 rounded'>›</div>
        </div>
      </div>
    </motion.div>
  );
};
const SkeletonFour = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  return (
    <motion.div
      initial='initial'
      animate='animate'
      whileHover='hover'
      className='flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2'
    >
      <motion.div
        variants={first}
        className='h-full w-1/3 rounded-2xl bg-muted/10 p-4 dark:bg-muted/10 dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center'
      >
        <div className='h-8 w-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mb-2'>
          <span className='text-white text-xs font-bold'>!</span>
        </div>
        <p className='sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-2'>
          Performance Issue Detected
        </p>
        <p className='border border-red-500 bg-red-100 dark:bg-red-900/20 text-red-600 text-xs rounded-full px-2 py-0.5 mt-2'>
          High Latency
        </p>
      </motion.div>
      <motion.div className='h-full relative z-20 w-1/3 rounded-2xl bg-muted/10 p-4 dark:bg-muted/10 dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center'>
        <div className='h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-2'>
          <span className='text-white text-xs font-bold'>AI</span>
        </div>
        <p className='sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-2'>
          AI Analysis Complete
        </p>
        <p className='border border-blue-500 bg-blue-100 dark:bg-blue-900/20 text-blue-600 text-xs rounded-full px-2 py-0.5 mt-2'>
          Optimized
        </p>
      </motion.div>
      <motion.div
        variants={second}
        className='h-full w-1/3 rounded-2xl bg-muted/10 p-4 dark:bg-muted/10 dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center'
      >
        <div className='h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-2'>
          <span className='text-white text-xs font-bold'>✓</span>
        </div>
        <p className='sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-2'>
          Code Quality Improved
        </p>
        <p className='border border-green-500 bg-green-100 dark:bg-green-900/20 text-green-600 text-xs rounded-full px-2 py-0.5 mt-2'>
          Excellent
        </p>
      </motion.div>
    </motion.div>
  );
};
const SkeletonFive = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial='initial'
      whileHover='animate'
      className='flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2'
    >
      <motion.div
        variants={variants}
        className='flex flex-row rounded-2xl border border-neutral-100 dark:border-white/[0.2] p-2 items-start space-x-2 bg-muted/10 dark:bg-muted/10'
      >
        <div className='h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0'>
          <span className='text-white text-xs font-bold'>1</span>
        </div>
        <div className='flex-1'>
          <p className='text-xs text-neutral-500 mb-1 font-semibold'>
            pip install smartpylogger
          </p>
          <div className='w-full bg-gray-200 dark:bg-gray-700 h-1 rounded'>
            <div className='bg-green-500 h-1 rounded w-full'></div>
          </div>
        </div>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className='flex flex-row rounded-2xl border border-neutral-100 dark:border-white/[0.2] p-2 items-start space-x-2 bg-muted/10 dark:bg-muted/10'
      >
        <div className='h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0'>
          <span className='text-white text-xs font-bold'>✓</span>
        </div>
        <div className='flex-1'>
          <p className='text-xs text-neutral-500 font-semibold'>
            Add middleware & you&apos;re done!
          </p>
          <p className='text-xs text-green-600 dark:text-green-400 mt-1'>
            Logging active • Dashboard ready
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
const items = [
  {
    title: "Comprehensive Request Logging",
    description: (
      <span className='text-sm'>
        Live HTTP/HTTPS request logging with full history and performance
        tracking for your FastAPI applications.
      </span>
    ),
    header: <SkeletonOne />,
    className: "md:col-span-1",
    icon: <IconClipboardCopy className='h-4 w-4 text-neutral-500' />,
  },
  {
    title: "CORS Middleware on Steroids",
    description: (
      <span className='text-sm'>
        Advanced CORS functionality with IP blocking, origin filtering, and
        detailed logging of disallowed requests.
      </span>
    ),
    header: <SkeletonTwo />,
    className: "md:col-span-1",
    icon: <IconFileBroken className='h-4 w-4 text-neutral-500' />,
  },
  {
    title: "Real-time Dashboard",
    description: (
      <span className='text-sm'>
        Monitor all incoming requests, blocked traffic, and performance metrics
        in a beautiful, intuitive dashboard.
      </span>
    ),
    header: <SkeletonThree />,
    className: "md:col-span-1",
    icon: <IconSignature className='h-4 w-4 text-neutral-500' />,
  },
  {
    title: "AI-Powered Code Analysis",
    description: (
      <span className='text-sm'>
        Get intelligent analysis of your requests and codebase for debugging,
        testing, and performance optimization.
      </span>
    ),
    header: <SkeletonFour />,
    className: "md:col-span-2",
    icon: <IconTableColumn className='h-4 w-4 text-neutral-500' />,
  },
  {
    title: "One-Line Integration",
    description: (
      <span className='text-sm'>
        Simple setup: pip install, import, add your API key, and you&apos;re
        ready to go with comprehensive logging.
      </span>
    ),
    header: <SkeletonFive />,
    className: "md:col-span-1",
    icon: <IconBoxAlignRightFilled className='h-4 w-4 text-neutral-500' />,
  },
];
