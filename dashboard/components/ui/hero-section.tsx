"use client";

import { useState } from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Copy, Check } from "lucide-react";
import { FaPython, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  const [copied, setCopied] = useState(false);

  const codeExample = `from fastapi import FastAPI
from smartpylogger import LoggingMiddleware

app = FastAPI()

# Add comprehensive logging
app.add_middleware(
    LoggingMiddleware,
    api_key="YOUR_API_KEY",
    capture_requests=True,
    capture_responses=True,
    track_performance=True
)`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeExample);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className='relative mx-auto w-full max-w-7xl'>
      <div className='px-4 py-12 sm:px-6 sm:py-16 lg:py-24 lg:px-8'>
        <div className='mx-auto lg:grid lg:grid-cols-12 lg:gap-8'>
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-center lg:col-span-6 lg:text-left'
          >
            <Badge variant='outline' className='mb-4'>
              Open Source
            </Badge>

            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight max-w-2xl'>
              The most comprehensive logging framework for{" "}
              <span className='text-primary'>FastAPI</span>.
            </h1>

            <div className='mt-6 sm:mt-8'>
              <div className='mb-4 sm:mb-6 flex items-center justify-center lg:justify-start'>
                <div className='flex items-center w-full max-w-sm sm:max-w-md lg:max-w-xl rounded bg-muted/20 border border-border px-2 sm:px-4 py-2 shadow text-xs sm:text-sm font-mono overflow-hidden'>
                  <div className='flex items-center min-w-0 flex-1'>
                    <span className='text-emerald-600 dark:text-emerald-400'>
                      git
                    </span>
                    <span className='text-muted-foreground'>:(</span>
                    <span className='text-red-600 dark:text-red-400'>main</span>
                    <span className='text-muted-foreground'>)</span>
                    <span className='text-yellow-600 dark:text-yellow-400 mx-1'>
                      x
                    </span>
                    <span className='text-foreground hidden sm:inline'>
                      pip install
                    </span>
                    <span className='text-foreground sm:hidden'>pip</span>
                    <span className='ml-1 text-blue-600 dark:text-blue-400 truncate'>
                      smartpylogger
                    </span>
                  </div>
                  <div className='flex items-center space-x-1 ml-2 flex-shrink-0'>
                    <span className='inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded bg-blue-500'>
                      <Link href='https://pypi.org/project/smartpylogger/0.2.0/#description'>
                        <FaPython className='h-3 w-3 sm:h-4 sm:w-4' />
                      </Link>
                    </span>
                    <span className='inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded bg-foreground'>
                      <Link href='https://github.com/Berget1411/Couchbase_Hack_25'>
                        <FaGithub className='h-3 w-3 sm:h-4 sm:w-4 text-background' />
                      </Link>
                    </span>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start'
              >
                <Button size='lg' className='w-full sm:w-auto'>
                  GET STARTED
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Code Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='mt-8 lg:col-span-6 lg:mt-0'
          >
            <div className='mx-auto w-full max-w-md sm:max-w-lg lg:mx-0 lg:max-w-none'>
              <div className='rounded-lg border border-border bg-background shadow-2xl overflow-hidden'>
                {/* Terminal Header */}
                <div className='flex items-center justify-between border-b border-border px-3 sm:px-4 py-2 sm:py-3 bg-muted/30'>
                  <div className='flex items-center space-x-2'>
                    <div className='h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-red-500'></div>
                    <div className='h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-yellow-500'></div>
                    <div className='h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500'></div>
                  </div>
                  <div className='flex items-center space-x-2 sm:space-x-4'>
                    <div className='hidden sm:flex items-center space-x-1'>
                      <span className='text-xs text-muted-foreground'>
                        main.py
                      </span>
                      <span className='text-xs text-muted-foreground/60'>
                        requirements.txt
                      </span>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-5 w-5 sm:h-6 sm:w-6 p-0'
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <Check className='h-3 w-3 text-green-500' />
                      ) : (
                        <Copy className='h-3 w-3' />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Code Content */}
                <div className='p-3 sm:p-4 lg:p-6 bg-muted/20'>
                  <div className='overflow-x-auto'>
                    <pre className='text-xs sm:text-sm font-mono'>
                      <code>
                        {codeExample.split("\n").map((line, index) => (
                          <div key={index} className='flex'>
                            <span className='mr-2 sm:mr-4 select-none text-muted-foreground/40 text-right w-4 sm:w-6 text-xs leading-5 sm:leading-6'>
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className='text-foreground leading-5 sm:leading-6 min-w-0'>
                              {line.includes("from ") ||
                              line.includes("import ") ? (
                                <span>
                                  <span className='text-purple-600 dark:text-purple-400'>
                                    {line.match(/^(from|import)/)?.[0]}
                                  </span>
                                  <span className='text-foreground'>
                                    {line.replace(/^(from|import)/, "")}
                                  </span>
                                </span>
                              ) : line.includes("app =") ? (
                                <span>
                                  <span className='text-blue-600 dark:text-blue-400'>
                                    app
                                  </span>
                                  <span className='text-foreground'> = </span>
                                  <span className='text-yellow-600 dark:text-yellow-400'>
                                    FastAPI
                                  </span>
                                  <span className='text-foreground'>()</span>
                                </span>
                              ) : line.includes("app.add_middleware") ? (
                                <span>
                                  <span className='text-blue-600 dark:text-blue-400'>
                                    app
                                  </span>
                                  <span className='text-foreground'>.</span>
                                  <span className='text-yellow-600 dark:text-yellow-400'>
                                    add_middleware
                                  </span>
                                  <span className='text-foreground'>(</span>
                                </span>
                              ) : line.includes("#") ? (
                                <span className='text-green-600 dark:text-green-400'>
                                  {line}
                                </span>
                              ) : line.includes("LoggingMiddleware") &&
                                !line.includes("=") ? (
                                <span>
                                  <span className='text-foreground'>
                                    {" "}
                                    LoggingMiddleware,
                                  </span>
                                </span>
                              ) : line.includes("=") &&
                                (line.includes("api_key") ||
                                  line.includes("capture_") ||
                                  line.includes("track_")) ? (
                                <span>
                                  <span className='text-foreground'> </span>
                                  <span className='text-red-600 dark:text-red-400'>
                                    {line.trim().split("=")[0]}
                                  </span>
                                  <span className='text-foreground'>=</span>
                                  <span
                                    className={
                                      line.includes('"')
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-orange-600 dark:text-orange-400"
                                    }
                                  >
                                    {line.trim().split("=")[1]}
                                  </span>
                                </span>
                              ) : line.trim() === ")" ? (
                                <span className='text-foreground'>)</span>
                              ) : (
                                <span className='text-foreground'>{line}</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </code>
                    </pre>
                  </div>

                  {/* Demo Button in Code Preview */}
                  <div className='mt-3 sm:mt-4 flex justify-end'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-xs sm:text-sm'
                    >
                      ▶ Demo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
